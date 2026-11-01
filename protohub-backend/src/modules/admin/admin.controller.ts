import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { UserRole } from '../../common/prisma-enums';
import { Roles } from '../../common/decorators/roles.decorator';
import { UsersService } from '../users/users.service';
import { ProjectsService } from '../projects/projects.service';
import { SetUserActiveDto } from './set-user-active.dto';

@Controller('admin')
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(
    private readonly usersService: UsersService,
    private readonly projectsService: ProjectsService,
  ) {}

  @Get('users')
  listUsers(@Query('page') page = '1', @Query('limit') limit = '20') {
    return this.usersService.listAll(Number(page), Number(limit));
  }

  @Patch('users/:id/status')
  setUserActive(@Param('id') id: string, @Body() dto: SetUserActiveDto) {
    return this.usersService.setActive(id, dto.isActive);
  }

  @Get('projects')
  listProjects(@Query('page') page = '1', @Query('limit') limit = '20') {
    return this.projectsService.findAll({ page: Number(page), limit: Number(limit) });
  }
}
