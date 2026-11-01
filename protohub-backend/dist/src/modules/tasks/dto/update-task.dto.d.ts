import { TaskPriority } from '../../../common/prisma-enums';
export declare class UpdateTaskDto {
    title?: string;
    description?: string;
    priority?: TaskPriority;
    assigneeId?: string | null;
    dueDate?: string | null;
}
