import { cn } from '@/lib/cn';

const COLOR_MAP: Record<string, string> = {
  // Project status
  DRAFT: 'bg-ink-faint',
  ACTIVE: 'bg-success',
  COMPLETED: 'bg-info',
  ARCHIVED: 'bg-ink-faint',
  // Task priority
  LOW: 'bg-ink-faint',
  MEDIUM: 'bg-info',
  HIGH: 'bg-warning',
  URGENT: 'bg-danger',
  // Join request / mentorship status
  PENDING: 'bg-warning',
  ACCEPTED: 'bg-success',
  REJECTED: 'bg-danger',
  WITHDRAWN: 'bg-ink-faint',
  CANCELLED: 'bg-ink-faint',
};

export function StatusDot({ status, className }: { status: string; className?: string }) {
  return <span className={cn('status-dot', COLOR_MAP[status] ?? 'bg-ink-faint', className)} aria-hidden />;
}

export function StatusLabel({ status, label }: { status: string; label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] text-ink-muted">
      <StatusDot status={status} />
      {label ?? status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}
