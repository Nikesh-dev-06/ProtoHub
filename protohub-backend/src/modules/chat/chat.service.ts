import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import { SendMessageDto } from './dto/send-message.dto';
import { ListMessagesDto } from './dto/list-messages.dto';

@Injectable()
export class ChatService {
  constructor(private readonly chatRepository: ChatRepository) {}

  /**
   * Chat-channel membership (kept in sync with project membership via the
   * `project.member.joined` / `project.member.removed` events — see
   * ChatMembershipListener) is the authorization source of truth here,
   * rather than re-checking ProjectsService on every message. This keeps
   * the hot path (sending a message) to a single indexed lookup.
   */
  async listDirectChannels(userId: string) {
    return this.chatRepository.listDirectChannels(userId);
  }

  async getOrCreateDirectChannel(userId1: string, userId2: string) {
    if (userId1 === userId2) throw new ForbiddenException('Cannot DM yourself');
    let channel = await this.chatRepository.findDirectChannel(userId1, userId2);
    if (!channel) {
      channel = await this.chatRepository.createDirectChannel(userId1, userId2);
    }
    return channel;
  }

  async listDirectMessages(channelId: string, userId: string, query: ListMessagesDto) {
    const membership = await this.chatRepository.findChannelMember(channelId, userId);
    if (!membership) throw new ForbiddenException('You are not a member of this chat');
    return this.chatRepository.listMessages(channelId, query.cursor, query.limit);
  }

  async sendDirectMessage(channelId: string, userId: string, dto: SendMessageDto) {
    const membership = await this.chatRepository.findChannelMember(channelId, userId);
    if (!membership) throw new ForbiddenException('You are not a member of this chat');
    return this.chatRepository.createMessage(channelId, userId, dto.content);
  }

  async assertChannelAccess(projectId: string, userId: string) {
    const channel = await this.chatRepository.findChannelByProject(projectId);
    if (!channel) throw new NotFoundException('This project has no chat channel');

    const membership = await this.chatRepository.findChannelMember(channel.id, userId);
    if (!membership) throw new ForbiddenException('You are not a member of this project workspace');

    return channel;
  }

  async listMessages(projectId: string, userId: string, query: ListMessagesDto) {
    const channel = await this.assertChannelAccess(projectId, userId);
    return this.chatRepository.listMessages(channel.id, query.cursor, query.limit);
  }

  async sendMessage(projectId: string, userId: string, dto: SendMessageDto) {
    const channel = await this.assertChannelAccess(projectId, userId);
    return this.chatRepository.createMessage(channel.id, userId, dto.content);
  }

  async editMessage(projectId: string, messageId: string, userId: string, dto: SendMessageDto) {
    await this.assertChannelAccess(projectId, userId);
    const message = await this.chatRepository.findMessageById(messageId);
    if (!message) throw new NotFoundException('Message not found');
    if (message.senderId !== userId) {
      throw new ForbiddenException('You can only edit your own messages');
    }
    return this.chatRepository.editMessage(messageId, dto.content);
  }

  async deleteMessage(projectId: string, messageId: string, userId: string) {
    await this.assertChannelAccess(projectId, userId);
    const message = await this.chatRepository.findMessageById(messageId);
    if (!message) throw new NotFoundException('Message not found');
    if (message.senderId !== userId) {
      throw new ForbiddenException('You can only delete your own messages');
    }
    await this.chatRepository.softDeleteMessage(messageId);
  }

  async markRead(projectId: string, userId: string) {
    const channel = await this.assertChannelAccess(projectId, userId);
    await this.chatRepository.updateLastRead(channel.id, userId);
  }
}
