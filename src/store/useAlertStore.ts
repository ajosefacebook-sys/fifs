'use client';

import { create } from 'zustand';
import { Alert } from '@/types/project.types';
import { alertService } from '@/services/alertService';

interface AlertState {
  alerts: Alert[];
  activeAlert: Alert | null;
  isOpen: boolean;
  init: () => void;
  loadAlerts: () => void;
  checkAlerts: () => void;
  markDone: (id: string) => void;
  snooze: (id: string, minutes?: number) => void;
  escalate: (id: string) => void;
  dismissAlert: () => void;
  getOverdueCount: () => number;
}

export const useAlertStore = create<AlertState>((set, get) => ({
  alerts: [],
  activeAlert: null,
  isOpen: false,

  init: () => {
    alertService.init();
    get().loadAlerts();
  },

  loadAlerts: () => {
    const alerts = alertService.getAll();
    set({ alerts });
  },

  checkAlerts: () => {
    const triggered = alertService.checkScheduledAlerts();
    const alerts = alertService.getAll();
    set({ alerts });
    if (triggered.length > 0) {
      const highestPriority = triggered.reduce((a, b) =>
        new Date(a.scheduledTime).getTime() < new Date(b.scheduledTime).getTime() ? a : b
      );
      set({ activeAlert: highestPriority, isOpen: true });
    }
  },

  markDone: (id) => {
    alertService.markDone(id);
    const alerts = alertService.getAll();
    set({ alerts, activeAlert: null, isOpen: false });
  },

  snooze: (id, minutes) => {
    alertService.snooze(id, minutes);
    const alerts = alertService.getAll();
    set({ alerts, activeAlert: null, isOpen: false });
  },

  escalate: (id) => {
    alertService.escalateAlert(id);
    const alerts = alertService.getAll();
    set({ alerts, activeAlert: null, isOpen: false });
  },

  dismissAlert: () => {
    set({ activeAlert: null, isOpen: false });
  },

  getOverdueCount: () => {
    return alertService.getOverdueAlerts().length;
  },
}));
