import { PublicUser } from '../users/users.service';
import { MentorshipService } from './mentorship.service';
import { CreateMentorshipRequestDto } from './dto/create-mentorship-request.dto';
import { RespondMentorshipRequestDto } from './dto/respond-mentorship-request.dto';
export declare class MentorshipController {
    private readonly mentorshipService;
    constructor(mentorshipService: MentorshipService);
    request(dto: CreateMentorshipRequestDto, user: PublicUser): Promise<{
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
    }>;
    listSent(user: PublicUser): import(".prisma/client").Prisma.PrismaPromise<({
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
    listReceived(user: PublicUser): import(".prisma/client").Prisma.PrismaPromise<({
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
    respond(id: string, dto: RespondMentorshipRequestDto, user: PublicUser): Promise<{
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
    }>;
    cancel(id: string, user: PublicUser): Promise<void>;
}
