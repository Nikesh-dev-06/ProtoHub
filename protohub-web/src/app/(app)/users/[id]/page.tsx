'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { useCreateMentorshipRequest } from '@/hooks/use-mentorship';
import { Card } from '@/components/ui/card';
import { Avatar, Badge } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { UserPlus, MapPin, Link as LinkIcon, Briefcase, GraduationCap } from 'lucide-react';

export default function PublicProfilePage() {
  const params = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const { mutate: createRequest, isPending } = useCreateMentorshipRequest();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.get(`/users/${params.id}`);
        setProfile(data);
      } catch (err) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };
    if (params.id) fetchProfile();
  }, [params.id]);

  if (isLoading) {
    return <div className="flex justify-center p-12 text-ink-muted">Loading profile...</div>;
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-ink-muted mb-4">User not found.</p>
        <Link href="/discover">
          <Button variant="secondary">Back to Discover</Button>
        </Link>
      </div>
    );
  }

  const skills = profile.skills || [];
  const projects = profile.ownedProjects || [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Sidebar Profile */}
        <div className="md:col-span-1 space-y-6">
          <Card className="p-6 flex flex-col items-center text-center">
            <Avatar name={profile.name} src={profile.avatarUrl} size={120} className="mb-4" />
            <h1 className="text-xl font-bold text-ink">{profile.name}</h1>
            <p className="text-sm font-medium text-accent mt-1">{profile.role}</p>
            <p className="text-[13px] text-ink-muted mt-2">
              {profile.headline || 'No headline set'}
            </p>

            <div className="mt-6 w-full space-y-3">
              <Button 
                className="w-full flex items-center justify-center gap-2"
                disabled={isPending}
                onClick={() => {
                  createRequest(
                    { mentorId: profile.id, message: 'I would like to connect with you!' },
                    {
                      onSuccess: () => toast.success('Mentorship request sent!'),
                      onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to send request'),
                    }
                  );
                }}
              >
                <UserPlus size={16} />
                Connect
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t border-border w-full text-left space-y-3">
              {profile.location && (
                <div className="flex items-center gap-2 text-[13px] text-ink-muted">
                  <MapPin size={14} className="shrink-0" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile.websiteUrl && (
                <div className="flex items-center gap-2 text-[13px] text-ink-muted">
                  <LinkIcon size={14} className="shrink-0" />
                  <a href={profile.websiteUrl} target="_blank" rel="noreferrer" className="text-accent hover:underline break-all">
                    {profile.websiteUrl}
                  </a>
                </div>
              )}
              {profile.githubUrl && (
                <div className="flex items-center gap-2 text-[13px] text-ink-muted">
                  <LinkIcon size={14} className="shrink-0" />
                  <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="text-accent hover:underline break-all">
                    GitHub
                  </a>
                </div>
              )}
            </div>
          </Card>

          {skills.length > 0 && (
            <Card className="p-6">
              <h2 className="text-sm font-semibold text-ink mb-4">Skills & Expertise</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((s: any) => (
                  <span key={s.skill.id} className="text-[11px] px-2.5 py-1 rounded-md bg-surface-raised text-ink-muted border border-border">
                    {s.skill.name}
                  </span>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right Column: Main Content */}
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-ink mb-4">About</h2>
            <div className="text-sm text-ink-muted whitespace-pre-line leading-relaxed">
              {profile.bio || 'This user hasn\'t written a bio yet.'}
            </div>
          </Card>

          {(profile.experience || profile.education) && (
            <Card className="p-6 space-y-6">
              {profile.experience && (
                <div>
                  <h2 className="text-sm font-semibold text-ink flex items-center gap-2 mb-3">
                    <Briefcase size={16} />
                    Experience
                  </h2>
                  <p className="text-[13px] text-ink-muted whitespace-pre-line">{profile.experience}</p>
                </div>
              )}
              {profile.education && (
                <div>
                  <h2 className="text-sm font-semibold text-ink flex items-center gap-2 mb-3">
                    <GraduationCap size={16} />
                    Education
                  </h2>
                  <p className="text-[13px] text-ink-muted whitespace-pre-line">{profile.education}</p>
                </div>
              )}
            </Card>
          )}

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-ink mb-4">Portfolio Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.length > 0 ? (
                projects.map((project: any) => (
                  <Link key={project.id} href={`/projects/${project.slug}`}>
                    <Card className="p-5 bg-surface hover:border-accent transition-colors flex flex-col h-full">
                      <h3 className="font-bold text-ink mb-2 line-clamp-1">{project.title}</h3>
                      <p className="text-[13px] text-ink-muted line-clamp-2">
                        {project.summary || 'No description provided.'}
                      </p>
                    </Card>
                  </Link>
                ))
              ) : (
                <div className="col-span-full p-8 text-center border border-dashed border-border rounded-xl bg-surface">
                  <p className="text-[13px] text-ink-muted">No public projects yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
