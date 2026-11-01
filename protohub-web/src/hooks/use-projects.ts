import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { Paginated, ProjectMember, ProjectSummary, JoinRequest } from '@/lib/types';

export interface ProjectQuery {
  search?: string;
  status?: string;
  visibility?: string;
  skillId?: string;
  page?: number;
  limit?: number;
}

function toQueryString(query: Record<string, unknown>) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== '') params.set(key, String(value));
  });
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export function useProjects(query: ProjectQuery) {
  return useQuery({
    queryKey: ['projects', query],
    queryFn: () => api.get<Paginated<ProjectSummary>>(`/projects${toQueryString({ ...query })}`),
  });
}

export function useMyProjects() {
  return useQuery({
    queryKey: ['my-projects'],
    queryFn: () => api.get<Paginated<ProjectSummary>>('/projects/me'),
  });
}

export function useProject(slugOrId: string | undefined) {
  return useQuery({
    queryKey: ['project', slugOrId],
    queryFn: () => api.get<ProjectSummary>(`/projects/${slugOrId}`),
    enabled: !!slugOrId,
  });
}

export function useProjectAttachments(projectId: string | undefined) {
  return useQuery({
    queryKey: ['project-attachments', projectId],
    queryFn: () => api.get<any[]>(`/projects/${projectId}/attachments`),
    enabled: !!projectId,
  });
}

export function useProjectActivity(projectId: string | undefined) {
  return useQuery({
    queryKey: ['project-activity', projectId],
    queryFn: () => api.get<any[]>(`/projects/${projectId}/activity`),
    enabled: !!projectId,
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { title: string; summary?: string; description: string; visibility?: string }) =>
      api.post<ProjectSummary>('/projects', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });
}

export function useProjectMembers(projectId: string | undefined) {
  return useQuery({
    queryKey: ['project-members', projectId],
    queryFn: () => api.get<ProjectMember[]>(`/projects/${projectId}/members`),
    enabled: !!projectId,
  });
}

export function useJoinRequests(projectId: string | undefined) {
  return useQuery({
    queryKey: ['join-requests', projectId],
    queryFn: () => api.get<JoinRequest[]>(`/projects/${projectId}/join-requests`),
    enabled: !!projectId,
  });
}

export function useRequestToJoin(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (message?: string) => api.post(`/projects/${projectId}/join-requests`, { message }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['project-members', projectId] }),
  });
}

export function useReviewJoinRequest(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, status }: { requestId: string; status: 'ACCEPTED' | 'REJECTED' }) =>
      api.patch(`/projects/${projectId}/join-requests/${requestId}`, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['join-requests', projectId] });
      qc.invalidateQueries({ queryKey: ['project-members', projectId] });
    },
  });
}
