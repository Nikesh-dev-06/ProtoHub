import { Injectable } from '@nestjs/common';
import { AIRole } from '../../common/prisma-enums';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AIRepository {
  constructor(private readonly prisma: PrismaService) {}

  createConversation(userId: string, projectId: string | undefined, title: string) {
    return this.prisma.aIConversation.create({ data: { userId, projectId, title } });
  }

  findConversation(id: string) {
    return this.prisma.aIConversation.findUnique({
      where: { id },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
  }

  listConversations(userId: string) {
    return this.prisma.aIConversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  addMessage(conversationId: string, role: AIRole, content: string, tokensUsed?: number) {
    return this.prisma.aIMessage.create({ data: { conversationId, role, content, tokensUsed } });
  }

  touchConversation(id: string) {
    return this.prisma.aIConversation.update({ where: { id }, data: { updatedAt: new Date() } });
  }

  deleteConversation(id: string) {
    return this.prisma.aIConversation.delete({ where: { id } });
  }
}
