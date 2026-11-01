"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const prisma_enums_1 = require("../../common/prisma-enums");
const tasks_service_1 = require("./tasks.service");
const tasks_repository_1 = require("./tasks.repository");
const projects_service_1 = require("../projects/projects.service");
describe('TasksService', () => {
    let service;
    let tasksRepo;
    let projectsService;
    const PROJECT_ID = 'project-1';
    const USER_ID = 'user-1';
    const TASK_ID = 'task-1';
    beforeEach(async () => {
        const moduleRef = await testing_1.Test.createTestingModule({
            providers: [
                tasks_service_1.TasksService,
                {
                    provide: tasks_repository_1.TasksRepository,
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
                    provide: projects_service_1.ProjectsService,
                    useValue: { assertProjectRole: jest.fn() },
                },
                {
                    provide: event_emitter_1.EventEmitter2,
                    useValue: { emit: jest.fn() },
                },
            ],
        }).compile();
        service = moduleRef.get(tasks_service_1.TasksService);
        tasksRepo = moduleRef.get(tasks_repository_1.TasksRepository);
        projectsService = moduleRef.get(projects_service_1.ProjectsService);
    });
    afterEach(() => jest.clearAllMocks());
    describe('moveTask', () => {
        it('delegates to the repository with the correct source/target coordinates', async () => {
            projectsService.assertProjectRole.mockResolvedValue({ role: prisma_enums_1.ProjectMemberRole.CONTRIBUTOR });
            tasksRepo.findTaskById.mockResolvedValue({
                id: TASK_ID,
                projectId: PROJECT_ID,
                columnId: 'col-a',
                position: 2,
            });
            tasksRepo.findColumnById.mockResolvedValue({ id: 'col-b', projectId: PROJECT_ID });
            tasksRepo.moveTask.mockResolvedValue({ id: TASK_ID, columnId: 'col-b', position: 0 });
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
            projectsService.assertProjectRole.mockResolvedValue({ role: prisma_enums_1.ProjectMemberRole.CONTRIBUTOR });
            tasksRepo.findTaskById.mockResolvedValue({ id: TASK_ID, projectId: 'a-different-project' });
            await expect(service.moveTask(PROJECT_ID, TASK_ID, { columnId: 'col-b', position: 0 }, USER_ID)).rejects.toBeInstanceOf(common_1.NotFoundException);
        });
        it('throws NotFoundException when the target column belongs to a different project', async () => {
            projectsService.assertProjectRole.mockResolvedValue({ role: prisma_enums_1.ProjectMemberRole.CONTRIBUTOR });
            tasksRepo.findTaskById.mockResolvedValue({ id: TASK_ID, projectId: PROJECT_ID, columnId: 'col-a', position: 0 });
            tasksRepo.findColumnById.mockResolvedValue({ id: 'col-b', projectId: 'a-different-project' });
            await expect(service.moveTask(PROJECT_ID, TASK_ID, { columnId: 'col-b', position: 0 }, USER_ID)).rejects.toBeInstanceOf(common_1.NotFoundException);
        });
    });
    describe('deleteTask', () => {
        const buildTask = () => ({ id: TASK_ID, projectId: PROJECT_ID, createdById: 'someone-else', assigneeId: null });
        it('allows the task creator to delete it even as a plain CONTRIBUTOR', async () => {
            projectsService.assertProjectRole.mockResolvedValue({ role: prisma_enums_1.ProjectMemberRole.CONTRIBUTOR });
            tasksRepo.findTaskById.mockResolvedValue({ ...buildTask(), createdById: USER_ID });
            await service.deleteTask(PROJECT_ID, TASK_ID, USER_ID);
            expect(tasksRepo.softDeleteTask).toHaveBeenCalledWith(TASK_ID);
        });
        it('allows a MAINTAINER to delete a task they neither created nor are assigned to', async () => {
            projectsService.assertProjectRole.mockResolvedValue({ role: prisma_enums_1.ProjectMemberRole.MAINTAINER });
            tasksRepo.findTaskById.mockResolvedValue(buildTask());
            await service.deleteTask(PROJECT_ID, TASK_ID, USER_ID);
            expect(tasksRepo.softDeleteTask).toHaveBeenCalledWith(TASK_ID);
        });
        it('blocks a CONTRIBUTOR who neither created nor is assigned to the task', async () => {
            projectsService.assertProjectRole.mockResolvedValue({ role: prisma_enums_1.ProjectMemberRole.CONTRIBUTOR });
            tasksRepo.findTaskById.mockResolvedValue(buildTask());
            await expect(service.deleteTask(PROJECT_ID, TASK_ID, USER_ID)).rejects.toBeInstanceOf(common_1.ForbiddenException);
            expect(tasksRepo.softDeleteTask).not.toHaveBeenCalled();
        });
    });
    describe('deleteColumn', () => {
        it('refuses to delete a column that still has tasks', async () => {
            projectsService.assertProjectRole.mockResolvedValue({ role: prisma_enums_1.ProjectMemberRole.OWNER });
            tasksRepo.findColumnById.mockResolvedValue({ id: 'col-a', projectId: PROJECT_ID });
            tasksRepo.countTasksInColumn.mockResolvedValue(3);
            await expect(service.deleteColumn(PROJECT_ID, 'col-a', USER_ID)).rejects.toBeInstanceOf(common_1.BadRequestException);
            expect(tasksRepo.deleteColumn).not.toHaveBeenCalled();
        });
        it('deletes an empty column', async () => {
            projectsService.assertProjectRole.mockResolvedValue({ role: prisma_enums_1.ProjectMemberRole.OWNER });
            tasksRepo.findColumnById.mockResolvedValue({ id: 'col-a', projectId: PROJECT_ID });
            tasksRepo.countTasksInColumn.mockResolvedValue(0);
            await service.deleteColumn(PROJECT_ID, 'col-a', USER_ID);
            expect(tasksRepo.deleteColumn).toHaveBeenCalledWith('col-a');
        });
    });
});
//# sourceMappingURL=tasks.service.spec.js.map