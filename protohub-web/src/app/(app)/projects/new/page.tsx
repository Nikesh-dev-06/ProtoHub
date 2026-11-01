'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateProject } from '@/hooks/use-projects';
import { ApiError } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input, Textarea, Label, FieldError } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

const schema = z.object({
  title: z.string().min(3, 'At least 3 characters').max(120),
  summary: z.string().max(200).optional(),
  description: z.string().min(20, 'Give teammates enough context — at least 20 characters').max(5000),
  visibility: z.enum(['PUBLIC', 'PRIVATE']).default('PUBLIC'),
});
type FormValues = z.infer<typeof schema>;

export default function NewProjectPage() {
  const router = useRouter();
  const createProject = useCreateProject();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { visibility: 'PUBLIC' } });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      const project = await createProject.mutateAsync(values);
      router.push(`/projects/${project.slug}`);
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : 'Could not create the project');
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:px-8 animate-fade-in">
      <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface to-surface-raised border border-white/5 p-8 shadow-glow text-center">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-accent/20 rounded-full blur-[80px] animate-pulse-slow"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-ink tracking-tight">Start a <span className="text-gradient">New Project</span></h1>
          <p className="mt-3 text-ink-muted text-base max-w-md mx-auto">
            This creates the project&apos;s workspace too — a Kanban board, a team chat channel, and AI assistant ready to go.
          </p>
        </div>
      </div>

      <div className="glass-card mt-6 p-8 rounded-2xl">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label htmlFor="title" className="mb-2 block font-medium">Title</Label>
            <Input id="title" placeholder="Campus Carpool" className="h-12 text-base" {...register('title')} />
            <FieldError>{errors.title?.message}</FieldError>
          </div>
          <div>
            <Label htmlFor="summary" className="mb-2 block font-medium">Short summary (optional)</Label>
            <Input id="summary" placeholder="A ride-sharing app for students" className="h-12" {...register('summary')} />
            <FieldError>{errors.summary?.message}</FieldError>
          </div>
          <div>
            <Label htmlFor="description" className="mb-2 block font-medium">Description</Label>
            <Textarea id="description" rows={5} placeholder="What are you building, and why?" className="resize-none" {...register('description')} />
            <FieldError>{errors.description?.message}</FieldError>
          </div>
          <div>
            <Label htmlFor="visibility" className="mb-2 block font-medium">Visibility</Label>
            <select
              id="visibility"
              className="h-12 w-full rounded-md border border-white/10 bg-surface px-4 text-sm text-ink outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
              {...register('visibility')}
            >
              <option value="PUBLIC">Public — anyone can discover and request to join</option>
              <option value="PRIVATE">Private — invite only</option>
            </select>
          </div>

          {serverError && (
            <div className="p-3 rounded-md bg-danger/10 border border-danger/20">
              <p className="text-sm text-danger text-center">{serverError}</p>
            </div>
          )}

          <div className="pt-4">
            <Button type="submit" className="w-full h-12 text-base font-semibold shadow-glow" disabled={isSubmitting}>
              {isSubmitting ? 'Creating…' : 'Create project'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
