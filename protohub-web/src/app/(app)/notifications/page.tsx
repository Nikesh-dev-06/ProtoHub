'use client';

import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '@/hooks/use-notifications';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';

export default function NotificationsPage() {
  const { data } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  return (
    <div className="mx-auto max-w-2xl px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink">Notifications</h1>
        {(data?.unreadCount ?? 0) > 0 && (
          <Button size="sm" variant="secondary" onClick={() => markAllRead.mutate()}>
            Mark all as read
          </Button>
        )}
      </div>

      <Card className="divide-y divide-border">
        {data?.notifications.map((n) => (
          <button
            key={n.id}
            onClick={() => !n.isRead && markRead.mutate(n.id)}
            className={cn('flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-surface-hover', !n.isRead && 'bg-accent-soft/40')}
          >
            <span className={cn('mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full', n.isRead ? 'bg-transparent' : 'bg-accent')} />
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-ink">{n.title}</p>
              <p className="mt-0.5 text-[13px] text-ink-muted">{n.message}</p>
              <p className="mt-1 font-mono text-[11px] text-ink-faint">
                {new Date(n.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
            </div>
          </button>
        ))}
        {data?.notifications.length === 0 && (
          <p className="p-8 text-center text-[13px] text-ink-muted">You&apos;re all caught up.</p>
        )}
      </Card>
    </div>
  );
}
