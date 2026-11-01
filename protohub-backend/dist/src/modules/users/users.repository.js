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
exports.UsersRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const PROFILE_INCLUDE = {
    skills: { include: { skill: true } },
    ownedProjects: {
        where: { visibility: 'PUBLIC' },
        select: { id: true, title: true, slug: true, summary: true, visibility: true }
    },
};
let UsersRepository = class UsersRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findByEmail(email) {
        return this.prisma.user.findFirst({
            where: { email, deletedAt: null },
        });
    }
    findById(id) {
        return this.prisma.user.findFirst({
            where: { id, deletedAt: null },
        });
    }
    findPublicProfile(id) {
        return this.prisma.user.findFirst({
            where: { id, deletedAt: null },
            include: PROFILE_INCLUDE,
        });
    }
    create(data) {
        return this.prisma.user.create({ data });
    }
    updateLastLogin(id) {
        return this.prisma.user.update({
            where: { id },
            data: { lastLoginAt: new Date() },
        });
    }
    updateProfile(id, data) {
        return this.prisma.user.update({ where: { id }, data, include: PROFILE_INCLUDE });
    }
    upsertSkill(userId, skillId, proficiency) {
        return this.prisma.userSkill.upsert({
            where: { userId_skillId: { userId, skillId } },
            update: { proficiency },
            create: { userId, skillId, proficiency },
        });
    }
    async addCustomSkill(userId, skillName, proficiency) {
        const skill = await this.prisma.skill.upsert({
            where: { name: skillName },
            update: {},
            create: { name: skillName },
        });
        return this.upsertSkill(userId, skill.id, proficiency);
    }
    removeSkill(userId, skillId) {
        return this.prisma.userSkill.deleteMany({ where: { userId, skillId } });
    }
    listSkillCatalog() {
        return this.prisma.skill.findMany({ orderBy: { name: 'asc' } });
    }
    searchUsers(query, limit) {
        return this.prisma.user.findMany({
            where: {
                deletedAt: null,
                OR: [
                    { name: { contains: query } },
                    { headline: { contains: query } },
                ],
            },
            select: { id: true, name: true, headline: true, avatarUrl: true, role: true },
            take: limit,
        });
    }
    searchMentors(query) {
        return this.prisma.user.findMany({
            where: {
                deletedAt: null,
                role: { in: ['TEACHER', 'PROFESSIONAL', 'MENTOR'] },
                OR: [
                    { name: { contains: query } },
                    { headline: { contains: query } },
                    { skills: { some: { skill: { name: { contains: query } } } } },
                ],
            },
            select: { id: true, name: true, headline: true, avatarUrl: true, role: true, skills: { include: { skill: true } } },
            take: 20,
        });
    }
    async listAll(page, limit) {
        const [data, total] = await this.prisma.$transaction([
            this.prisma.user.findMany({
                where: { deletedAt: null },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    isActive: true,
                    isVerified: true,
                    createdAt: true,
                },
            }),
            this.prisma.user.count({ where: { deletedAt: null } }),
        ]);
        return { data, total };
    }
    setActive(id, isActive) {
        return this.prisma.user.update({ where: { id }, data: { isActive } });
    }
    async findConnections(userId) {
        const connections = await this.prisma.mentorshipRequest.findMany({
            where: {
                status: 'ACCEPTED',
                OR: [{ requesterId: userId }, { mentorId: userId }],
            },
            include: {
                requester: { select: { id: true, name: true, avatarUrl: true, headline: true, role: true } },
                mentor: { select: { id: true, name: true, avatarUrl: true, headline: true, role: true } },
            },
        });
        return connections.map((c) => (c.requesterId === userId ? c.mentor : c.requester));
    }
    async findSuggestions(userId) {
        const users = await this.prisma.user.findMany({
            where: {
                id: { not: userId },
                deletedAt: null,
                isActive: true,
            },
            select: { id: true, name: true, avatarUrl: true, headline: true, role: true },
            take: 20,
        });
        return users.sort(() => 0.5 - Math.random()).slice(0, 5);
    }
    async findFeed(userId) {
        return this.prisma.activityLog.findMany({
            where: {
                OR: [
                    { actorId: userId },
                    { project: { members: { some: { userId } } } }
                ]
            },
            include: {
                actor: { select: { id: true, name: true, avatarUrl: true } },
                project: { select: { id: true, title: true, slug: true } }
            },
            orderBy: { createdAt: 'desc' },
            take: 20,
        });
    }
};
exports.UsersRepository = UsersRepository;
exports.UsersRepository = UsersRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersRepository);
//# sourceMappingURL=users.repository.js.map