'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import type { ProjectSummary, PublicUser } from '@/lib/types';

export default function SearchPage() {
  const params = useSearchParams();
  const q = params.get('q') ?? '';

  const { data, isLoading } = useQuery({
    queryKey: ['search', q],
    queryFn: () => api.get<{ projects: ProjectSummary[]; people: Pick<PublicUser, 'id' | 'name' | 'avatarUrl'>[] }>(
      `/search?q=${encodeURIComponent(q)}`,
    ),
    enabled: q.length >= 2,
  });

  return (
    <div className="mx-auto max-w-3xl px-8 py-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-ink tracking-tight">Results for <span className="text-gradient">&quot;{q}&quot;</span></h1>

      {isLoading && <p className="mt-4 text-[13px] text-ink-muted">Searching…</p>}

      <div className="mt-6 grid grid-cols-2 gap-6">
        <div>
          <h2 className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-ink-muted">Projects</h2>
          <Card className="divide-y divide-border">
            {data?.projects.map((p) => (
              <Link key={p.id} href={`/projects/${p.slug}`} className="block p-3 hover:bg-surface-hover">
                <p className="text-[13px] font-medium text-ink">{p.title}</p>
                <p className="text-[12px] text-ink-muted line-clamp-1">{p.summary ?? p.description}</p>
              </Link>
            ))}
            {data && data.projects.length === 0 && <p className="p-3 text-[13px] text-ink-muted">No matches.</p>}
          </Card>
        </div>
        <div>
          <h2 className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-ink-muted">People</h2>
          <Card className="divide-y divide-border">
            {data?.people.map((person) => (
              <div key={person.id} className="flex items-center gap-2.5 p-3">
                <Avatar name={person.name} src={person.avatarUrl} size={26} />
                <span className="text-[13px] text-ink">{person.name}</span>
              </div>
            ))}
            {data && data.people.length === 0 && <p className="p-3 text-[13px] text-ink-muted">No matches.</p>}
          </Card>
        </div>
      </div>
    </div>
  );
}
