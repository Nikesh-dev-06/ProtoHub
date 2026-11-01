"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const tasks_repository_1 = require("./tasks.repository");
const projects_service_1 = require("../projects/projects.service");
let TasksService = class TasksService {
    constructor(tasksRepository, projectsService, eventEmitter) {
        this.tasksRepository = tasksRepository;
        this.projectsService = projectsService;
        this.eventEmitter = eventEmitter;
    }
    async getBoard(projectId, userId) {
        await this.projectsService.assertProjectRole(projectId, userId, projects_service_1.ALL_MEMBER_ROLES);
        return this.tasksRepository.findColumnsWithTasks(projectId);
    }
    async createColumn(projectId, dto, userId) {
        await this.projectsService.assertProjectRole(projectId, userId, projects_service_1.MANAGE_ROLES);
        return this.tasksRepository.createColumn(projectId, dto.name);
    }
    async renameColumn(projectId, columnId, dto, userId) {
        await this.projectsService.assertProjectRole(projectId, userId, projects_service_1.MANAGE_ROLES);
        await this.assertColumnBelongsToProject(columnId, projectId);
        return this.tasksRepository.renameColumn(columnId, dto.name);
    }
    async deleteColumn(projectId, columnId, userId) {
        await this.projectsService.assertProjectRole(projectId, userId, projects_service_1.MANAGE_ROLES);
        await this.assertColumnBelongsToProject(columnId, projectId);
        const taskCount = await this.tasksRepository.countTasksInColumn(columnId);
        if (taskCount > 0) {
            throw new common_1.BadRequestException('Move or delete all tasks out of this column before deleting it');
        }
        await this.tasksRepository.deleteColumn(columnId);
    }
    async createTask(projectId, dto, userId) {
        await this.projectsService.assertProjectRole(projectId, userId, projects_service_1.ALL_MEMBER_ROLES);
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
    async getTask(projectId, taskId, userId) {
        await this.projectsService.assertProjectRole(projectId, userId, projects_service_1.ALL_MEMBER_ROLES);
        const task = await this.findTaskInProject(taskId, projectId);
        return task;
    }
    async updateTask(projectId, taskId, dto, userId) {
        await this.projectsService.assertProjectRole(projectId, userId, projects_service_1.ALL_MEMBER_ROLES);
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
    async moveTask(projectId, taskId, dto, userId) {
        await this.projectsService.assertProjectRole(projectId, userId, projects_service_1.ALL_MEMBER_ROLES);
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
    async deleteTask(projectId, taskId, userId) {
        const membership = await this.projectsService.assertProjectRole(projectId, userId, projects_service_1.ALL_MEMBER_ROLES);
        const task = await this.findTaskInProject(taskId, projectId);
        const canDelete = task.createdById === userId || task.assigneeId === userId || projects_service_1.MANAGE_ROLES.includes(membership.role);
        if (!canDelete) {
            throw new common_1.ForbiddenException('Only the task creator, assignee, or a project manager can delete this task');
        }
        await this.tasksRepository.softDeleteTask(taskId);
    }
    async addComment(projectId, taskId, dto, userId) {
        await this.projectsService.assertProjectRole(projectId, userId, projects_service_1.ALL_MEMBER_ROLES);
        await this.findTaskInProject(taskId, projectId);
        return this.tasksRepository.addComment(taskId, userId, dto.content);
    }
    async listComments(projectId, taskId, userId) {
        await this.projectsService.assertProjectRole(projectId, userId, projects_service_1.ALL_MEMBER_ROLES);
        await this.findTaskInProject(taskId, projectId);
        return this.tasksRepository.listComments(taskId);
    }
    async deleteComment(projectId, commentId, userId) {
        const membership = await this.projectsService.assertProjectRole(projectId, userId, projects_service_1.ALL_MEMBER_ROLES);
        const comment = await this.tasksRepository.findCommentById(commentId);
        if (!comment)
            throw new common_1.NotFoundException('Comment not found');
        const canDelete = comment.authorId === userId || projects_service_1.MANAGE_ROLES.includes(membership.role);
        if (!canDelete) {
            throw new common_1.ForbiddenException('Only the comment author or a project manager can delete this comment');
        }
        await this.tasksRepository.softDeleteComment(commentId);
    }
    async assertColumnBelongsToProject(columnId, projectId) {
        const column = await this.tasksRepository.findColumnById(columnId);
        if (!column || column.projectId !== projectId) {
            throw new common_1.NotFoundException('Column not found in this project');
        }
        return column;
    }
    async assertValidAssignee(projectId, assigneeId) {
        try {
            await this.projectsService.assertProjectRole(projectId, assigneeId, projects_service_1.ALL_MEMBER_ROLES);
        }
        catch {
            throw new common_1.BadRequestException('Assignee must be an active member of this project');
        }
    }
    async findUserTasks(userId) {
        const tasks = await this.tasksRepository.findUserTasks(userId);
        return { data: tasks, meta: { total: tasks.length } };
    }
    async findAllUserTasksForPlanner(userId) {
        const tasks = await this.tasksRepository.findAllUserTasksForPlanner(userId);
        return { data: tasks, meta: { total: tasks.length } };
    }
    async findTaskInProject(taskId, projectId) {
        const task = await this.tasksRepository.findTaskById(taskId);
        if (!task || task.projectId !== projectId) {
            throw new common_1.NotFoundException('Task not found in this project');
        }
        return task;
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tasks_repository_1.TasksRepository,
        projects_service_1.ProjectsService,
        event_emitter_1.EventEmitter2])
], TasksService);
//# sourceMappingURL=tasks.service.js.map