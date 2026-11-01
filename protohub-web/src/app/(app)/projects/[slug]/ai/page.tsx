'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useProject } from '@/hooks/use-projects';
import { useAIConversations, useDeleteAIConversation } from '@/hooks/use-ai';
import { AIChatWindow } from '@/components/ai/chat-window';
import { Plus, MoreHorizontal, Trash2, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAIFeatureAvailability } from '@/lib/ai-maintenance-context';
import { AI_FEATURES_ENABLED } from '@/lib/ai-features';

export default function ProjectAIPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project } = useProject(slug);
  const { data: conversations, isLoading: conversationsLoading } = useAIConversations();
  const { mutate: deleteConversation } = useDeleteAIConversation();
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { guardAIAction } = useAIFeatureAvailability();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const projectId = project?.id;
  // Filter conversations that belong to this project
  const projectConversations = conversations?.filter(c => c.projectId === projectId) || [];

  const handleNewProjectChat = () => {
    if (!guardAIAction()) return;
    setActiveConversationId(null);
  };

  if (!projectId) return null;

  return (
    <div className="flex h-[600px] rounded-xl border border-white/5 bg-surface/50 backdrop-blur-md shadow-glow overflow-hidden animate-fade-in">
      {/* Sidebar */}
      <div className="w-72 border-r border-white/5 glass-panel flex flex-col shrink-0">
        <div className="p-4 border-b border-white/5">
          {!AI_FEATURES_ENABLED && (
            <div className="flex items-center gap-1.5 mb-3 px-1">
              <WifiOff size={11} className="text-[#F59E0B] flex-shrink-0" />
              <span className="text-[11px] text-[#F59E0B]/80 font-medium">AI Temporarily Unavailable</span>
            </div>
          )}
          <Button
            onClick={handleNewProjectChat}
            className="w-full"
            size="sm"
            title={!AI_FEATURES_ENABLED ? 'AI features are temporarily unavailable' : undefined}
          >
            <Plus size={16} />
            New Project Chat
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversationsLoading ? (
            <p className="text-sm text-ink-muted p-2">Loading...</p>
          ) : projectConversations.length === 0 ? (
            <p className="text-sm text-ink-muted p-2">No history for this project.</p>
          ) : (
            projectConversations.map((conv) => (
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
      <div className="flex-1 flex flex-col min-w-0 bg-bg/50">
        <AIChatWindow 
          conversationId={activeConversationId} 
          projectId={projectId}
          onConversationCreated={setActiveConversationId} 
        />
      </div>
    </div>
  );
}
