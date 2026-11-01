import { useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, API_URL } from '@/lib/api-client';
import { tokenStorage } from '@/lib/token-storage';
import type { ChatMessage } from '@/lib/types';

const SOCKET_URL = API_URL.replace(/\/api\/v1\/?$/, '');

export function useChatHistory(projectId: string | undefined) {
  return useQuery({
    queryKey: ['messages', projectId],
    queryFn: () => api.get<{ messages: ChatMessage[]; hasMore: boolean }>(`/projects/${projectId}/messages`),
    enabled: !!projectId,
  });
}

/**
 * Owns the socket connection for one project's chat. Sending goes over the
 * socket for real-time fan-out to other members; if the socket isn't
 * connected yet, it falls back to the REST endpoint — same ChatService
 * method on the backend either way, so behavior never diverges.
 */
export function useChatSocket(projectId: string | undefined) {
  const [liveMessages, setLiveMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!projectId) return;
    const token = tokenStorage.getAccessToken();
    if (!token) return;

    const socket = io(SOCKET_URL, { auth: { token } });
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('join_project', { projectId });
    });
    socket.on('disconnect', () => setIsConnected(false));
    socket.on('new_message', (message: ChatMessage) => {
      setLiveMessages((prev) => [...prev, message]);
    });
    socket.on('error', (err: { message: string }) => {
      // eslint-disable-next-line no-console
      console.warn('Chat socket error:', err.message);
    });

    return () => {
      socket.emit('leave_project', { projectId });
      socket.disconnect();
    };
  }, [projectId]);

  const sendMessage = (content: string) => {
    if (socketRef.current?.connected && projectId) {
      socketRef.current.emit('send_message', { projectId, content });
    } else if (projectId) {
      api.post(`/projects/${projectId}/messages`, { content }).then((message) => {
        setLiveMessages((prev) => [...prev, message as ChatMessage]);
      });
    }
  };

  const markRead = () => {
    if (projectId) api.post(`/projects/${projectId}/messages/read`).catch(() => {});
  };

  return { liveMessages, isConnected, sendMessage, markRead };
}

export function useDeleteMessage(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (messageId: string) => api.delete(`/projects/${projectId}/messages/${messageId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['messages', projectId] }),
  });
}
