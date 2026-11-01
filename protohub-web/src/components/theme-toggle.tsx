'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="secondary" className="h-9 w-9 p-0 rounded-full" aria-label="Toggle theme">
        <Sun className="h-[1.1rem] w-[1.1rem]" />
      </Button>
    );
  }

  return (
    <Button
      variant="secondary"
      className="h-9 w-9 p-0 rounded-full bg-surface hover:bg-surface-hover text-ink-muted hover:text-ink border border-white/5"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-[1.1rem] w-[1.1rem] transition-all hover:rotate-90 hover:scale-110" />
      ) : (
        <Moon className="h-[1.1rem] w-[1.1rem] transition-all hover:-rotate-90 hover:scale-110" />
      )}
    </Button>
  );
}
