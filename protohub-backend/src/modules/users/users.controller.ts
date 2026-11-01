import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PublicUser, UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AddSkillDto } from './dto/add-skill.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Get('skills')
  listSkillCatalog() {
    return this.usersService.listSkillCatalog();
  }

  @Patch('users/me')
  updateProfile(@Body() dto: UpdateProfileDto, @CurrentUser() user: PublicUser) {
    return this.usersService.updateProfile(user.id, dto);
  }

  @Post('users/me/skills')
  addSkill(@Body() dto: AddSkillDto, @CurrentUser() user: PublicUser) {
    return this.usersService.addSkill(user.id, dto);
  }

  @Delete('users/me/skills/:skillId')
  removeSkill(@Param('skillId') skillId: string, @CurrentUser() user: PublicUser) {
    return this.usersService.removeSkill(user.id, skillId);
  }

  @Get('users/me/connections')
  getConnections(@CurrentUser() user: PublicUser) {
    return this.usersService.getConnections(user.id);
  }

  @Get('users/suggestions')
  getSuggestions(@CurrentUser() user: PublicUser) {
    return this.usersService.getSuggestions(user.id);
  }

  @Get('users/mentors')
  getMentors(@Query('q') query: string) {
    return this.usersService.searchMentors(query || '');
  }

  @Get('users/me/feed')
  getFeed(@CurrentUser() user: PublicUser) {
    return this.usersService.getFeed(user.id);
  }

  @Public()
  @Get('users/:id')
  getPublicProfile(@Param('id') id: string) {
    return this.usersService.getPublicProfile(id);
  }

  @Get('users')
  listAllUsers(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20'
  ) {
    return this.usersService.listAll(parseInt(page, 10), parseInt(limit, 10));
  }
}
