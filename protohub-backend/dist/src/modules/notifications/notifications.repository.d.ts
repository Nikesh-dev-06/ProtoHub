import { NotificationType } from '../../common/prisma-enums';
import { PrismaService } from '../../prisma/prisma.service';
export interface CreateNotificationParams {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    entityType?: string;
    entityId?: string;
}
export declare class NotificationsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
    listForUser(userId: string, unreadOnly: boolean): import(".prisma/client").Prisma.PrismaPromise<{
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
    }[]>;
    markRead(id: string, userId: string): import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
    markAllRead(userId: string): import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
    countUnread(userId: string): import(".prisma/client").Prisma.PrismaPromise<number>;
}
