import { PublicUser } from '../users/users.service';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryProjectsDto } from './dto/query-projects.dto';
import { CreateJoinRequestDto } from './dto/create-join-request.dto';
import { ReviewJoinRequestDto } from './dto/review-join-request.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(dto: CreateProjectDto, user: PublicUser): Promise<{
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
    findMyProjects(user: PublicUser): Promise<{
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
    findOne(slug: string): Promise<{
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
    update(id: string, dto: UpdateProjectDto, user: PublicUser): Promise<{
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
    remove(id: string, user: PublicUser): Promise<void>;
    listMembers(id: string): import(".prisma/client").Prisma.PrismaPromise<({
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
    updateMemberRole(id: string, userId: string, dto: UpdateMemberRoleDto, user: PublicUser): Promise<{
        id: string;
        role: string;
        userId: string;
        status: string;
        projectId: string;
        joinedAt: Date;
        leftAt: Date | null;
    }>;
    removeMember(id: string, userId: string, user: PublicUser): Promise<void>;
    requestToJoin(id: string, dto: CreateJoinRequestDto, user: PublicUser): Promise<{
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
    listJoinRequests(id: string, user: PublicUser): Promise<({
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
    reviewJoinRequest(id: string, requestId: string, dto: ReviewJoinRequestDto, user: PublicUser): Promise<{
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
    listAttachments(id: string, user: PublicUser): Promise<({
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
    listActivity(id: string, user: PublicUser): Promise<({
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
}
