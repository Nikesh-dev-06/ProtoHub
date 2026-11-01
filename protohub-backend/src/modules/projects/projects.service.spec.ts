import { Test } from '@nestjs/testing';
import { BadRequestException, ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JoinRequestStatus, ProjectMemberRole } from '../../common/prisma-enums';
import { ProjectsService } from './projects.service';
import { ProjectsRepository } from './projects.repository';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let repo: jest.Mocked<ProjectsRepository>;
  let eventEmitter: jest.Mocked<EventEmitter2>;

  const OWNER_ID = 'owner-1';
  const MEMBER_ID = 'member-1';
  const OUTSIDER_ID = 'outsider-1';
  const PROJECT_ID = 'project-1';

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: ProjectsRepository,
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
          provide: EventEmitter2,
          useValue: { emit: jest.fn() },
        },
      ],
    }).compile();

    service = moduleRef.get(ProjectsService);
    repo = moduleRef.get(ProjectsRepository);
    eventEmitter = moduleRef.get(EventEmitter2);
  });

  afterEach(() => jest.clearAllMocks());

  describe('update (authorization)', () => {
    it('allows an OWNER to update the project', async () => {
      repo.findMember.mockResolvedValue({ role: ProjectMemberRole.OWNER, status: 'ACTIVE' } as any);
      repo.update.mockResolvedValue({ id: PROJECT_ID } as any);

      await service.update(PROJECT_ID, { title: 'New title' } as any, OWNER_ID);

      expect(repo.update).toHaveBeenCalledWith(PROJECT_ID, { title: 'New title' });
    });

    it('rejects a CONTRIBUTOR trying to update the project', async () => {
      repo.findMember.mockResolvedValue({ role: ProjectMemberRole.CONTRIBUTOR, status: 'ACTIVE' } as any);

      await expect(service.update(PROJECT_ID, { title: 'x' } as any, MEMBER_ID)).rejects.toBeInstanceOf(
        ForbiddenException,
      );
      expect(repo.update).not.toHaveBeenCalled();
    });

    it('rejects someone who is not a member at all', async () => {
      repo.findMember.mockResolvedValue(null);

      await expect(service.update(PROJECT_ID, { title: 'x' } as any, OUTSIDER_ID)).rejects.toBeInstanceOf(
        ForbiddenException,
      );
    });
  });

  describe('remove', () => {
    it('only allows the OWNER (not a MAINTAINER) to delete the project', async () => {
      repo.findMember.mockResolvedValue({ role: ProjectMemberRole.MAINTAINER, status: 'ACTIVE' } as any);

      await expect(service.remove(PROJECT_ID, MEMBER_ID)).rejects.toBeInstanceOf(ForbiddenException);
      expect(repo.softDelete).not.toHaveBeenCalled();
    });
  });

  describe('updateMemberRole', () => {
    it('refuses to promote someone to OWNER through this endpoint', async () => {
      repo.findMember.mockResolvedValue({ role: ProjectMemberRole.OWNER, status: 'ACTIVE' } as any);

      await expect(
        service.updateMemberRole(PROJECT_ID, MEMBER_ID, { role: ProjectMemberRole.OWNER }, OWNER_ID),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('requestToJoin', () => {
    beforeEach(() => {
      repo.findById.mockResolvedValue({ id: PROJECT_ID, title: 'Campus Carpool', ownerId: OWNER_ID } as any);
    });

    it('creates a join request when the user is not already a member', async () => {
      repo.findMember.mockResolvedValue(null);
      repo.findPendingJoinRequest.mockResolvedValue(null);
      repo.createJoinRequest.mockResolvedValue({ id: 'req-1' } as any);

      const result = await service.requestToJoin(PROJECT_ID, OUTSIDER_ID, { message: 'let me in' });

      expect(repo.createJoinRequest).toHaveBeenCalledWith(PROJECT_ID, OUTSIDER_ID, 'let me in');
      expect(result).toEqual({ id: 'req-1' });
    });

    it('rejects a duplicate request while one is already pending', async () => {
      repo.findMember.mockResolvedValue(null);
      repo.findPendingJoinRequest.mockResolvedValue({ id: 'existing' } as any);

      await expect(service.requestToJoin(PROJECT_ID, OUTSIDER_ID, {})).rejects.toBeInstanceOf(ConflictException);
      expect(repo.createJoinRequest).not.toHaveBeenCalled();
    });

    it('rejects a request from someone who is already an active member', async () => {
      repo.findMember.mockResolvedValue({ status: 'ACTIVE' } as any);

      await expect(service.requestToJoin(PROJECT_ID, MEMBER_ID, {})).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('reviewJoinRequest', () => {
    it('adds the requester as a member when accepted', async () => {
      repo.findMember.mockResolvedValue({ role: ProjectMemberRole.OWNER, status: 'ACTIVE' } as any);
      repo.findJoinRequestById.mockResolvedValue({
        id: 'req-1',
        projectId: PROJECT_ID,
        userId: OUTSIDER_ID,
        status: JoinRequestStatus.PENDING,
      } as any);
      repo.reviewJoinRequest.mockResolvedValue({ id: 'req-1', status: JoinRequestStatus.ACCEPTED } as any);

      await service.reviewJoinRequest(PROJECT_ID, 'req-1', { status: 'ACCEPTED' }, OWNER_ID);

      expect(repo.addMember).toHaveBeenCalledWith(PROJECT_ID, OUTSIDER_ID);
      expect(eventEmitter.emit).toHaveBeenCalledWith('project.member.joined', {
        projectId: PROJECT_ID,
        userId: OUTSIDER_ID,
      });
    });

    it('does not add a member when rejected', async () => {
      repo.findMember.mockResolvedValue({ role: ProjectMemberRole.OWNER, status: 'ACTIVE' } as any);
      repo.findJoinRequestById.mockResolvedValue({
        id: 'req-1',
        projectId: PROJECT_ID,
        userId: OUTSIDER_ID,
        status: JoinRequestStatus.PENDING,
      } as any);
      repo.reviewJoinRequest.mockResolvedValue({ id: 'req-1', status: JoinRequestStatus.REJECTED } as any);

      await service.reviewJoinRequest(PROJECT_ID, 'req-1', { status: 'REJECTED' }, OWNER_ID);

      expect(repo.addMember).not.toHaveBeenCalled();
    });

    it('throws if the request was already reviewed', async () => {
      repo.findMember.mockResolvedValue({ role: ProjectMemberRole.OWNER, status: 'ACTIVE' } as any);
      repo.findJoinRequestById.mockResolvedValue({
        id: 'req-1',
        projectId: PROJECT_ID,
        userId: OUTSIDER_ID,
        status: JoinRequestStatus.ACCEPTED,
      } as any);

      await expect(
        service.reviewJoinRequest(PROJECT_ID, 'req-1', { status: 'ACCEPTED' }, OWNER_ID),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('throws NotFoundException when the request belongs to a different project', async () => {
      repo.findMember.mockResolvedValue({ role: ProjectMemberRole.OWNER, status: 'ACTIVE' } as any);
      repo.findJoinRequestById.mockResolvedValue({
        id: 'req-1',
        projectId: 'a-different-project',
        userId: OUTSIDER_ID,
        status: JoinRequestStatus.PENDING,
      } as any);

      await expect(
        service.reviewJoinRequest(PROJECT_ID, 'req-1', { status: 'ACCEPTED' }, OWNER_ID),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
