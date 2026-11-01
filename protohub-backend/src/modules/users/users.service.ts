import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserRole } from '../../common/prisma-enums';
import { UsersRepository } from './users.repository';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AddSkillDto } from './dto/add-skill.dto';

/**
 * The subset of User fields that are safe to ever send to a client.
 * passwordHash never leaves this module.
 */
export type PublicUser = Omit<User, 'passwordHash'>;

export function toPublicUser(user: User): PublicUser {
  const { passwordHash, ...publicUser } = user;
  return publicUser;
}

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  findById(id: string) {
    return this.usersRepository.findById(id);
  }

  createUser(params: { email: string; passwordHash: string; name: string; headline?: string; role?: UserRole }) {
    return this.usersRepository.create({
      email: params.email,
      passwordHash: params.passwordHash,
      name: params.name,
      headline: params.headline,
      role: params.role ?? UserRole.STUDENT,
    });
  }

  markLoggedIn(id: string) {
    return this.usersRepository.updateLastLogin(id);
  }

  async getPublicProfile(id: string) {
    const profile = await this.usersRepository.findPublicProfile(id);
    if (!profile) throw new NotFoundException('User not found');
    const { passwordHash, ...rest } = profile;
    return rest;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const updated = await this.usersRepository.updateProfile(userId, dto);
    return toPublicUser(updated);
  }

  async addSkill(userId: string, dto: AddSkillDto) {
    const proficiency = dto.proficiency || 'INTERMEDIATE';
    if (dto.skillId) {
      return this.usersRepository.upsertSkill(userId, dto.skillId, proficiency);
    } else if (dto.name) {
      return this.usersRepository.addCustomSkill(userId, dto.name, proficiency);
    }
    throw new BadRequestException('Must provide either skillId or name');
  }

  async removeSkill(userId: string, skillId: string) {
    await this.usersRepository.removeSkill(userId, skillId);
  }

  listSkillCatalog() {
    return this.usersRepository.listSkillCatalog();
  }

  searchUsers(query: string, limit = 10) {
    return this.usersRepository.searchUsers(query, limit);
  }

  searchMentors(query: string) {
    return this.usersRepository.searchMentors(query);
  }

  async listAll(page: number, limit: number) {
    const { data, total } = await this.usersRepository.listAll(page, limit);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async setActive(id: string, isActive: boolean) {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');
    const updated = await this.usersRepository.setActive(id, isActive);
    return toPublicUser(updated);
  }

  async getConnections(userId: string) {
    return this.usersRepository.findConnections(userId);
  }

  async getSuggestions(userId: string) {
    return this.usersRepository.findSuggestions(userId);
  }

  async getFeed(userId: string) {
    return this.usersRepository.findFeed(userId);
  }
}
