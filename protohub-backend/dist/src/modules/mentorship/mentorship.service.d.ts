import { EventEmitter2 } from '@nestjs/event-emitter';
import { MentorshipRepository } from './mentorship.repository';
import { UsersService } from '../users/users.service';
import { CreateMentorshipRequestDto } from './dto/create-mentorship-request.dto';
import { RespondMentorshipRequestDto } from './dto/respond-mentorship-request.dto';
export declare class MentorshipService {
    private readonly mentorshipRepository;
    private readonly usersService;
    private readonly eventEmitter;
    constructor(mentorshipRepository: MentorshipRepository, usersService: UsersService, eventEmitter: EventEmitter2);
    request(requesterId: string, dto: CreateMentorshipRequestDto): Promise<{
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
    respond(requestId: string, mentorId: string, dto: RespondMentorshipRequestDto): Promise<{
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
    cancel(requestId: string, requesterId: string): Promise<void>;
    listSent(userId: string): import(".prisma/client").Prisma.PrismaPromise<({
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
    listReceived(userId: string): import(".prisma/client").Prisma.PrismaPromise<({
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
}
