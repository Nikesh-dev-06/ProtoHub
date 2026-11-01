import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { MentorshipController } from './mentorship.controller';
import { MentorshipService } from './mentorship.service';
import { MentorshipRepository } from './mentorship.repository';

@Module({
  imports: [UsersModule],
  controllers: [MentorshipController],
  providers: [MentorshipService, MentorshipRepository],
})
export class MentorshipModule {}
