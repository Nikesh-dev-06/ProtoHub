import { MentorshipStatus } from '../../common/prisma-enums';
import { PrismaService } from '../../prisma/prisma.service';
export declare class MentorshipRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(requesterId: string, mentorId: string, projectId: string | undefined, message: string | undefined): import(".prisma/client").Prisma.Prisma__MentorshipRequestClient<{
        project: {
            id: string;
            slug: string;
            title: string;
        } | null;
        requester: {
            id: string;
            name: string;
            headline: string | null;
            avatarUrl: string | null;
        };
        mentor: {
            id: string;
            name: string;
            headline: string | null;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        projectId: string | null;
        message: string | null;
        respondedAt: Date | null;
        requesterId: string;
        mentorId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findById(id: string): import(".prisma/client").Prisma.Prisma__MentorshipRequestClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        projectId: string | null;
        message: string | null;
        respondedAt: Date | null;
        requesterId: string;
        mentorId: string;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    respond(id: string, status: MentorshipStatus): import(".prisma/client").Prisma.Prisma__MentorshipRequestClient<{
        project: {
            id: string;
            slug: string;
            title: string;
        } | null;
        requester: {
            id: string;
            name: string;
            headline: string | null;
            avatarUrl: string | null;
        };
        mentor: {
            id: string;
            name: string;
            headline: string | null;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        projectId: string | null;
        message: string | null;
        respondedAt: Date | null;
        requesterId: string;
        mentorId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    cancel(id: string): import(".prisma/client").Prisma.Prisma__MentorshipRequestClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        projectId: string | null;
        message: string | null;
        respondedAt: Date | null;
        requesterId: string;
        mentorId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    listSent(requesterId: string): import(".prisma/client").Prisma.PrismaPromise<({
        project: {
            id: string;
            slug: string;
            title: string;
        } | null;
        requester: {
            id: string;
            name: string;
            headline: string | null;
            avatarUrl: string | null;
        };
        mentor: {
            id: string;
            name: string;
            headline: string | null;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        projectId: string | null;
        message: string | null;
        respondedAt: Date | null;
        requesterId: string;
        mentorId: string;
    })[]>;
    listReceived(mentorId: string): import(".prisma/client").Prisma.PrismaPromise<({
        project: {
            id: string;
            slug: string;
            title: string;
        } | null;
        requester: {
            id: string;
            name: string;
            headline: string | null;
            avatarUrl: string | null;
        };
        mentor: {
            id: string;
            name: string;
            headline: string | null;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        projectId: string | null;
        message: string | null;
        respondedAt: Date | null;
        requesterId: string;
        mentorId: string;
    })[]>;
    findExistingPending(requesterId: string, mentorId: string): import(".prisma/client").Prisma.Prisma__MentorshipRequestClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        projectId: string | null;
        message: string | null;
        respondedAt: Date | null;
        requesterId: string;
        mentorId: string;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}
