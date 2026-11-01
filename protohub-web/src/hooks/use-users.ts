import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { PublicUser } from '@/lib/types';

export function useMyConnections() {
  return useQuery({
    queryKey: ['my-connections'],
    queryFn: () => api.get<PublicUser[]>('/users/me/connections'),
  });
}

export function usePeopleSuggestions() {
  return useQuery({
    queryKey: ['people-suggestions'],
    queryFn: () => api.get<PublicUser[]>('/users/suggestions'),
  });
}

export function useFeed() {
  return useQuery({
    queryKey: ['feed'],
    queryFn: () => api.get<any[]>('/users/me/feed'),
  });
}

export function useMentors(query: string = '') {
  return useQuery({
    queryKey: ['mentors', query],
    queryFn: () => api.get<PublicUser[]>(`/users/mentors?q=${encodeURIComponent(query)}`),
  });
}
