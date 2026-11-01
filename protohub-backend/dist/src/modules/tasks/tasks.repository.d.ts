import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
export declare class TasksRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findColumnsWithTasks(projectId: string): Prisma.PrismaPromise<({
        tasks: ({
            assignee: {
                id: string;
                name: string;
                avatarUrl: string | null;
            } | null;
            creator: {
                id: string;
                name: string;
                avatarUrl: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            title: string;
            description: string | null;
            projectId: string;
            position: number;
            priority: string;
            dueDate: Date | null;
            completedAt: Date | null;
            columnId: string;
            assigneeId: string | null;
            createdById: string;
        })[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
        position: number;
    })[]>;
    findColumnById(id: string): Prisma.Prisma__TaskColumnClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
        position: number;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    createColumn(projectId: string, name: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
        position: number;
    }>;
    renameColumn(id: string, name: string): Prisma.Prisma__TaskColumnClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
        position: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    countTasksInColumn(columnId: string): Prisma.PrismaPromise<number>;
    deleteColumn(id: string): Prisma.Prisma__TaskColumnClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
        position: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    findTaskById(id: string): Prisma.Prisma__TaskClient<({
        assignee: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
        creator: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        title: string;
        description: string | null;
        projectId: string;
        position: number;
        priority: string;
        dueDate: Date | null;
        completedAt: Date | null;
        columnId: string;
        assigneeId: string | null;
        createdById: string;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    findUserTasks(userId: string, limit?: number): Prisma.PrismaPromise<({
        project: {
            id: string;
            slug: string;
            title: string;
        };
        assignee: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
        creator: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        title: string;
        description: string | null;
        projectId: string;
        position: number;
        priority: string;
        dueDate: Date | null;
        completedAt: Date | null;
        columnId: string;
        assigneeId: string | null;
        createdById: string;
    })[]>;
    findAllUserTasksForPlanner(userId: string): Prisma.PrismaPromise<({
        project: {
            id: string;
            slug: string;
            title: string;
        };
        column: {
            id: string;
            name: string;
        };
        assignee: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
        creator: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        title: string;
        description: string | null;
        projectId: string;
        position: number;
        priority: string;
        dueDate: Date | null;
        completedAt: Date | null;
        columnId: string;
        assigneeId: string | null;
        createdById: string;
    })[]>;
    createTask(data: {
        projectId: string;
        columnId: string;
        title: string;
        description?: string;
        priority?: Prisma.TaskCreateInput['priority'];
        assigneeId?: string;
        createdById: string;
        dueDate?: Date;
    }): Promise<{
        assignee: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
        creator: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        title: string;
        description: string | null;
        projectId: string;
        position: number;
        priority: string;
        dueDate: Date | null;
        completedAt: Date | null;
        columnId: string;
        assigneeId: string | null;
        createdById: string;
    }>;
    updateTask(id: string, data: Prisma.TaskUpdateInput): Prisma.Prisma__TaskClient<{
        assignee: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
        creator: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        title: string;
        description: string | null;
        projectId: string;
        position: number;
        priority: string;
        dueDate: Date | null;
        completedAt: Date | null;
        columnId: string;
        assigneeId: string | null;
        createdById: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    softDeleteTask(id: string): Prisma.Prisma__TaskClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        title: string;
        description: string | null;
        projectId: string;
        position: number;
        priority: string;
        dueDate: Date | null;
        completedAt: Date | null;
        columnId: string;
        assigneeId: string | null;
        createdById: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    moveTask(params: {
        taskId: string;
        sourceColumnId: string;
        sourcePosition: number;
        targetColumnId: string;
        targetPosition: number;
    }): Promise<{
        assignee: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
        creator: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        title: string;
        description: string | null;
        projectId: string;
        position: number;
        priority: string;
        dueDate: Date | null;
        completedAt: Date | null;
        columnId: string;
        assigneeId: string | null;
        createdById: string;
    }>;
    addComment(taskId: string, authorId: string, content: string): Prisma.Prisma__TaskCommentClient<{
        author: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        content: string;
        taskId: string;
        authorId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    listComments(taskId: string): Prisma.PrismaPromise<({
        author: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        content: string;
        taskId: string;
        authorId: string;
    })[]>;
    findCommentById(id: string): Prisma.Prisma__TaskCommentClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        content: string;
        taskId: string;
        authorId: string;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    softDeleteComment(id: string): Prisma.Prisma__TaskCommentClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        content: string;
        taskId: string;
        authorId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
}
