import { Injectable } from '@nestjs/common';
import { MentorshipStatus } from '../../common/prisma-enums';
import { PrismaService } from '../../prisma/prisma.service';

const REQUEST_INCLUDE = {
  requester: { select: { id: true, name: true, avatarUrl: true, headline: true } },
  mentor: { select: { id: true, name: true, avatarUrl: true, headline: true } },
  project: { select: { id: true, title: true, slug: true } },
};

@Injectable()
export class MentorshipRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(requesterId: string, mentorId: string, projectId: string | undefined, message: string | undefined) {
    return this.prisma.mentorshipRequest.create({
      data: { requesterId, mentorId, projectId, message },
      include: REQUEST_INCLUDE,
    });
  }

  findById(id: string) {
    return this.prisma.mentorshipRequest.findUnique({ where: { id } });
  }

  respond(id: string, status: MentorshipStatus) {
    return this.prisma.mentorshipRequest.update({
      where: { id },
      data: { status, respondedAt: new Date() },
      include: REQUEST_INCLUDE,
    });
  }

  cancel(id: string) {
    return this.prisma.mentorshipRequest.update({
      where: { id },
      data: { status: MentorshipStatus.CANCELLED, respondedAt: new Date() },
    });
  }

  listSent(requesterId: string) {
    return this.prisma.mentorshipRequest.findMany({
      where: { requesterId },
      include: REQUEST_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  listReceived(mentorId: string) {
    return this.prisma.mentorshipRequest.findMany({
      where: { mentorId },
      include: REQUEST_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  findExistingPending(requesterId: string, mentorId: string) {
    return this.prisma.mentorshipRequest.findFirst({
      where: { requesterId, mentorId, status: MentorshipStatus.PENDING },
    });
  }
}
