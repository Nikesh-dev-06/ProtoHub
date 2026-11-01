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
exports.TasksRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const TASK_INCLUDE = {
    assignee: { select: { id: true, name: true, avatarUrl: true } },
    creator: { select: { id: true, name: true, avatarUrl: true } },
};
let TasksRepository = class TasksRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findColumnsWithTasks(projectId) {
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
    findColumnById(id) {
        return this.prisma.taskColumn.findUnique({ where: { id } });
    }
    async createColumn(projectId, name) {
        const count = await this.prisma.taskColumn.count({ where: { projectId } });
        return this.prisma.taskColumn.create({ data: { projectId, name, position: count } });
    }
    renameColumn(id, name) {
        return this.prisma.taskColumn.update({ where: { id }, data: { name } });
    }
    countTasksInColumn(columnId) {
        return this.prisma.task.count({ where: { columnId, deletedAt: null } });
    }
    deleteColumn(id) {
        return this.prisma.taskColumn.delete({ where: { id } });
    }
    findTaskById(id) {
        return this.prisma.task.findFirst({ where: { id, deletedAt: null }, include: TASK_INCLUDE });
    }
    findUserTasks(userId, limit = 20) {
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
    findAllUserTasksForPlanner(userId) {
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
    async createTask(data) {
        const position = await this.prisma.task.count({ where: { columnId: data.columnId, deletedAt: null } });
        return this.prisma.task.create({
            data: { ...data, position },
            include: TASK_INCLUDE,
        });
    }
    updateTask(id, data) {
        return this.prisma.task.update({ where: { id }, data, include: TASK_INCLUDE });
    }
    softDeleteTask(id) {
        return this.prisma.task.update({ where: { id }, data: { deletedAt: new Date() } });
    }
    async moveTask(params) {
        const { taskId, sourceColumnId, sourcePosition, targetColumnId, targetPosition } = params;
        return this.prisma.$transaction(async (tx) => {
            if (sourceColumnId === targetColumnId) {
                if (targetPosition > sourcePosition) {
                    await tx.task.updateMany({
                        where: { columnId: sourceColumnId, position: { gt: sourcePosition, lte: targetPosition }, deletedAt: null },
                        data: { position: { decrement: 1 } },
                    });
                }
                else if (targetPosition < sourcePosition) {
                    await tx.task.updateMany({
                        where: { columnId: sourceColumnId, position: { gte: targetPosition, lt: sourcePosition }, deletedAt: null },
                        data: { position: { increment: 1 } },
                    });
                }
            }
            else {
                await tx.task.updateMany({
                    where: { columnId: sourceColumnId, position: { gt: sourcePosition }, deletedAt: null },
                    data: { position: { decrement: 1 } },
                });
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
    addComment(taskId, authorId, content) {
        return this.prisma.taskComment.create({
            data: { taskId, authorId, content },
            include: { author: { select: { id: true, name: true, avatarUrl: true } } },
        });
    }
    listComments(taskId) {
        return this.prisma.taskComment.findMany({
            where: { taskId, deletedAt: null },
            orderBy: { createdAt: 'asc' },
            include: { author: { select: { id: true, name: true, avatarUrl: true } } },
        });
    }
    findCommentById(id) {
        return this.prisma.taskComment.findFirst({ where: { id, deletedAt: null } });
    }
    softDeleteComment(id) {
        return this.prisma.taskComment.update({ where: { id }, data: { deletedAt: new Date() } });
    }
};
exports.TasksRepository = TasksRepository;
exports.TasksRepository = TasksRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TasksRepository);
//# sourceMappingURL=tasks.repository.js.map