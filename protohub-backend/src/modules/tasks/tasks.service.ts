import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ProjectMemberRole } from '../../common/prisma-enums';
import { TasksRepository } from './tasks.repository';
import { ProjectsService, ALL_MEMBER_ROLES, MANAGE_ROLES } from '../projects/projects.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { MoveTaskDto } from './dto/move-task.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class TasksService {
  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly projectsService: ProjectsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async getBoard(projectId: string, userId: string) {
    await this.projectsService.assertProjectRole(projectId, userId, ALL_MEMBER_ROLES);
    return this.tasksRepository.findColumnsWithTasks(projectId);
  }

  // ---------------- Columns ----------------

  async createColumn(projectId: string, dto: CreateColumnDto, userId: string) {
    await this.projectsService.assertProjectRole(projectId, userId, MANAGE_ROLES);
    return this.tasksRepository.createColumn(projectId, dto.name);
  }

  async renameColumn(projectId: string, columnId: string, dto: CreateColumnDto, userId: string) {
    await this.projectsService.assertProjectRole(projectId, userId, MANAGE_ROLES);
    await this.assertColumnBelongsToProject(columnId, projectId);
    return this.tasksRepository.renameColumn(columnId, dto.name);
  }

  async deleteColumn(projectId: string, columnId: string, userId: string) {
    await this.projectsService.assertProjectRole(projectId, userId, MANAGE_ROLES);
    await this.assertColumnBelongsToProject(columnId, projectId);

    const taskCount = await this.tasksRepository.countTasksInColumn(columnId);
    if (taskCount > 0) {
      throw new BadRequestException('Move or delete all tasks out of this column before deleting it');
    }
    await this.tasksRepository.deleteColumn(columnId);
  }

  // ---------------- Tasks ----------------

  async createTask(projectId: string, dto: CreateTaskDto, userId: string) {
    await this.projectsService.assertProjectRole(projectId, userId, ALL_MEMBER_ROLES);
    await this.assertColumnBelongsToProject(dto.columnId, projectId);
    if (dto.assigneeId) {
      await this.assertValidAssignee(projectId, dto.assigneeId);
    }

    const task = await this.tasksRepository.createTask({
      projectId,
      columnId: dto.columnId,
      title: dto.title,
      description: dto.description,
      priority: dto.priority,
      assigneeId: dto.assigneeId,
      createdById: userId,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
    });

    if (dto.assigneeId && dto.assigneeId !== userId) {
      this.eventEmitter.emit('task.assigned', {
        projectId,
        taskId: task.id,
        taskTitle: task.title,
        assigneeId: dto.assigneeId,
        assignedById: userId,
      });
    }
    return task;
  }

  async getTask(projectId: string, taskId: string, userId: string) {
    await this.projectsService.assertProjectRole(projectId, userId, ALL_MEMBER_ROLES);
    const task = await this.findTaskInProject(taskId, projectId);
    return task;
  }

  async updateTask(projectId: string, taskId: string, dto: UpdateTaskDto, userId: string) {
    await this.projectsService.assertProjectRole(projectId, userId, ALL_MEMBER_ROLES);
    const existingTask = await this.findTaskInProject(taskId, projectId);

    if (dto.assigneeId) {
      await this.assertValidAssignee(projectId, dto.assigneeId);
    }

    const { dueDate, ...rest } = dto;
    const updated = await this.tasksRepository.updateTask(taskId, {
      ...rest,
      ...(dueDate !== undefined ? { dueDate: dueDate ? new Date(dueDate) : null } : {}),
      ...(dto.assigneeId === null ? { assignee: { disconnect: true } } : {}),
    });

    if (dto.assigneeId && dto.assigneeId !== existingTask.assigneeId && dto.assigneeId !== userId) {
      this.eventEmitter.emit('task.assigned', {
        projectId,
        taskId,
        taskTitle: updated.title,
        assigneeId: dto.assigneeId,
        assignedById: userId,
      });
    }
    return updated;
  }

  async moveTask(projectId: string, taskId: string, dto: MoveTaskDto, userId: string) {
    await this.projectsService.assertProjectRole(projectId, userId, ALL_MEMBER_ROLES);
    const task = await this.findTaskInProject(taskId, projectId);
    await this.assertColumnBelongsToProject(dto.columnId, projectId);

    return this.tasksRepository.moveTask({
      taskId,
      sourceColumnId: task.columnId,
      sourcePosition: task.position,
      targetColumnId: dto.columnId,
      targetPosition: dto.position,
    });
  }

  async deleteTask(projectId: string, taskId: string, userId: string) {
    const membership = await this.projectsService.assertProjectRole(projectId, userId, ALL_MEMBER_ROLES);
    const task = await this.findTaskInProject(taskId, projectId);

    const canDelete =
      task.createdById === userId || task.assigneeId === userId || MANAGE_ROLES.includes(membership.role as ProjectMemberRole);
    if (!canDelete) {
      throw new ForbiddenException('Only the task creator, assignee, or a project manager can delete this task');
    }
    await this.tasksRepository.softDeleteTask(taskId);
  }

  // ---------------- Comments ----------------

  async addComment(projectId: string, taskId: string, dto: CreateCommentDto, userId: string) {
    await this.projectsService.assertProjectRole(projectId, userId, ALL_MEMBER_ROLES);
    await this.findTaskInProject(taskId, projectId);
    return this.tasksRepository.addComment(taskId, userId, dto.content);
  }

  async listComments(projectId: string, taskId: string, userId: string) {
    await this.projectsService.assertProjectRole(projectId, userId, ALL_MEMBER_ROLES);
    await this.findTaskInProject(taskId, projectId);
    return this.tasksRepository.listComments(taskId);
  }

  async deleteComment(projectId: string, commentId: string, userId: string) {
    const membership = await this.projectsService.assertProjectRole(projectId, userId, ALL_MEMBER_ROLES);
    const comment = await this.tasksRepository.findCommentById(commentId);
    if (!comment) throw new NotFoundException('Comment not found');

    const canDelete = comment.authorId === userId || MANAGE_ROLES.includes(membership.role as ProjectMemberRole);
    if (!canDelete) {
      throw new ForbiddenException('Only the comment author or a project manager can delete this comment');
    }
    await this.tasksRepository.softDeleteComment(commentId);
  }

  // ---------------- Shared guards ----------------

  private async assertColumnBelongsToProject(columnId: string, projectId: string) {
    const column = await this.tasksRepository.findColumnById(columnId);
    if (!column || column.projectId !== projectId) {
      throw new NotFoundException('Column not found in this project');
    }
    return column;
  }

  private async assertValidAssignee(projectId: string, assigneeId: string) {
    try {
      await this.projectsService.assertProjectRole(projectId, assigneeId, ALL_MEMBER_ROLES);
    } catch {
      throw new BadRequestException('Assignee must be an active member of this project');
    }
  }

  async findUserTasks(userId: string) {
    const tasks = await this.tasksRepository.findUserTasks(userId);
    return { data: tasks, meta: { total: tasks.length } };
  }

  async findAllUserTasksForPlanner(userId: string) {
    const tasks = await this.tasksRepository.findAllUserTasksForPlanner(userId);
    return { data: tasks, meta: { total: tasks.length } };
  }

  private async findTaskInProject(taskId: string, projectId: string) {
    const task = await this.tasksRepository.findTaskById(taskId);
    if (!task || task.projectId !== projectId) {
      throw new NotFoundException('Task not found in this project');
    }
    return task;
  }
}
