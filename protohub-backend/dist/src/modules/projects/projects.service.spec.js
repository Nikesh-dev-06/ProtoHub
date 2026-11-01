"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const prisma_enums_1 = require("../../common/prisma-enums");
const projects_service_1 = require("./projects.service");
const projects_repository_1 = require("./projects.repository");
describe('ProjectsService', () => {
    let service;
    let repo;
    let eventEmitter;
    const OWNER_ID = 'owner-1';
    const MEMBER_ID = 'member-1';
    const OUTSIDER_ID = 'outsider-1';
    const PROJECT_ID = 'project-1';
    beforeEach(async () => {
        const moduleRef = await testing_1.Test.createTestingModule({
            providers: [
                projects_service_1.ProjectsService,
                {
                    provide: projects_repository_1.ProjectsRepository,
                    useValue: {
                        createWithWorkspace: jest.fn(),
                        ensureUniqueSlug: jest.fn(),
                        findMany: jest.fn(),
                        findBySlug: jest.fn(),
                        findById: jest.fn(),
                        update: jest.fn(),
                        replaceSkills: jest.fn(),
                        softDelete: jest.fn(),
                        findMember: jest.fn(),
                        listMembers: jest.fn(),
                        addMember: jest.fn(),
                        updateMemberRole: jest.fn(),
                        removeMember: jest.fn(),
                        findPendingJoinRequest: jest.fn(),
                        createJoinRequest: jest.fn(),
                        listJoinRequests: jest.fn(),
                        findJoinRequestById: jest.fn(),
                        reviewJoinRequest: jest.fn(),
                    },
                },
                {
                    provide: event_emitter_1.EventEmitter2,
                    useValue: { emit: jest.fn() },
                },
            ],
        }).compile();
        service = moduleRef.get(projects_service_1.ProjectsService);
        repo = moduleRef.get(projects_repository_1.ProjectsRepository);
        eventEmitter = moduleRef.get(event_emitter_1.EventEmitter2);
    });
    afterEach(() => jest.clearAllMocks());
    describe('update (authorization)', () => {
        it('allows an OWNER to update the project', async () => {
            repo.findMember.mockResolvedValue({ role: prisma_enums_1.ProjectMemberRole.OWNER, status: 'ACTIVE' });
            repo.update.mockResolvedValue({ id: PROJECT_ID });
            await service.update(PROJECT_ID, { title: 'New title' }, OWNER_ID);
            expect(repo.update).toHaveBeenCalledWith(PROJECT_ID, { title: 'New title' });
        });
        it('rejects a CONTRIBUTOR trying to update the project', async () => {
            repo.findMember.mockResolvedValue({ role: prisma_enums_1.ProjectMemberRole.CONTRIBUTOR, status: 'ACTIVE' });
            await expect(service.update(PROJECT_ID, { title: 'x' }, MEMBER_ID)).rejects.toBeInstanceOf(common_1.ForbiddenException);
            expect(repo.update).not.toHaveBeenCalled();
        });
        it('rejects someone who is not a member at all', async () => {
            repo.findMember.mockResolvedValue(null);
            await expect(service.update(PROJECT_ID, { title: 'x' }, OUTSIDER_ID)).rejects.toBeInstanceOf(common_1.ForbiddenException);
        });
    });
    describe('remove', () => {
        it('only allows the OWNER (not a MAINTAINER) to delete the project', async () => {
            repo.findMember.mockResolvedValue({ role: prisma_enums_1.ProjectMemberRole.MAINTAINER, status: 'ACTIVE' });
            await expect(service.remove(PROJECT_ID, MEMBER_ID)).rejects.toBeInstanceOf(common_1.ForbiddenException);
            expect(repo.softDelete).not.toHaveBeenCalled();
        });
    });
    describe('updateMemberRole', () => {
        it('refuses to promote someone to OWNER through this endpoint', async () => {
            repo.findMember.mockResolvedValue({ role: prisma_enums_1.ProjectMemberRole.OWNER, status: 'ACTIVE' });
            await expect(service.updateMemberRole(PROJECT_ID, MEMBER_ID, { role: prisma_enums_1.ProjectMemberRole.OWNER }, OWNER_ID)).rejects.toBeInstanceOf(common_1.BadRequestException);
        });
    });
    describe('requestToJoin', () => {
        beforeEach(() => {
            repo.findById.mockResolvedValue({ id: PROJECT_ID, title: 'Campus Carpool', ownerId: OWNER_ID });
        });
        it('creates a join request when the user is not already a member', async () => {
            repo.findMember.mockResolvedValue(null);
            repo.findPendingJoinRequest.mockResolvedValue(null);
            repo.createJoinRequest.mockResolvedValue({ id: 'req-1' });
            const result = await service.requestToJoin(PROJECT_ID, OUTSIDER_ID, { message: 'let me in' });
            expect(repo.createJoinRequest).toHaveBeenCalledWith(PROJECT_ID, OUTSIDER_ID, 'let me in');
            expect(result).toEqual({ id: 'req-1' });
        });
        it('rejects a duplicate request while one is already pending', async () => {
            repo.findMember.mockResolvedValue(null);
            repo.findPendingJoinRequest.mockResolvedValue({ id: 'existing' });
            await expect(service.requestToJoin(PROJECT_ID, OUTSIDER_ID, {})).rejects.toBeInstanceOf(common_1.ConflictException);
            expect(repo.createJoinRequest).not.toHaveBeenCalled();
        });
        it('rejects a request from someone who is already an active member', async () => {
            repo.findMember.mockResolvedValue({ status: 'ACTIVE' });
            await expect(service.requestToJoin(PROJECT_ID, MEMBER_ID, {})).rejects.toBeInstanceOf(common_1.ConflictException);
        });
    });
    describe('reviewJoinRequest', () => {
        it('adds the requester as a member when accepted', async () => {
            repo.findMember.mockResolvedValue({ role: prisma_enums_1.ProjectMemberRole.OWNER, status: 'ACTIVE' });
            repo.findJoinRequestById.mockResolvedValue({
                id: 'req-1',
                projectId: PROJECT_ID,
                userId: OUTSIDER_ID,
                status: prisma_enums_1.JoinRequestStatus.PENDING,
            });
            repo.reviewJoinRequest.mockResolvedValue({ id: 'req-1', status: prisma_enums_1.JoinRequestStatus.ACCEPTED });
            await service.reviewJoinRequest(PROJECT_ID, 'req-1', { status: 'ACCEPTED' }, OWNER_ID);
            expect(repo.addMember).toHaveBeenCalledWith(PROJECT_ID, OUTSIDER_ID);
            expect(eventEmitter.emit).toHaveBeenCalledWith('project.member.joined', {
                projectId: PROJECT_ID,
                userId: OUTSIDER_ID,
            });
        });
        it('does not add a member when rejected', async () => {
            repo.findMember.mockResolvedValue({ role: prisma_enums_1.ProjectMemberRole.OWNER, status: 'ACTIVE' });
            repo.findJoinRequestById.mockResolvedValue({
                id: 'req-1',
                projectId: PROJECT_ID,
                userId: OUTSIDER_ID,
                status: prisma_enums_1.JoinRequestStatus.PENDING,
            });
            repo.reviewJoinRequest.mockResolvedValue({ id: 'req-1', status: prisma_enums_1.JoinRequestStatus.REJECTED });
            await service.reviewJoinRequest(PROJECT_ID, 'req-1', { status: 'REJECTED' }, OWNER_ID);
            expect(repo.addMember).not.toHaveBeenCalled();
        });
        it('throws if the request was already reviewed', async () => {
            repo.findMember.mockResolvedValue({ role: prisma_enums_1.ProjectMemberRole.OWNER, status: 'ACTIVE' });
            repo.findJoinRequestById.mockResolvedValue({
                id: 'req-1',
                projectId: PROJECT_ID,
                userId: OUTSIDER_ID,
                status: prisma_enums_1.JoinRequestStatus.ACCEPTED,
            });
            await expect(service.reviewJoinRequest(PROJECT_ID, 'req-1', { status: 'ACCEPTED' }, OWNER_ID)).rejects.toBeInstanceOf(common_1.ConflictException);
        });
        it('throws NotFoundException when the request belongs to a different project', async () => {
            repo.findMember.mockResolvedValue({ role: prisma_enums_1.ProjectMemberRole.OWNER, status: 'ACTIVE' });
            repo.findJoinRequestById.mockResolvedValue({
                id: 'req-1',
                projectId: 'a-different-project',
                userId: OUTSIDER_ID,
                status: prisma_enums_1.JoinRequestStatus.PENDING,
            });
            await expect(service.reviewJoinRequest(PROJECT_ID, 'req-1', { status: 'ACCEPTED' }, OWNER_ID)).rejects.toBeInstanceOf(common_1.NotFoundException);
        });
    });
});
//# sourceMappingURL=projects.service.spec.js.map