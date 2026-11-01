import { EventEmitter2 } from '@nestjs/event-emitter';
import { TasksRepository } from './tasks.repository';
import { ProjectsService } from '../projects/projects.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { MoveTaskDto } from './dto/move-task.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
export declare class TasksService {
    private readonly tasksRepository;
    private readonly projectsService;
    private readonly eventEmitter;
    constructor(tasksRepository: TasksRepository, projectsService: ProjectsService, eventEmitter: EventEmitter2);
    getBoard(projectId: string, userId: string): Promise<({
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
    createColumn(projectId: string, dto: CreateColumnDto, userId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
        position: number;
    }>;
    renameColumn(projectId: string, columnId: string, dto: CreateColumnDto, userId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
        position: number;
    }>;
    deleteColumn(projectId: string, columnId: string, userId: string): Promise<void>;
    createTask(projectId: string, dto: CreateTaskDto, userId: string): Promise<{
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
    getTask(projectId: string, taskId: string, userId: string): Promise<{
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
    updateTask(projectId: string, taskId: string, dto: UpdateTaskDto, userId: string): Promise<{
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
    moveTask(projectId: string, taskId: string, dto: MoveTaskDto, userId: string): Promise<{
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
    deleteTask(projectId: string, taskId: string, userId: string): Promise<void>;
    addComment(projectId: string, taskId: string, dto: CreateCommentDto, userId: string): Promise<{
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
    }>;
    listComments(projectId: string, taskId: string, userId: string): Promise<({
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
    deleteComment(projectId: string, commentId: string, userId: string): Promise<void>;
    private assertColumnBelongsToProject;
    private assertValidAssignee;
    findUserTasks(userId: string): Promise<{
        data: ({
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
        })[];
        meta: {
            total: number;
        };
    }>;
    findAllUserTasksForPlanner(userId: string): Promise<{
        data: ({
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
        })[];
        meta: {
            total: number;
        };
    }>;
    private findTaskInProject;
}
