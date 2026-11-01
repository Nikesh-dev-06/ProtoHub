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
exports.UsersService = void 0;
exports.toPublicUser = toPublicUser;
const common_1 = require("@nestjs/common");
const prisma_enums_1 = require("../../common/prisma-enums");
const users_repository_1 = require("./users.repository");
function toPublicUser(user) {
    const { passwordHash, ...publicUser } = user;
    return publicUser;
}
let UsersService = class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    findByEmail(email) {
        return this.usersRepository.findByEmail(email);
    }
    findById(id) {
        return this.usersRepository.findById(id);
    }
    createUser(params) {
        return this.usersRepository.create({
            email: params.email,
            passwordHash: params.passwordHash,
            name: params.name,
            headline: params.headline,
            role: params.role ?? prisma_enums_1.UserRole.STUDENT,
        });
    }
    markLoggedIn(id) {
        return this.usersRepository.updateLastLogin(id);
    }
    async getPublicProfile(id) {
        const profile = await this.usersRepository.findPublicProfile(id);
        if (!profile)
            throw new common_1.NotFoundException('User not found');
        const { passwordHash, ...rest } = profile;
        return rest;
    }
    async updateProfile(userId, dto) {
        const updated = await this.usersRepository.updateProfile(userId, dto);
        return toPublicUser(updated);
    }
    async addSkill(userId, dto) {
        const proficiency = dto.proficiency || 'INTERMEDIATE';
        if (dto.skillId) {
            return this.usersRepository.upsertSkill(userId, dto.skillId, proficiency);
        }
        else if (dto.name) {
            return this.usersRepository.addCustomSkill(userId, dto.name, proficiency);
        }
        throw new common_1.BadRequestException('Must provide either skillId or name');
    }
    async removeSkill(userId, skillId) {
        await this.usersRepository.removeSkill(userId, skillId);
    }
    listSkillCatalog() {
        return this.usersRepository.listSkillCatalog();
    }
    searchUsers(query, limit = 10) {
        return this.usersRepository.searchUsers(query, limit);
    }
    searchMentors(query) {
        return this.usersRepository.searchMentors(query);
    }
    async listAll(page, limit) {
        const { data, total } = await this.usersRepository.listAll(page, limit);
        return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    }
    async setActive(id, isActive) {
        const user = await this.usersRepository.findById(id);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const updated = await this.usersRepository.setActive(id, isActive);
        return toPublicUser(updated);
    }
    async getConnections(userId) {
        return this.usersRepository.findConnections(userId);
    }
    async getSuggestions(userId) {
        return this.usersRepository.findSuggestions(userId);
    }
    async getFeed(userId) {
        return this.usersRepository.findFeed(userId);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository])
], UsersService);
//# sourceMappingURL=users.service.js.map