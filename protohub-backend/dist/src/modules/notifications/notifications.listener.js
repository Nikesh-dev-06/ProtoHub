"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const prisma_enums_1 = require("../../common/prisma-enums");
const notifications_service_1 = require("./notifications.service");
let NotificationsListener = class NotificationsListener {
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    async onJoinRequestCreated(event) {
        await this.notificationsService.create({
            userId: event.ownerId,
            type: prisma_enums_1.NotificationType.JOIN_REQUEST,
            title: 'New join request',
            message: `Someone requested to join "${event.projectTitle}".`,
            entityType: 'Project',
            entityId: event.projectId,
        });
    }
    async onJoinRequestReviewed(event) {
        const accepted = event.status === 'ACCEPTED';
        await this.notificationsService.create({
            userId: event.requesterId,
            type: accepted ? prisma_enums_1.NotificationType.JOIN_REQUEST_ACCEPTED : prisma_enums_1.NotificationType.JOIN_REQUEST_REJECTED,
            title: accepted ? 'Join request accepted' : 'Join request declined',
            message: accepted
                ? `You're now a member of "${event.projectTitle}".`
                : `Your request to join "${event.projectTitle}" was declined.`,
            entityType: 'Project',
            entityId: event.projectId,
        });
    }
    async onMentorshipRequested(event) {
        await this.notificationsService.create({
            userId: event.mentorId,
            type: prisma_enums_1.NotificationType.MENTORSHIP_REQUEST,
            title: 'New mentorship request',
            message: 'A student has requested you as a mentor.',
            entityType: 'MentorshipRequest',
            entityId: event.requestId,
        });
    }
    async onMentorshipResponded(event) {
        const accepted = event.status === 'ACCEPTED';
        await this.notificationsService.create({
            userId: event.requesterId,
            type: accepted ? prisma_enums_1.NotificationType.MENTORSHIP_ACCEPTED : prisma_enums_1.NotificationType.MENTORSHIP_REJECTED,
            title: accepted ? 'Mentorship request accepted' : 'Mentorship request declined',
            message: accepted ? 'A mentor accepted your request.' : 'A mentor declined your request.',
            entityType: 'MentorshipRequest',
            entityId: event.requestId,
        });
    }
    async onTaskAssigned(event) {
        await this.notificationsService.create({
            userId: event.assigneeId,
            type: prisma_enums_1.NotificationType.TASK_ASSIGNED,
            title: 'Task assigned to you',
            message: `You were assigned "${event.taskTitle}".`,
            entityType: 'Task',
            entityId: event.taskId,
        });
    }
};
exports.NotificationsListener = NotificationsListener;
__decorate([
    (0, event_emitter_1.OnEvent)('project.join_request.created'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsListener.prototype, "onJoinRequestCreated", null);
__decorate([
    (0, event_emitter_1.OnEvent)('project.join_request.reviewed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsListener.prototype, "onJoinRequestReviewed", null);
__decorate([
    (0, event_emitter_1.OnEvent)('mentorship.requested'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsListener.prototype, "onMentorshipRequested", null);
__decorate([
    (0, event_emitter_1.OnEvent)('mentorship.responded'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsListener.prototype, "onMentorshipResponded", null);
__decorate([
    (0, event_emitter_1.OnEvent)('task.assigned'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsListener.prototype, "onTaskAssigned", null);
exports.NotificationsListener = NotificationsListener = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
], NotificationsListener);
//# sourceMappingURL=notifications.listener.js.map