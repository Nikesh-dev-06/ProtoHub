import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PublicUser } from '../users/users.service';
import { TasksService } from './tasks.service';

@Controller('users/me/tasks')
export class TasksGlobalController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findUserTasks(@CurrentUser() user: PublicUser) {
    return this.tasksService.findUserTasks(user.id);
  }

  @Get('planner')
  findAllUserTasksForPlanner(@CurrentUser() user: PublicUser) {
    return this.tasksService.findAllUserTasksForPlanner(user.id);
  }
}
