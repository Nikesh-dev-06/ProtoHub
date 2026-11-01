'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useDirectChannels, useDirectMessages, useDirectChatSocket, useStartDirectMessage, DirectChannel } from '@/hooks/use-direct-chat';
import { useMyConnections } from '@/hooks/use-users';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Plus, Search, X, Check, Mail, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function MessagesPage() {
  const { user } = useAuth();
  const { data: channels, isLoading: channelsLoading } = useDirectChannels();
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);

  // Filter channels based on search query
  const filteredChannels = useMemo(() => {
    if (!channels) return [];
    if (!searchQuery.trim()) return channels;
    const lowerQuery = searchQuery.toLowerCase();
    return channels.filter(channel => {
      const otherMember = channel.members.find(m => m.user.id !== user?.id)?.user;
      return otherMember?.name.toLowerCase().includes(lowerQuery) || 
             otherMember?.headline?.toLowerCase().includes(lowerQuery);
    });
  }, [channels, searchQuery, user?.id]);

  const activeChannel = channels?.find(c => c.id === activeChannelId);
  const activeOtherMember = activeChannel?.members.find(m => m.user.id !== user?.id)?.user;

  return (
    <div className="flex h-[calc(100vh-64px)] relative">
      {/* Sidebar: Conversations */}
      <div className="w-80 border-r border-white/5 glass-panel flex flex-col shrink-0">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="font-semibold text-ink">Messages</h2>
          <Button variant="ghost" size="sm" onClick={() => setIsNewMessageModalOpen(true)} className="h-8 w-8 p-0 rounded-full">
            <Plus size={18} className="text-accent" />
          </Button>
        </div>
        <div className="p-3 border-b border-white/5">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <Input 
              placeholder="Search messages..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9 text-xs"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {channelsLoading ? (
            <div className="space-y-2 p-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-full bg-surface-raised" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-surface-raised rounded w-24" />
                    <div className="h-2 bg-surface-raised rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredChannels.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center p-4">
              <Mail className="text-ink-muted mb-2 opacity-50" size={24} />
              <p className="text-sm text-ink-muted">No conversations found.</p>
              {searchQuery ? (
                <button onClick={() => setSearchQuery('')} className="text-xs text-accent mt-2">Clear search</button>
              ) : (
                <button onClick={() => setIsNewMessageModalOpen(true)} className="text-xs text-accent mt-2">Start one now</button>
              )}
            </div>
          ) : (
            filteredChannels.map((channel) => {
              const otherMember = channel.members.find((m) => m.user.id !== user?.id)?.user;
              if (!otherMember) return null;
              
              return (
                <button
                  key={channel.id}
                  onClick={() => setActiveChannelId(channel.id)}
                  className={`w-full flex items-center gap-3 p-3 text-left rounded-lg transition-all duration-200 ${
                    activeChannelId === channel.id ? 'bg-surface-raised shadow-sm border border-white/5' : 'hover:bg-surface-hover border border-transparent'
                  }`}
                >
                  <Avatar name={otherMember.name} src={otherMember.avatarUrl} size={40} className={activeChannelId === channel.id ? 'ring-2 ring-accent/20' : ''} />
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-ink truncate">{otherMember.name}</span>
                    </div>
                    <p className="text-[12px] text-ink-muted truncate mt-0.5">
                      {channel.messages[0]?.content || 'Start a conversation'}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-bg/50">
        {activeChannelId ? (
          <ChatWindow channelId={activeChannelId} otherMemberName={activeOtherMember?.name} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-ink-muted">
            <div className="w-16 h-16 rounded-full bg-surface border border-white/5 flex items-center justify-center mb-4">
              <Mail className="text-accent opacity-80" size={32} />
            </div>
            <h3 className="text-lg font-bold text-ink mb-2">Your Messages</h3>
            <p className="text-sm max-w-xs text-center">Select a conversation from the sidebar or start a new one to collaborate.</p>
            <Button onClick={() => setIsNewMessageModalOpen(true)} className="mt-6">
              <Plus size={16} />
              New Message
            </Button>
          </div>
        )}
      </div>

      {/* 3rd Column: Conversation Details (Desktop Only) */}
      {activeChannelId && activeOtherMember && (
        <div className="hidden lg:flex w-72 border-l border-white/5 glass-panel flex-col shrink-0 animate-fade-in">
          <div className="p-4 border-b border-white/5">
            <h2 className="font-semibold text-ink">Details</h2>
          </div>
          <div className="p-6 flex flex-col items-center text-center border-b border-white/5">
            <Avatar name={activeOtherMember.name} src={activeOtherMember.avatarUrl} size={80} className="mb-4 shadow-raised" />
            <h3 className="text-lg font-bold text-ink">{activeOtherMember.name}</h3>
            <p className="text-[13px] text-accent font-medium mt-1">{activeOtherMember.headline || 'Member'}</p>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-2">Status</h4>
              <div className="flex items-center gap-2 text-sm text-ink">
                <span className={`w-2 h-2 rounded-full ${activeOtherMember.isAvailable ? 'bg-success' : 'bg-ink-muted'}`}></span>
                {activeOtherMember.isAvailable ? 'Available for collaboration' : 'Busy'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Message Modal */}
      {isNewMessageModalOpen && (
        <NewMessageModal 
          onClose={() => setIsNewMessageModalOpen(false)} 
          onChannelCreated={(id) => {
            setActiveChannelId(id);
            setIsNewMessageModalOpen(false);
          }}
          existingChannels={channels}
        />
      )}
    </div>
  );
}

function NewMessageModal({ onClose, onChannelCreated, existingChannels }: { onClose: () => void; onChannelCreated: (id: string) => void, existingChannels?: DirectChannel[] }) {
  const { user } = useAuth();
  const { data: connections, isLoading } = useMyConnections();
  const { mutate: startChat, isPending } = useStartDirectMessage();
  const [filter, setFilter] = useState('');

  const filteredConnections = useMemo(() => {
    if (!connections) return [];
    return connections.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()));
  }, [connections, filter]);

  const handleSelectUser = (targetUserId: string) => {
    // Check if channel already exists
    const existingChannel = existingChannels?.find(c => c.members.some(m => m.user.id === targetUserId));
    if (existingChannel) {
      onChannelCreated(existingChannel.id);
      return;
    }

    // Start new chat
    startChat(targetUserId, {
      onSuccess: (channel) => onChannelCreated(channel.id)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-surface-raised border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <h2 className="font-bold text-ink">New Message</h2>
          <button onClick={onClose} className="p-1 text-ink-muted hover:text-ink hover:bg-white/5 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 border-b border-white/5">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <Input 
              placeholder="Search connections..." 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-9 bg-bg/50"
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {isLoading ? (
            <div className="flex justify-center p-8"><span className="text-sm text-ink-muted">Loading connections...</span></div>
          ) : connections?.length === 0 ? (
            <div className="flex justify-center p-8"><span className="text-sm text-ink-muted">You have no connections yet.</span></div>
          ) : filteredConnections.length === 0 ? (
            <div className="flex justify-center p-8"><span className="text-sm text-ink-muted">No matching connections.</span></div>
          ) : (
            <div className="space-y-1">
              {filteredConnections.map(conn => (
                <button 
                  key={conn.id}
                  onClick={() => handleSelectUser(conn.id)}
                  disabled={isPending}
                  className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-colors text-left"
                >
                  <Avatar name={conn.name} src={conn.avatarUrl} size={40} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-ink">{conn.name}</p>
                    <p className="text-xs text-ink-muted truncate">{conn.headline || 'Member'}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ChatWindow({ channelId, otherMemberName }: { channelId: string, otherMemberName?: string }) {
  const { user } = useAuth();
  const { data: initialData, isLoading } = useDirectMessages(channelId);
  const { liveMessages, sendMessage } = useDirectChatSocket(channelId);
  const [inputValue, setInputValue] = useState('');

  const allMessages = [...(initialData?.messages || []).reverse(), ...liveMessages];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    sendMessage(inputValue.trim());
    setInputValue('');
  };

  return (
    <div className="flex-1 flex flex-col h-full animate-fade-in">
      <div className="p-4 border-b border-white/5 glass-panel shrink-0 flex items-center gap-3 lg:hidden">
         {/* Mobile Header (Hidden on Desktop since 3rd column handles details) */}
         <h2 className="font-bold text-ink">{otherMemberName}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-ink-muted">Loading messages...</div>
        ) : allMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-ink-muted flex-col">
            <span className="bg-surface px-4 py-1 rounded-full text-xs font-medium mb-2 border border-white/5">Say hello!</span>
            <p className="text-[13px]">This is the beginning of your direct message history.</p>
          </div>
        ) : (
          allMessages.map((msg, i) => {
            const isMe = msg.sender?.id === user?.id;
            const showAvatar = i === 0 || allMessages[i - 1].sender?.id !== msg.sender?.id;

            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} gap-3 group`}>
                {!isMe && (
                  <div className="w-8 flex-shrink-0 flex flex-col items-center">
                    {showAvatar ? <Avatar name={msg.sender?.name || ''} src={msg.sender?.avatarUrl} size={32} /> : <div className="w-8" />}
                  </div>
                )}
                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
                  <div
                    className={`rounded-2xl px-4 py-2.5 shadow-sm ${
                      isMe 
                        ? 'bg-gradient-to-br from-accent to-info text-white rounded-tr-sm' 
                        : 'glass-card text-ink rounded-tl-sm'
                    }`}
                  >
                    <p className="text-[14px] leading-relaxed break-words">{msg.content}</p>
                  </div>
                  {/* Subtle timestamp on hover */}
                  <span className="text-[10px] text-ink-faint mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
      <div className="p-4 border-t border-white/5 glass-panel shrink-0">
        <form onSubmit={handleSend} className="flex items-center gap-3">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Write a message..."
            className="flex-1 bg-surface-raised border-white/10 focus:border-accent/50 rounded-full px-5 h-12"
          />
          <Button
            type="submit"
            disabled={!inputValue.trim()}
            className="h-12 w-12 rounded-full p-0 flex items-center justify-center shadow-glow transition-all active:scale-95 disabled:shadow-none"
          >
            <Send size={18} className="ml-1" />
          </Button>
        </form>
      </div>
    </div>
  );
}
