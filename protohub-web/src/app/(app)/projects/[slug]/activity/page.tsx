'use client';

import { useParams } from 'next/navigation';
import { useProject, useProjectActivity } from '@/hooks/use-projects';
import { Avatar } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Activity } from 'lucide-react';

export default function ProjectActivityPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project } = useProject(slug);
  const { data: activities, isLoading } = useProjectActivity(project?.id);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-accent" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-ink">Activity Log</h2>
          <p className="text-sm text-ink-muted">A timeline of everything happening in this workspace</p>
        </div>
      </div>

      {activities?.length === 0 ? (
        <div className="rounded-2xl border border-white/5 border-dashed bg-surface-raised p-16 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-surface border border-white/5 flex items-center justify-center mb-4">
            <Activity className="h-8 w-8 text-info opacity-80" />
          </div>
          <h3 className="text-base font-semibold text-ink">No activity yet</h3>
          <p className="mt-2 text-sm text-ink-muted max-w-sm">
            When team members update tasks, join the project, or upload files, the activity will appear here.
          </p>
        </div>
      ) : (
        <div className="relative border-l-2 border-white/10 ml-4 space-y-8 py-4 before:absolute before:inset-y-0 before:-left-[2px] before:w-[2px] before:bg-gradient-to-b before:from-accent/50 before:to-transparent">
          {activities?.map((activity) => (
            <div key={activity.id} className="relative pl-8 group">
              {/* Timeline Dot */}
              <div className="absolute -left-[20px] top-1.5 h-10 w-10 rounded-full bg-bg border-4 border-bg flex items-center justify-center shadow-[0_0_10px_rgba(139,92,246,0.3)] z-10 transition-transform group-hover:scale-110">
                <Avatar name={activity.actor.name} src={activity.actor.avatarUrl} size={32} />
              </div>

              <div className="glass-card rounded-xl p-5 border border-white/5 transition-all group-hover:border-white/10 group-hover:shadow-glow">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-[14px] text-ink leading-relaxed">
                    <span className="font-bold text-white">{activity.actor.name}</span> {formatActivityAction(activity.action)}
                  </p>
                  <span className="text-[11px] font-medium text-ink-muted uppercase tracking-wider whitespace-nowrap mt-1">
                    {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                  </span>
                </div>
                
                {activity.details && (
                  <div className="mt-3 bg-black/20 p-4 rounded-lg border border-white/5 text-sm text-ink-muted leading-relaxed">
                    {formatActivityDetails(activity.details)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Basic formatting helpers for the activity log based on standard actions
function formatActivityAction(action: string) {
  const formatting: Record<string, string> = {
    PROJECT_CREATED: 'created the project.',
    PROJECT_UPDATED: 'updated the project details.',
    MEMBER_JOINED: 'joined the project.',
    MEMBER_LEFT: 'left the project.',
    TASK_CREATED: 'created a new task.',
    TASK_MOVED: 'moved a task.',
    TASK_COMPLETED: 'completed a task.',
    FILE_UPLOADED: 'uploaded a file.',
  };
  return formatting[action] || `performed action: ${action}`;
}

function formatActivityDetails(details: any) {
  if (typeof details === 'string') return details;
  if (details?.title) return details.title;
  if (details?.filename) return details.filename;
  return JSON.stringify(details);
}
