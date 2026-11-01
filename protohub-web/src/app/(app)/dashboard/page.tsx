'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, CheckCircle2, Circle, Clock, Users, UserPlus, Compass, Bot, Sparkles, WifiOff } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useMyProjects } from '@/hooks/use-projects';
import { useMyTasks } from '@/hooks/use-tasks';
import { useFeed, useMyConnections, usePeopleSuggestions } from '@/hooks/use-users';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, Badge } from '@/components/ui/avatar';
import { StatusLabel } from '@/components/ui/status-dot';
import { formatDistanceToNow } from 'date-fns';
import { useAIFeatureAvailability } from '@/lib/ai-maintenance-context';
import { AI_FEATURES_ENABLED } from '@/lib/ai-features';

export default function DashboardPage() {
  const [visibleFeedCount, setVisibleFeedCount] = useState(5);
  const { user } = useAuth();
  const { data: myProjects, isLoading: isLoadingProjects } = useMyProjects();
  const { data: myTasks, isLoading: isLoadingTasks } = useMyTasks();
  const { data: feed, isLoading: isLoadingFeed } = useFeed();
  const { data: connections, isLoading: isLoadingConnections } = useMyConnections();
  const { data: suggestions, isLoading: isLoadingSuggestions } = usePeopleSuggestions();
  const { guardAIAction } = useAIFeatureAvailability();
  const router = useRouter();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 animate-fade-in">
      <div className="mb-10 relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface to-surface-raised border border-white/5 p-8 shadow-glow">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/20 rounded-full blur-[80px] animate-pulse-slow"></div>
        <h1 className="text-3xl font-bold text-ink tracking-tight relative z-10">{getGreeting()}, <span className="text-gradient">{user?.name?.split(' ')?.[0]}</span></h1>
        <p className="text-ink-muted mt-2 relative z-10 text-base">Here&apos;s what&apos;s happening with your learning and projects.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">

        {/* Left Sidebar: Profile & Connections */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="overflow-hidden animate-slide-up">
            <div className="h-20 bg-gradient-to-r from-accent to-info opacity-90"></div>
            <div className="px-4 pb-4">
              <div className="-mt-8 mb-2 flex justify-center relative z-10">
                <Avatar name={user?.name || ''} src={user?.avatarUrl} size={64} className="border-4 border-surface bg-surface-raised text-ink" />
              </div>
              <div className="text-center">
                <h2 className="text-base font-bold text-ink">{user?.name}</h2>
                <p className="text-[13px] font-medium text-accent mt-0.5">{user?.role}</p>
                <p className="mt-2 text-xs text-ink-muted line-clamp-2">{user?.headline || 'No headline set.'}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-border flex justify-between text-sm">
                <span className="text-ink-muted">Connections</span>
                <span className="font-semibold text-ink">{connections?.length || 0}</span>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-sm font-semibold text-ink mb-3 flex items-center gap-2">
              <Users size={16} className="text-accent" />
              Your Network
            </h3>
            <div className="space-y-3">
              {isLoadingConnections ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => <div key={i} className="animate-pulse bg-surface h-10 rounded-md"></div>)}
                </div>
              ) : connections?.slice(0, 5).map(c => (
                <Link key={c.id} href={`/network/${c.id}`} className="flex items-center gap-3 group">
                  <Avatar name={c.name} src={c.avatarUrl} size={32} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink truncate group-hover:text-accent transition-colors">{c.name}</p>
                    <p className="text-[11px] text-ink-muted truncate">{c.role}</p>
                  </div>
                </Link>
              ))}
              {!isLoadingConnections && (!connections || connections.length === 0) && (
                <p className="text-[13px] text-ink-muted text-center py-4">No connections yet.</p>
              )}
            </div>
            <div className="mt-4 pt-3 border-t border-border">
              <Link href="/discover" className="text-xs font-medium text-accent hover:underline block text-center">
                View all connections
              </Link>
            </div>
          </Card>
        </div>

        {/* Main Feed: Projects & Activity */}
        <div className="space-y-6 lg:col-span-2">

          {/* Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link href="/projects/new" className="flex flex-col items-center justify-center p-4 rounded-xl border border-white/5 bg-surface-raised/50 hover:border-accent/30 hover:shadow-glow transition-all duration-300 text-center group">
              <div className="h-9 w-9 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-2.5 group-hover:scale-110 transition-transform">
                <Plus size={18} />
              </div>
              <span className="text-xs font-medium text-ink">New Project</span>
            </Link>
            <Link href="/network" className="flex flex-col items-center justify-center p-4 rounded-xl border border-white/5 bg-surface-raised/50 hover:border-accent/30 hover:shadow-glow transition-all duration-300 text-center group">
              <div className="h-9 w-9 rounded-full bg-info/10 flex items-center justify-center text-info mb-2.5 group-hover:scale-110 transition-transform">
                <UserPlus size={18} />
              </div>
              <span className="text-xs font-medium text-ink">Find Mentor</span>
            </Link>
            <Link href="/discover" className="flex flex-col items-center justify-center p-4 rounded-xl border border-white/5 bg-surface-raised/50 hover:border-accent/30 hover:shadow-glow transition-all duration-300 text-center group">
              <div className="h-9 w-9 rounded-full bg-success/10 flex items-center justify-center text-success mb-2.5 group-hover:scale-110 transition-transform">
                <Compass size={18} />
              </div>
              <span className="text-xs font-medium text-ink">Explore Projects</span>
            </Link>
            <button
              onClick={() => { if (AI_FEATURES_ENABLED) { router.push('/ai'); } else { guardAIAction(); } }}
              className="flex flex-col items-center justify-center p-4 rounded-xl border border-white/5 bg-surface-raised/50 hover:border-accent/30 hover:shadow-glow transition-all duration-300 text-center group relative"
              title={!AI_FEATURES_ENABLED ? 'AI features are temporarily unavailable' : 'Ask AI Assistant'}
            >
              <div className="h-9 w-9 rounded-full bg-warning/10 flex items-center justify-center text-warning mb-2.5 group-hover:scale-110 transition-transform">
                <Bot size={18} />
              </div>
              <span className="text-xs font-medium text-ink">Ask AI</span>
              {!AI_FEATURES_ENABLED && (
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
              )}
            </button>
          </div>

          {/* Active Projects */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-muted">
                Active Projects
              </h2>
            </div>
            {isLoadingProjects ? (
              <div className="animate-pulse rounded-xl bg-surface h-32"></div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {myProjects?.data?.map((project) => (
                  <Link key={project.id} href={`/projects/${project.slug}`}>
                    <Card className="p-4 hover:border-accent/30 transition-all flex flex-col h-full">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="font-semibold text-ink line-clamp-1">{project.title}</span>
                        <StatusLabel status={project.status} />
                      </div>
                      <p className="text-[13px] text-ink-muted line-clamp-2 mb-4 flex-1">
                        {project.summary ?? project.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {/* Mock avatars for team */}
                          <div className="h-6 w-6 rounded-full bg-accent border-2 border-surface flex items-center justify-center text-[9px] font-bold text-white">M</div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
                {(!myProjects?.data?.length) && (
                  <Card className="col-span-full p-8 text-center border-dashed">
                    <p className="text-sm text-ink-muted">You aren&apos;t working on any projects yet.</p>
                  </Card>
                )}
              </div>
            )}
          </div>

          {/* Feed List */}
          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink-muted mt-8">
              Recent Activity
            </h2>
            <div className="space-y-3">
              {isLoadingFeed ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => <div key={i} className="animate-pulse bg-surface h-20 rounded-xl"></div>)}
                </div>
              ) : feed?.slice(0, visibleFeedCount).map((log) => (
                <Card key={log.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar name={log.actor?.name || 'System'} src={log.actor?.avatarUrl} size={36} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-ink-muted leading-tight">
                        <span className="font-medium text-ink">{log.actor?.name || 'System'}</span>{' '}
                        {log.action.replace(/_/g, ' ').toLowerCase()} in{' '}
                        <Link href={`/projects/${log.project.slug}`} className="font-medium text-accent hover:underline">
                          {log.project.title}
                        </Link>
                      </p>
                      <span className="text-[11px] text-ink-faint mt-1 block">
                        {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
              {!isLoadingFeed && (!feed || feed.length === 0) && (
                <div className="p-8 text-center rounded-xl border border-dashed border-border">
                  <p className="text-[13px] text-ink-muted">Your feed is quiet. Join projects to see activity.</p>
                </div>
              )}
              {feed && feed.length > visibleFeedCount && (
                <Button 
                  variant="secondary" 
                  className="w-full mt-4" 
                  onClick={() => setVisibleFeedCount(prev => prev + 5)}
                >
                  View More History
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Suggestions & Tasks */}
        <div className="space-y-6 lg:col-span-1">

          {/* People Suggestions */}
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-ink mb-3">
              People you may know
            </h3>
            <div className="space-y-4">
              {isLoadingSuggestions ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => <div key={i} className="animate-pulse bg-surface h-12 rounded-md"></div>)}
                </div>
              ) : suggestions?.map(s => (
                <div key={s.id} className="flex items-center gap-3">
                  <Avatar name={s.name} src={s.avatarUrl} size={36} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink truncate">{s.name}</p>
                    <p className="text-[11px] text-ink-muted truncate">{s.role}</p>
                  </div>
                  <Button size="sm" variant="secondary" className="shrink-0 px-2 h-7 text-[11px]">Connect</Button>
                </div>
              ))}
              {!isLoadingSuggestions && (!suggestions || suggestions.length === 0) && (
                <p className="text-[13px] text-ink-muted text-center">No suggestions available.</p>
              )}
            </div>
          </Card>

          {/* My Tasks */}
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-ink mb-3">
              Upcoming Tasks
            </h3>
            <div className="space-y-2">
              {isLoadingTasks ? (
                <div className="space-y-2">
                  {[1, 2, 3].map(i => <div key={i} className="animate-pulse bg-surface h-10 rounded-md"></div>)}
                </div>
              ) : myTasks?.data?.slice(0, 5).map((task) => (
                <Link key={task.id} href={`/projects/${task.project.slug}/tasks`}>
                  <div className="group flex items-start gap-2 p-2 rounded-lg transition-colors hover:bg-surface-hover -mx-2">
                    <Circle size={14} className="mt-0.5 text-ink-muted group-hover:text-accent flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-ink truncate leading-tight">{task.title}</p>
                      <p className="mt-0.5 text-[11px] text-ink-muted truncate">{task.project.title}</p>
                    </div>
                  </div>
                </Link>
              ))}
              {!isLoadingTasks && (!myTasks?.data?.length) && (
                <div className="text-center py-4">
                  <CheckCircle2 size={24} className="mx-auto text-success/50 mb-2" />
                  <p className="text-[13px] text-ink-muted">No pending tasks.</p>
                </div>
              )}
            </div>
          </Card>

          {/* AI Quick Ask */}
          <Card className="p-4 relative overflow-hidden">
            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-accent/10 rounded-full blur-[40px]" />
            <div className="relative z-10">
              <h3 className="text-sm font-semibold text-ink mb-2 flex items-center gap-2">
                <Sparkles size={16} className="text-accent" />
                ProtoHub AI
                {!AI_FEATURES_ENABLED && (
                  <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-[#F59E0B]/25 bg-[#F59E0B]/10 px-1.5 py-0.5 text-[9px] font-semibold text-[#F59E0B] leading-none">
                    <WifiOff size={7} />
                    In Development
                  </span>
                )}
              </h3>
              <p className="text-[12px] text-ink-muted mb-4">
                {AI_FEATURES_ENABLED ? 'What are you working on today?' : 'AI features are being integrated and validated.'}
              </p>
              <div className="space-y-1.5">
                <button
                  onClick={() => guardAIAction()}
                  className="block w-full text-left text-[12px] text-ink-muted hover:text-accent transition-colors py-1 px-2 rounded hover:bg-surface-hover -mx-2"
                >
                  → Improve my project architecture
                </button>
                <button
                  onClick={() => guardAIAction()}
                  className="block w-full text-left text-[12px] text-ink-muted hover:text-accent transition-colors py-1 px-2 rounded hover:bg-surface-hover -mx-2"
                >
                  → Suggest next tasks
                </button>
                <button
                  onClick={() => guardAIAction()}
                  className="block w-full text-left text-[12px] text-ink-muted hover:text-accent transition-colors py-1 px-2 rounded hover:bg-surface-hover -mx-2"
                >
                  → Explain this error
                </button>
              </div>
              <div className="mt-4">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full text-[12px]"
                  onClick={() => guardAIAction()}
                >
                  <Bot size={14} />
                  Ask AI
                </Button>
              </div>
            </div>
          </Card>

        </div>

      </div>
    </div>
  );
}
