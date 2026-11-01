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
var ChatGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const users_service_1 = require("../users/users.service");
const chat_service_1 = require("./chat.service");
const projectRoom = (projectId) => `project:${projectId}`;
const channelRoom = (channelId) => `channel:${channelId}`;
let ChatGateway = ChatGateway_1 = class ChatGateway {
    constructor(chatService, jwtService, configService, usersService) {
        this.chatService = chatService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.usersService = usersService;
        this.logger = new common_1.Logger(ChatGateway_1.name);
    }
    async handleConnection(socket) {
        try {
            const token = socket.handshake.auth?.token ?? socket.handshake.headers?.authorization?.replace('Bearer ', '');
            if (!token)
                throw new common_1.UnauthorizedException('Missing access token');
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get('JWT_ACCESS_SECRET'),
            });
            const user = await this.usersService.findById(payload.sub);
            if (!user || !user.isActive)
                throw new common_1.UnauthorizedException('Invalid session');
            socket.data.userId = (0, users_service_1.toPublicUser)(user).id;
        }
        catch (error) {
            this.logger.warn(`Rejected socket connection: ${error.message}`);
            socket.emit('auth_error', { message: 'Authentication failed' });
            socket.disconnect(true);
        }
    }
    handleDisconnect(socket) {
        this.logger.debug(`Socket disconnected: ${socket.id}`);
    }
    async handleJoinProject(socket, body) {
        try {
            await this.chatService.assertChannelAccess(body.projectId, socket.data.userId);
            await socket.join(projectRoom(body.projectId));
            socket.emit('joined_project', { projectId: body.projectId });
        }
        catch (error) {
            socket.emit('error', { message: error.message });
        }
    }
    async handleLeaveProject(socket, body) {
        await socket.leave(projectRoom(body.projectId));
    }
    async handleSendMessage(socket, body) {
        try {
            const message = await this.chatService.sendMessage(body.projectId, socket.data.userId, { content: body.content });
            this.server.to(projectRoom(body.projectId)).emit('new_message', message);
        }
        catch (error) {
            socket.emit('error', { message: error.message });
        }
    }
    handleTyping(socket, body) {
        socket.to(projectRoom(body.projectId)).emit('user_typing', { userId: socket.data.userId });
    }
    async handleJoinChannel(socket, body) {
        await socket.join(channelRoom(body.channelId));
    }
    async handleLeaveChannel(socket, body) {
        await socket.leave(channelRoom(body.channelId));
    }
    async handleSendDirectMessage(socket, body) {
        try {
            const message = await this.chatService.sendDirectMessage(body.channelId, socket.data.userId, { content: body.content });
            this.server.to(channelRoom(body.channelId)).emit('new_message', message);
        }
        catch (error) {
            socket.emit('error', { message: error.message });
        }
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join_project'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleJoinProject", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave_project'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleLeaveProject", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('send_message'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleSendMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleTyping", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('join_channel'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleJoinChannel", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave_channel'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleLeaveChannel", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('send_direct_message'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleSendDirectMessage", null);
exports.ChatGateway = ChatGateway = ChatGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: { origin: process.env.CORS_ORIGIN?.split(',') ?? true, credentials: true } }),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        jwt_1.JwtService,
        config_1.ConfigService,
        users_service_1.UsersService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map