import { Module } from '@nestjs/common';
import { ProjectsModule } from '../projects/projects.module';
import { TasksController } from './tasks.controller';
import { TasksGlobalController } from './tasks-global.controller';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';

@Module({
  imports: [ProjectsModule],
  controllers: [TasksController, TasksGlobalController],
  providers: [TasksService, TasksRepository],
})
export class TasksModule {}
