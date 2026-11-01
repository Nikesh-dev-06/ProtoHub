'use client';

import { useState } from 'react';
import { Search, UserPlus, GraduationCap, MessageCircle, MapPin } from 'lucide-react';
import { useMentors } from '@/hooks/use-users';
import { useCreateMentorshipRequest } from '@/hooks/use-mentorship';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, Badge } from '@/components/ui/avatar';
import { toast } from 'sonner';

export default function NetworkPage() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const { data: mentors, isLoading } = useMentors(debouncedQuery);
  const { mutate: createRequest, isPending } = useCreateMentorshipRequest();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedQuery(query);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8 animate-fade-in">
      <div className="mb-10 text-center relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface to-surface-raised border border-white/5 p-10 shadow-glow">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-accent/20 rounded-full blur-[80px] animate-pulse-slow"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold tracking-tight text-ink">Find a <span className="text-gradient">Mentor</span></h1>
          <p className="mt-4 text-ink-muted text-lg max-w-xl mx-auto">
            Connect with experienced professionals and teachers in your field to accelerate your learning.
          </p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-10">
        <Search className="absolute left-4 top-3 h-5 w-5 text-ink-muted" />
        <Input
          type="text"
          placeholder="Search by name, headline, or skill (e.g. React, UI Design)..."
          className="pl-11 h-12 text-base rounded-full border-border shadow-sm focus-visible:ring-accent"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="submit" className="absolute right-1 top-1 h-10 rounded-full px-6">
          Search
        </Button>
      </form>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse rounded-xl bg-surface border border-border h-64"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors?.map((mentor) => (
            <div key={mentor.id} className="glass-card flex flex-col items-center p-8 text-center rounded-2xl transition-all hover:shadow-glow">
              <Avatar name={mentor.name} src={mentor.avatarUrl} size={80} className="mb-5 ring-4 ring-surface-raised shadow-lg" />
              <h3 className="text-xl font-bold text-ink">{mentor.name}</h3>
              <div className="flex items-center gap-1.5 mt-2">
                <GraduationCap size={14} className="text-accent" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
                  {mentor.role}
                </span>
              </div>
              <p className="mt-4 text-[13px] text-ink-muted line-clamp-2 min-h-[40px] leading-relaxed">
                {mentor.headline || 'No headline available'}
              </p>
              
              <div className="mt-5 flex flex-wrap justify-center gap-1.5 mb-8 w-full">
                {mentor.skills?.slice(0, 3).map((us: any) => (
                  <span key={us.skill.id} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-ink-muted text-[11px] font-medium">
                    {us.skill.name}
                  </span>
                ))}
                {mentor.skills && mentor.skills.length > 3 && (
                  <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-ink-muted text-[11px] font-medium">
                    +{mentor.skills.length - 3}
                  </span>
                )}
              </div>

              <button 
                className="w-full mt-auto flex items-center justify-center gap-2 py-3 rounded-lg bg-accent text-white hover:bg-accent/90 transition-all text-sm font-semibold shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] disabled:opacity-50 disabled:pointer-events-none"
                disabled={isPending}
                onClick={() => {
                  createRequest(
                    { mentorId: mentor.id, message: 'I would like to connect with you!' },
                    {
                      onSuccess: () => toast.success('Mentorship request sent!'),
                      onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to send request'),
                    }
                  );
                }}
              >
                <UserPlus size={16} />
                Request Mentorship
              </button>
            </div>
          ))}
          {(!mentors || mentors.length === 0) && (
            <div className="col-span-full py-12 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-ink/5 flex items-center justify-center mb-4">
                <Search className="text-ink-muted" size={24} />
              </div>
              <h3 className="text-lg font-medium text-ink">No mentors found</h3>
              <p className="text-sm text-ink-muted mt-1">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
