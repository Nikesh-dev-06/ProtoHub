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
exports.DirectChatController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const chat_service_1 = require("./chat.service");
const send_message_dto_1 = require("./dto/send-message.dto");
const list_messages_dto_1 = require("./dto/list-messages.dto");
let DirectChatController = class DirectChatController {
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
};
exports.DirectChatController = DirectChatController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DirectChatController.prototype, "listDirectChannels", null);
__decorate([
    (0, common_1.Post)(':targetUserId'),
    __param(0, (0, common_1.Param)('targetUserId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DirectChatController.prototype, "startDirectMessage", null);
__decorate([
    (0, common_1.Get)(':channelId/messages'),
    __param(0, (0, common_1.Param)('channelId')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, list_messages_dto_1.ListMessagesDto, Object]),
    __metadata("design:returntype", void 0)
], DirectChatController.prototype, "listDirectMessages", null);
__decorate([
    (0, common_1.Post)(':channelId/messages'),
    __param(0, (0, common_1.Param)('channelId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, send_message_dto_1.SendMessageDto, Object]),
    __metadata("design:returntype", void 0)
], DirectChatController.prototype, "sendDirectMessage", null);
exports.DirectChatController = DirectChatController = __decorate([
    (0, common_1.Controller)('chat/direct'),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], DirectChatController);
//# sourceMappingURL=direct-chat.controller.js.map