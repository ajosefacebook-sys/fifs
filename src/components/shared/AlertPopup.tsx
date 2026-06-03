'use client';

import { Alert } from '@/types/project.types';
import { formatTime } from '@/utils/date';
import { AlertTriangle, Bell, BellOff, ChevronUp } from 'lucide-react';

interface AlertPopupProps {
  alert: Alert;
  onMarkDone: (id: string) => void;
  onSnooze: (id: string) => void;
  onEscalate: (id: string) => void;
  onDismiss: () => void;
}

export function AlertPopup({ alert, onMarkDone, onSnooze, onEscalate, onDismiss }: AlertPopupProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className={`bg-[#161616] border ${alert.escalated ? 'border-red-500/50' : 'border-[rgba(212,168,67,0.3)]'} rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl`}>
        <div className="flex items-center gap-3 mb-4">
          {alert.escalated ? (
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <BellOff className="w-5 h-5 text-red-500" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-[rgba(212,168,67,0.2)] flex items-center justify-center">
              <Bell className="w-5 h-5 text-[#D4A843]" />
            </div>
          )}
          <div>
            <h3 className={`font-bold text-lg ${alert.escalated ? 'text-red-400' : 'text-white'}`}>
              {alert.escalated ? 'ESCALATED ALERT' : 'Task Alert'}
            </h3>
            <p className="text-[#888] text-sm">Scheduled task reminder</p>
          </div>
        </div>

        <div className="bg-[#1E1E1E] rounded-xl p-4 mb-4">
          <p className="text-white font-semibold mb-2">{alert.taskName}</p>
          <div className="flex items-center gap-2 text-sm text-[#888]">
            <span>Assigned to: <span className="text-white">{alert.assignedPerson}</span></span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#888] mt-1">
            <span>Scheduled: <span className="text-white">{formatTime(alert.scheduledTime)}</span></span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => onMarkDone(alert.id)}
            className="w-full py-3 bg-[#D4A843] text-black font-bold rounded-xl hover:bg-[#C8960C] transition-all duration-200"
          >
            Mark Done
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => onSnooze(alert.id)}
              className="flex-1 py-2.5 border border-[rgba(212,168,67,0.3)] text-[#D4A843] font-medium rounded-xl hover:bg-[rgba(212,168,67,0.1)] transition-all duration-200"
            >
              Snooze 15min
            </button>
            <button
              onClick={() => onEscalate(alert.id)}
              className="flex-1 py-2.5 border border-red-500/30 text-red-400 font-medium rounded-xl hover:bg-red-500/10 transition-all duration-200"
            >
              Escalate
            </button>
          </div>
          <button
            onClick={onDismiss}
            className="w-full py-2 text-[#888] text-sm hover:text-white transition-colors duration-200"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
