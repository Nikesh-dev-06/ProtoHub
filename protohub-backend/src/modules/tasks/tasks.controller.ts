import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PublicUser } from '../users/users.service';
import { TasksService } from './tasks.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { MoveTaskDto } from './dto/move-task.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('projects/:projectId')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('board')
  getBoard(@Param('projectId') projectId: string, @CurrentUser() user: PublicUser) {
    return this.tasksService.getBoard(projectId, user.id);
  }

  // ---------------- Columns ----------------

  @Post('columns')
  createColumn(@Param('projectId') projectId: string, @Body() dto: CreateColumnDto, @CurrentUser() user: PublicUser) {
    return this.tasksService.createColumn(projectId, dto, user.id);
  }

  @Patch('columns/:columnId')
  renameColumn(
    @Param('projectId') projectId: string,
    @Param('columnId') columnId: string,
    @Body() dto: CreateColumnDto,
    @CurrentUser() user: PublicUser,
  ) {
    return this.tasksService.renameColumn(projectId, columnId, dto, user.id);
  }

  @Delete('columns/:columnId')
  deleteColumn(@Param('projectId') projectId: string, @Param('columnId') columnId: string, @CurrentUser() user: PublicUser) {
    return this.tasksService.deleteColumn(projectId, columnId, user.id);
  }

  // ---------------- Tasks ----------------

  @Post('tasks')
  createTask(@Param('projectId') projectId: string, @Body() dto: CreateTaskDto, @CurrentUser() user: PublicUser) {
    return this.tasksService.createTask(projectId, dto, user.id);
  }

  @Get('tasks/:taskId')
  getTask(@Param('projectId') projectId: string, @Param('taskId') taskId: string, @CurrentUser() user: PublicUser) {
    return this.tasksService.getTask(projectId, taskId, user.id);
  }

  @Patch('tasks/:taskId')
  updateTask(
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
    @Body() dto: UpdateTaskDto,
    @CurrentUser() user: PublicUser,
  ) {
    return this.tasksService.updateTask(projectId, taskId, dto, user.id);
  }

  @Patch('tasks/:taskId/move')
  moveTask(
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
    @Body() dto: MoveTaskDto,
    @CurrentUser() user: PublicUser,
  ) {
    return this.tasksService.moveTask(projectId, taskId, dto, user.id);
  }

  @Delete('tasks/:taskId')
  deleteTask(@Param('projectId') projectId: string, @Param('taskId') taskId: string, @CurrentUser() user: PublicUser) {
    return this.tasksService.deleteTask(projectId, taskId, user.id);
  }

  // ---------------- Comments ----------------

  @Post('tasks/:taskId/comments')
  addComment(
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
    @Body() dto: CreateCommentDto,
    @CurrentUser() user: PublicUser,
  ) {
    return this.tasksService.addComment(projectId, taskId, dto, user.id);
  }

  @Get('tasks/:taskId/comments')
  listComments(@Param('projectId') projectId: string, @Param('taskId') taskId: string, @CurrentUser() user: PublicUser) {
    return this.tasksService.listComments(projectId, taskId, user.id);
  }

  @Delete('comments/:commentId')
  deleteComment(
    @Param('projectId') projectId: string,
    @Param('commentId') commentId: string,
    @CurrentUser() user: PublicUser,
  ) {
    return this.tasksService.deleteComment(projectId, commentId, user.id);
  }
}
