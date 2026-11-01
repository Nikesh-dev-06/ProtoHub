import { Injectable } from '@nestjs/common';
import { CreateNotificationParams, NotificationsRepository } from './notifications.repository';

@Injectable()
export class NotificationsService {
  constructor(private readonly notificationsRepository: NotificationsRepository) {}

  create(params: CreateNotificationParams) {
    return this.notificationsRepository.create(params);
  }

  async list(userId: string, unreadOnly: boolean) {
    const [notifications, unreadCount] = await Promise.all([
      this.notificationsRepository.listForUser(userId, unreadOnly),
      this.notificationsRepository.countUnread(userId),
    ]);
    return { notifications, unreadCount };
  }

  async markRead(id: string, userId: string) {
    await this.notificationsRepository.markRead(id, userId);
  }

  async markAllRead(userId: string) {
    await this.notificationsRepository.markAllRead(userId);
  }
}
