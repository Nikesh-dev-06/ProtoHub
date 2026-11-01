import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ProjectMemberRole, JoinRequestStatus, MembershipStatus, ActivityAction } from '../../common/prisma-enums';
import { PrismaService } from '../../prisma/prisma.service';

export interface ProjectFilters {
  search?: string;
  status?: Prisma.StringFilter['equals'];
  visibility?: Prisma.StringFilter['equals'];
  skillId?: string;
}

const PROJECT_CARD_INCLUDE = {
  owner: { select: { id: true, name: true, avatarUrl: true } },
  skills: { include: { skill: true } },
  _count: { select: { members: true } },
} satisfies Prisma.ProjectInclude;

@Injectable()
export class ProjectsRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a project together with its workspace scaffolding in a single
   * transaction: OWNER membership, default Kanban columns, and a chat
   * channel. A project without these isn't usable, so they can't be a
   * follow-up step — see ProjectsService for the orchestration reasoning.
   */
  async createWithWorkspace(params: {
    ownerId: string;
    title: string;
    slug: string;
    summary?: string;
    description: string;
    visibility: Prisma.ProjectCreateInput['visibility'];
    skillIds?: string[];
  }) {
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const project = await tx.project.create({
        data: {
          title: params.title,
          slug: params.slug,
          summary: params.summary,
          description: params.description,
          visibility: params.visibility,
          ownerId: params.ownerId,
          skills: params.skillIds?.length
            ? { create: params.skillIds.map((skillId) => ({ skillId })) }
            : undefined,
        },
      });

      await tx.projectMember.create({
        data: { projectId: project.id, userId: params.ownerId, role: ProjectMemberRole.OWNER },
      });

      await tx.taskColumn.createMany({
        data: [
          { projectId: project.id, name: 'Backlog', position: 0 },
          { projectId: project.id, name: 'In Progress', position: 1 },
          { projectId: project.id, name: 'In Review', position: 2 },
          { projectId: project.id, name: 'Done', position: 3 },
        ],
      });

      await tx.chatChannel.create({
        data: {
          projectId: project.id,
          members: { create: { userId: params.ownerId } },
        },
      });

      await tx.activityLog.create({
        data: {
          projectId: project.id,
          actorId: params.ownerId,
          action: ActivityAction.PROJECT_CREATED,
          entityType: 'Project',
          entityId: project.id,
        },
      });

      return project;
    });
  }

  /** Appends -2, -3, ... until the slug is free. Runs outside the create transaction since it's read-only. */
  async ensureUniqueSlug(baseSlug: string): Promise<string> {
    let candidate = baseSlug || 'project';
    let suffix = 1;
    // Bounded loop: extremely unlikely to need more than a handful of attempts.
    while (await this.prisma.project.findUnique({ where: { slug: candidate }, select: { id: true } })) {
      suffix += 1;
      candidate = `${baseSlug}-${suffix}`;
    }
    return candidate;
  }

  findBySlug(slug: string) {
    return this.prisma.project.findFirst({
      where: { slug, deletedAt: null },
      include: PROJECT_CARD_INCLUDE,
    });
  }

  findById(id: string) {
    return this.prisma.project.findFirst({
      where: { id, deletedAt: null },
      include: PROJECT_CARD_INCLUDE,
    });
  }

  findUserProjects(userId: string, limit: number = 10) {
    return this.prisma.project.findMany({
      where: {
        deletedAt: null,
        members: { some: { userId, status: 'ACTIVE' } },
      },
      include: PROJECT_CARD_INCLUDE,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async findMany(filters: ProjectFilters, page: number, limit: number) {
    const where: Prisma.ProjectWhereInput = {
      deletedAt: null,
      status: filters.status,
      visibility: filters.visibility,
      skills: filters.skillId ? { some: { skillId: filters.skillId } } : undefined,
      ...(filters.search
        ? {
            OR: [
              { title: { contains: filters.search } },
              { summary: { contains: filters.search } },
            ],
          }
        : {}),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        where,
        include: PROJECT_CARD_INCLUDE,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.project.count({ where }),
    ]);

    return { data, total };
  }

  update(id: string, data: Prisma.ProjectUpdateInput) {
    return this.prisma.project.update({ where: { id }, data, include: PROJECT_CARD_INCLUDE });
  }

  replaceSkills(projectId: string, skillIds: string[]) {
    return this.prisma.$transaction([
      this.prisma.projectSkill.deleteMany({ where: { projectId } }),
      this.prisma.projectSkill.createMany({ data: skillIds.map((skillId) => ({ projectId, skillId })) }),
    ]);
  }

  softDelete(id: string) {
    return this.prisma.project.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ---------------- Members ----------------

  findMember(projectId: string, userId: string) {
    return this.prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
    });
  }

  listMembers(projectId: string) {
    return this.prisma.projectMember.findMany({
      where: { projectId, status: MembershipStatus.ACTIVE },
      include: { user: { select: { id: true, name: true, avatarUrl: true, headline: true } } },
      orderBy: { joinedAt: 'asc' },
    });
  }

  addMember(projectId: string, userId: string, role: ProjectMemberRole = ProjectMemberRole.CONTRIBUTOR) {
    return this.prisma.projectMember.create({ data: { projectId, userId, role } });
  }

  updateMemberRole(projectId: string, userId: string, role: ProjectMemberRole) {
    return this.prisma.projectMember.update({
      where: { projectId_userId: { projectId, userId } },
      data: { role },
    });
  }

  removeMember(projectId: string, userId: string) {
    return this.prisma.projectMember.update({
      where: { projectId_userId: { projectId, userId } },
      data: { status: MembershipStatus.REMOVED, leftAt: new Date() },
    });
  }

  // ---------------- Join requests ----------------

  findPendingJoinRequest(projectId: string, userId: string) {
    return this.prisma.projectJoinRequest.findFirst({
      where: { projectId, userId, status: JoinRequestStatus.PENDING },
    });
  }

  async createJoinRequest(projectId: string, userId: string, message?: string) {
    return this.prisma.projectJoinRequest.create({
      data: { projectId, userId, message },
    });
  }

  async listAttachments(projectId: string) {
    return this.prisma.attachment.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      include: {
        uploader: { select: { id: true, name: true, avatarUrl: true } },
      },
    });
  }

  async listActivity(projectId: string) {
    return this.prisma.activityLog.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      include: {
        actor: { select: { id: true, name: true, avatarUrl: true } },
      },
      take: 50,
    });
  }

  listJoinRequests(projectId: string, status: JoinRequestStatus = JoinRequestStatus.PENDING) {
    return this.prisma.projectJoinRequest.findMany({
      where: { projectId, status },
      include: { requester: { select: { id: true, name: true, avatarUrl: true, headline: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  findJoinRequestById(id: string) {
    return this.prisma.projectJoinRequest.findUnique({ where: { id } });
  }

  reviewJoinRequest(id: string, status: JoinRequestStatus, reviewedById: string) {
    return this.prisma.projectJoinRequest.update({
      where: { id },
      data: { status, reviewedById, reviewedAt: new Date() },
    });
  }
}
