'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';
import { User, Shield, Bell, Palette, Lock, Key } from 'lucide-react';

const SETTINGS_NAV = [
  { href: '/settings/account', label: 'Account', icon: User },
  { href: '/settings/profile', label: 'Profile', icon: User }, // Might replace with a badge or different icon but User is fine
  { href: '/settings/security', label: 'Security', icon: Shield },
  { href: '/settings/notifications', label: 'Notifications', icon: Bell },
  { href: '/settings/appearance', label: 'Appearance', icon: Palette },
  { href: '/settings/privacy', label: 'Privacy', icon: Lock },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8 animate-fade-in">
      <div className="mb-10 relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface to-surface-raised border border-white/5 p-8 shadow-glow">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-info/20 rounded-full blur-[80px] animate-pulse-slow" />
        <h1 className="text-3xl font-bold text-ink tracking-tight relative z-10"><span className="text-gradient">Settings</span></h1>
        <p className="text-ink-muted mt-2 relative z-10">Manage your account preferences and settings.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col gap-1">
            {SETTINGS_NAV.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'bg-surface-raised text-accent'
                      : 'text-ink-muted hover:bg-surface-hover hover:text-ink'
                  )}
                >
                  <Icon size={16} className={cn(active ? 'text-accent' : 'text-ink-muted')} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Settings Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
