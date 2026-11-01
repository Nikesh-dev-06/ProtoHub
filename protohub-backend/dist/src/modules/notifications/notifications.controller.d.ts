import { PublicUser } from '../users/users.service';
import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    list(unreadOnly: string | undefined, user: PublicUser): Promise<{
        notifications: {
            id: string;
            createdAt: Date;
            userId: string;
            title: string;
            message: string;
            type: string;
            isRead: boolean;
            readAt: Date | null;
            entityType: string | null;
            entityId: string | null;
        }[];
        unreadCount: number;
    }>;
    markRead(id: string, user: PublicUser): Promise<void>;
    markAllRead(user: PublicUser): Promise<void>;
}
