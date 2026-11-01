import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

export enum AIRole {
  USER = 'USER',
  ASSISTANT = 'ASSISTANT',
}

export interface AIMessage {
  id: string;
  conversationId: string;
  role: AIRole;
  content: string;
  createdAt: string;
}

export interface AIConversation {
  id: string;
  userId: string;
  projectId: string | null;
  title: string;
  messages: AIMessage[];
  createdAt: string;
  updatedAt: string;
}

export function useAIConversations() {
  return useQuery({
    queryKey: ['ai-conversations'],
    queryFn: () => api.get<AIConversation[]>('/ai/conversations'),
  });
}

export function useAIConversation(id: string | null) {
  return useQuery({
    queryKey: ['ai-conversation', id],
    queryFn: () => api.get<AIConversation>(`/ai/conversations/${id}`),
    enabled: !!id,
  });
}

export function useSendAIMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { conversationId?: string; projectId?: string; content: string }) =>
      api.post<{ conversationId: string; message: AIMessage }>('/ai/conversations/messages', data),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['ai-conversations'] });
      qc.invalidateQueries({ queryKey: ['ai-conversation', data.conversationId] });
    },
  });
}

export function useDeleteAIConversation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<{ success: boolean }>(`/ai/conversations/${id}`),
    onSuccess: (_, deletedId) => {
      qc.invalidateQueries({ queryKey: ['ai-conversations'] });
      qc.removeQueries({ queryKey: ['ai-conversation', deletedId] });
    },
  });
}
