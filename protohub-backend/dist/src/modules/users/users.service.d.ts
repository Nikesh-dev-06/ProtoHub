import { User } from '@prisma/client';
import { UserRole } from '../../common/prisma-enums';
import { UsersRepository } from './users.repository';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AddSkillDto } from './dto/add-skill.dto';
export type PublicUser = Omit<User, 'passwordHash'>;
export declare function toPublicUser(user: User): PublicUser;
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: UsersRepository);
    findByEmail(email: string): Promise<{
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
    } | null>;
    findById(id: string): Promise<{
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
    } | null>;
    createUser(params: {
        email: string;
        passwordHash: string;
        name: string;
        headline?: string;
        role?: UserRole;
    }): Promise<{
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
    }>;
    markLoggedIn(id: string): Promise<{
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
    }>;
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
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<PublicUser>;
    addSkill(userId: string, dto: AddSkillDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        skillId: string;
        proficiency: string;
    }>;
    removeSkill(userId: string, skillId: string): Promise<void>;
    listSkillCatalog(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        category: string | null;
        createdAt: Date;
    }[]>;
    searchUsers(query: string, limit?: number): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        headline: string | null;
        avatarUrl: string | null;
        role: string;
    }[]>;
    searchMentors(query: string): import(".prisma/client").Prisma.PrismaPromise<{
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
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    setActive(id: string, isActive: boolean): Promise<PublicUser>;
    getConnections(userId: string): Promise<{
        id: string;
        name: string;
        headline: string | null;
        avatarUrl: string | null;
        role: string;
    }[]>;
    getSuggestions(userId: string): Promise<{
        id: string;
        name: string;
        headline: string | null;
        avatarUrl: string | null;
        role: string;
    }[]>;
    getFeed(userId: string): Promise<({
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
}
