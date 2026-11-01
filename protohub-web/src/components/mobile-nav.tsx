'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, FolderKanban, MessageSquare, UserCircle } from 'lucide-react';
import { cn } from '@/lib/cn';

const MOBILE_NAV = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/discover', label: 'Discover', icon: Compass },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/messages', label: 'Messages', icon: MessageSquare },
  { href: '/profile', label: 'Profile', icon: UserCircle },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass-panel border-t border-white/5 safe-area-bottom">
      <div className="flex items-center justify-around h-14">
        {MOBILE_NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 transition-colors',
                active ? 'text-accent' : 'text-ink-muted',
              )}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
