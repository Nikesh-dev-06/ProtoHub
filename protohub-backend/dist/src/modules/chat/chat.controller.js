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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const chat_service_1 = require("./chat.service");
const send_message_dto_1 = require("./dto/send-message.dto");
const list_messages_dto_1 = require("./dto/list-messages.dto");
let ChatController = class ChatController {
    constructor(chatService) {
        this.chatService = chatService;
    }
    listDirectChannels(user) {
        return this.chatService.listDirectChannels(user.id);
    }
    startDirectMessage(targetUserId, user) {
        return this.chatService.getOrCreateDirectChannel(user.id, targetUserId);
    }
    listDirectMessages(channelId, query, user) {
        return this.chatService.listDirectMessages(channelId, user.id, query);
    }
    sendDirectMessage(channelId, dto, user) {
        return this.chatService.sendDirectMessage(channelId, user.id, dto);
    }
    list(projectId, query, user) {
        return this.chatService.listMessages(projectId, user.id, query);
    }
    send(projectId, dto, user) {
        return this.chatService.sendMessage(projectId, user.id, dto);
    }
    edit(projectId, messageId, dto, user) {
        return this.chatService.editMessage(projectId, messageId, user.id, dto);
    }
    async remove(projectId, messageId, user) {
        await this.chatService.deleteMessage(projectId, messageId, user.id);
    }
    async markRead(projectId, user) {
        await this.chatService.markRead(projectId, user.id);
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Get)('/direct'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "listDirectChannels", null);
__decorate([
    (0, common_1.Post)('/direct/:targetUserId'),
    __param(0, (0, common_1.Param)('targetUserId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "startDirectMessage", null);
__decorate([
    (0, common_1.Get)('/direct/:channelId/messages'),
    __param(0, (0, common_1.Param)('channelId')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, list_messages_dto_1.ListMessagesDto, Object]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "listDirectMessages", null);
__decorate([
    (0, common_1.Post)('/direct/:channelId/messages'),
    __param(0, (0, common_1.Param)('channelId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, send_message_dto_1.SendMessageDto, Object]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "sendDirectMessage", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, list_messages_dto_1.ListMessagesDto, Object]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, send_message_dto_1.SendMessageDto, Object]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "send", null);
__decorate([
    (0, common_1.Patch)(':messageId'),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('messageId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, send_message_dto_1.SendMessageDto, Object]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "edit", null);
__decorate([
    (0, common_1.Delete)(':messageId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('messageId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('read'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "markRead", null);
exports.ChatController = ChatController = __decorate([
    (0, common_1.Controller)('projects/:projectId/messages'),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map