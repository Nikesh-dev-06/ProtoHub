import { PrismaService } from '../../prisma/prisma.service';
export declare class AuthRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createRefreshToken(params: {
        userId: string;
        tokenHash: string;
        expiresAt: Date;
        userAgent?: string;
        ipAddress?: string;
    }): import(".prisma/client").Prisma.Prisma__RefreshTokenClient<{
        id: string;
        createdAt: Date;
        userId: string;
        tokenHash: string;
        userAgent: string | null;
        ipAddress: string | null;
        expiresAt: Date;
        revokedAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findActiveByHash(tokenHash: string): import(".prisma/client").Prisma.Prisma__RefreshTokenClient<({
        user: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        tokenHash: string;
        userAgent: string | null;
        ipAddress: string | null;
        expiresAt: Date;
        revokedAt: Date | null;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    revokeById(id: string): import(".prisma/client").Prisma.Prisma__RefreshTokenClient<{
        id: string;
        createdAt: Date;
        userId: string;
        tokenHash: string;
        userAgent: string | null;
        ipAddress: string | null;
        expiresAt: Date;
        revokedAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    revokeAllForUser(userId: string): import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
}
