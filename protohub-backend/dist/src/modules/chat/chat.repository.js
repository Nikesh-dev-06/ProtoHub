"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const MESSAGE_INCLUDE = {
    sender: { select: { id: true, name: true, avatarUrl: true } },
};
let ChatRepository = class ChatRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findChannelByProject(projectId) {
        return this.prisma.chatChannel.findUnique({ where: { projectId } });
    }
    async findDirectChannel(userId1, userId2) {
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
    async createDirectChannel(userId1, userId2) {
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
    async listDirectChannels(userId) {
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
    findChannelMember(channelId, userId) {
        return this.prisma.chatChannelMember.findUnique({
            where: { channelId_userId: { channelId, userId } },
        });
    }
    addChannelMember(channelId, userId) {
        return this.prisma.chatChannelMember.upsert({
            where: { channelId_userId: { channelId, userId } },
            update: {},
            create: { channelId, userId },
        });
    }
    removeChannelMember(channelId, userId) {
        return this.prisma.chatChannelMember.deleteMany({ where: { channelId, userId } });
    }
    updateLastRead(channelId, userId) {
        return this.prisma.chatChannelMember.update({
            where: { channelId_userId: { channelId, userId } },
            data: { lastReadAt: new Date() },
        });
    }
    async listMessages(channelId, cursor, limit) {
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
    createMessage(channelId, senderId, content) {
        return this.prisma.chatMessage.create({
            data: { channelId, senderId, content },
            include: MESSAGE_INCLUDE,
        });
    }
    findMessageById(id) {
        return this.prisma.chatMessage.findFirst({ where: { id, deletedAt: null } });
    }
    editMessage(id, content) {
        return this.prisma.chatMessage.update({
            where: { id },
            data: { content, editedAt: new Date() },
            include: MESSAGE_INCLUDE,
        });
    }
    softDeleteMessage(id) {
        return this.prisma.chatMessage.update({ where: { id }, data: { deletedAt: new Date() } });
    }
};
exports.ChatRepository = ChatRepository;
exports.ChatRepository = ChatRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChatRepository);
//# sourceMappingURL=chat.repository.js.map