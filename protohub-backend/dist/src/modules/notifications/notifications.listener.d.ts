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
export declare class NotificationsListener {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    onJoinRequestCreated(event: JoinRequestCreatedEvent): Promise<void>;
    onJoinRequestReviewed(event: JoinRequestReviewedEvent): Promise<void>;
    onMentorshipRequested(event: MentorshipRequestedEvent): Promise<void>;
    onMentorshipResponded(event: MentorshipRespondedEvent): Promise<void>;
    onTaskAssigned(event: TaskAssignedEvent): Promise<void>;
}
export {};
