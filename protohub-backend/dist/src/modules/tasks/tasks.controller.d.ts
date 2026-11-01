import { PublicUser } from '../users/users.service';
import { TasksService } from './tasks.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { MoveTaskDto } from './dto/move-task.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    getBoard(projectId: string, user: PublicUser): Promise<({
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
    createColumn(projectId: string, dto: CreateColumnDto, user: PublicUser): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
        position: number;
    }>;
    renameColumn(projectId: string, columnId: string, dto: CreateColumnDto, user: PublicUser): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
        position: number;
    }>;
    deleteColumn(projectId: string, columnId: string, user: PublicUser): Promise<void>;
    createTask(projectId: string, dto: CreateTaskDto, user: PublicUser): Promise<{
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
    getTask(projectId: string, taskId: string, user: PublicUser): Promise<{
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
    updateTask(projectId: string, taskId: string, dto: UpdateTaskDto, user: PublicUser): Promise<{
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
    moveTask(projectId: string, taskId: string, dto: MoveTaskDto, user: PublicUser): Promise<{
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
    deleteTask(projectId: string, taskId: string, user: PublicUser): Promise<void>;
    addComment(projectId: string, taskId: string, dto: CreateCommentDto, user: PublicUser): Promise<{
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
    listComments(projectId: string, taskId: string, user: PublicUser): Promise<({
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
    deleteComment(projectId: string, commentId: string, user: PublicUser): Promise<void>;
}
