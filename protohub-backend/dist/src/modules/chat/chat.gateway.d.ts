import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UsersService } from '../users/users.service';
import { ChatService } from './chat.service';
interface AuthenticatedSocket extends Socket {
    data: {
        userId: string;
    };
}
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly chatService;
    private readonly jwtService;
    private readonly configService;
    private readonly usersService;
    server: Server;
    private readonly logger;
    constructor(chatService: ChatService, jwtService: JwtService, configService: ConfigService, usersService: UsersService);
    handleConnection(socket: AuthenticatedSocket): Promise<void>;
    handleDisconnect(socket: AuthenticatedSocket): void;
    handleJoinProject(socket: AuthenticatedSocket, body: {
        projectId: string;
    }): Promise<void>;
    handleLeaveProject(socket: AuthenticatedSocket, body: {
        projectId: string;
    }): Promise<void>;
    handleSendMessage(socket: AuthenticatedSocket, body: {
        projectId: string;
        content: string;
    }): Promise<void>;
    handleTyping(socket: AuthenticatedSocket, body: {
        projectId: string;
    }): void;
    handleJoinChannel(socket: AuthenticatedSocket, body: {
        channelId: string;
    }): Promise<void>;
    handleLeaveChannel(socket: AuthenticatedSocket, body: {
        channelId: string;
    }): Promise<void>;
    handleSendDirectMessage(socket: AuthenticatedSocket, body: {
        channelId: string;
        content: string;
    }): Promise<void>;
}
export {};
