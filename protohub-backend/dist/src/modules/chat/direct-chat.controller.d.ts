import { PublicUser } from '../users/users.service';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { ListMessagesDto } from './dto/list-messages.dto';
export declare class DirectChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    listDirectChannels(user: PublicUser): Promise<({
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
    startDirectMessage(targetUserId: string, user: PublicUser): Promise<{
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
    listDirectMessages(channelId: string, query: ListMessagesDto, user: PublicUser): Promise<{
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
    sendDirectMessage(channelId: string, dto: SendMessageDto, user: PublicUser): Promise<{
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
}
