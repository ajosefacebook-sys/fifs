'use client';

import { useEffect } from 'react';
import { useAlertStore } from '@/store/useAlertStore';

export function useAlerts() {
  const { init, checkAlerts, loadAlerts, activeAlert, isOpen, markDone, snooze, escalate, dismissAlert } = useAlertStore();

  useEffect(() => {
    init();
    loadAlerts();
    const interval = setInterval(() => {
      checkAlerts();
    }, 30000);
    return () => clearInterval(interval);
  }, [init, loadAlerts, checkAlerts]);

  return {
    activeAlert,
    isOpen,
    markDone,
    snooze,
    escalate,
    dismissAlert,
  };
}
