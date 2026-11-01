import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
}

const variants = {
  primary: 'bg-gradient-to-br from-accent to-info text-white shadow-glow hover:shadow-glow-strong border border-white/10',
  secondary: 'bg-surface-hover text-ink border border-border hover:border-border-hover shadow-subtle hover:bg-surface-raised',
  ghost: 'text-ink-muted hover:text-ink hover:bg-surface-hover',
  danger: 'bg-danger/10 text-danger hover:bg-danger/20 border border-danger/20',
};

const sizes = {
  sm: 'h-8 px-4 text-[13px] rounded-full',
  md: 'h-10 px-6 text-sm rounded-full',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 font-medium transition-all duration-300',
        'active:scale-[0.98] hover:-translate-y-0.5',
        'disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 disabled:hover:translate-y-0',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = 'Button';
