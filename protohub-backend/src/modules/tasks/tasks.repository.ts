import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

const TASK_INCLUDE = {
  assignee: { select: { id: true, name: true, avatarUrl: true } },
  creator: { select: { id: true, name: true, avatarUrl: true } },
} satisfies Prisma.TaskInclude;

@Injectable()
export class TasksRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ---------------- Columns ----------------

  findColumnsWithTasks(projectId: string) {
    return this.prisma.taskColumn.findMany({
      where: { projectId },
      orderBy: { position: 'asc' },
      include: {
        tasks: {
          where: { deletedAt: null },
          orderBy: { position: 'asc' },
          include: TASK_INCLUDE,
        },
      },
    });
  }

  findColumnById(id: string) {
    return this.prisma.taskColumn.findUnique({ where: { id } });
  }

  async createColumn(projectId: string, name: string) {
    const count = await this.prisma.taskColumn.count({ where: { projectId } });
    return this.prisma.taskColumn.create({ data: { projectId, name, position: count } });
  }

  renameColumn(id: string, name: string) {
    return this.prisma.taskColumn.update({ where: { id }, data: { name } });
  }

  countTasksInColumn(columnId: string) {
    return this.prisma.task.count({ where: { columnId, deletedAt: null } });
  }

  deleteColumn(id: string) {
    return this.prisma.taskColumn.delete({ where: { id } });
  }

  // ---------------- Tasks ----------------

  findTaskById(id: string) {
    return this.prisma.task.findFirst({ where: { id, deletedAt: null }, include: TASK_INCLUDE });
  }

  findUserTasks(userId: string, limit: number = 20) {
    return this.prisma.task.findMany({
      where: { assigneeId: userId, deletedAt: null, column: { name: { not: 'Done' } } },
      include: {
        ...TASK_INCLUDE,
        project: { select: { id: true, title: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  findAllUserTasksForPlanner(userId: string) {
    return this.prisma.task.findMany({
      where: { assigneeId: userId, deletedAt: null },
      include: {
        ...TASK_INCLUDE,
        project: { select: { id: true, title: true, slug: true } },
        column: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createTask(data: {
    projectId: string;
    columnId: string;
    title: string;
    description?: string;
    priority?: Prisma.TaskCreateInput['priority'];
    assigneeId?: string;
    createdById: string;
    dueDate?: Date;
  }) {
    const position = await this.prisma.task.count({ where: { columnId: data.columnId, deletedAt: null } });
    return this.prisma.task.create({
      data: { ...data, position },
      include: TASK_INCLUDE,
    });
  }

  updateTask(id: string, data: Prisma.TaskUpdateInput) {
    return this.prisma.task.update({ where: { id }, data, include: TASK_INCLUDE });
  }

  softDeleteTask(id: string) {
    return this.prisma.task.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  /**
   * Re-indexes positions in both the source and destination columns so
   * there are never gaps or duplicate positions, then places the task at
   * its new slot. Runs as one transaction — a partial reorder would corrupt
   * every board that touches either column.
   */
  async moveTask(params: {
    taskId: string;
    sourceColumnId: string;
    sourcePosition: number;
    targetColumnId: string;
    targetPosition: number;
  }) {
    const { taskId, sourceColumnId, sourcePosition, targetColumnId, targetPosition } = params;

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      if (sourceColumnId === targetColumnId) {
        if (targetPosition > sourcePosition) {
          await tx.task.updateMany({
            where: { columnId: sourceColumnId, position: { gt: sourcePosition, lte: targetPosition }, deletedAt: null },
            data: { position: { decrement: 1 } },
          });
        } else if (targetPosition < sourcePosition) {
          await tx.task.updateMany({
            where: { columnId: sourceColumnId, position: { gte: targetPosition, lt: sourcePosition }, deletedAt: null },
            data: { position: { increment: 1 } },
          });
        }
      } else {
        // Close the gap left behind in the source column.
        await tx.task.updateMany({
          where: { columnId: sourceColumnId, position: { gt: sourcePosition }, deletedAt: null },
          data: { position: { decrement: 1 } },
        });
        // Open a slot in the destination column.
        await tx.task.updateMany({
          where: { columnId: targetColumnId, position: { gte: targetPosition }, deletedAt: null },
          data: { position: { increment: 1 } },
        });
      }

      return tx.task.update({
        where: { id: taskId },
        data: { columnId: targetColumnId, position: targetPosition },
        include: TASK_INCLUDE,
      });
    });
  }

  // ---------------- Comments ----------------

  addComment(taskId: string, authorId: string, content: string) {
    return this.prisma.taskComment.create({
      data: { taskId, authorId, content },
      include: { author: { select: { id: true, name: true, avatarUrl: true } } },
    });
  }

  listComments(taskId: string) {
    return this.prisma.taskComment.findMany({
      where: { taskId, deletedAt: null },
      orderBy: { createdAt: 'asc' },
      include: { author: { select: { id: true, name: true, avatarUrl: true } } },
    });
  }

  findCommentById(id: string) {
    return this.prisma.taskComment.findFirst({ where: { id, deletedAt: null } });
  }

  softDeleteComment(id: string) {
    return this.prisma.taskComment.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
