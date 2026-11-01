import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationsRepository } from './notifications.repository';
import { NotificationsListener } from './notifications.listener';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsRepository, NotificationsListener],
})
export class NotificationsModule {}
