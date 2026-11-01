import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PublicUser } from '../users/users.service';
import { MentorshipService } from './mentorship.service';
import { CreateMentorshipRequestDto } from './dto/create-mentorship-request.dto';
import { RespondMentorshipRequestDto } from './dto/respond-mentorship-request.dto';

@Controller('mentorship-requests')
export class MentorshipController {
  constructor(private readonly mentorshipService: MentorshipService) {}

  @Post()
  request(@Body() dto: CreateMentorshipRequestDto, @CurrentUser() user: PublicUser) {
    return this.mentorshipService.request(user.id, dto);
  }

  @Get('sent')
  listSent(@CurrentUser() user: PublicUser) {
    return this.mentorshipService.listSent(user.id);
  }

  @Get('received')
  listReceived(@CurrentUser() user: PublicUser) {
    return this.mentorshipService.listReceived(user.id);
  }

  @Patch(':id')
  respond(@Param('id') id: string, @Body() dto: RespondMentorshipRequestDto, @CurrentUser() user: PublicUser) {
    return this.mentorshipService.respond(id, user.id, dto);
  }

  @Delete(':id')
  cancel(@Param('id') id: string, @CurrentUser() user: PublicUser) {
    return this.mentorshipService.cancel(id, user.id);
  }
}
