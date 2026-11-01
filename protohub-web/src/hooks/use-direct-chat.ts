import { useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, API_URL } from '@/lib/api-client';
import { tokenStorage } from '@/lib/token-storage';
import type { ChatMessage, PublicUser as User } from '@/lib/types';

const SOCKET_URL = API_URL.replace(/\/api\/v1\/?$/, '');

export interface DirectChannel {
  id: string;
  type: 'DIRECT';
  members: {
    user: Pick<User, 'id' | 'name' | 'avatarUrl' | 'headline' | 'isAvailable'>;
  }[];
  messages: ChatMessage[];
}

export function useDirectChannels() {
  return useQuery({
    queryKey: ['direct-channels'],
    queryFn: () => api.get<DirectChannel[]>('/chat/direct'),
  });
}

export function useDirectMessages(channelId: string | undefined) {
  return useQuery({
    queryKey: ['direct-messages', channelId],
    queryFn: () => api.get<{ messages: ChatMessage[]; hasMore: boolean }>(`/chat/direct/${channelId}/messages`),
    enabled: !!channelId,
  });
}

export function useStartDirectMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (targetUserId: string) => api.post<DirectChannel>(`/chat/direct/${targetUserId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['direct-channels'] }),
  });
}

export function useDirectChatSocket(channelId: string | undefined) {
  const [liveMessages, setLiveMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!channelId) return;
    const token = tokenStorage.getAccessToken();
    if (!token) return;

    const socket = io(SOCKET_URL, { auth: { token } });
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('join_channel', { channelId });
    });
    socket.on('disconnect', () => setIsConnected(false));
    socket.on('new_message', (message: ChatMessage) => {
      setLiveMessages((prev) => [...prev, message]);
    });
    socket.on('error', (err: { message: string }) => {
      console.warn('Chat socket error:', err.message);
    });

    return () => {
      socket.emit('leave_channel', { channelId });
      socket.disconnect();
      setLiveMessages([]);
    };
  }, [channelId]);

  const sendMessage = (content: string) => {
    if (socketRef.current?.connected && channelId) {
      socketRef.current.emit('send_direct_message', { channelId, content });
    } else if (channelId) {
      api.post(`/chat/direct/${channelId}/messages`, { content }).then((message) => {
        setLiveMessages((prev) => [...prev, message as ChatMessage]);
      });
    }
  };

  return { liveMessages, isConnected, sendMessage };
}
