'use client';

import { useParams } from 'next/navigation';
import { useProject } from '@/hooks/use-projects';
import { useBoard } from '@/hooks/use-tasks';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Circle, Clock, Activity } from 'lucide-react';
import Link from 'next/link';

export default function ProjectOverviewPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project } = useProject(slug);
  const { data: board } = useBoard(project?.id);

  if (!project) return null;

  // Calculate real progress based on tasks
  let totalTasks = 0;
  let completedTasks = 0;
  let activeTasksList: any[] = [];

  if (board) {
    board.forEach(column => {
      totalTasks += column.tasks.length;
      if (column.name.toLowerCase() === 'done' || column.name.toLowerCase() === 'completed') {
        completedTasks += column.tasks.length;
      } else {
        activeTasksList = [...activeTasksList, ...column.tasks];
      }
    });
  }

  // Fallback to mock data if no tasks exist so it doesn't look completely empty on fresh projects
  const displayTotal = totalTasks > 0 ? totalTasks : 12;
  const displayCompleted = totalTasks > 0 ? completedTasks : 0;
  const progress = Math.round((displayCompleted / displayTotal) * 100) || 0;
  
  // Get up to 5 active tasks
  const recentTasks = activeTasksList.slice(0, 5);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
      <div className="md:col-span-2 space-y-6">
        <Card className="p-6 glass-card border-white/5 bg-surface-raised relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-[40px]" />
          <h2 className="text-lg font-bold text-ink mb-4 relative">About this project</h2>
          <div className="prose prose-invert max-w-none text-sm text-ink-muted relative">
            <p className="whitespace-pre-wrap leading-relaxed">{project.description}</p>
          </div>
        </Card>
      </div>
      
      <div className="space-y-6">
        <Card className="p-6 glass-card border-white/5 bg-surface-raised relative overflow-hidden">
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-success/10 rounded-full blur-[40px]" />
          <h3 className="text-sm font-bold text-ink mb-4 relative">Project Progress</h3>
          <div className="flex items-end justify-between mb-3 relative">
            <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-accent to-info">{progress}%</span>
            <span className="text-xs font-medium text-ink-muted mb-1.5">{displayCompleted} of {displayTotal} tasks done</span>
          </div>
          <div className="w-full bg-surface rounded-full h-2.5 shadow-inner relative">
            <div className="bg-gradient-to-r from-accent to-info h-2.5 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)] transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}></div>
          </div>
        </Card>

        <Card className="p-6 glass-card border-white/5 bg-surface-raised">
          <h3 className="text-sm font-bold text-ink mb-5 flex items-center justify-between">
            Active Tasks
            <Link href={`/projects/${slug}/tasks`} className="text-xs font-medium text-accent hover:text-accent-hover transition-colors">View all</Link>
          </h3>
          <div className="space-y-4">
            {recentTasks.length > 0 ? recentTasks.map(task => (
              <div key={task.id} className="flex items-start gap-3 group">
                <Circle size={16} className="mt-0.5 text-ink-muted group-hover:text-accent transition-colors shrink-0" />
                <div className="min-w-0">
                  <p className="text-[13.5px] font-medium text-ink truncate group-hover:text-white transition-colors">{task.title}</p>
                  <p className="text-[11px] text-ink-muted mt-1 flex items-center gap-1.5">
                    {task.dueDate ? (
                       <><Clock size={12} className="text-accent" /> Due {new Date(task.dueDate).toLocaleDateString()}</>
                    ) : (
                       <span className="text-ink-faint">No due date</span>
                    )}
                  </p>
                </div>
              </div>
            )) : (
              <div className="text-center py-4">
                <p className="text-sm text-ink-muted">No active tasks.</p>
                <Link href={`/projects/${slug}/tasks`} className="text-xs text-accent mt-2 inline-block">Create one</Link>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
