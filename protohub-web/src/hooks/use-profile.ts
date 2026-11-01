import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { PublicUser, Skill } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';

export function useUpdateProfile() {
  const { refreshUser } = useAuth();
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<PublicUser>) => api.patch<PublicUser>('/users/me', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['me'] });
      refreshUser();
    },
  });
}

export function useSkillCatalog() {
  return useQuery({
    queryKey: ['skills-catalog'],
    queryFn: () => api.get<Skill[]>('/skills'),
  });
}

export function useAddSkill() {
  const { refreshUser } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: { skillId?: string; name?: string; proficiency?: string }) => api.post('/users/me/skills', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['me'] });
      refreshUser();
    },
  });
}

export function useRemoveSkill() {
  const { refreshUser } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (skillId: string) => api.delete(`/users/me/skills/${skillId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['me'] });
      refreshUser();
    },
  });
}
