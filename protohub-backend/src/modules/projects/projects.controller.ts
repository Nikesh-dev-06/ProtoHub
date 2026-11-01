import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PublicUser } from '../users/users.service';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryProjectsDto } from './dto/query-projects.dto';
import { CreateJoinRequestDto } from './dto/create-join-request.dto';
import { ReviewJoinRequestDto } from './dto/review-join-request.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() dto: CreateProjectDto, @CurrentUser() user: PublicUser) {
    return this.projectsService.create(dto, user.id);
  }

  @Public()
  @Get()
  findAll(@Query() query: QueryProjectsDto) {
    return this.projectsService.findAll(query);
  }

  @Get('me')
  findMyProjects(@CurrentUser() user: PublicUser) {
    return this.projectsService.findUserProjects(user.id);
  }

  @Public()
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.projectsService.findBySlug(slug);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto, @CurrentUser() user: PublicUser) {
    return this.projectsService.update(id, dto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: PublicUser) {
    return this.projectsService.remove(id, user.id);
  }

  @Public()
  @Get(':id/members')
  listMembers(@Param('id') id: string) {
    return this.projectsService.listMembers(id);
  }

  @Patch(':id/members/:userId')
  updateMemberRole(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body() dto: UpdateMemberRoleDto,
    @CurrentUser() user: PublicUser,
  ) {
    return this.projectsService.updateMemberRole(id, userId, dto, user.id);
  }

  @Delete(':id/members/:userId')
  removeMember(@Param('id') id: string, @Param('userId') userId: string, @CurrentUser() user: PublicUser) {
    return this.projectsService.removeMember(id, userId, user.id);
  }

  @Post(':id/join-requests')
  requestToJoin(@Param('id') id: string, @Body() dto: CreateJoinRequestDto, @CurrentUser() user: PublicUser) {
    return this.projectsService.requestToJoin(id, user.id, dto);
  }

  @Get(':id/join-requests')
  listJoinRequests(@Param('id') id: string, @CurrentUser() user: PublicUser) {
    return this.projectsService.listJoinRequests(id, user.id);
  }

  @Patch(':id/join-requests/:requestId')
  reviewJoinRequest(
    @Param('id') id: string,
    @Param('requestId') requestId: string,
    @Body() dto: ReviewJoinRequestDto,
    @CurrentUser() user: PublicUser,
  ) {
    return this.projectsService.reviewJoinRequest(id, requestId, dto, user.id);
  }

  @Get(':id/attachments')
  listAttachments(@Param('id') id: string, @CurrentUser() user: PublicUser) {
    return this.projectsService.listAttachments(id, user.id);
  }

  @Get(':id/activity')
  listActivity(@Param('id') id: string, @CurrentUser() user: PublicUser) {
    return this.projectsService.listActivity(id, user.id);
  }
}
