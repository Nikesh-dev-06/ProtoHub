'use client';

import { useState, useRef, useEffect } from 'react';
import { useAIConversations, useDeleteAIConversation } from '@/hooks/use-ai';
import { AIChatWindow } from '@/components/ai/chat-window';
import { Button } from '@/components/ui/button';
import { Plus, MoreHorizontal, Trash2, WifiOff } from 'lucide-react';
import { useAIFeatureAvailability } from '@/lib/ai-maintenance-context';
import { AI_FEATURES_ENABLED } from '@/lib/ai-features';

export default function GlobalAIPage() {
  const { data: conversations, isLoading: conversationsLoading } = useAIConversations();
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const { mutate: deleteConversation } = useDeleteAIConversation();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { guardAIAction } = useAIFeatureAvailability();

  // Filter out project-specific conversations if any, although the backend might return them.
  const globalConversations = conversations?.filter(c => !c.projectId) || [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNewConversation = () => {
    if (!guardAIAction()) return;
    setActiveConversationId(null);
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <div className="w-80 border-r border-white/5 glass-panel flex flex-col">
        <div className="p-4 border-b border-white/5 flex items-center justify-between gap-2">
          <h2 className="font-semibold text-ink">AI Assistant</h2>
          {!AI_FEATURES_ENABLED && (
            <span className="inline-flex items-center gap-1 rounded-full border border-[#F59E0B]/25 bg-[#F59E0B]/10 px-2 py-0.5 text-[10px] font-medium text-[#F59E0B] flex-shrink-0">
              <WifiOff size={9} />
              In Development
            </span>
          )}
        </div>
        <div className="p-3 border-b border-white/5">
          <Button
            onClick={handleNewConversation}
            className="w-full"
            size="sm"
            title={!AI_FEATURES_ENABLED ? 'AI features are temporarily unavailable' : undefined}
          >
            <Plus size={16} />
            New Conversation
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversationsLoading ? (
            <p className="text-sm text-ink-muted p-2">Loading...</p>
          ) : globalConversations.length === 0 ? (
            <p className="text-sm text-ink-muted p-2">No history.</p>
          ) : (
            globalConversations.map((conv) => (
              <div key={conv.id} className="relative group">
                <button
                  onClick={() => setActiveConversationId(conv.id)}
                  className={`w-full flex items-center gap-3 p-3 pr-10 text-left rounded-md transition-colors ${
                    activeConversationId === conv.id ? 'bg-surface-hover' : 'hover:bg-surface-hover'
                  }`}
                >
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium text-ink truncate">{conv.title}</p>
                  </div>
                </button>
                
                <div className={`absolute right-2 top-1/2 -translate-y-1/2 ${activeConversationId === conv.id || openMenuId === conv.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === conv.id ? null : conv.id);
                    }}
                    className="p-1.5 rounded-md text-ink-muted hover:text-ink hover:bg-surface transition-colors"
                  >
                    <MoreHorizontal size={16} />
                  </button>
                </div>

                {openMenuId === conv.id && (
                  <div ref={menuRef} className="absolute right-2 top-10 z-50 w-36 rounded-md border border-white/10 bg-surface-raised p-1 shadow-glow animate-fade-in">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(conv.id);
                        if (activeConversationId === conv.id) {
                          setActiveConversationId(null);
                        }
                        setOpenMenuId(null);
                      }}
                      className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-danger hover:bg-white/5 transition-colors"
                    >
                      <Trash2 size={14} />
                      <span>Delete chat</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <AIChatWindow 
          conversationId={activeConversationId} 
          onConversationCreated={setActiveConversationId} 
        />
      </div>
    </div>
  );
}
