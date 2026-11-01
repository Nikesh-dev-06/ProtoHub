'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Bell } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useNotifications } from '@/hooks/use-notifications';
import { Avatar } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/theme-toggle';

export function TopBar() {
  const { user } = useAuth();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const { data: notifData } = useNotifications(true);
  const unread = notifData?.unreadCount ?? 0;

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-white/5 glass-panel px-6">
      <form onSubmit={onSearch} className="relative w-full max-w-sm flex items-center group">
        <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint group-focus-within:text-accent transition-colors" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search ProtoHub..."
          className="h-9 w-full rounded-full border border-white/10 bg-surface/50 pl-9 pr-14 text-[13px] text-ink placeholder:text-ink-faint outline-none transition-all duration-300 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:bg-surface"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <kbd className="hidden sm:inline-block rounded border border-border bg-bg px-1.5 py-0.5 text-[10px] font-medium text-ink-muted">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </form>

      {user && (
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/settings/notifications" className="relative text-ink-muted hover:text-ink transition-colors">
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[9px] font-bold text-white shadow-[0_0_6px_rgba(239,68,68,0.5)]">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </Link>
          <span className="text-[13px] text-ink-muted hidden sm:block">{user.name}</span>
          <Avatar name={user.name} src={user.avatarUrl} size={30} />
        </div>
      )}
    </header>
  );
}
