import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PublicUser } from '../users/users.service';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { ListMessagesDto } from './dto/list-messages.dto';

@Controller('chat/direct')
export class DirectChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  listDirectChannels(@CurrentUser() user: PublicUser) {
    return this.chatService.listDirectChannels(user.id);
  }

  @Post(':targetUserId')
  startDirectMessage(@Param('targetUserId') targetUserId: string, @CurrentUser() user: PublicUser) {
    return this.chatService.getOrCreateDirectChannel(user.id, targetUserId);
  }

  @Get(':channelId/messages')
  listDirectMessages(@Param('channelId') channelId: string, @Query() query: ListMessagesDto, @CurrentUser() user: PublicUser) {
    return this.chatService.listDirectMessages(channelId, user.id, query);
  }

  @Post(':channelId/messages')
  sendDirectMessage(@Param('channelId') channelId: string, @Body() dto: SendMessageDto, @CurrentUser() user: PublicUser) {
    return this.chatService.sendDirectMessage(channelId, user.id, dto);
  }
}
