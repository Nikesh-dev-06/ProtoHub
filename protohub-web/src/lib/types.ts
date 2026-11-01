export type UserRole = 'STUDENT' | 'MENTOR' | 'ADMIN';
export type ProjectStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
export type ProjectVisibility = 'PUBLIC' | 'PRIVATE';
export type ProjectMemberRole = 'OWNER' | 'MAINTAINER' | 'CONTRIBUTOR';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type JoinRequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';

export interface PublicUser {
  id: string;
  email: string;
  name: string;
  headline: string | null;
  bio: string | null;
  avatarUrl: string | null;
  location: string | null;
  education: string | null;
  experience: string | null;
  websiteUrl: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  isAvailable: boolean;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  skills?: { skill: { id: string; name: string } }[];
}

export interface Skill {
  id: string;
  name: string;
  category: string | null;
}

export interface ProjectSkill {
  skill: Skill;
}

export interface ProjectSummary {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  description: string;
  coverImageUrl: string | null;
  status: ProjectStatus;
  visibility: ProjectVisibility;
  createdAt: string;
  owner: { id: string; name: string; avatarUrl: string | null };
  skills: ProjectSkill[];
  _count: { members: number };
}

export interface ProjectMember {
  id: string;
  userId: string;
  role: ProjectMemberRole;
  joinedAt: string;
  user: { id: string; name: string; avatarUrl: string | null; headline: string | null };
}

export interface JoinRequest {
  id: string;
  message: string | null;
  status: JoinRequestStatus;
  createdAt: string;
  requester: { id: string; name: string; avatarUrl: string | null; headline: string | null };
}

export interface Paginated<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export interface TaskCard {
  id: string;
  title: string;
  description: string | null;
  priority: TaskPriority;
  position: number;
  columnId: string;
  dueDate: string | null;
  assignee: { id: string; name: string; avatarUrl: string | null } | null;
  creator: { id: string; name: string; avatarUrl: string | null };
}

export interface TaskColumnWithTasks {
  id: string;
  name: string;
  position: number;
  tasks: TaskCard[];
}

export interface ChatMessage {
  id: string;
  content: string;
  createdAt: string;
  editedAt: string | null;
  sender: { id: string; name: string; avatarUrl: string | null } | null;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  entityType: string | null;
  entityId: string | null;
  isRead: boolean;
  createdAt: string;
}
