import Image from 'next/image';
import { cn } from '@/lib/cn';

export function Avatar({
  name,
  src,
  size = 28,
  className,
}: {
  name: string;
  src?: string | null;
  size?: number;
  className?: string;
}) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={size}
        height={size}
        className={cn("rounded-full border border-border object-cover", className)}
        unoptimized
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      className={cn("flex items-center justify-center rounded-full bg-accent-soft font-medium text-accent border border-border", className)}
    >
      {initials}
    </div>
  );
}

export function Badge({
  children,
  variant = 'default',
  className,
}: {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'outline';
  className?: string;
}) {
  const variants = {
    default: 'bg-surface-hover text-ink-muted',
    accent: 'bg-accent-soft text-accent',
    outline: 'border border-border text-ink-muted',
  };
  return (
    <span className={cn('inline-flex items-center rounded px-1.5 py-0.5 text-[12px] font-medium', variants[variant], className)}>
      {children}
    </span>
  );
}
