import { TaskPriority } from '../../../common/prisma-enums';
export declare class CreateTaskDto {
    columnId: string;
    title: string;
    description?: string;
    priority?: TaskPriority;
    assigneeId?: string;
    dueDate?: string;
}
