'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { AI_FEATURES_ENABLED } from '@/lib/ai-features';

interface AIMaintenanceContextValue {
  isAIEnabled: boolean;
  isModalOpen: boolean;
  openMaintenanceModal: () => void;
  closeMaintenanceModal: () => void;
  /** Call this before any AI action. Returns true if safe to proceed. */
  guardAIAction: () => boolean;
}

const AIMaintenanceContext = createContext<AIMaintenanceContextValue | null>(null);

export function AIMaintenanceProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openMaintenanceModal = useCallback(() => setIsModalOpen(true), []);
  const closeMaintenanceModal = useCallback(() => setIsModalOpen(false), []);

  /** Returns true if AI is enabled (safe to proceed), false if blocked (modal shown). */
  const guardAIAction = useCallback((): boolean => {
    if (!AI_FEATURES_ENABLED) {
      setIsModalOpen(true);
      return false;
    }
    return true;
  }, []);

  return (
    <AIMaintenanceContext.Provider
      value={{
        isAIEnabled: AI_FEATURES_ENABLED,
        isModalOpen,
        openMaintenanceModal,
        closeMaintenanceModal,
        guardAIAction,
      }}
    >
      {children}
    </AIMaintenanceContext.Provider>
  );
}

export function useAIFeatureAvailability() {
  const ctx = useContext(AIMaintenanceContext);
  if (!ctx) throw new Error('useAIFeatureAvailability must be used within AIMaintenanceProvider');
  return ctx;
}
