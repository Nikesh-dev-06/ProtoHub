import { EventEmitter2 } from '@nestjs/event-emitter';
import { ProjectMemberRole } from '../../common/prisma-enums';
import { ProjectsRepository } from './projects.repository';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryProjectsDto } from './dto/query-projects.dto';
import { CreateJoinRequestDto } from './dto/create-join-request.dto';
import { ReviewJoinRequestDto } from './dto/review-join-request.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
export declare const MANAGE_ROLES: ProjectMemberRole[];
export declare const ALL_MEMBER_ROLES: ProjectMemberRole[];
export declare class ProjectsService {
    private readonly projectsRepository;
    private readonly eventEmitter;
    constructor(projectsRepository: ProjectsRepository, eventEmitter: EventEmitter2);
    create(dto: CreateProjectDto, ownerId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        slug: string;
        title: string;
        summary: string | null;
        description: string;
        coverImageUrl: string | null;
        repositoryUrl: string | null;
        status: string;
        visibility: string;
        ownerId: string;
    }>;
    findAll(query: QueryProjectsDto): Promise<{
        data: ({
            skills: ({
                skill: {
                    id: string;
                    name: string;
                    category: string | null;
                    createdAt: Date;
                };
            } & {
                skillId: string;
                projectId: string;
            })[];
            owner: {
                id: string;
                name: string;
                avatarUrl: string | null;
            };
            _count: {
                members: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            slug: string;
            title: string;
            summary: string | null;
            description: string;
            coverImageUrl: string | null;
            repositoryUrl: string | null;
            status: string;
            visibility: string;
            ownerId: string;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findUserProjects(userId: string): Promise<{
        data: ({
            skills: ({
                skill: {
                    id: string;
                    name: string;
                    category: string | null;
                    createdAt: Date;
                };
            } & {
                skillId: string;
                projectId: string;
            })[];
            owner: {
                id: string;
                name: string;
                avatarUrl: string | null;
            };
            _count: {
                members: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            slug: string;
            title: string;
            summary: string | null;
            description: string;
            coverImageUrl: string | null;
            repositoryUrl: string | null;
            status: string;
            visibility: string;
            ownerId: string;
        })[];
        meta: {
            total: number;
        };
    }>;
    findBySlug(slug: string): Promise<{
        skills: ({
            skill: {
                id: string;
                name: string;
                category: string | null;
                createdAt: Date;
            };
        } & {
            skillId: string;
            projectId: string;
        })[];
        owner: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
        _count: {
            members: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        slug: string;
        title: string;
        summary: string | null;
        description: string;
        coverImageUrl: string | null;
        repositoryUrl: string | null;
        status: string;
        visibility: string;
        ownerId: string;
    }>;
    update(id: string, dto: UpdateProjectDto, currentUserId: string): Promise<{
        skills: ({
            skill: {
                id: string;
                name: string;
                category: string | null;
                createdAt: Date;
            };
        } & {
            skillId: string;
            projectId: string;
        })[];
        owner: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
        _count: {
            members: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        slug: string;
        title: string;
        summary: string | null;
        description: string;
        coverImageUrl: string | null;
        repositoryUrl: string | null;
        status: string;
        visibility: string;
        ownerId: string;
    }>;
    remove(id: string, currentUserId: string): Promise<void>;
    listMembers(projectId: string): import(".prisma/client").Prisma.PrismaPromise<({
        user: {
            id: string;
            name: string;
            headline: string | null;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        role: string;
        userId: string;
        status: string;
        projectId: string;
        joinedAt: Date;
        leftAt: Date | null;
    })[]>;
    updateMemberRole(projectId: string, targetUserId: string, dto: UpdateMemberRoleDto, currentUserId: string): Promise<{
        id: string;
        role: string;
        userId: string;
        status: string;
        projectId: string;
        joinedAt: Date;
        leftAt: Date | null;
    }>;
    removeMember(projectId: string, targetUserId: string, currentUserId: string): Promise<void>;
    listAttachments(projectId: string, userId: string): Promise<({
        uploader: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        projectId: string | null;
        taskId: string | null;
        url: string;
        publicId: string;
        fileName: string;
        mimeType: string;
        fileSize: number;
        uploaderId: string | null;
    })[]>;
    listActivity(projectId: string, userId: string): Promise<({
        actor: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        projectId: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        entityType: string;
        entityId: string;
        action: string;
        actorId: string | null;
    })[]>;
    requestToJoin(projectId: string, userId: string, dto: CreateJoinRequestDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: string;
        projectId: string;
        message: string | null;
        reviewedAt: Date | null;
        reviewedById: string | null;
    }>;
    listJoinRequests(projectId: string, currentUserId: string): Promise<({
        requester: {
            id: string;
            name: string;
            headline: string | null;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: string;
        projectId: string;
        message: string | null;
        reviewedAt: Date | null;
        reviewedById: string | null;
    })[]>;
    reviewJoinRequest(projectId: string, requestId: string, dto: ReviewJoinRequestDto, currentUserId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: string;
        projectId: string;
        message: string | null;
        reviewedAt: Date | null;
        reviewedById: string | null;
    }>;
    assertProjectRole(projectId: string, userId: string, allowedRoles: ProjectMemberRole[]): Promise<{
        id: string;
        role: string;
        userId: string;
        status: string;
        projectId: string;
        joinedAt: Date;
        leftAt: Date | null;
    }>;
}
