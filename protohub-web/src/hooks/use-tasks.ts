import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { Paginated, TaskCard } from '@/lib/types';

export interface TaskSummary extends TaskCard {
  project: {
    id: string;
    title: string;
    slug: string;
  };
}

export function useMyTasks() {
  return useQuery({
    queryKey: ['my-tasks'],
    queryFn: () => api.get<Paginated<TaskSummary>>('/users/me/tasks'),
  });
}

export function usePlannerTasks() {
  return useQuery({
    queryKey: ['my-tasks', 'planner'],
    queryFn: () => api.get<Paginated<TaskSummary & { column: { id: string; name: string } }>>('/users/me/tasks/planner'),
  });
}

export function useBoard(projectId: string | undefined) {
  return useQuery({
    queryKey: ['board', projectId],
    queryFn: () => api.get<any[]>(`/projects/${projectId}/board`),
    enabled: !!projectId,
  });
}

export function useCreateTask(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post(`/projects/${projectId}/tasks`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['board', projectId] });
      qc.invalidateQueries({ queryKey: ['my-tasks', 'planner'] });
    },
  });
}

export function useUpdateTask(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, ...data }: any) => api.patch(`/projects/${projectId}/tasks/${taskId}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['board', projectId] });
      qc.invalidateQueries({ queryKey: ['my-tasks', 'planner'] });
    },
  });
}

export function useMoveTask(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, ...data }: any) => api.patch(`/projects/${projectId}/tasks/${taskId}/move`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['board', projectId] });
      qc.invalidateQueries({ queryKey: ['my-tasks', 'planner'] });
    },
  });
}

export function useDeleteTask(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) => api.delete(`/projects/${projectId}/tasks/${taskId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['board', projectId] });
      qc.invalidateQueries({ queryKey: ['my-tasks', 'planner'] });
    },
  });
}

export function useDeleteAnyTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, taskId }: { projectId: string; taskId: string }) => api.delete(`/projects/${projectId}/tasks/${taskId}`),
    onSuccess: (_, { projectId }) => {
      qc.invalidateQueries({ queryKey: ['board', projectId] });
      qc.invalidateQueries({ queryKey: ['my-tasks', 'planner'] });
    },
  });
}

export function useUpdateTaskStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, taskId, statusName }: { projectId: string; taskId: string; statusName: string }) => {
      // Fetch columns for this project
      const columns = await api.get<any[]>(`/projects/${projectId}/board`);
      let targetColumn = columns.find(c => c.name.toLowerCase() === statusName.toLowerCase());
      if (!targetColumn && columns.length > 0) {
        targetColumn = columns[0]; // fallback
      }
      if (!targetColumn) throw new Error('No columns found in project');

      return api.patch(`/projects/${projectId}/tasks/${taskId}/move`, {
        columnId: targetColumn.id,
        position: 0
      });
    },
    onSuccess: (_, { projectId }) => {
      qc.invalidateQueries({ queryKey: ['board', projectId] });
      qc.invalidateQueries({ queryKey: ['my-tasks', 'planner'] });
    },
  });
}
