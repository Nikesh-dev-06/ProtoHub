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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const chat_repository_1 = require("./chat.repository");
let ChatService = class ChatService {
    constructor(chatRepository) {
        this.chatRepository = chatRepository;
    }
    async listDirectChannels(userId) {
        return this.chatRepository.listDirectChannels(userId);
    }
    async getOrCreateDirectChannel(userId1, userId2) {
        if (userId1 === userId2)
            throw new common_1.ForbiddenException('Cannot DM yourself');
        let channel = await this.chatRepository.findDirectChannel(userId1, userId2);
        if (!channel) {
            channel = await this.chatRepository.createDirectChannel(userId1, userId2);
        }
        return channel;
    }
    async listDirectMessages(channelId, userId, query) {
        const membership = await this.chatRepository.findChannelMember(channelId, userId);
        if (!membership)
            throw new common_1.ForbiddenException('You are not a member of this chat');
        return this.chatRepository.listMessages(channelId, query.cursor, query.limit);
    }
    async sendDirectMessage(channelId, userId, dto) {
        const membership = await this.chatRepository.findChannelMember(channelId, userId);
        if (!membership)
            throw new common_1.ForbiddenException('You are not a member of this chat');
        return this.chatRepository.createMessage(channelId, userId, dto.content);
    }
    async assertChannelAccess(projectId, userId) {
        const channel = await this.chatRepository.findChannelByProject(projectId);
        if (!channel)
            throw new common_1.NotFoundException('This project has no chat channel');
        const membership = await this.chatRepository.findChannelMember(channel.id, userId);
        if (!membership)
            throw new common_1.ForbiddenException('You are not a member of this project workspace');
        return channel;
    }
    async listMessages(projectId, userId, query) {
        const channel = await this.assertChannelAccess(projectId, userId);
        return this.chatRepository.listMessages(channel.id, query.cursor, query.limit);
    }
    async sendMessage(projectId, userId, dto) {
        const channel = await this.assertChannelAccess(projectId, userId);
        return this.chatRepository.createMessage(channel.id, userId, dto.content);
    }
    async editMessage(projectId, messageId, userId, dto) {
        await this.assertChannelAccess(projectId, userId);
        const message = await this.chatRepository.findMessageById(messageId);
        if (!message)
            throw new common_1.NotFoundException('Message not found');
        if (message.senderId !== userId) {
            throw new common_1.ForbiddenException('You can only edit your own messages');
        }
        return this.chatRepository.editMessage(messageId, dto.content);
    }
    async deleteMessage(projectId, messageId, userId) {
        await this.assertChannelAccess(projectId, userId);
        const message = await this.chatRepository.findMessageById(messageId);
        if (!message)
            throw new common_1.NotFoundException('Message not found');
        if (message.senderId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own messages');
        }
        await this.chatRepository.softDeleteMessage(messageId);
    }
    async markRead(projectId, userId) {
        const channel = await this.assertChannelAccess(projectId, userId);
        await this.chatRepository.updateLastRead(channel.id, userId);
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [chat_repository_1.ChatRepository])
], ChatService);
//# sourceMappingURL=chat.service.js.map