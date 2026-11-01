'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FolderKanban, Settings, LogOut, Users, MessageSquare, Bot, Compass, UserCircle, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useAuth } from '@/lib/auth-context';
import { useNotifications } from '@/hooks/use-notifications';
import { AI_FEATURES_ENABLED } from '@/lib/ai-features';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: Home, isAI: false },
  { href: '/planner', label: 'My Planner', icon: CalendarDays, isAI: false },
  { href: '/discover', label: 'Discover', icon: Compass, isAI: false },
  { href: '/projects', label: 'Projects', icon: FolderKanban, isAI: false },
  { href: '/network', label: 'Mentors', icon: Users, isAI: false },
  { href: '/messages', label: 'Messages', icon: MessageSquare, isAI: false },
  { href: '/ai', label: 'AI Assistant', icon: Bot, isAI: true },
];

const BOTTOM_ITEMS = [
  { href: '/profile', label: 'Profile', icon: UserCircle },
  { href: '/settings/profile', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const { data } = useNotifications(true);
  const unread = data?.unreadCount ?? 0;

  return (
    <aside className="hidden md:flex h-screen w-64 flex-col border-r border-white/5 glass-panel">
      <div className="flex h-14 items-center px-6 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2.5 font-bold text-ink">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-accent to-info shadow-glow" aria-label="ProtoHub Logo" />
          <span className="text-lg tracking-tight">ProtoHub</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-ink-muted mb-2">Main</p>
          {NAV_ITEMS.map(({ href, label, icon: Icon, isAI }) => {
            const active = pathname.startsWith(href);
            const isDisabled = isAI && !AI_FEATURES_ENABLED;
            return (
              <Link
                key={href}
                href={href}
                title={isDisabled ? 'AI Assistant — Integration in Progress' : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-surface-hover hover:text-ink',
                  active ? 'bg-surface-raised text-accent' : 'text-ink-muted'
                )}
              >
                <Icon size={16} className={cn(active ? 'text-accent' : 'text-ink-muted')} />
                {label}
                {href === '/notifications' && unread > 0 && (
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white">
                    {unread}
                  </span>
                )}
                {isDisabled && (
                  <span className="ml-auto inline-flex items-center rounded-full border border-[#F59E0B]/20 bg-[#F59E0B]/10 px-1.5 py-0.5 text-[9px] font-semibold text-[#F59E0B] leading-none">
                    Dev
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="p-3 border-t border-border flex flex-col gap-1">
        {BOTTOM_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-surface-hover hover:text-ink',
                active ? 'bg-surface-raised text-accent' : 'text-ink-muted'
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
        
        <button
          onClick={logout}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-hover hover:text-danger w-full text-left"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
