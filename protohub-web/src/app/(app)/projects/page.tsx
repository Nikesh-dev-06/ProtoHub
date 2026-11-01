'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { useProjects } from '@/hooks/use-projects';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, Badge } from '@/components/ui/avatar';
import { StatusLabel } from '@/components/ui/status-dot';

const STATUS_FILTERS = ['ACTIVE', 'DRAFT', 'COMPLETED'] as const;

export default function ProjectsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string | undefined>(undefined);
  const { data, isLoading } = useProjects({ search, status, limit: 24 });

  return (
    <div className="mx-auto max-w-5xl px-8 py-8 animate-fade-in">
      <div className="mb-10 relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface to-surface-raised border border-white/5 p-8 shadow-glow flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-accent/20 rounded-full blur-[80px] animate-pulse-slow"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-ink tracking-tight">Discover <span className="text-gradient">Projects</span></h1>
          <p className="text-ink-muted mt-2 text-base">Find a team building something you&apos;d want to work on.</p>
        </div>
        <Link href="/projects/new">
          <Button>
            <Plus size={14} /> New project
          </Button>
        </Link>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or summary…"
            className="h-9 w-full rounded-md border border-border bg-surface pl-9 pr-3 text-[13px] text-ink placeholder:text-ink-faint outline-none focus:border-accent"
          />
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => setStatus(undefined)}
            className={`rounded-md px-2.5 py-1 text-[12px] font-medium transition-colors ${!status ? 'bg-accent-soft text-accent' : 'text-ink-muted hover:bg-surface-hover'}`}
          >
            All
          </button>
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`rounded-md px-2.5 py-1 text-[12px] font-medium transition-colors ${status === s ? 'bg-accent-soft text-accent' : 'text-ink-muted hover:bg-surface-hover'}`}
            >
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {isLoading && <p className="text-[13px] text-ink-muted">Loading…</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.data.map((project) => (
          <Link key={project.id} href={`/projects/${project.slug}`}>
            <div className="glass-card p-6 rounded-2xl flex flex-col h-full group transition-all hover:shadow-glow">
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="font-bold text-ink text-lg line-clamp-1 group-hover:text-accent transition-colors">{project.title}</h3>
                <StatusLabel status={project.status} />
              </div>
              <p className="text-sm text-ink-muted line-clamp-2 mb-5 flex-1">
                {project.summary ?? project.description}
              </p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {project.skills.slice(0, 3).map((s: any) => (
                  <span key={s.skill.id} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-ink-muted text-[11px] font-medium">
                    {s.skill.name}
                  </span>
                ))}
                {project.skills.length > 3 && (
                  <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-ink-muted text-[11px] font-medium">
                    +{project.skills.length - 3}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <Avatar name={project.owner.name} src={project.owner.avatarUrl} size={24} className="ring-2 ring-bg" />
                  <span className="text-[12px] font-medium text-ink-muted">{project.owner.name}</span>
                </div>
                <span className="text-[11px] font-medium text-ink-faint uppercase tracking-wider">
                  {project.visibility === 'PUBLIC' ? 'Public' : 'Private'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {data?.data.length === 0 && !isLoading && (
        <p className="py-12 text-center text-[13px] text-ink-muted">No projects match that search.</p>
      )}
    </div>
  );
}
