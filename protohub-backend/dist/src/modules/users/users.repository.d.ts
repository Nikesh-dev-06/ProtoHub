import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
export declare class UsersRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    findPublicProfile(id: string): Prisma.Prisma__UserClient<({
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
    } & {
        id: string;
        name: string;
        createdAt: Date;
        email: string;
        passwordHash: string;
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
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    create(data: Prisma.UserCreateInput): Promise<User>;
    updateLastLogin(id: string): Promise<User>;
    updateProfile(id: string, data: Prisma.UserUpdateInput): Prisma.Prisma__UserClient<{
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
    } & {
        id: string;
        name: string;
        createdAt: Date;
        email: string;
        passwordHash: string;
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    upsertSkill(userId: string, skillId: string, proficiency: Prisma.UserSkillCreateInput['proficiency']): Prisma.Prisma__UserSkillClient<{
        id: string;
        createdAt: Date;
        userId: string;
        skillId: string;
        proficiency: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    addCustomSkill(userId: string, skillName: string, proficiency: Prisma.UserSkillCreateInput['proficiency']): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        skillId: string;
        proficiency: string;
    }>;
    removeSkill(userId: string, skillId: string): Prisma.PrismaPromise<Prisma.BatchPayload>;
    listSkillCatalog(): Prisma.PrismaPromise<{
        id: string;
        name: string;
        category: string | null;
        createdAt: Date;
    }[]>;
    searchUsers(query: string, limit: number): Prisma.PrismaPromise<{
        id: string;
        name: string;
        headline: string | null;
        avatarUrl: string | null;
        role: string;
    }[]>;
    searchMentors(query: string): Prisma.PrismaPromise<{
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
    listAll(page: number, limit: number): Promise<{
        data: {
            id: string;
            name: string;
            createdAt: Date;
            email: string;
            role: string;
            isVerified: boolean;
            isActive: boolean;
        }[];
        total: number;
    }>;
    setActive(id: string, isActive: boolean): Prisma.Prisma__UserClient<{
        id: string;
        name: string;
        createdAt: Date;
        email: string;
        passwordHash: string;
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    findConnections(userId: string): Promise<{
        id: string;
        name: string;
        headline: string | null;
        avatarUrl: string | null;
        role: string;
    }[]>;
    findSuggestions(userId: string): Promise<{
        id: string;
        name: string;
        headline: string | null;
        avatarUrl: string | null;
        role: string;
    }[]>;
    findFeed(userId: string): Promise<({
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
        metadata: Prisma.JsonValue | null;
        entityType: string;
        entityId: string;
        action: string;
        actorId: string | null;
    })[]>;
}
