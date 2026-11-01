'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="flex h-screen items-center justify-center bg-bg p-4">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 30% 30%, rgba(139, 92, 246, 0.08) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(59, 130, 246, 0.06) 0%, transparent 50%)',
        }}
      />
      <div className="relative z-10 text-center max-w-md mx-auto animate-fade-in">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-accent/20 to-info/20 border border-white/10 mb-6">
            <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent to-info">
              404
            </span>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-ink tracking-tight mb-3">Page Not Found</h1>
        <p className="text-ink-muted text-[14px] leading-relaxed mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Check the URL or head back to the dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-[13px] font-medium text-ink-muted hover:bg-white/10 hover:text-ink transition-colors"
          >
            <ArrowLeft size={15} />
            Go Back
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-accent-hover transition-colors shadow-glow"
          >
            <Home size={15} />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
