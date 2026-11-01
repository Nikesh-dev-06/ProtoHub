import { ChatRepository } from './chat.repository';
import { SendMessageDto } from './dto/send-message.dto';
import { ListMessagesDto } from './dto/list-messages.dto';
export declare class ChatService {
    private readonly chatRepository;
    constructor(chatRepository: ChatRepository);
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
    getOrCreateDirectChannel(userId1: string, userId2: string): Promise<{
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
    listDirectMessages(channelId: string, userId: string, query: ListMessagesDto): Promise<{
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
    sendDirectMessage(channelId: string, userId: string, dto: SendMessageDto): Promise<{
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
    }>;
    assertChannelAccess(projectId: string, userId: string): Promise<{
        id: string;
        name: string | null;
        createdAt: Date;
        projectId: string | null;
        type: string;
    }>;
    listMessages(projectId: string, userId: string, query: ListMessagesDto): Promise<{
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
    sendMessage(projectId: string, userId: string, dto: SendMessageDto): Promise<{
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
    }>;
    editMessage(projectId: string, messageId: string, userId: string, dto: SendMessageDto): Promise<{
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
    }>;
    deleteMessage(projectId: string, messageId: string, userId: string): Promise<void>;
    markRead(projectId: string, userId: string): Promise<void>;
}
