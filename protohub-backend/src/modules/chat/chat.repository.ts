import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

const MESSAGE_INCLUDE = {
  sender: { select: { id: true, name: true, avatarUrl: true } },
} satisfies Prisma.ChatMessageInclude;

@Injectable()
export class ChatRepository {
  constructor(private readonly prisma: PrismaService) {}

  findChannelByProject(projectId: string) {
    return this.prisma.chatChannel.findUnique({ where: { projectId } });
  }

  async findDirectChannel(userId1: string, userId2: string) {
    return this.prisma.chatChannel.findFirst({
      where: {
        type: 'DIRECT',
        AND: [
          { members: { some: { userId: userId1 } } },
          { members: { some: { userId: userId2 } } },
        ],
      },
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true, avatarUrl: true, isAvailable: true, headline: true } }
          }
        }
      }
    });
  }

  async createDirectChannel(userId1: string, userId2: string) {
    return this.prisma.chatChannel.create({
      data: {
        type: 'DIRECT',
        members: {
          create: [{ userId: userId1 }, { userId: userId2 }],
        },
      },
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true, avatarUrl: true, isAvailable: true, headline: true } }
          }
        }
      }
    });
  }

  async listDirectChannels(userId: string) {
    return this.prisma.chatChannel.findMany({
      where: {
        type: 'DIRECT',
        members: { some: { userId } }
      },
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true, avatarUrl: true, isAvailable: true, headline: true } }
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: { sender: { select: { id: true, name: true, avatarUrl: true } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  findChannelMember(channelId: string, userId: string) {
    return this.prisma.chatChannelMember.findUnique({
      where: { channelId_userId: { channelId, userId } },
    });
  }

  /** Idempotent — safe to call even if the user is somehow already in the channel. */
  addChannelMember(channelId: string, userId: string) {
    return this.prisma.chatChannelMember.upsert({
      where: { channelId_userId: { channelId, userId } },
      update: {},
      create: { channelId, userId },
    });
  }

  removeChannelMember(channelId: string, userId: string) {
    return this.prisma.chatChannelMember.deleteMany({ where: { channelId, userId } });
  }

  updateLastRead(channelId: string, userId: string) {
    return this.prisma.chatChannelMember.update({
      where: { channelId_userId: { channelId, userId } },
      data: { lastReadAt: new Date() },
    });
  }

  /** Cursor-paginated, newest first. Returns one extra row so the caller can tell if there's a next page without a second query. */
  async listMessages(channelId: string, cursor: string | undefined, limit: number) {
    const rows = await this.prisma.chatMessage.findMany({
      where: { channelId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      include: MESSAGE_INCLUDE,
    });

    const hasMore = rows.length > limit;
    return { messages: rows.slice(0, limit), hasMore };
  }

  createMessage(channelId: string, senderId: string, content: string) {
    return this.prisma.chatMessage.create({
      data: { channelId, senderId, content },
      include: MESSAGE_INCLUDE,
    });
  }

  findMessageById(id: string) {
    return this.prisma.chatMessage.findFirst({ where: { id, deletedAt: null } });
  }

  editMessage(id: string, content: string) {
    return this.prisma.chatMessage.update({
      where: { id },
      data: { content, editedAt: new Date() },
      include: MESSAGE_INCLUDE,
    });
  }

  softDeleteMessage(id: string) {
    return this.prisma.chatMessage.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
