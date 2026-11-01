import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { ChatController } from './chat.controller';
import { DirectChatController } from './direct-chat.controller';
import { ChatService } from './chat.service';
import { ChatRepository } from './chat.repository';
import { ChatGateway } from './chat.gateway';
import { ChatMembershipListener } from './chat-membership.listener';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [ChatController, DirectChatController],
  providers: [ChatService, ChatRepository, ChatGateway, ChatMembershipListener],
})
export class ChatModule {}
