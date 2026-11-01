import { ConfigService } from '@nestjs/config';
import { AIRepository } from './ai.repository';
import { SendAIMessageDto } from './dto/send-ai-message.dto';
export declare class AIService {
    private readonly aiRepository;
    private readonly configService;
    constructor(aiRepository: AIRepository, configService: ConfigService);
    listConversations(userId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string | null;
        projectId: string | null;
    }[]>;
    getConversation(id: string, userId: string): Promise<{
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
    deleteConversation(id: string, userId: string): Promise<{
        success: boolean;
    }>;
    sendMessage(userId: string, dto: SendAIMessageDto): Promise<{
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
    private callOpenAI;
}
