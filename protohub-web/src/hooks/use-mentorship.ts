import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

export function useCreateMentorshipRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { mentorId: string; message: string }) => api.post('/mentorship-requests', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mentorship-requests', 'sent'] });
      qc.invalidateQueries({ queryKey: ['mentors'] });
    },
  });
}

export function useSentMentorshipRequests() {
  return useQuery({
    queryKey: ['mentorship-requests', 'sent'],
    queryFn: () => api.get<any[]>('/mentorship-requests/sent'),
  });
}

export function useReceivedMentorshipRequests() {
  return useQuery({
    queryKey: ['mentorship-requests', 'received'],
    queryFn: () => api.get<any[]>('/mentorship-requests/received'),
  });
}

export function useRespondMentorshipRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'ACCEPTED' | 'REJECTED' }) =>
      api.patch(`/mentorship-requests/${id}`, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mentorship-requests'] });
      qc.invalidateQueries({ queryKey: ['my-connections'] });
    },
  });
}
