import { CreateNotificationParams, NotificationsRepository } from './notifications.repository';
export declare class NotificationsService {
    private readonly notificationsRepository;
    constructor(notificationsRepository: NotificationsRepository);
    create(params: CreateNotificationParams): import(".prisma/client").Prisma.Prisma__NotificationClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    list(userId: string, unreadOnly: boolean): Promise<{
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
    markRead(id: string, userId: string): Promise<void>;
    markAllRead(userId: string): Promise<void>;
}
