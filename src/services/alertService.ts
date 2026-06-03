import { Alert } from '@/types/project.types';
import { generateId } from '@/utils/helpers';

let alerts: Alert[] = [];
let escalationTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioContext;
}

function playBeep(frequency: number = 800, duration: number = 200) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = frequency;
    gain.gain.value = 0.3;
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
    osc.stop(ctx.currentTime + duration / 1000);
  } catch {
    // Audio not available
  }
}

function playEscalationSound() {
  playBeep(400, 500);
  setTimeout(() => playBeep(300, 600), 600);
}

export const alertService = {
  loadAlerts: (): Alert[] => {
    try {
      const stored = localStorage.getItem('fifs_alerts');
      if (stored) alerts = JSON.parse(stored);
    } catch { /* ignore */ }
    return [...alerts];
  },

  saveAlerts: () => {
    try {
      localStorage.setItem('fifs_alerts', JSON.stringify(alerts));
    } catch { /* ignore */ }
  },

  addAlert: (alert: Omit<Alert, 'id' | 'createdAt' | 'status' | 'escalated'>): Alert => {
    const newAlert: Alert = {
      ...alert,
      id: generateId(),
      status: 'pending',
      escalated: false,
      createdAt: new Date().toISOString(),
    };
    alerts.push(newAlert);
    alertService.saveAlerts();
    return newAlert;
  },

  checkScheduledAlerts: (): Alert[] => {
    const now = Date.now();
    const triggered: Alert[] = [];
    for (const alert of alerts) {
      if (alert.status !== 'pending') continue;
      const scheduledTime = new Date(alert.scheduledTime).getTime();
      if (scheduledTime <= now) {
        triggered.push(alert);
        playBeep();
        if (!escalationTimers.has(alert.id)) {
          const timer = setTimeout(() => {
            alertService.escalateAlert(alert.id);
          }, 30 * 60 * 1000);
          escalationTimers.set(alert.id, timer);
        }
      }
    }
    return triggered;
  },

  markDone: (alertId: string): Alert | undefined => {
    const alert = alerts.find(a => a.id === alertId);
    if (!alert) return undefined;
    alert.status = 'done';
    alert.acknowledgedAt = new Date().toISOString();
    alertService.clearEscalationTimer(alertId);
    alertService.saveAlerts();
    return { ...alert };
  },

  snooze: (alertId: string, minutes: number = 15): Alert | undefined => {
    const alert = alerts.find(a => a.id === alertId);
    if (!alert) return undefined;
    alert.scheduledTime = new Date(Date.now() + minutes * 60000).toISOString();
    alert.status = 'snoozed';
    alertService.clearEscalationTimer(alertId);
    alertService.saveAlerts();
    return { ...alert };
  },

  escalateAlert: (alertId: string): Alert | undefined => {
    const alert = alerts.find(a => a.id === alertId);
    if (!alert) return undefined;
    alert.escalated = true;
    alert.status = 'escalated';
    playEscalationSound();
    alertService.saveAlerts();
    return { ...alert };
  },

  clearEscalationTimer: (alertId: string) => {
    const timer = escalationTimers.get(alertId);
    if (timer) {
      clearTimeout(timer);
      escalationTimers.delete(alertId);
    }
  },

  getOverdueAlerts: (): Alert[] => {
    const now = Date.now();
    return alerts.filter(a => {
      if (a.status !== 'pending' && a.status !== 'escalated') return false;
      return new Date(a.scheduledTime).getTime() <= now;
    });
  },

  getAll: (): Alert[] => [...alerts],

  init: () => {
    alertService.loadAlerts();
    setInterval(() => alertService.checkScheduledAlerts(), 30000);
  },
};
