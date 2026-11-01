import { Test } from '@nestjs/testing';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ProjectMemberRole } from '../../common/prisma-enums';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
import { ProjectsService } from '../projects/projects.service';

describe('TasksService', () => {
  let service: TasksService;
  let tasksRepo: jest.Mocked<TasksRepository>;
  let projectsService: jest.Mocked<ProjectsService>;

  const PROJECT_ID = 'project-1';
  const USER_ID = 'user-1';
  const TASK_ID = 'task-1';

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TasksRepository,
          useValue: {
            findColumnsWithTasks: jest.fn(),
            findColumnById: jest.fn(),
            createColumn: jest.fn(),
            renameColumn: jest.fn(),
            countTasksInColumn: jest.fn(),
            deleteColumn: jest.fn(),
            findTaskById: jest.fn(),
            createTask: jest.fn(),
            updateTask: jest.fn(),
            softDeleteTask: jest.fn(),
            moveTask: jest.fn(),
            addComment: jest.fn(),
            listComments: jest.fn(),
            findCommentById: jest.fn(),
            softDeleteComment: jest.fn(),
          },
        },
        {
          provide: ProjectsService,
          useValue: { assertProjectRole: jest.fn() },
        },
        {
          provide: EventEmitter2,
          useValue: { emit: jest.fn() },
        },
      ],
    }).compile();

    service = moduleRef.get(TasksService);
    tasksRepo = moduleRef.get(TasksRepository);
    projectsService = moduleRef.get(ProjectsService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('moveTask', () => {
    it('delegates to the repository with the correct source/target coordinates', async () => {
      projectsService.assertProjectRole.mockResolvedValue({ role: ProjectMemberRole.CONTRIBUTOR } as any);
      tasksRepo.findTaskById.mockResolvedValue({
        id: TASK_ID,
        projectId: PROJECT_ID,
        columnId: 'col-a',
        position: 2,
      } as any);
      tasksRepo.findColumnById.mockResolvedValue({ id: 'col-b', projectId: PROJECT_ID } as any);
      tasksRepo.moveTask.mockResolvedValue({ id: TASK_ID, columnId: 'col-b', position: 0 } as any);

      await service.moveTask(PROJECT_ID, TASK_ID, { columnId: 'col-b', position: 0 }, USER_ID);

      expect(tasksRepo.moveTask).toHaveBeenCalledWith({
        taskId: TASK_ID,
        sourceColumnId: 'col-a',
        sourcePosition: 2,
        targetColumnId: 'col-b',
        targetPosition: 0,
      });
    });

    it('throws NotFoundException when the task does not belong to this project', async () => {
      projectsService.assertProjectRole.mockResolvedValue({ role: ProjectMemberRole.CONTRIBUTOR } as any);
      tasksRepo.findTaskById.mockResolvedValue({ id: TASK_ID, projectId: 'a-different-project' } as any);

      await expect(
        service.moveTask(PROJECT_ID, TASK_ID, { columnId: 'col-b', position: 0 }, USER_ID),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('throws NotFoundException when the target column belongs to a different project', async () => {
      projectsService.assertProjectRole.mockResolvedValue({ role: ProjectMemberRole.CONTRIBUTOR } as any);
      tasksRepo.findTaskById.mockResolvedValue({ id: TASK_ID, projectId: PROJECT_ID, columnId: 'col-a', position: 0 } as any);
      tasksRepo.findColumnById.mockResolvedValue({ id: 'col-b', projectId: 'a-different-project' } as any);

      await expect(
        service.moveTask(PROJECT_ID, TASK_ID, { columnId: 'col-b', position: 0 }, USER_ID),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('deleteTask', () => {
    const buildTask = () => ({ id: TASK_ID, projectId: PROJECT_ID, createdById: 'someone-else', assigneeId: null });

    it('allows the task creator to delete it even as a plain CONTRIBUTOR', async () => {
      projectsService.assertProjectRole.mockResolvedValue({ role: ProjectMemberRole.CONTRIBUTOR } as any);
      tasksRepo.findTaskById.mockResolvedValue({ ...buildTask(), createdById: USER_ID } as any);

      await service.deleteTask(PROJECT_ID, TASK_ID, USER_ID);
      expect(tasksRepo.softDeleteTask).toHaveBeenCalledWith(TASK_ID);
    });

    it('allows a MAINTAINER to delete a task they neither created nor are assigned to', async () => {
      projectsService.assertProjectRole.mockResolvedValue({ role: ProjectMemberRole.MAINTAINER } as any);
      tasksRepo.findTaskById.mockResolvedValue(buildTask() as any);

      await service.deleteTask(PROJECT_ID, TASK_ID, USER_ID);
      expect(tasksRepo.softDeleteTask).toHaveBeenCalledWith(TASK_ID);
    });

    it('blocks a CONTRIBUTOR who neither created nor is assigned to the task', async () => {
      projectsService.assertProjectRole.mockResolvedValue({ role: ProjectMemberRole.CONTRIBUTOR } as any);
      tasksRepo.findTaskById.mockResolvedValue(buildTask() as any);

      await expect(service.deleteTask(PROJECT_ID, TASK_ID, USER_ID)).rejects.toBeInstanceOf(ForbiddenException);
      expect(tasksRepo.softDeleteTask).not.toHaveBeenCalled();
    });
  });

  describe('deleteColumn', () => {
    it('refuses to delete a column that still has tasks', async () => {
      projectsService.assertProjectRole.mockResolvedValue({ role: ProjectMemberRole.OWNER } as any);
      tasksRepo.findColumnById.mockResolvedValue({ id: 'col-a', projectId: PROJECT_ID } as any);
      tasksRepo.countTasksInColumn.mockResolvedValue(3);

      await expect(service.deleteColumn(PROJECT_ID, 'col-a', USER_ID)).rejects.toBeInstanceOf(BadRequestException);
      expect(tasksRepo.deleteColumn).not.toHaveBeenCalled();
    });

    it('deletes an empty column', async () => {
      projectsService.assertProjectRole.mockResolvedValue({ role: ProjectMemberRole.OWNER } as any);
      tasksRepo.findColumnById.mockResolvedValue({ id: 'col-a', projectId: PROJECT_ID } as any);
      tasksRepo.countTasksInColumn.mockResolvedValue(0);

      await service.deleteColumn(PROJECT_ID, 'col-a', USER_ID);
      expect(tasksRepo.deleteColumn).toHaveBeenCalledWith('col-a');
    });
  });
});
