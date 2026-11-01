import { Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PublicUser } from '../users/users.service';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  list(@Query('unreadOnly') unreadOnly: string | undefined, @CurrentUser() user: PublicUser) {
    return this.notificationsService.list(user.id, unreadOnly === 'true');
  }

  @Patch(':id/read')
  @HttpCode(HttpStatus.NO_CONTENT)
  async markRead(@Param('id') id: string, @CurrentUser() user: PublicUser): Promise<void> {
    await this.notificationsService.markRead(id, user.id);
  }

  @Post('read-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  async markAllRead(@CurrentUser() user: PublicUser): Promise<void> {
    await this.notificationsService.markAllRead(user.id);
  }
}
