import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
export declare class ChatRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findChannelByProject(projectId: string): Prisma.Prisma__ChatChannelClient<{
        id: string;
        name: string | null;
        createdAt: Date;
        projectId: string | null;
        type: string;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    findDirectChannel(userId1: string, userId2: string): Promise<({
        members: ({
            user: {
                id: string;
                name: string;
                headline: string | null;
                avatarUrl: string | null;
                isAvailable: boolean;
            };
        } & {
            id: string;
            userId: string;
            joinedAt: Date;
            channelId: string;
            lastReadAt: Date | null;
        })[];
    } & {
        id: string;
        name: string | null;
        createdAt: Date;
        projectId: string | null;
        type: string;
    }) | null>;
    createDirectChannel(userId1: string, userId2: string): Promise<{
        members: ({
            user: {
                id: string;
                name: string;
                headline: string | null;
                avatarUrl: string | null;
                isAvailable: boolean;
            };
        } & {
            id: string;
            userId: string;
            joinedAt: Date;
            channelId: string;
            lastReadAt: Date | null;
        })[];
    } & {
        id: string;
        name: string | null;
        createdAt: Date;
        projectId: string | null;
        type: string;
    }>;
    listDirectChannels(userId: string): Promise<({
        members: ({
            user: {
                id: string;
                name: string;
                headline: string | null;
                avatarUrl: string | null;
                isAvailable: boolean;
            };
        } & {
            id: string;
            userId: string;
            joinedAt: Date;
            channelId: string;
            lastReadAt: Date | null;
        })[];
        messages: ({
            sender: {
                id: string;
                name: string;
                avatarUrl: string | null;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            deletedAt: Date | null;
            content: string;
            channelId: string;
            editedAt: Date | null;
            senderId: string | null;
            attachmentId: string | null;
        })[];
    } & {
        id: string;
        name: string | null;
        createdAt: Date;
        projectId: string | null;
        type: string;
    })[]>;
    findChannelMember(channelId: string, userId: string): Prisma.Prisma__ChatChannelMemberClient<{
        id: string;
        userId: string;
        joinedAt: Date;
        channelId: string;
        lastReadAt: Date | null;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    addChannelMember(channelId: string, userId: string): Prisma.Prisma__ChatChannelMemberClient<{
        id: string;
        userId: string;
        joinedAt: Date;
        channelId: string;
        lastReadAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    removeChannelMember(channelId: string, userId: string): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateLastRead(channelId: string, userId: string): Prisma.Prisma__ChatChannelMemberClient<{
        id: string;
        userId: string;
        joinedAt: Date;
        channelId: string;
        lastReadAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    listMessages(channelId: string, cursor: string | undefined, limit: number): Promise<{
        messages: ({
            sender: {
                id: string;
                name: string;
                avatarUrl: string | null;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            deletedAt: Date | null;
            content: string;
            channelId: string;
            editedAt: Date | null;
            senderId: string | null;
            attachmentId: string | null;
        })[];
        hasMore: boolean;
    }>;
    createMessage(channelId: string, senderId: string, content: string): Prisma.Prisma__ChatMessageClient<{
        sender: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        deletedAt: Date | null;
        content: string;
        channelId: string;
        editedAt: Date | null;
        senderId: string | null;
        attachmentId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    findMessageById(id: string): Prisma.Prisma__ChatMessageClient<{
        id: string;
        createdAt: Date;
        deletedAt: Date | null;
        content: string;
        channelId: string;
        editedAt: Date | null;
        senderId: string | null;
        attachmentId: string | null;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    editMessage(id: string, content: string): Prisma.Prisma__ChatMessageClient<{
        sender: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        deletedAt: Date | null;
        content: string;
        channelId: string;
        editedAt: Date | null;
        senderId: string | null;
        attachmentId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    softDeleteMessage(id: string): Prisma.Prisma__ChatMessageClient<{
        id: string;
        createdAt: Date;
        deletedAt: Date | null;
        content: string;
        channelId: string;
        editedAt: Date | null;
        senderId: string | null;
        attachmentId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
}
