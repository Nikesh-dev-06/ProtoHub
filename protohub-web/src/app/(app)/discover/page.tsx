'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useProjects } from '@/hooks/use-projects';
import { useMentors } from '@/hooks/use-users';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, Badge } from '@/components/ui/avatar';
import { Search, UserPlus } from 'lucide-react';

export default function DiscoverPage() {
  const [activeTab, setActiveTab] = useState<'projects' | 'people'>('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Basic debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 animate-fade-in">
      <div className="mb-10 relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface to-surface-raised border border-white/5 p-8 shadow-glow flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-info/20 rounded-full blur-[80px] animate-pulse-slow"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-ink tracking-tight">Discover <span className="text-gradient">Opportunities</span></h1>
          <p className="text-ink-muted mt-2 text-base">Find projects to contribute to, or mentors to learn from.</p>
        </div>
        <div className="w-full md:w-72">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" size={16} />
            <Input
              type="text"
              placeholder={activeTab === 'projects' ? 'Search projects...' : 'Search people...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-6 border-b border-border mb-6">
        <button
          onClick={() => setActiveTab('projects')}
          className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'projects' ? 'text-accent border-b-2 border-accent' : 'text-ink-muted hover:text-ink'}`}
        >
          Projects
        </button>
        <button
          onClick={() => setActiveTab('people')}
          className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'people' ? 'text-accent border-b-2 border-accent' : 'text-ink-muted hover:text-ink'}`}
        >
          People
        </button>
      </div>

      {activeTab === 'projects' ? (
        <ProjectsTab query={debouncedQuery} />
      ) : (
        <PeopleTab query={debouncedQuery} />
      )}
    </div>
  );
}

function ProjectsTab({ query }: { query: string }) {
  const { data: projectsData, isLoading } = useProjects({ search: query, limit: 20 });

  if (isLoading) {
    return <div className="text-center py-12 text-ink-muted">Loading projects...</div>;
  }

  const projects = projectsData?.data || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Link key={project.id} href={`/projects/${project.slug}`}>
          <div className="glass-card p-6 rounded-2xl flex flex-col h-full group transition-all hover:shadow-glow">
            <div className="flex items-start justify-between gap-2 mb-3">
              <h3 className="font-bold text-ink text-lg line-clamp-1 group-hover:text-accent transition-colors">{project.title}</h3>
              <Badge variant="outline" className="text-[10px] shrink-0 border-white/10 bg-white/5">{project.visibility === 'PUBLIC' ? 'Public' : 'Private'}</Badge>
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
                {project._count?.members || 1} member{(project._count?.members || 1) !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </Link>
      ))}
      {projects.length === 0 && (
        <div className="col-span-full py-12 text-center text-ink-muted">
          No projects found matching &quot;{query}&quot;
        </div>
      )}
    </div>
  );
}

function PeopleTab({ query }: { query: string }) {
  const { data: mentors, isLoading } = useMentors(query);

  if (isLoading) {
    return <div className="text-center py-12 text-ink-muted">Loading people...</div>;
  }

  const people = mentors || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {people.map((person) => (
        <div key={person.id} className="glass-card p-6 rounded-2xl flex flex-col items-center text-center transition-all hover:shadow-glow">
          <Avatar name={person.name} src={person.avatarUrl} size={80} className="mb-4 ring-4 ring-surface-raised shadow-lg" />
          <h3 className="font-bold text-ink text-lg">{person.name}</h3>
          <p className="text-[11px] font-bold text-accent uppercase tracking-wider mt-1">{person.role}</p>
          <p className="text-[13px] text-ink-muted mt-3 line-clamp-2 min-h-[40px] leading-relaxed">
            {person.headline || 'No headline set'}
          </p>
          
          <div className="flex flex-wrap justify-center gap-1.5 mt-5 mb-6 w-full">
            {person.skills?.slice(0, 3).map((s: any) => (
              <span key={s.skill.id} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-ink-muted text-[11px] font-medium">
                {s.skill.name}
              </span>
            ))}
          </div>

          <Link href={`/users/${person.id}`} className="mt-auto w-full">
            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-surface border border-white/5 text-accent hover:bg-accent hover:text-white transition-all text-sm font-semibold hover:shadow-glow">
              <UserPlus size={16} />
              Connect
            </button>
          </Link>
        </div>
      ))}
      {people.length === 0 && (
        <div className="col-span-full py-12 text-center text-ink-muted">
          No people found matching &quot;{query}&quot;
        </div>
      )}
    </div>
  );
}
