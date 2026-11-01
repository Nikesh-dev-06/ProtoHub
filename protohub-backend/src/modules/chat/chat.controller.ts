import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PublicUser } from '../users/users.service';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { ListMessagesDto } from './dto/list-messages.dto';

@Controller('projects/:projectId/messages')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('/direct')
  listDirectChannels(@CurrentUser() user: PublicUser) {
    return this.chatService.listDirectChannels(user.id);
  }

  @Post('/direct/:targetUserId')
  startDirectMessage(@Param('targetUserId') targetUserId: string, @CurrentUser() user: PublicUser) {
    return this.chatService.getOrCreateDirectChannel(user.id, targetUserId);
  }

  @Get('/direct/:channelId/messages')
  listDirectMessages(@Param('channelId') channelId: string, @Query() query: ListMessagesDto, @CurrentUser() user: PublicUser) {
    return this.chatService.listDirectMessages(channelId, user.id, query);
  }

  @Post('/direct/:channelId/messages')
  sendDirectMessage(@Param('channelId') channelId: string, @Body() dto: SendMessageDto, @CurrentUser() user: PublicUser) {
    return this.chatService.sendDirectMessage(channelId, user.id, dto);
  }

  @Get()
  list(@Param('projectId') projectId: string, @Query() query: ListMessagesDto, @CurrentUser() user: PublicUser) {
    return this.chatService.listMessages(projectId, user.id, query);
  }

  /**
   * REST fallback for sending a message (e.g. a client without an open
   * socket). The WS gateway is the primary path for real-time delivery —
   * see ChatGateway.handleSendMessage — both funnel through the same
   * ChatService method so behavior never diverges between transports.
   */
  @Post()
  send(@Param('projectId') projectId: string, @Body() dto: SendMessageDto, @CurrentUser() user: PublicUser) {
    return this.chatService.sendMessage(projectId, user.id, dto);
  }

  @Patch(':messageId')
  edit(
    @Param('projectId') projectId: string,
    @Param('messageId') messageId: string,
    @Body() dto: SendMessageDto,
    @CurrentUser() user: PublicUser,
  ) {
    return this.chatService.editMessage(projectId, messageId, user.id, dto);
  }

  @Delete(':messageId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('projectId') projectId: string,
    @Param('messageId') messageId: string,
    @CurrentUser() user: PublicUser,
  ): Promise<void> {
    await this.chatService.deleteMessage(projectId, messageId, user.id);
  }

  @Post('read')
  @HttpCode(HttpStatus.NO_CONTENT)
  async markRead(@Param('projectId') projectId: string, @CurrentUser() user: PublicUser): Promise<void> {
    await this.chatService.markRead(projectId, user.id);
  }
}
