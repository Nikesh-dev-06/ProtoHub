'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/lib/auth-context';
import { useUpdateProfile } from '@/hooks/use-profile';
import { ApiError } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input, Textarea, Label } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';

interface FormValues {
  name: string;
  headline: string;
  bio: string;
  location: string;
  avatarUrl: string;
  education: string;
  experience: string;
  websiteUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  isAvailable: boolean;
}

export default function ProfileSettingsPage() {
  const { user, refreshUser } = useAuth();
  const updateProfile = useUpdateProfile();
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const { register, handleSubmit, reset } = useForm<FormValues>();

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        headline: user.headline ?? '',
        bio: user.bio ?? '',
        location: user.location ?? '',
        avatarUrl: user.avatarUrl ?? '',
        education: user.education ?? '',
        experience: user.experience ?? '',
        websiteUrl: user.websiteUrl ?? '',
        githubUrl: user.githubUrl ?? '',
        linkedinUrl: user.linkedinUrl ?? '',
        isAvailable: user.isAvailable ?? true,
      });
    }
  }, [user, reset]);

  if (!user) return null;

  const onSubmit = async (values: FormValues) => {
    setStatus('idle');
    try {
      await updateProfile.mutateAsync(values);
      await refreshUser();
      setStatus('saved');
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-xl">
      <Card className="p-6">
        <div className="mb-5 flex items-center gap-3">
          <Avatar name={user.name} src={user.avatarUrl} size={48} />
          <div>
            <p className="text-sm font-medium text-ink">{user.name}</p>
            <p className="text-[12px] text-ink-muted">{user.email}</p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register('name')} />
          </div>
          <div>
            <Label htmlFor="avatarUrl">Avatar URL</Label>
            <Input id="avatarUrl" placeholder="https://…" {...register('avatarUrl')} />
          </div>
          <div>
            <Label htmlFor="headline">Headline</Label>
            <Input id="headline" placeholder="CS Junior @ your school" {...register('headline')} />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" {...register('location')} />
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" rows={4} {...register('bio')} />
          </div>
          <div>
            <Label htmlFor="education">Education</Label>
            <Textarea id="education" rows={2} {...register('education')} placeholder="Where did you study?" />
          </div>
          <div>
            <Label htmlFor="experience">Experience</Label>
            <Textarea id="experience" rows={2} {...register('experience')} placeholder="What have you worked on?" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="websiteUrl">Website</Label>
              <Input id="websiteUrl" {...register('websiteUrl')} placeholder="https://" />
            </div>
            <div>
              <Label htmlFor="githubUrl">GitHub</Label>
              <Input id="githubUrl" {...register('githubUrl')} placeholder="https://github.com/..." />
            </div>
            <div>
              <Label htmlFor="linkedinUrl">LinkedIn</Label>
              <Input id="linkedinUrl" {...register('linkedinUrl')} placeholder="https://linkedin.com/..." />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="isAvailable" {...register('isAvailable')} className="h-4 w-4 rounded border-gray-300" />
            <Label htmlFor="isAvailable">I am available for new projects and mentorship</Label>
          </div>

          {status === 'saved' && <p className="text-[13px] text-success">Saved.</p>}
          {status === 'error' && <p className="text-[13px] text-danger">Could not save your profile.</p>}

          <Button type="submit" disabled={updateProfile.isPending}>
            {updateProfile.isPending ? 'Saving…' : 'Save changes'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
