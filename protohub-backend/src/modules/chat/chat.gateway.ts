import { Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UsersService, toPublicUser } from '../users/users.service';
import { ChatService } from './chat.service';

interface AuthenticatedSocket extends Socket {
  data: { userId: string };
}

const projectRoom = (projectId: string) => `project:${projectId}`;
const channelRoom = (channelId: string) => `channel:${channelId}`;

/**
 * Sockets don't go through the global JwtAuthGuard (that's HTTP-only), so
 * authentication happens explicitly in handleConnection using the same
 * access token the REST API uses — one token, two transports.
 */
@WebSocketGateway({ cors: { origin: process.env.CORS_ORIGIN?.split(',') ?? true, credentials: true } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async handleConnection(socket: AuthenticatedSocket) {
    try {
      const token = socket.handshake.auth?.token ?? socket.handshake.headers?.authorization?.replace('Bearer ', '');
      if (!token) throw new UnauthorizedException('Missing access token');

      const payload = await this.jwtService.verifyAsync<{ sub: string }>(token, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      });
      const user = await this.usersService.findById(payload.sub);
      if (!user || !user.isActive) throw new UnauthorizedException('Invalid session');

      socket.data.userId = toPublicUser(user).id;
    } catch (error) {
      this.logger.warn(`Rejected socket connection: ${(error as Error).message}`);
      socket.emit('auth_error', { message: 'Authentication failed' });
      socket.disconnect(true);
    }
  }

  handleDisconnect(socket: AuthenticatedSocket) {
    this.logger.debug(`Socket disconnected: ${socket.id}`);
  }

  @SubscribeMessage('join_project')
  async handleJoinProject(@ConnectedSocket() socket: AuthenticatedSocket, @MessageBody() body: { projectId: string }) {
    try {
      await this.chatService.assertChannelAccess(body.projectId, socket.data.userId);
      await socket.join(projectRoom(body.projectId));
      socket.emit('joined_project', { projectId: body.projectId });
    } catch (error) {
      socket.emit('error', { message: (error as Error).message });
    }
  }

  @SubscribeMessage('leave_project')
  async handleLeaveProject(@ConnectedSocket() socket: AuthenticatedSocket, @MessageBody() body: { projectId: string }) {
    await socket.leave(projectRoom(body.projectId));
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() body: { projectId: string; content: string },
  ) {
    try {
      const message = await this.chatService.sendMessage(body.projectId, socket.data.userId, { content: body.content });
      this.server.to(projectRoom(body.projectId)).emit('new_message', message);
    } catch (error) {
      socket.emit('error', { message: (error as Error).message });
    }
  }

  @SubscribeMessage('typing')
  handleTyping(@ConnectedSocket() socket: AuthenticatedSocket, @MessageBody() body: { projectId: string }) {
    socket.to(projectRoom(body.projectId)).emit('user_typing', { userId: socket.data.userId });
  }

  @SubscribeMessage('join_channel')
  async handleJoinChannel(@ConnectedSocket() socket: AuthenticatedSocket, @MessageBody() body: { channelId: string }) {
    await socket.join(channelRoom(body.channelId));
  }

  @SubscribeMessage('leave_channel')
  async handleLeaveChannel(@ConnectedSocket() socket: AuthenticatedSocket, @MessageBody() body: { channelId: string }) {
    await socket.leave(channelRoom(body.channelId));
  }

  @SubscribeMessage('send_direct_message')
  async handleSendDirectMessage(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() body: { channelId: string; content: string },
  ) {
    try {
      const message = await this.chatService.sendDirectMessage(body.channelId, socket.data.userId, { content: body.content });
      this.server.to(channelRoom(body.channelId)).emit('new_message', message);
    } catch (error) {
      socket.emit('error', { message: (error as Error).message });
    }
  }
}
