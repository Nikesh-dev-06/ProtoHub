import { AIRole } from '../../common/prisma-enums';
import { PrismaService } from '../../prisma/prisma.service';
export declare class AIRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createConversation(userId: string, projectId: string | undefined, title: string): import(".prisma/client").Prisma.Prisma__AIConversationClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string | null;
        projectId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findConversation(id: string): import(".prisma/client").Prisma.Prisma__AIConversationClient<({
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
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    listConversations(userId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string | null;
        projectId: string | null;
    }[]>;
    addMessage(conversationId: string, role: AIRole, content: string, tokensUsed?: number): import(".prisma/client").Prisma.Prisma__AIMessageClient<{
        id: string;
        createdAt: Date;
        role: string;
        content: string;
        tokensUsed: number | null;
        conversationId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    touchConversation(id: string): import(".prisma/client").Prisma.Prisma__AIConversationClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string | null;
        projectId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    deleteConversation(id: string): import(".prisma/client").Prisma.Prisma__AIConversationClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string | null;
        projectId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}
