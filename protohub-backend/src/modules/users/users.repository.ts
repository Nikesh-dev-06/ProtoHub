import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

const PROFILE_INCLUDE = {
  skills: { include: { skill: true } },
  ownedProjects: { 
    where: { visibility: 'PUBLIC' }, 
    select: { id: true, title: true, slug: true, summary: true, visibility: true } 
  },
} satisfies Prisma.UserInclude;

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { email, deletedAt: null },
    });
  }

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { id, deletedAt: null },
    });
  }

  findPublicProfile(id: string) {
    return this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      include: PROFILE_INCLUDE,
    });
  }

  create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  updateLastLogin(id: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }

  updateProfile(id: string, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({ where: { id }, data, include: PROFILE_INCLUDE });
  }

  upsertSkill(userId: string, skillId: string, proficiency: Prisma.UserSkillCreateInput['proficiency']) {
    return this.prisma.userSkill.upsert({
      where: { userId_skillId: { userId, skillId } },
      update: { proficiency },
      create: { userId, skillId, proficiency },
    });
  }

  async addCustomSkill(userId: string, skillName: string, proficiency: Prisma.UserSkillCreateInput['proficiency']) {
    // Create the skill if it doesn't exist
    const skill = await this.prisma.skill.upsert({
      where: { name: skillName },
      update: {},
      create: { name: skillName },
    });

    return this.upsertSkill(userId, skill.id, proficiency);
  }

  removeSkill(userId: string, skillId: string) {
    return this.prisma.userSkill.deleteMany({ where: { userId, skillId } });
  }

  listSkillCatalog() {
    return this.prisma.skill.findMany({ orderBy: { name: 'asc' } });
  }

  searchUsers(query: string, limit: number) {
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

  searchMentors(query: string) {
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

  async listAll(page: number, limit: number) {
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

  setActive(id: string, isActive: boolean) {
    return this.prisma.user.update({ where: { id }, data: { isActive } });
  }

  async findConnections(userId: string) {
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

  async findSuggestions(userId: string) {
    // Find users with similar skills or roles, excluding the user themselves
    // For a simple implementation, we'll just return a random subset of other active users
    const users = await this.prisma.user.findMany({
      where: {
        id: { not: userId },
        deletedAt: null,
        isActive: true,
      },
      select: { id: true, name: true, avatarUrl: true, headline: true, role: true },
      take: 20,
    });
    // Shuffle array and take top 5 (simplified simulation of relevance algorithm)
    return users.sort(() => 0.5 - Math.random()).slice(0, 5);
  }

  async findFeed(userId: string) {
    // Return recent activity logs from projects the user is in, or public projects
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
}

