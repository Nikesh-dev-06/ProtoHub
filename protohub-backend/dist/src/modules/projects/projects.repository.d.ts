import { Prisma } from '@prisma/client';
import { ProjectMemberRole, JoinRequestStatus } from '../../common/prisma-enums';
import { PrismaService } from '../../prisma/prisma.service';
export interface ProjectFilters {
    search?: string;
    status?: Prisma.StringFilter['equals'];
    visibility?: Prisma.StringFilter['equals'];
    skillId?: string;
}
export declare class ProjectsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createWithWorkspace(params: {
        ownerId: string;
        title: string;
        slug: string;
        summary?: string;
        description: string;
        visibility: Prisma.ProjectCreateInput['visibility'];
        skillIds?: string[];
    }): Promise<{
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
    ensureUniqueSlug(baseSlug: string): Promise<string>;
    findBySlug(slug: string): Prisma.Prisma__ProjectClient<({
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
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    findById(id: string): Prisma.Prisma__ProjectClient<({
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
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    findUserProjects(userId: string, limit?: number): Prisma.PrismaPromise<({
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
    })[]>;
    findMany(filters: ProjectFilters, page: number, limit: number): Promise<{
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
        total: number;
    }>;
    update(id: string, data: Prisma.ProjectUpdateInput): Prisma.Prisma__ProjectClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    replaceSkills(projectId: string, skillIds: string[]): Promise<[Prisma.BatchPayload, Prisma.BatchPayload]>;
    softDelete(id: string): Prisma.Prisma__ProjectClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    findMember(projectId: string, userId: string): Prisma.Prisma__ProjectMemberClient<{
        id: string;
        role: string;
        userId: string;
        status: string;
        projectId: string;
        joinedAt: Date;
        leftAt: Date | null;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    listMembers(projectId: string): Prisma.PrismaPromise<({
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
    addMember(projectId: string, userId: string, role?: ProjectMemberRole): Prisma.Prisma__ProjectMemberClient<{
        id: string;
        role: string;
        userId: string;
        status: string;
        projectId: string;
        joinedAt: Date;
        leftAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    updateMemberRole(projectId: string, userId: string, role: ProjectMemberRole): Prisma.Prisma__ProjectMemberClient<{
        id: string;
        role: string;
        userId: string;
        status: string;
        projectId: string;
        joinedAt: Date;
        leftAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    removeMember(projectId: string, userId: string): Prisma.Prisma__ProjectMemberClient<{
        id: string;
        role: string;
        userId: string;
        status: string;
        projectId: string;
        joinedAt: Date;
        leftAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    findPendingJoinRequest(projectId: string, userId: string): Prisma.Prisma__ProjectJoinRequestClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: string;
        projectId: string;
        message: string | null;
        reviewedAt: Date | null;
        reviewedById: string | null;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    createJoinRequest(projectId: string, userId: string, message?: string): Promise<{
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
    listAttachments(projectId: string): Promise<({
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
    listActivity(projectId: string): Promise<({
        actor: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        projectId: string;
        metadata: Prisma.JsonValue | null;
        entityType: string;
        entityId: string;
        action: string;
        actorId: string | null;
    })[]>;
    listJoinRequests(projectId: string, status?: JoinRequestStatus): Prisma.PrismaPromise<({
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
    findJoinRequestById(id: string): Prisma.Prisma__ProjectJoinRequestClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: string;
        projectId: string;
        message: string | null;
        reviewedAt: Date | null;
        reviewedById: string | null;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    reviewJoinRequest(id: string, status: JoinRequestStatus, reviewedById: string): Prisma.Prisma__ProjectJoinRequestClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: string;
        projectId: string;
        message: string | null;
        reviewedAt: Date | null;
        reviewedById: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
}
