'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/lib/auth-context';
import { ApiError } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input, Label, FieldError } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

// Mirrors backend RegisterDto exactly, so the person hits the same rule
// client-side instead of round-tripping to the API to find out.
const schema = z.object({
  name: z.string().min(2, 'At least 2 characters').max(100),
  email: z.string().email('Enter a valid email'),
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .max(72)
    .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Needs an uppercase letter, a lowercase letter, and a number'),
  role: z.enum(['STUDENT', 'TEACHER', 'PROFESSIONAL', 'HOBBYIST']),
  headline: z.string().max(150, 'Headline is too long').optional(),
});
type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { role: 'STUDENT' } });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      await registerUser(values.email, values.password, values.name, values.role, values.headline);
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : 'Could not create your account');
    }
  };

  return (
    <Card className="p-8">
      <div className="text-center mb-8">
        <div className="mx-auto h-12 w-12 rounded-xl bg-gradient-to-br from-accent to-info shadow-glow mb-5" />
        <h1 className="text-2xl font-bold text-ink">Create your account</h1>
        <p className="mt-1.5 text-sm text-ink-muted">Join ProtoHub and start building</p>
      </div>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input id="name" autoComplete="name" {...register('name')} />
          <FieldError>{errors.name?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" {...register('email')} />
          <FieldError>{errors.email?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" autoComplete="new-password" {...register('password')} />
          <FieldError>{errors.password?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="headline">Headline (Optional)</Label>
          <Input id="headline" placeholder="e.g. CS Student at XYZ University" autoComplete="off" {...register('headline')} />
          <FieldError>{errors.headline?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="role">I am a...</Label>
          <select
            id="role"
            className="flex h-9 w-full rounded-md border border-border bg-surface px-3 py-1 text-sm text-ink transition-all duration-300 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:shadow-[0_0_15px_rgba(139,92,246,0.15)] outline-none"
            {...register('role')}
          >
            <option value="STUDENT">Student</option>
            <option value="TEACHER">Teacher</option>
            <option value="PROFESSIONAL">Professional</option>
            <option value="HOBBYIST">Hobbyist</option>
          </select>
          <FieldError>{errors.role?.message}</FieldError>
        </div>

        {serverError && <p className="text-[13px] text-danger">{serverError}</p>}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="mt-5 text-center text-[13px] text-ink-muted">
        Already have an account?{' '}
        <Link href="/login" className="text-accent hover:underline">
          Sign in
        </Link>
      </p>
    </Card>
  );
}
