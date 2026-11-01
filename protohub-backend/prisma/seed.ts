import { PrismaClient } from '@prisma/client';
import { UserRole, ProjectStatus, ProjectVisibility, ProjectMemberRole, JoinRequestStatus, MentorshipStatus, TaskPriority, SkillProficiency, NotificationType, ActivityAction, AIRole } from '../src/common/prisma-enums';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const SALT_ROUNDS = 12;
const hash = (plain: string) => bcrypt.hash(plain, SALT_ROUNDS);

async function main() {
  console.log('🌱 Seeding ProtoHub...');

  // ------------------------------------------------
  // SKILLS
  // ------------------------------------------------
  const skillNames = [
    { name: 'React', category: 'Frontend' },
    { name: 'TypeScript', category: 'Language' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'NestJS', category: 'Backend' },
    { name: 'PostgreSQL', category: 'Database' },
    { name: 'Prisma', category: 'ORM' },
    { name: 'UI/UX Design', category: 'Design' },
    { name: 'Machine Learning', category: 'AI/ML' },
    { name: 'DevOps', category: 'Infrastructure' },
    { name: 'Product Management', category: 'Product' },
  ];

  const skills = await Promise.all(
    skillNames.map((s) =>
      prisma.skill.upsert({
        where: { name: s.name },
        update: {},
        create: s,
      }),
    ),
  );
  const skill = (name: string) => skills.find((s) => s.name === name)!;

  // ------------------------------------------------
  // USERS
  // ------------------------------------------------
  const [admin, mentorAda, mentorGrace, studentLee, studentPriya, studentOmar] = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@protohub.dev' },
      update: {},
      create: {
        email: 'admin@protohub.dev',
        passwordHash: await hash('AdminPass123!'),
        name: 'Sam Rivera',
        role: UserRole.ADMIN,
        isVerified: true,
        headline: 'ProtoHub Platform Team',
      },
    }),
    prisma.user.upsert({
      where: { email: 'ada@protohub.dev' },
      update: {},
      create: {
        email: 'ada@protohub.dev',
        passwordHash: await hash('MentorPass123!'),
        name: 'Ada Okafor',
        role: UserRole.MENTOR,
        isVerified: true,
        headline: 'Staff Engineer @ a fintech scale-up',
        bio: 'I mentor early-career engineers on backend architecture and system design.',
        location: 'Lagos, Nigeria',
      },
    }),
    prisma.user.upsert({
      where: { email: 'grace@protohub.dev' },
      update: {},
      create: {
        email: 'grace@protohub.dev',
        passwordHash: await hash('MentorPass123!'),
        name: 'Grace Kim',
        role: UserRole.MENTOR,
        isVerified: true,
        headline: 'Product Designer, ex-Notion',
        bio: 'Helping student teams turn rough ideas into usable products.',
        location: 'Seoul, South Korea',
      },
    }),
    prisma.user.upsert({
      where: { email: 'lee@protohub.dev' },
      update: {},
      create: {
        email: 'lee@protohub.dev',
        passwordHash: await hash('StudentPass123!'),
        name: 'Lee Chen',
        role: UserRole.STUDENT,
        isVerified: true,
        headline: 'CS Junior @ UC Davis',
        location: 'Davis, CA',
      },
    }),
    prisma.user.upsert({
      where: { email: 'priya@protohub.dev' },
      update: {},
      create: {
        email: 'priya@protohub.dev',
        passwordHash: await hash('StudentPass123!'),
        name: 'Priya Sharma',
        role: UserRole.STUDENT,
        isVerified: true,
        headline: 'Self-taught full-stack developer',
        location: 'Pune, India',
      },
    }),
    prisma.user.upsert({
      where: { email: 'omar@protohub.dev' },
      update: {},
      create: {
        email: 'omar@protohub.dev',
        passwordHash: await hash('StudentPass123!'),
        name: 'Omar Haddad',
        role: UserRole.STUDENT,
        isVerified: false,
        headline: 'Bootcamp grad exploring backend engineering',
        location: 'Amman, Jordan',
      },
    }),
  ]);

  await Promise.all([
    prisma.userSkill.upsert({ where: { userId_skillId: { userId: mentorAda.id, skillId: skill('NestJS').id } }, update: {}, create: { userId: mentorAda.id, skillId: skill('NestJS').id, proficiency: SkillProficiency.EXPERT } }),
    prisma.userSkill.upsert({ where: { userId_skillId: { userId: mentorAda.id, skillId: skill('PostgreSQL').id } }, update: {}, create: { userId: mentorAda.id, skillId: skill('PostgreSQL').id, proficiency: SkillProficiency.EXPERT } }),
    prisma.userSkill.upsert({ where: { userId_skillId: { userId: mentorGrace.id, skillId: skill('UI/UX Design').id } }, update: {}, create: { userId: mentorGrace.id, skillId: skill('UI/UX Design').id, proficiency: SkillProficiency.EXPERT } }),
    prisma.userSkill.upsert({ where: { userId_skillId: { userId: studentLee.id, skillId: skill('React').id } }, update: {}, create: { userId: studentLee.id, skillId: skill('React').id, proficiency: SkillProficiency.INTERMEDIATE } }),
    prisma.userSkill.upsert({ where: { userId_skillId: { userId: studentPriya.id, skillId: skill('TypeScript').id } }, update: {}, create: { userId: studentPriya.id, skillId: skill('TypeScript').id, proficiency: SkillProficiency.ADVANCED } }),
    prisma.userSkill.upsert({ where: { userId_skillId: { userId: studentOmar.id, skillId: skill('Node.js').id } }, update: {}, create: { userId: studentOmar.id, skillId: skill('Node.js').id, proficiency: SkillProficiency.BEGINNER } }),
  ]);

  // ------------------------------------------------
  // PROJECT (owned by Priya, Lee joins as contributor)
  // ------------------------------------------------
  const project = await prisma.project.upsert({
    where: { slug: 'campus-carpool' },
    update: {},
    create: {
      title: 'Campus Carpool',
      slug: 'campus-carpool',
      summary: 'A ride-sharing app for students commuting to campus.',
      description:
        'Campus Carpool matches students who live near each other and share commute times, cutting parking demand and transportation costs. Built as a learning project to practice real-time features and geolocation matching.',
      status: ProjectStatus.ACTIVE,
      visibility: ProjectVisibility.PUBLIC,
      ownerId: studentPriya.id,
      skills: {
        create: [
          { skillId: skill('React').id },
          { skillId: skill('NestJS').id },
          { skillId: skill('PostgreSQL').id },
        ],
      },
    },
  });

  await prisma.projectMember.upsert({
    where: { projectId_userId: { projectId: project.id, userId: studentPriya.id } },
    update: {},
    create: {
      projectId: project.id,
      userId: studentPriya.id,
      role: ProjectMemberRole.OWNER,
    },
  });
  const leeMembership = await prisma.projectMember.upsert({
    where: { projectId_userId: { projectId: project.id, userId: studentLee.id } },
    update: {},
    create: {
      projectId: project.id,
      userId: studentLee.id,
      role: ProjectMemberRole.CONTRIBUTOR,
    },
  });

  // Omar requests to join — still pending
  await prisma.projectJoinRequest.create({
    data: {
      projectId: project.id,
      userId: studentOmar.id,
      message: 'I would love to help build the matching algorithm — I have been learning Node.js for 6 months.',
      status: JoinRequestStatus.PENDING,
    },
  });

  // ------------------------------------------------
  // MENTORSHIP
  // ------------------------------------------------
  await prisma.mentorshipRequest.create({
    data: {
      requesterId: studentPriya.id,
      mentorId: mentorAda.id,
      projectId: project.id,
      message: 'Could you review our backend architecture before we scale the matching service?',
      status: MentorshipStatus.ACCEPTED,
      respondedAt: new Date(),
    },
  });
  await prisma.mentorshipRequest.create({
    data: {
      requesterId: studentLee.id,
      mentorId: mentorGrace.id,
      message: 'Looking for general guidance on breaking into product design.',
      status: MentorshipStatus.PENDING,
    },
  });

  // ------------------------------------------------
  // WORKSPACE — KANBAN
  // ------------------------------------------------
  const [colBacklog, colInProgress, colReview, colDone] = await Promise.all([
    prisma.taskColumn.upsert({ where: { projectId_position: { projectId: project.id, position: 0 } }, update: {}, create: { projectId: project.id, name: 'Backlog', position: 0 } }),
    prisma.taskColumn.upsert({ where: { projectId_position: { projectId: project.id, position: 1 } }, update: {}, create: { projectId: project.id, name: 'In Progress', position: 1 } }),
    prisma.taskColumn.upsert({ where: { projectId_position: { projectId: project.id, position: 2 } }, update: {}, create: { projectId: project.id, name: 'In Review', position: 2 } }),
    prisma.taskColumn.upsert({ where: { projectId_position: { projectId: project.id, position: 3 } }, update: {}, create: { projectId: project.id, name: 'Done', position: 3 } }),
  ]);

  const taskSchema = await prisma.task.create({
    data: {
      projectId: project.id,
      columnId: colDone.id,
      title: 'Design initial database schema',
      description: 'Model users, rides, and matches in Postgres via Prisma.',
      priority: TaskPriority.HIGH,
      position: 0,
      assigneeId: studentPriya.id,
      createdById: studentPriya.id,
      completedAt: new Date(),
    },
  });

  const taskMatching = await prisma.task.create({
    data: {
      projectId: project.id,
      columnId: colInProgress.id,
      title: 'Build ride-matching algorithm',
      description: 'Match riders within a 2km radius and ±15 minute departure window.',
      priority: TaskPriority.URGENT,
      position: 0,
      assigneeId: studentLee.id,
      createdById: studentPriya.id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.task.create({
    data: {
      projectId: project.id,
      columnId: colBacklog.id,
      title: 'Design onboarding flow',
      description: 'Wireframe the sign-up and profile-setup screens.',
      priority: TaskPriority.MEDIUM,
      position: 0,
      createdById: studentPriya.id,
    },
  });

  await prisma.taskComment.create({
    data: {
      taskId: taskMatching.id,
      authorId: mentorAda.id,
      content: 'Consider indexing on (lat, lng) with PostGIS if this needs to scale past a few thousand users.',
    },
  });
  await prisma.taskComment.create({
    data: {
      taskId: taskMatching.id,
      authorId: studentLee.id,
      content: 'Good call — starting with a simple bounding-box query for the MVP and will revisit.',
    },
  });

  // ------------------------------------------------
  // ACTIVITY TIMELINE
  // ------------------------------------------------
  await prisma.activityLog.createMany({
    data: [
      { projectId: project.id, actorId: studentPriya.id, action: ActivityAction.PROJECT_CREATED, entityType: 'Project', entityId: project.id },
      { projectId: project.id, actorId: studentLee.id, action: ActivityAction.MEMBER_JOINED, entityType: 'ProjectMember', entityId: leeMembership.id },
      { projectId: project.id, actorId: studentPriya.id, action: ActivityAction.TASK_CREATED, entityType: 'Task', entityId: taskSchema.id },
      { projectId: project.id, actorId: studentPriya.id, action: ActivityAction.TASK_COMPLETED, entityType: 'Task', entityId: taskSchema.id },
      { projectId: project.id, actorId: studentPriya.id, action: ActivityAction.TASK_ASSIGNED, entityType: 'Task', entityId: taskMatching.id, metadata: { assigneeId: studentLee.id } },
    ],
  });

  // ------------------------------------------------
  // CHAT
  // ------------------------------------------------
  const channel = await prisma.chatChannel.upsert({
    where: { projectId: project.id },
    update: {},
    create: { projectId: project.id, name: 'campus-carpool-general' },
  });

  await Promise.all(
    [studentPriya.id, studentLee.id, mentorAda.id].map((userId) =>
      prisma.chatChannelMember.upsert({
        where: { channelId_userId: { channelId: channel.id, userId } },
        update: {},
        create: { channelId: channel.id, userId },
      }),
    ),
  );

  await prisma.chatMessage.create({
    data: { channelId: channel.id, senderId: studentPriya.id, content: 'Welcome to the workspace! Kicking off with the DB schema this week.' },
  });
  await prisma.chatMessage.create({
    data: { channelId: channel.id, senderId: studentLee.id, content: 'On it — starting the matching algorithm today.' },
  });
  await prisma.chatMessage.create({
    data: { channelId: channel.id, senderId: mentorAda.id, content: 'Happy to review the schema before you start building on top of it.' },
  });

  // ------------------------------------------------
  // NOTIFICATIONS
  // ------------------------------------------------
  await prisma.notification.createMany({
    data: [
      {
        userId: studentPriya.id,
        type: NotificationType.JOIN_REQUEST,
        title: 'New join request',
        message: 'Omar Haddad requested to join Campus Carpool.',
        entityType: 'Project',
        entityId: project.id,
      },
      {
        userId: studentLee.id,
        type: NotificationType.TASK_ASSIGNED,
        title: 'Task assigned to you',
        message: 'You were assigned "Build ride-matching algorithm".',
        entityType: 'Task',
        entityId: taskMatching.id,
        isRead: true,
        readAt: new Date(),
      },
      {
        userId: mentorAda.id,
        type: NotificationType.MENTORSHIP_REQUEST,
        title: 'Mentorship request accepted',
        message: 'You are now mentoring Priya Sharma on Campus Carpool.',
        entityType: 'Project',
        entityId: project.id,
      },
    ],
  });

  // ------------------------------------------------
  // AI ASSISTANT
  // ------------------------------------------------
  const aiConversation = await prisma.aIConversation.create({
    data: {
      userId: studentPriya.id,
      projectId: project.id,
      title: 'Choosing a geo-matching strategy',
    },
  });
  await prisma.aIMessage.createMany({
    data: [
      { conversationId: aiConversation.id, role: AIRole.USER, content: 'What is the simplest way to match riders by location for an MVP?' },
      { conversationId: aiConversation.id, role: AIRole.ASSISTANT, content: 'Start with a bounding-box filter in SQL, then refine with the Haversine formula for accurate distance once you have real usage data.', tokensUsed: 42 },
    ],
  });

  console.log('✅ Seed complete.');
  console.log({
    users: 6,
    projects: 1,
    skills: skills.length,
  });
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
