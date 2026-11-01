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
var ChatMembershipListener_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMembershipListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const chat_repository_1 = require("./chat.repository");
let ChatMembershipListener = ChatMembershipListener_1 = class ChatMembershipListener {
    constructor(chatRepository) {
        this.chatRepository = chatRepository;
        this.logger = new common_1.Logger(ChatMembershipListener_1.name);
    }
    async handleMemberJoined({ projectId, userId }) {
        const channel = await this.chatRepository.findChannelByProject(projectId);
        if (!channel) {
            this.logger.warn(`No chat channel found for project ${projectId} — skipping membership sync`);
            return;
        }
        await this.chatRepository.addChannelMember(channel.id, userId);
    }
    async handleMemberRemoved({ projectId, userId }) {
        const channel = await this.chatRepository.findChannelByProject(projectId);
        if (!channel)
            return;
        await this.chatRepository.removeChannelMember(channel.id, userId);
    }
};
exports.ChatMembershipListener = ChatMembershipListener;
__decorate([
    (0, event_emitter_1.OnEvent)('project.member.joined'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatMembershipListener.prototype, "handleMemberJoined", null);
__decorate([
    (0, event_emitter_1.OnEvent)('project.member.removed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatMembershipListener.prototype, "handleMemberRemoved", null);
exports.ChatMembershipListener = ChatMembershipListener = ChatMembershipListener_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [chat_repository_1.ChatRepository])
], ChatMembershipListener);
//# sourceMappingURL=chat-membership.listener.js.map