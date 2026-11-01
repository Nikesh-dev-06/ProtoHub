import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PublicUser } from '../users/users.service';
import { AIService } from './ai.service';
import { SendAIMessageDto } from './dto/send-ai-message.dto';

@Controller('ai/conversations')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Get()
  list(@CurrentUser() user: PublicUser) {
    return this.aiService.listConversations(user.id);
  }

  @Get(':id')
  get(@Param('id') id: string, @CurrentUser() user: PublicUser) {
    return this.aiService.getConversation(id, user.id);
  }

  @Post('messages')
  sendMessage(@Body() dto: SendAIMessageDto, @CurrentUser() user: PublicUser) {
    return this.aiService.sendMessage(user.id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @CurrentUser() user: PublicUser) {
    return this.aiService.deleteConversation(id, user.id);
  }
}
