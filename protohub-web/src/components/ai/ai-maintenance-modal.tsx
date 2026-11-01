'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Bot, X, Wrench, ArrowRight } from 'lucide-react';
import { useAIFeatureAvailability } from '@/lib/ai-maintenance-context';

/**
 * AIMaintenanceModal
 *
 * Displays a professional maintenance notice when the user attempts to
 * access an AI-powered feature while AI_FEATURES_ENABLED=false.
 *
 * - Background blur + dark overlay over current page.
 * - Supports Escape key and click-outside dismissal.
 * - Locks body scroll while open.
 * - Respects prefers-reduced-motion.
 * - Does NOT appear on every page load — only on attempted AI interaction.
 */
export function AIMaintenanceModal() {
  const { isModalOpen, closeMaintenanceModal } = useAIFeatureAvailability();
  const router = useRouter();

  // Lock scroll while open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  // Escape key dismissal
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMaintenanceModal();
    },
    [closeMaintenanceModal]
  );

  useEffect(() => {
    if (!isModalOpen) return;
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, handleKeyDown]);

  const handleExploreFeatures = () => {
    closeMaintenanceModal();
    router.push('/dashboard');
  };

  if (!isModalOpen) return null;

  return (
    <>
      {/* Backdrop: blur + dark overlay */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className="fixed inset-0 z-[9998] backdrop-blur-[8px]"
        style={{ backgroundColor: 'rgba(5, 5, 5, 0.72)' }}
        onClick={closeMaintenanceModal}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-modal-title"
        aria-describedby="ai-modal-desc"
        className="
          fixed inset-0 z-[9999] flex items-center justify-center p-4
          pointer-events-none
        "
      >
        <div
          className="
            pointer-events-auto relative w-full max-w-md
            rounded-2xl border border-white/10
            bg-[#111] shadow-[0_0_60px_rgba(139,92,246,0.18),0_32px_64px_rgba(0,0,0,0.8)]
            animate-fade-in
          "
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={closeMaintenanceModal}
            aria-label="Close"
            className="
              absolute right-4 top-4 rounded-md p-1.5
              text-[#777] hover:text-white hover:bg-white/5
              transition-colors focus-visible:ring-2 focus-visible:ring-accent
            "
          >
            <X size={16} />
          </button>

          <div className="p-8">
            {/* Icon */}
            <div className="mb-6 flex items-center justify-center">
              <div className="relative">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#8B5CF6]/20 to-[#3B82F6]/20 border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.2)]">
                  <Bot size={28} className="text-[#8B5CF6]" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center">
                  <Wrench size={12} className="text-[#F59E0B]" />
                </div>
              </div>
            </div>

            {/* Title */}
            <h2
              id="ai-modal-title"
              className="text-center text-lg font-bold text-white tracking-tight"
            >
              AI Features Under Development
            </h2>

            {/* Divider */}
            <div className="my-4 h-px bg-white/5" />

            {/* Body */}
            <p id="ai-modal-desc" className="text-center text-[13.5px] text-[#A1A1AA] leading-relaxed">
              PROTOFIX is currently undergoing development and integration of its AI services.
              AI-powered chat, debugging assistance, and recommendations are temporarily unavailable
              while we complete and validate these features.
            </p>

            <p className="mt-3 text-center text-[12.5px] text-[#71717A] leading-relaxed">
              Our core platform remains fully accessible. AI functionality will become available
              after integration and testing are complete.
            </p>

            {/* Status badge */}
            <div className="mt-5 flex justify-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#F59E0B]/20 bg-[#F59E0B]/10 px-3 py-1 text-[11px] font-medium text-[#F59E0B]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
                Integration in Progress
              </span>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col gap-2.5">
              <button
                onClick={closeMaintenanceModal}
                className="
                  w-full rounded-xl bg-[#8B5CF6] px-4 py-3
                  text-[13px] font-semibold text-white
                  hover:bg-[#A78BFA] active:bg-[#7C3AED]
                  transition-colors shadow-[0_0_20px_rgba(139,92,246,0.3)]
                  focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#111]
                "
              >
                Got It
              </button>
              <button
                onClick={handleExploreFeatures}
                className="
                  w-full flex items-center justify-center gap-2
                  rounded-xl border border-white/10 bg-white/5 px-4 py-3
                  text-[13px] font-medium text-[#A1A1AA]
                  hover:bg-white/10 hover:text-white hover:border-white/20
                  transition-colors
                  focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#111]
                "
              >
                Explore Available Features
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
