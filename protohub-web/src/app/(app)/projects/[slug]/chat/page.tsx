'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { useProject } from '@/hooks/use-projects';
import { useChatHistory, useChatSocket } from '@/hooks/use-chat';
import { useAuth } from '@/lib/auth-context';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { ChatMessage } from '@/lib/types';

export default function ChatPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project } = useProject(slug);
  const { data: history } = useChatHistory(project?.id);
  const { liveMessages, isConnected, sendMessage, markRead } = useChatSocket(project?.id);
  const { user } = useAuth();
  const [draft, setDraft] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const messages: ChatMessage[] = [...(history?.messages ?? []).slice().reverse(), ...liveMessages];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    markRead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length]);

  if (!project) return null;

  const submit = () => {
    if (!draft.trim()) return;
    sendMessage(draft.trim());
    setDraft('');
  };

  return (
    <div className="flex h-[600px] flex-col rounded-xl border border-white/5 bg-surface/50 backdrop-blur-md shadow-glow overflow-hidden animate-fade-in">
      <div className="flex items-center justify-between border-b border-white/5 px-6 py-4 glass-panel shrink-0">
        <span className="text-sm font-bold text-ink flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-ink-muted'} transition-all`} />
          Workspace chat
        </span>
        <span className={`text-[12px] font-medium ${isConnected ? 'text-success' : 'text-ink-faint'}`}>
          {isConnected ? 'Connected' : 'Connecting…'}
        </span>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        {messages.map((m, i) => {
          const isMe = m.sender?.id === user?.id;
          const showAvatar = i === 0 || messages[i - 1].sender?.id !== m.sender?.id;
          
          return (
            <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} gap-3 group`}>
              {!isMe && (
                <div className="w-8 flex-shrink-0 flex flex-col items-center">
                  {showAvatar ? <Avatar name={m.sender?.name ?? 'Removed user'} src={m.sender?.avatarUrl} size={32} /> : <div className="w-8" />}
                </div>
              )}
              <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
                {!isMe && showAvatar && <span className="text-[11px] font-medium text-ink-muted mb-1 ml-1">{m.sender?.name ?? 'Removed user'}</span>}
                <div
                  className={`rounded-2xl px-4 py-2.5 shadow-sm ${
                    isMe 
                      ? 'bg-gradient-to-br from-accent to-info text-white rounded-tr-sm' 
                      : 'glass-card text-ink rounded-tl-sm'
                  }`}
                >
                  <p className="text-[14px] leading-relaxed break-words">{m.content}</p>
                </div>
                <span className="text-[10px] text-ink-faint mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {formatDistanceToNow(new Date(m.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          );
        })}
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-ink-muted">
             <span className="bg-surface px-4 py-1 rounded-full text-xs font-medium mb-2 border border-white/5">Say hello!</span>
             <p className="text-[13px]">Start collaborating with your team.</p>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-center gap-3 border-t border-white/5 p-4 glass-panel shrink-0">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder={user ? `Message as ${user.name.split(' ')[0]}…` : 'Message…'}
          className="flex-1 bg-surface-raised border-white/10 focus:border-accent/50 rounded-full px-5 h-12"
        />
        <Button
          onClick={submit}
          disabled={!draft.trim()}
          className="h-12 w-12 rounded-full p-0 flex items-center justify-center shadow-glow transition-all active:scale-95 disabled:shadow-none"
          aria-label="Send"
        >
          <Send size={18} className="ml-1" />
        </Button>
      </div>
    </div>
  );
}
