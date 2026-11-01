import { PublicUser } from '../users/users.service';
import { AIService } from './ai.service';
import { SendAIMessageDto } from './dto/send-ai-message.dto';
export declare class AIController {
    private readonly aiService;
    constructor(aiService: AIService);
    list(user: PublicUser): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string | null;
        projectId: string | null;
    }[]>;
    get(id: string, user: PublicUser): Promise<{
        messages: {
            id: string;
            createdAt: Date;
            role: string;
            content: string;
            tokensUsed: number | null;
            conversationId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string | null;
        projectId: string | null;
    }>;
    sendMessage(dto: SendAIMessageDto, user: PublicUser): Promise<{
        conversationId: string;
        message: {
            id: string;
            createdAt: Date;
            role: string;
            content: string;
            tokensUsed: number | null;
            conversationId: string;
        };
    }>;
    delete(id: string, user: PublicUser): Promise<{
        success: boolean;
    }>;
}
