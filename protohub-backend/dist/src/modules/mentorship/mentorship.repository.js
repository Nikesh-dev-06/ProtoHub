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
exports.MentorshipRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_enums_1 = require("../../common/prisma-enums");
const prisma_service_1 = require("../../prisma/prisma.service");
const REQUEST_INCLUDE = {
    requester: { select: { id: true, name: true, avatarUrl: true, headline: true } },
    mentor: { select: { id: true, name: true, avatarUrl: true, headline: true } },
    project: { select: { id: true, title: true, slug: true } },
};
let MentorshipRepository = class MentorshipRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(requesterId, mentorId, projectId, message) {
        return this.prisma.mentorshipRequest.create({
            data: { requesterId, mentorId, projectId, message },
            include: REQUEST_INCLUDE,
        });
    }
    findById(id) {
        return this.prisma.mentorshipRequest.findUnique({ where: { id } });
    }
    respond(id, status) {
        return this.prisma.mentorshipRequest.update({
            where: { id },
            data: { status, respondedAt: new Date() },
            include: REQUEST_INCLUDE,
        });
    }
    cancel(id) {
        return this.prisma.mentorshipRequest.update({
            where: { id },
            data: { status: prisma_enums_1.MentorshipStatus.CANCELLED, respondedAt: new Date() },
        });
    }
    listSent(requesterId) {
        return this.prisma.mentorshipRequest.findMany({
            where: { requesterId },
            include: REQUEST_INCLUDE,
            orderBy: { createdAt: 'desc' },
        });
    }
    listReceived(mentorId) {
        return this.prisma.mentorshipRequest.findMany({
            where: { mentorId },
            include: REQUEST_INCLUDE,
            orderBy: { createdAt: 'desc' },
        });
    }
    findExistingPending(requesterId, mentorId) {
        return this.prisma.mentorshipRequest.findFirst({
            where: { requesterId, mentorId, status: prisma_enums_1.MentorshipStatus.PENDING },
        });
    }
};
exports.MentorshipRepository = MentorshipRepository;
exports.MentorshipRepository = MentorshipRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MentorshipRepository);
//# sourceMappingURL=mentorship.repository.js.map