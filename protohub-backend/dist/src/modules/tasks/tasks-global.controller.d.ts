import { PublicUser } from '../users/users.service';
import { TasksService } from './tasks.service';
export declare class TasksGlobalController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    findUserTasks(user: PublicUser): Promise<{
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
    findAllUserTasksForPlanner(user: PublicUser): Promise<{
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
}
