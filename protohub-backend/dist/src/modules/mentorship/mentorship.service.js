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
exports.MentorshipService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const prisma_enums_1 = require("../../common/prisma-enums");
const mentorship_repository_1 = require("./mentorship.repository");
const users_service_1 = require("../users/users.service");
let MentorshipService = class MentorshipService {
    constructor(mentorshipRepository, usersService, eventEmitter) {
        this.mentorshipRepository = mentorshipRepository;
        this.usersService = usersService;
        this.eventEmitter = eventEmitter;
    }
    async request(requesterId, dto) {
        if (dto.mentorId === requesterId) {
            throw new common_1.BadRequestException('You cannot request mentorship from yourself');
        }
        const mentor = await this.usersService.findById(dto.mentorId);
        if (!mentor || (mentor.role !== prisma_enums_1.UserRole.MENTOR && mentor.role !== prisma_enums_1.UserRole.ADMIN)) {
            throw new common_1.BadRequestException('This user is not registered as a mentor');
        }
        const existing = await this.mentorshipRepository.findExistingPending(requesterId, dto.mentorId);
        if (existing) {
            throw new common_1.ConflictException('You already have a pending request with this mentor');
        }
        const request = await this.mentorshipRepository.create(requesterId, dto.mentorId, dto.projectId, dto.message);
        this.eventEmitter.emit('mentorship.requested', {
            mentorId: dto.mentorId,
            requesterId,
            requestId: request.id,
        });
        return request;
    }
    async respond(requestId, mentorId, dto) {
        const request = await this.mentorshipRepository.findById(requestId);
        if (!request)
            throw new common_1.NotFoundException('Mentorship request not found');
        if (request.mentorId !== mentorId) {
            throw new common_1.ForbiddenException('Only the requested mentor can respond to this request');
        }
        if (request.status !== prisma_enums_1.MentorshipStatus.PENDING) {
            throw new common_1.ConflictException('This request has already been responded to');
        }
        const status = dto.status === 'ACCEPTED' ? prisma_enums_1.MentorshipStatus.ACCEPTED : prisma_enums_1.MentorshipStatus.REJECTED;
        const updated = await this.mentorshipRepository.respond(requestId, status);
        this.eventEmitter.emit('mentorship.responded', {
            requesterId: request.requesterId,
            mentorId,
            requestId,
            status,
        });
        return updated;
    }
    async cancel(requestId, requesterId) {
        const request = await this.mentorshipRepository.findById(requestId);
        if (!request)
            throw new common_1.NotFoundException('Mentorship request not found');
        if (request.requesterId !== requesterId) {
            throw new common_1.ForbiddenException('Only the requester can cancel this request');
        }
        if (request.status !== prisma_enums_1.MentorshipStatus.PENDING) {
            throw new common_1.ConflictException('Only a pending request can be cancelled');
        }
        await this.mentorshipRepository.cancel(requestId);
    }
    listSent(userId) {
        return this.mentorshipRepository.listSent(userId);
    }
    listReceived(userId) {
        return this.mentorshipRepository.listReceived(userId);
    }
};
exports.MentorshipService = MentorshipService;
exports.MentorshipService = MentorshipService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mentorship_repository_1.MentorshipRepository,
        users_service_1.UsersService,
        event_emitter_1.EventEmitter2])
], MentorshipService);
//# sourceMappingURL=mentorship.service.js.map