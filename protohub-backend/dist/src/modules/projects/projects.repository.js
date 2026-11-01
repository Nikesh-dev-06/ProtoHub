"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_enums_1 = require("../../common/prisma-enums");
const prisma_service_1 = require("../../prisma/prisma.service");
const PROJECT_CARD_INCLUDE = {
    owner: { select: { id: true, name: true, avatarUrl: true } },
    skills: { include: { skill: true } },
    _count: { select: { members: true } },
};
let ProjectsRepository = class ProjectsRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createWithWorkspace(params) {
        return this.prisma.$transaction(async (tx) => {
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
                data: { projectId: project.id, userId: params.ownerId, role: prisma_enums_1.ProjectMemberRole.OWNER },
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
                    action: prisma_enums_1.ActivityAction.PROJECT_CREATED,
                    entityType: 'Project',
                    entityId: project.id,
                },
            });
            return project;
        });
    }
    async ensureUniqueSlug(baseSlug) {
        let candidate = baseSlug || 'project';
        let suffix = 1;
        while (await this.prisma.project.findUnique({ where: { slug: candidate }, select: { id: true } })) {
            suffix += 1;
            candidate = `${baseSlug}-${suffix}`;
        }
        return candidate;
    }
    findBySlug(slug) {
        return this.prisma.project.findFirst({
            where: { slug, deletedAt: null },
            include: PROJECT_CARD_INCLUDE,
        });
    }
    findById(id) {
        return this.prisma.project.findFirst({
            where: { id, deletedAt: null },
            include: PROJECT_CARD_INCLUDE,
        });
    }
    findUserProjects(userId, limit = 10) {
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
    async findMany(filters, page, limit) {
        const where = {
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
    update(id, data) {
        return this.prisma.project.update({ where: { id }, data, include: PROJECT_CARD_INCLUDE });
    }
    replaceSkills(projectId, skillIds) {
        return this.prisma.$transaction([
            this.prisma.projectSkill.deleteMany({ where: { projectId } }),
            this.prisma.projectSkill.createMany({ data: skillIds.map((skillId) => ({ projectId, skillId })) }),
        ]);
    }
    softDelete(id) {
        return this.prisma.project.update({ where: { id }, data: { deletedAt: new Date() } });
    }
    findMember(projectId, userId) {
        return this.prisma.projectMember.findUnique({
            where: { projectId_userId: { projectId, userId } },
        });
    }
    listMembers(projectId) {
        return this.prisma.projectMember.findMany({
            where: { projectId, status: prisma_enums_1.MembershipStatus.ACTIVE },
            include: { user: { select: { id: true, name: true, avatarUrl: true, headline: true } } },
            orderBy: { joinedAt: 'asc' },
        });
    }
    addMember(projectId, userId, role = prisma_enums_1.ProjectMemberRole.CONTRIBUTOR) {
        return this.prisma.projectMember.create({ data: { projectId, userId, role } });
    }
    updateMemberRole(projectId, userId, role) {
        return this.prisma.projectMember.update({
            where: { projectId_userId: { projectId, userId } },
            data: { role },
        });
    }
    removeMember(projectId, userId) {
        return this.prisma.projectMember.update({
            where: { projectId_userId: { projectId, userId } },
            data: { status: prisma_enums_1.MembershipStatus.REMOVED, leftAt: new Date() },
        });
    }
    findPendingJoinRequest(projectId, userId) {
        return this.prisma.projectJoinRequest.findFirst({
            where: { projectId, userId, status: prisma_enums_1.JoinRequestStatus.PENDING },
        });
    }
    async createJoinRequest(projectId, userId, message) {
        return this.prisma.projectJoinRequest.create({
            data: { projectId, userId, message },
        });
    }
    async listAttachments(projectId) {
        return this.prisma.attachment.findMany({
            where: { projectId },
            orderBy: { createdAt: 'desc' },
            include: {
                uploader: { select: { id: true, name: true, avatarUrl: true } },
            },
        });
    }
    async listActivity(projectId) {
        return this.prisma.activityLog.findMany({
            where: { projectId },
            orderBy: { createdAt: 'desc' },
            include: {
                actor: { select: { id: true, name: true, avatarUrl: true } },
            },
            take: 50,
        });
    }
    listJoinRequests(projectId, status = prisma_enums_1.JoinRequestStatus.PENDING) {
        return this.prisma.projectJoinRequest.findMany({
            where: { projectId, status },
            include: { requester: { select: { id: true, name: true, avatarUrl: true, headline: true } } },
            orderBy: { createdAt: 'asc' },
        });
    }
    findJoinRequestById(id) {
        return this.prisma.projectJoinRequest.findUnique({ where: { id } });
    }
    reviewJoinRequest(id, status, reviewedById) {
        return this.prisma.projectJoinRequest.update({
            where: { id },
            data: { status, reviewedById, reviewedAt: new Date() },
        });
    }
};
exports.ProjectsRepository = ProjectsRepository;
exports.ProjectsRepository = ProjectsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProjectsRepository);
//# sourceMappingURL=projects.repository.js.map