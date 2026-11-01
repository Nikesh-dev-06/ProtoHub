import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MentorshipStatus, UserRole } from '../../common/prisma-enums';
import { MentorshipRepository } from './mentorship.repository';
import { UsersService } from '../users/users.service';
import { CreateMentorshipRequestDto } from './dto/create-mentorship-request.dto';
import { RespondMentorshipRequestDto } from './dto/respond-mentorship-request.dto';

@Injectable()
export class MentorshipService {
  constructor(
    private readonly mentorshipRepository: MentorshipRepository,
    private readonly usersService: UsersService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async request(requesterId: string, dto: CreateMentorshipRequestDto) {
    if (dto.mentorId === requesterId) {
      throw new BadRequestException('You cannot request mentorship from yourself');
    }

    const mentor = await this.usersService.findById(dto.mentorId);
    if (!mentor || (mentor.role !== UserRole.MENTOR && mentor.role !== UserRole.ADMIN)) {
      throw new BadRequestException('This user is not registered as a mentor');
    }

    const existing = await this.mentorshipRepository.findExistingPending(requesterId, dto.mentorId);
    if (existing) {
      throw new ConflictException('You already have a pending request with this mentor');
    }

    const request = await this.mentorshipRepository.create(requesterId, dto.mentorId, dto.projectId, dto.message);
    this.eventEmitter.emit('mentorship.requested', {
      mentorId: dto.mentorId,
      requesterId,
      requestId: request.id,
    });
    return request;
  }

  async respond(requestId: string, mentorId: string, dto: RespondMentorshipRequestDto) {
    const request = await this.mentorshipRepository.findById(requestId);
    if (!request) throw new NotFoundException('Mentorship request not found');
    if (request.mentorId !== mentorId) {
      throw new ForbiddenException('Only the requested mentor can respond to this request');
    }
    if (request.status !== MentorshipStatus.PENDING) {
      throw new ConflictException('This request has already been responded to');
    }

    const status = dto.status === 'ACCEPTED' ? MentorshipStatus.ACCEPTED : MentorshipStatus.REJECTED;
    const updated = await this.mentorshipRepository.respond(requestId, status);

    this.eventEmitter.emit('mentorship.responded', {
      requesterId: request.requesterId,
      mentorId,
      requestId,
      status,
    });
    return updated;
  }

  async cancel(requestId: string, requesterId: string) {
    const request = await this.mentorshipRepository.findById(requestId);
    if (!request) throw new NotFoundException('Mentorship request not found');
    if (request.requesterId !== requesterId) {
      throw new ForbiddenException('Only the requester can cancel this request');
    }
    if (request.status !== MentorshipStatus.PENDING) {
      throw new ConflictException('Only a pending request can be cancelled');
    }
    await this.mentorshipRepository.cancel(requestId);
  }

  listSent(userId: string) {
    return this.mentorshipRepository.listSent(userId);
  }

  listReceived(userId: string) {
    return this.mentorshipRepository.listReceived(userId);
  }
}
