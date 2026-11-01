import { useState, useEffect, useRef } from 'react';
import { useAIConversation, useSendAIMessage, AIRole } from '@/hooks/use-ai';
import { Input } from '@/components/ui/input';
import { Send, Bot, User as UserIcon, WifiOff } from 'lucide-react';
import { useAIFeatureAvailability } from '@/lib/ai-maintenance-context';
import { AI_FEATURES_ENABLED } from '@/lib/ai-features';

export function AIChatWindow({ 
  conversationId, 
  projectId, 
  onConversationCreated 
}: { 
  conversationId: string | null, 
  projectId?: string,
  onConversationCreated?: (id: string) => void 
}) {
  const { data: conversation, isLoading } = useAIConversation(conversationId);
  const { mutate: sendMessage, isPending, variables } = useSendAIMessage();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { guardAIAction } = useAIFeatureAvailability();

  const messages = conversation?.messages || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isPending]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    // Guard: block submission and show modal when AI is disabled
    if (!guardAIAction()) return;
    if (!inputValue.trim() || isPending) return;
    
    const content = inputValue.trim();
    setInputValue('');

    sendMessage(
      { conversationId: conversationId || undefined, projectId, content },
      {
        onSuccess: (res) => {
          if (!conversationId && onConversationCreated) {
            onConversationCreated(res.conversationId);
          }
        }
      }
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* AI Temporarily Unavailable banner */}
      {!AI_FEATURES_ENABLED && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[#F59E0B]/8 border-b border-[#F59E0B]/15 flex-shrink-0">
          <WifiOff size={13} className="text-[#F59E0B] flex-shrink-0" />
          <p className="text-[12px] text-[#F59E0B]/80 font-medium">
            AI Temporarily Unavailable — Integration in Progress
          </p>
        </div>
      )}

      {isLoading && conversationId ? (
        <div className="flex-1 flex items-center justify-center text-ink-muted">
          Loading messages...
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-ink-muted space-y-4">
              <Bot size={48} className="text-ink-muted opacity-50" />
              {AI_FEATURES_ENABLED ? (
                <p>How can I help you today?</p>
              ) : (
                <div className="text-center space-y-2 max-w-sm">
                  <p className="text-[14px] text-ink-muted">AI Assistant is temporarily unavailable</p>
                  <p className="text-[12px] text-ink-faint">
                    AI services are being integrated and validated. Try again after the integration is complete.
                  </p>
                </div>
              )}
            </div>
          ) : (
            messages.map((msg) => {
              const isUser = msg.role === AIRole.USER;

              return (
                <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-4`}>
                  {!isUser && (
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white flex-shrink-0">
                      <Bot size={16} />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      isUser ? 'bg-surface-raised border border-border text-ink' : 'bg-transparent text-ink'
                    }`}
                  >
                    <p className="text-[14.5px] whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </div>
                  {isUser && (
                    <div className="w-8 h-8 rounded-full bg-surface-raised border border-border flex items-center justify-center text-ink flex-shrink-0">
                      <UserIcon size={16} />
                    </div>
                  )}
                </div>
              );
            })
          )}
          {isPending && variables?.content && (
            <div className="flex justify-end gap-4 animate-in fade-in">
              <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-surface-raised border border-border text-ink opacity-70">
                <p className="text-[14.5px] whitespace-pre-wrap leading-relaxed">{variables.content}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-surface-raised border border-border flex items-center justify-center text-ink flex-shrink-0">
                <UserIcon size={16} />
              </div>
            </div>
          )}
          {isPending && (
            <div className="flex justify-start gap-4">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white flex-shrink-0">
                <Bot size={16} />
              </div>
              <div className="px-4 py-3 text-ink-muted flex items-center">
                <span className="animate-pulse">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      <div className="p-4 border-t border-border bg-surface flex-shrink-0">
        <form onSubmit={handleSend} className="flex items-center gap-2 max-w-4xl mx-auto">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={AI_FEATURES_ENABLED ? "Ask the AI Assistant..." : "AI Assistant — Integration in Progress"}
            className="flex-1 py-6 text-[15px]"
            disabled={isPending || !AI_FEATURES_ENABLED}
            title={!AI_FEATURES_ENABLED ? 'AI features are temporarily unavailable' : undefined}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isPending || !AI_FEATURES_ENABLED}
            onClick={!AI_FEATURES_ENABLED ? (e) => { e.preventDefault(); guardAIAction(); } : undefined}
            aria-label={AI_FEATURES_ENABLED ? 'Send message' : 'AI features temporarily unavailable'}
            className="p-4 bg-accent text-white rounded-md disabled:opacity-40 transition-colors hover:bg-accent/90"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
