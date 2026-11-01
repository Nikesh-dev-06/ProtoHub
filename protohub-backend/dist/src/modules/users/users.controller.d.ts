import { PublicUser, UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AddSkillDto } from './dto/add-skill.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    listSkillCatalog(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        category: string | null;
        createdAt: Date;
    }[]>;
    updateProfile(dto: UpdateProfileDto, user: PublicUser): Promise<PublicUser>;
    addSkill(dto: AddSkillDto, user: PublicUser): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        skillId: string;
        proficiency: string;
    }>;
    removeSkill(skillId: string, user: PublicUser): Promise<void>;
    getConnections(user: PublicUser): Promise<{
        id: string;
        name: string;
        headline: string | null;
        avatarUrl: string | null;
        role: string;
    }[]>;
    getSuggestions(user: PublicUser): Promise<{
        id: string;
        name: string;
        headline: string | null;
        avatarUrl: string | null;
        role: string;
    }[]>;
    getMentors(query: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        headline: string | null;
        avatarUrl: string | null;
        role: string;
        skills: ({
            skill: {
                id: string;
                name: string;
                category: string | null;
                createdAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            skillId: string;
            proficiency: string;
        })[];
    }[]>;
    getFeed(user: PublicUser): Promise<({
        project: {
            id: string;
            slug: string;
            title: string;
        };
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
    getPublicProfile(id: string): Promise<{
        ownedProjects: {
            id: string;
            slug: string;
            title: string;
            summary: string | null;
            visibility: string;
        }[];
        skills: ({
            skill: {
                id: string;
                name: string;
                category: string | null;
                createdAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            skillId: string;
            proficiency: string;
        })[];
        id: string;
        name: string;
        createdAt: Date;
        email: string;
        headline: string | null;
        bio: string | null;
        avatarUrl: string | null;
        location: string | null;
        education: string | null;
        experience: string | null;
        websiteUrl: string | null;
        githubUrl: string | null;
        linkedinUrl: string | null;
        isAvailable: boolean;
        role: string;
        isVerified: boolean;
        isActive: boolean;
        lastLoginAt: Date | null;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    listAllUsers(page?: string, limit?: string): Promise<{
        data: {
            id: string;
            name: string;
            createdAt: Date;
            email: string;
            role: string;
            isVerified: boolean;
            isActive: boolean;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
