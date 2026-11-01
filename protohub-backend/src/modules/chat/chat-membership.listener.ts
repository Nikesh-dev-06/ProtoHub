import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ChatRepository } from './chat.repository';

interface ProjectMembershipEvent {
  projectId: string;
  userId: string;
}

/**
 * Reacts to membership changes emitted by ProjectsService. This is the
 * deliberate alternative to ChatModule <-> ProjectsModule importing each
 * other directly: Projects doesn't know Chat exists, Chat doesn't drive
 * project membership — they only agree on an event contract.
 */
@Injectable()
export class ChatMembershipListener {
  private readonly logger = new Logger(ChatMembershipListener.name);

  constructor(private readonly chatRepository: ChatRepository) {}

  @OnEvent('project.member.joined')
  async handleMemberJoined({ projectId, userId }: ProjectMembershipEvent) {
    const channel = await this.chatRepository.findChannelByProject(projectId);
    if (!channel) {
      this.logger.warn(`No chat channel found for project ${projectId} — skipping membership sync`);
      return;
    }
    await this.chatRepository.addChannelMember(channel.id, userId);
  }

  @OnEvent('project.member.removed')
  async handleMemberRemoved({ projectId, userId }: ProjectMembershipEvent) {
    const channel = await this.chatRepository.findChannelByProject(projectId);
    if (!channel) return;
    await this.chatRepository.removeChannelMember(channel.id, userId);
  }
}
