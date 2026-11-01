import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { ProjectsModule } from '../projects/projects.module';
import { AdminController } from './admin.controller';

@Module({
  imports: [UsersModule, ProjectsModule],
  controllers: [AdminController],
})
export class AdminModule {}
