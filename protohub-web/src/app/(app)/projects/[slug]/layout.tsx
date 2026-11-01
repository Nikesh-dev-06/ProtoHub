'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { useProject } from '@/hooks/use-projects';
import { Avatar, Badge } from '@/components/ui/avatar';
import { StatusLabel } from '@/components/ui/status-dot';
import { cn } from '@/lib/cn';

import { ArrowLeft, UserPlus, Share, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TABS = [
  { href: '', label: 'Overview' },
  { href: '/tasks', label: 'Tasks' },
  { href: '/chat', label: 'Chat' },
  { href: '/files', label: 'Files' },
  { href: '/activity', label: 'Activity' },
  { href: '/ai', label: 'AI' },
];

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading } = useProject(slug);
  const pathname = usePathname();
  const base = `/projects/${slug}`;

  if (isLoading || !project) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-accent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-6 animate-fade-in">
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-ink mb-6 transition-colors">
        <ArrowLeft size={14} /> Back to Projects
      </Link>
      
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 relative p-6 rounded-xl border border-white/5 bg-gradient-to-br from-surface to-surface-raised shadow-glow">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-ink">{project.title}</h1>
            <StatusLabel status={project.status} />
            <Badge variant="outline" className="text-[10px]">{project.visibility === 'PUBLIC' ? 'Public' : 'Private'}</Badge>
          </div>
          <p className="mt-2 max-w-2xl text-sm text-ink-muted">{project.summary ?? project.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.skills.map((s) => (
              <Badge key={s.skill.id} variant="accent" className="bg-surface border-border text-ink-muted hover:bg-surface hover:text-ink transition-colors">
                {s.skill.name}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-end gap-4 ml-6">
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" className="h-8 px-3 text-xs gap-1.5">
              <Share size={14} /> Share
            </Button>
            <Button variant="secondary" size="sm" className="h-8 px-3 text-xs gap-1.5">
              <Settings size={14} /> Settings
            </Button>
            <Button size="sm" className="h-8 px-3 text-xs gap-1.5">
              <UserPlus size={14} /> Invite
            </Button>
          </div>
          <div className="flex -space-x-2">
            <Avatar name={project.owner.name} src={project.owner.avatarUrl} size={32} className="border-2 border-bg" />
            {/* Additional team avatars would go here */}
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-2 border-b border-white/10">
        {TABS.map((tab) => {
          const href = `${base}${tab.href}`;
          const active = tab.href === '' ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={tab.href}
              href={href}
              className={cn(
                'relative px-5 py-3 text-[13px] font-medium transition-all duration-300 rounded-t-lg',
                active ? 'text-accent bg-surface-raised/50 backdrop-blur-md' : 'text-ink-muted hover:text-ink hover:bg-surface-hover/50',
              )}
            >
              {tab.label}
              {active && <span className="absolute inset-x-0 bottom-0 h-[2px] bg-accent shadow-[0_0_8px_rgba(139,92,246,0.5)]" />}
            </Link>
          );
        })}
      </div>

      <div className="pt-6">{children}</div>
    </div>
  );
}
