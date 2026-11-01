import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationType } from '../../common/prisma-enums';
import { NotificationsService } from './notifications.service';

interface JoinRequestCreatedEvent {
  projectId: string;
  projectTitle: string;
  ownerId: string;
  requesterId: string;
  requestId: string;
}

interface JoinRequestReviewedEvent {
  projectId: string;
  projectTitle: string;
  requesterId: string;
  status: 'ACCEPTED' | 'REJECTED';
}

interface MentorshipRequestedEvent {
  mentorId: string;
  requesterId: string;
  requestId: string;
}

interface MentorshipRespondedEvent {
  requesterId: string;
  mentorId: string;
  requestId: string;
  status: 'ACCEPTED' | 'REJECTED';
}

interface TaskAssignedEvent {
  projectId: string;
  taskId: string;
  taskTitle: string;
  assigneeId: string;
  assignedById: string;
}

@Injectable()
export class NotificationsListener {
  constructor(private readonly notificationsService: NotificationsService) {}

  @OnEvent('project.join_request.created')
  async onJoinRequestCreated(event: JoinRequestCreatedEvent) {
    await this.notificationsService.create({
      userId: event.ownerId,
      type: NotificationType.JOIN_REQUEST,
      title: 'New join request',
      message: `Someone requested to join "${event.projectTitle}".`,
      entityType: 'Project',
      entityId: event.projectId,
    });
  }

  @OnEvent('project.join_request.reviewed')
  async onJoinRequestReviewed(event: JoinRequestReviewedEvent) {
    const accepted = event.status === 'ACCEPTED';
    await this.notificationsService.create({
      userId: event.requesterId,
      type: accepted ? NotificationType.JOIN_REQUEST_ACCEPTED : NotificationType.JOIN_REQUEST_REJECTED,
      title: accepted ? 'Join request accepted' : 'Join request declined',
      message: accepted
        ? `You're now a member of "${event.projectTitle}".`
        : `Your request to join "${event.projectTitle}" was declined.`,
      entityType: 'Project',
      entityId: event.projectId,
    });
  }

  @OnEvent('mentorship.requested')
  async onMentorshipRequested(event: MentorshipRequestedEvent) {
    await this.notificationsService.create({
      userId: event.mentorId,
      type: NotificationType.MENTORSHIP_REQUEST,
      title: 'New mentorship request',
      message: 'A student has requested you as a mentor.',
      entityType: 'MentorshipRequest',
      entityId: event.requestId,
    });
  }

  @OnEvent('mentorship.responded')
  async onMentorshipResponded(event: MentorshipRespondedEvent) {
    const accepted = event.status === 'ACCEPTED';
    await this.notificationsService.create({
      userId: event.requesterId,
      type: accepted ? NotificationType.MENTORSHIP_ACCEPTED : NotificationType.MENTORSHIP_REJECTED,
      title: accepted ? 'Mentorship request accepted' : 'Mentorship request declined',
      message: accepted ? 'A mentor accepted your request.' : 'A mentor declined your request.',
      entityType: 'MentorshipRequest',
      entityId: event.requestId,
    });
  }

  @OnEvent('task.assigned')
  async onTaskAssigned(event: TaskAssignedEvent) {
    await this.notificationsService.create({
      userId: event.assigneeId,
      type: NotificationType.TASK_ASSIGNED,
      title: 'Task assigned to you',
      message: `You were assigned "${event.taskTitle}".`,
      entityType: 'Task',
      entityId: event.taskId,
    });
  }
}
