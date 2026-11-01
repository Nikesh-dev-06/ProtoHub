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
exports.ProjectsService = exports.ALL_MEMBER_ROLES = exports.MANAGE_ROLES = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const prisma_enums_1 = require("../../common/prisma-enums");
const projects_repository_1 = require("./projects.repository");
const slugify_1 = require("../../common/utils/slugify");
exports.MANAGE_ROLES = [prisma_enums_1.ProjectMemberRole.OWNER, prisma_enums_1.ProjectMemberRole.MAINTAINER];
exports.ALL_MEMBER_ROLES = [
    prisma_enums_1.ProjectMemberRole.OWNER,
    prisma_enums_1.ProjectMemberRole.MAINTAINER,
    prisma_enums_1.ProjectMemberRole.CONTRIBUTOR,
];
let ProjectsService = class ProjectsService {
    constructor(projectsRepository, eventEmitter) {
        this.projectsRepository = projectsRepository;
        this.eventEmitter = eventEmitter;
    }
    async create(dto, ownerId) {
        const baseSlug = (0, slugify_1.slugify)(dto.title);
        const slug = await this.projectsRepository.ensureUniqueSlug(baseSlug);
        return this.projectsRepository.createWithWorkspace({
            ownerId,
            title: dto.title,
            slug,
            summary: dto.summary,
            description: dto.description,
            visibility: dto.visibility ?? prisma_enums_1.ProjectVisibility.PUBLIC,
            skillIds: dto.skillIds,
        });
    }
    async findAll(query) {
        const { data, total } = await this.projectsRepository.findMany({ search: query.search, status: query.status, visibility: query.visibility, skillId: query.skillId }, query.page, query.limit);
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
    async findUserProjects(userId) {
        const projects = await this.projectsRepository.findUserProjects(userId);
        return { data: projects, meta: { total: projects.length } };
    }
    async findBySlug(slug) {
        const project = await this.projectsRepository.findBySlug(slug);
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        return project;
    }
    async update(id, dto, currentUserId) {
        await this.assertProjectRole(id, currentUserId, exports.MANAGE_ROLES);
        const { skillIds, ...rest } = dto;
        if (skillIds) {
            await this.projectsRepository.replaceSkills(id, skillIds);
        }
        return this.projectsRepository.update(id, rest);
    }
    async remove(id, currentUserId) {
        await this.assertProjectRole(id, currentUserId, [prisma_enums_1.ProjectMemberRole.OWNER]);
        await this.projectsRepository.softDelete(id);
    }
    listMembers(projectId) {
        return this.projectsRepository.listMembers(projectId);
    }
    async updateMemberRole(projectId, targetUserId, dto, currentUserId) {
        await this.assertProjectRole(projectId, currentUserId, [prisma_enums_1.ProjectMemberRole.OWNER]);
        if (dto.role === prisma_enums_1.ProjectMemberRole.OWNER) {
            throw new common_1.BadRequestException('Ownership transfer is a separate, explicit operation — not a role update');
        }
        const target = await this.projectsRepository.findMember(projectId, targetUserId);
        if (!target || target.role === prisma_enums_1.ProjectMemberRole.OWNER) {
            throw new common_1.BadRequestException('Cannot change the role of the project owner');
        }
        return this.projectsRepository.updateMemberRole(projectId, targetUserId, dto.role);
    }
    async removeMember(projectId, targetUserId, currentUserId) {
        await this.assertProjectRole(projectId, currentUserId, exports.MANAGE_ROLES);
        const target = await this.projectsRepository.findMember(projectId, targetUserId);
        if (!target)
            throw new common_1.NotFoundException('This person is not a member of the project');
        if (target.role === prisma_enums_1.ProjectMemberRole.OWNER) {
            throw new common_1.BadRequestException('The project owner cannot be removed — transfer ownership first');
        }
        await this.projectsRepository.removeMember(projectId, targetUserId);
        this.eventEmitter.emit('project.member.removed', { projectId, userId: targetUserId });
    }
    async listAttachments(projectId, userId) {
        await this.assertProjectRole(projectId, userId, exports.ALL_MEMBER_ROLES);
        return this.projectsRepository.listAttachments(projectId);
    }
    async listActivity(projectId, userId) {
        await this.assertProjectRole(projectId, userId, exports.ALL_MEMBER_ROLES);
        return this.projectsRepository.listActivity(projectId);
    }
    async requestToJoin(projectId, userId, dto) {
        const project = await this.projectsRepository.findById(projectId);
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        const existingMembership = await this.projectsRepository.findMember(projectId, userId);
        if (existingMembership && existingMembership.status === 'ACTIVE') {
            throw new common_1.ConflictException('You are already a member of this project');
        }
        const pending = await this.projectsRepository.findPendingJoinRequest(projectId, userId);
        if (pending) {
            throw new common_1.ConflictException('You already have a pending request to join this project');
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
    async listJoinRequests(projectId, currentUserId) {
        await this.assertProjectRole(projectId, currentUserId, exports.MANAGE_ROLES);
        return this.projectsRepository.listJoinRequests(projectId, prisma_enums_1.JoinRequestStatus.PENDING);
    }
    async reviewJoinRequest(projectId, requestId, dto, currentUserId) {
        await this.assertProjectRole(projectId, currentUserId, exports.MANAGE_ROLES);
        const request = await this.projectsRepository.findJoinRequestById(requestId);
        if (!request || request.projectId !== projectId) {
            throw new common_1.NotFoundException('Join request not found');
        }
        if (request.status !== prisma_enums_1.JoinRequestStatus.PENDING) {
            throw new common_1.ConflictException('This request has already been reviewed');
        }
        const updated = await this.projectsRepository.reviewJoinRequest(requestId, dto.status, currentUserId);
        this.eventEmitter.emit('project.join_request.reviewed', {
            projectId,
            projectTitle: (await this.projectsRepository.findById(projectId))?.title ?? 'a project',
            requesterId: request.userId,
            status: dto.status,
        });
        if (dto.status === prisma_enums_1.JoinRequestStatus.ACCEPTED) {
            await this.projectsRepository.addMember(projectId, request.userId);
            this.eventEmitter.emit('project.member.joined', { projectId, userId: request.userId });
        }
        return updated;
    }
    async assertProjectRole(projectId, userId, allowedRoles) {
        const membership = await this.projectsRepository.findMember(projectId, userId);
        if (!membership || membership.status !== 'ACTIVE' || !allowedRoles.includes(membership.role)) {
            throw new common_1.ForbiddenException('You do not have permission to perform this action on this project');
        }
        return membership;
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [projects_repository_1.ProjectsRepository,
        event_emitter_1.EventEmitter2])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map