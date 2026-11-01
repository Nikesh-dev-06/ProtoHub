import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JoinRequestStatus, ProjectMemberRole, ProjectVisibility } from '../../common/prisma-enums';
import { ProjectsRepository } from './projects.repository';
import { slugify } from '../../common/utils/slugify';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryProjectsDto } from './dto/query-projects.dto';
import { CreateJoinRequestDto } from './dto/create-join-request.dto';
import { ReviewJoinRequestDto } from './dto/review-join-request.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';

export const MANAGE_ROLES: ProjectMemberRole[] = [ProjectMemberRole.OWNER, ProjectMemberRole.MAINTAINER];
export const ALL_MEMBER_ROLES: ProjectMemberRole[] = [
  ProjectMemberRole.OWNER,
  ProjectMemberRole.MAINTAINER,
  ProjectMemberRole.CONTRIBUTOR,
];

@Injectable()
export class ProjectsService {
  constructor(
    private readonly projectsRepository: ProjectsRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(dto: CreateProjectDto, ownerId: string) {
    const baseSlug = slugify(dto.title);
    const slug = await this.projectsRepository.ensureUniqueSlug(baseSlug);

    return this.projectsRepository.createWithWorkspace({
      ownerId,
      title: dto.title,
      slug,
      summary: dto.summary,
      description: dto.description,
      visibility: dto.visibility ?? ProjectVisibility.PUBLIC,
      skillIds: dto.skillIds,
    });
  }

  async findAll(query: QueryProjectsDto) {
    const { data, total } = await this.projectsRepository.findMany(
      { search: query.search, status: query.status, visibility: query.visibility, skillId: query.skillId },
      query.page,
      query.limit,
    );

    return {
      data,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  }

  async findUserProjects(userId: string) {
    const projects = await this.projectsRepository.findUserProjects(userId);
    return { data: projects, meta: { total: projects.length } };
  }

  async findBySlug(slug: string) {
    const project = await this.projectsRepository.findBySlug(slug);
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(id: string, dto: UpdateProjectDto, currentUserId: string) {
    await this.assertProjectRole(id, currentUserId, MANAGE_ROLES);

    const { skillIds, ...rest } = dto;
    if (skillIds) {
      await this.projectsRepository.replaceSkills(id, skillIds);
    }
    return this.projectsRepository.update(id, rest);
  }

  async remove(id: string, currentUserId: string) {
    await this.assertProjectRole(id, currentUserId, [ProjectMemberRole.OWNER]);
    await this.projectsRepository.softDelete(id);
  }

  listMembers(projectId: string) {
    return this.projectsRepository.listMembers(projectId);
  }

  async updateMemberRole(projectId: string, targetUserId: string, dto: UpdateMemberRoleDto, currentUserId: string) {
    await this.assertProjectRole(projectId, currentUserId, [ProjectMemberRole.OWNER]);

    if (dto.role === ProjectMemberRole.OWNER) {
      throw new BadRequestException('Ownership transfer is a separate, explicit operation — not a role update');
    }
    const target = await this.projectsRepository.findMember(projectId, targetUserId);
    if (!target || target.role === ProjectMemberRole.OWNER) {
      throw new BadRequestException('Cannot change the role of the project owner');
    }
    return this.projectsRepository.updateMemberRole(projectId, targetUserId, dto.role);
  }

  async removeMember(projectId: string, targetUserId: string, currentUserId: string) {
    await this.assertProjectRole(projectId, currentUserId, MANAGE_ROLES);

    const target = await this.projectsRepository.findMember(projectId, targetUserId);
    if (!target) throw new NotFoundException('This person is not a member of the project');
    if (target.role === ProjectMemberRole.OWNER) {
      throw new BadRequestException('The project owner cannot be removed — transfer ownership first');
    }
    await this.projectsRepository.removeMember(projectId, targetUserId);
    this.eventEmitter.emit('project.member.removed', { projectId, userId: targetUserId });
  }



  async listAttachments(projectId: string, userId: string) {
    await this.assertProjectRole(projectId, userId, ALL_MEMBER_ROLES);
    return this.projectsRepository.listAttachments(projectId);
  }

  async listActivity(projectId: string, userId: string) {
    await this.assertProjectRole(projectId, userId, ALL_MEMBER_ROLES);
    return this.projectsRepository.listActivity(projectId);
  }

  async requestToJoin(projectId: string, userId: string, dto: CreateJoinRequestDto) {
    const project = await this.projectsRepository.findById(projectId);
    if (!project) throw new NotFoundException('Project not found');

    const existingMembership = await this.projectsRepository.findMember(projectId, userId);
    if (existingMembership && existingMembership.status === 'ACTIVE') {
      throw new ConflictException('You are already a member of this project');
    }

    const pending = await this.projectsRepository.findPendingJoinRequest(projectId, userId);
    if (pending) {
      throw new ConflictException('You already have a pending request to join this project');
    }

    const request = await this.projectsRepository.createJoinRequest(projectId, userId, dto.message);
    this.eventEmitter.emit('project.join_request.created', {
      projectId,
      projectTitle: project.title,
      ownerId: project.ownerId,
      requesterId: userId,
      requestId: request.id,
    });
    return request;
  }

  async listJoinRequests(projectId: string, currentUserId: string) {
    await this.assertProjectRole(projectId, currentUserId, MANAGE_ROLES);
    return this.projectsRepository.listJoinRequests(projectId, JoinRequestStatus.PENDING);
  }

  async reviewJoinRequest(projectId: string, requestId: string, dto: ReviewJoinRequestDto, currentUserId: string) {
    await this.assertProjectRole(projectId, currentUserId, MANAGE_ROLES);

    const request = await this.projectsRepository.findJoinRequestById(requestId);
    if (!request || request.projectId !== projectId) {
      throw new NotFoundException('Join request not found');
    }
    if (request.status !== JoinRequestStatus.PENDING) {
      throw new ConflictException('This request has already been reviewed');
    }

    const updated = await this.projectsRepository.reviewJoinRequest(requestId, dto.status as JoinRequestStatus, currentUserId);
    this.eventEmitter.emit('project.join_request.reviewed', {
      projectId,
      projectTitle: (await this.projectsRepository.findById(projectId))?.title ?? 'a project',
      requesterId: request.userId,
      status: dto.status,
    });

    if (dto.status === JoinRequestStatus.ACCEPTED) {
      await this.projectsRepository.addMember(projectId, request.userId);
      this.eventEmitter.emit('project.member.joined', { projectId, userId: request.userId });
    }
    return updated;
  }

  /**
   * Project-scoped authorization — deliberately separate from the global
   * UserRole RBAC guard. Public and reusable: other workspace modules
   * (Tasks, Chat, Uploads, Activity) call this instead of re-querying
   * project_members directly, so the "what counts as a member" rule lives
   * in exactly one place.
   */
  async assertProjectRole(projectId: string, userId: string, allowedRoles: ProjectMemberRole[]) {
    const membership = await this.projectsRepository.findMember(projectId, userId);
    if (!membership || membership.status !== 'ACTIVE' || !allowedRoles.includes(membership.role as ProjectMemberRole)) {
      throw new ForbiddenException('You do not have permission to perform this action on this project');
    }
    return membership;
  }
}
