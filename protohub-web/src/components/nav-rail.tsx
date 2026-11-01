'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FolderKanban, Bell, Settings, LogOut, Users, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useAuth } from '@/lib/auth-context';
import { useNotifications } from '@/hooks/use-notifications';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/planner', label: 'Planner', icon: CalendarDays },
  { href: '/projects', label: 'Discover', icon: FolderKanban },
  { href: '/network', label: 'Network', icon: Users },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/settings/profile', label: 'Settings', icon: Settings },
];

export function NavRail() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { data } = useNotifications(true);
  const unread = data?.unreadCount ?? 0;

  return (
    <nav className="flex h-screen w-14 flex-col items-center border-r border-border bg-surface py-4">
      <Link href="/dashboard" className="mb-6 h-7 w-7 rounded bg-accent" aria-label="ProtoHub home" />

      <div className="flex flex-1 flex-col items-center gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={cn(
                'relative flex h-9 w-9 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-surface-hover hover:text-ink',
                active && 'bg-accent-soft text-accent',
              )}
            >
              <Icon size={18} />
              {href === '/notifications' && unread > 0 && (
                <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-danger" />
              )}
            </Link>
          );
        })}
      </div>

      <button
        onClick={logout}
        title="Sign out"
        className="flex h-9 w-9 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-surface-hover hover:text-danger"
      >
        <LogOut size={18} />
      </button>
    </nav>
  );
}
