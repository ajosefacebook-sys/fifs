'use client';

import { useState, useEffect } from 'react';
import { useChecklistStore } from '@/store/useChecklistStore';
import { ChecklistItemStatus, ChecklistType } from '@/types/project.types';
import { Card } from '@/components/shared/Card';
import { CheckCircle2, AlertTriangle, XCircle, ChevronLeft, ClipboardCheck } from 'lucide-react';
import { formatTime } from '@/utils/date';

const checklistNames: Record<ChecklistType, string> = {
  daily: 'Daily Inspection',
  generator: 'Generator Check',
  plumbing: 'Plumbing Audit',
  electrical: 'Electrical Inspection',
  hvac: 'HVAC Check',
  cleaning: 'Cleaning Audit',
};

const typeColors: Record<ChecklistType, string> = {
  daily: '#D4A843',
  generator: '#F97316',
  plumbing: '#3B82F6',
  electrical: '#EAB308',
  hvac: '#06B6D4',
  cleaning: '#22C55E',
};

export function DailyFlow() {
  const { checklists, selectedChecklist, selectChecklist, updateItemStatus, submitChecklist, loadChecklists } = useChecklistStore();
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => { loadChecklists(); }, [loadChecklists]);

  const openChecklist = (id: string) => {
    selectChecklist(id);
    setShowDetail(true);
  };

  const closeChecklist = () => {
    selectChecklist(null);
    setShowDetail(false);
  };

  const handleItemTap = (itemId: string, currentStatus: ChecklistItemStatus) => {
    if (!selectedChecklist) return;
    const nextStatus: Record<ChecklistItemStatus, ChecklistItemStatus> = {
      ok: 'warning',
      warning: 'fault',
      fault: 'ok',
    };
    updateItemStatus(selectedChecklist.id, itemId, nextStatus[currentStatus]);
  };

  const getProgressColors = (items: { status: ChecklistItemStatus }[]) => {
    const total = items.length;
    if (total === 0) return { green: 0, yellow: 0, red: 0 };
    const green = (items.filter(i => i.status === 'ok').length / total) * 100;
    const yellow = (items.filter(i => i.status === 'warning').length / total) * 100;
    const red = (items.filter(i => i.status === 'fault').length / total) * 100;
    return { green, yellow, red };
  };

  const getStatusIcon = (status: ChecklistItemStatus) => {
    switch (status) {
      case 'ok': return <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-[#EAB308]" />;
      case 'fault': return <XCircle className="w-5 h-5 text-[#EF4444]" />;
    }
  };

  const handleSubmit = () => {
    if (!selectedChecklist) return;
    const generatedTaskId = submitChecklist(selectedChecklist.id);
    if (generatedTaskId) {
      alert('Work order created for fault items!');
    } else {
      alert('Checklist submitted successfully!');
    }
  };

  return (
    <div>
      {!showDetail ? (
        <div className="space-y-3">
          {checklists.map(cl => {
            const prog = getProgressColors(cl.items);
            return (
              <Card key={cl.id} hover onClick={() => openChecklist(cl.id)}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: typeColors[cl.type] }} />
                    <h4 className="text-white font-semibold text-sm">{checklistNames[cl.type]}</h4>
                  </div>
                  <span className={`text-xs font-medium ${cl.completed ? 'text-[#22C55E]' : 'text-[#EAB308]'}`}>
                    {cl.completed ? 'Completed' : 'Pending'}
                  </span>
                </div>
                <div className="h-2 bg-[#1E1E1E] rounded-full overflow-hidden flex">
                  {prog.green > 0 && <div className="h-full transition-all duration-500" style={{ width: `${prog.green}%`, backgroundColor: '#22C55E' }} />}
                  {prog.yellow > 0 && <div className="h-full transition-all duration-500" style={{ width: `${prog.yellow}%`, backgroundColor: '#EAB308' }} />}
                  {prog.red > 0 && <div className="h-full transition-all duration-500" style={{ width: `${prog.red}%`, backgroundColor: '#EF4444' }} />}
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-[10px] text-[#888]">
                  <span className="text-[#22C55E]">{cl.items.filter(i => i.status === 'ok').length} OK</span>
                  <span className="text-[#EAB308]">{cl.items.filter(i => i.status === 'warning').length} Warnings</span>
                  <span className="text-[#EF4444]">{cl.items.filter(i => i.status === 'fault').length} Faults</span>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <button onClick={closeChecklist} className="text-[#888] hover:text-white"><ChevronLeft className="w-5 h-5" /></button>
            <h3 className="text-white font-bold">{selectedChecklist ? checklistNames[selectedChecklist.type] : ''}</h3>
          </div>

          {selectedChecklist && (
            <div className="space-y-2">
              {selectedChecklist.items.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleItemTap(item.id, item.status)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${item.status === 'ok' ? 'bg-[rgba(34,197,94,0.1)] border-[rgba(34,197,94,0.2)]' : item.status === 'warning' ? 'bg-[rgba(234,179,8,0.1)] border-[rgba(234,179,8,0.2)]' : 'bg-[rgba(239,68,68,0.1)] border-[rgba(239,68,68,0.2)]'}`}
                >
                  {getStatusIcon(item.status)}
                  <div className="flex-1 text-left">
                    <span className="text-white text-sm font-medium">{item.label}</span>
                    {item.note && <p className="text-[#888] text-xs mt-0.5">{item.note}</p>}
                  </div>
                </button>
              ))}

              {!selectedChecklist.completed && (
                <button onClick={handleSubmit} className="w-full mt-4 py-3 bg-[#D4A843] text-black font-bold rounded-xl hover:bg-[#C8960C] transition-all duration-200 flex items-center justify-center gap-2">
                  <ClipboardCheck className="w-5 h-5" /> Submit Checklist
                </button>
              )}
              {selectedChecklist.completed && (
                <p className="text-center text-[#22C55E] text-sm font-medium mt-4">Submitted at {selectedChecklist.submittedAt ? formatTime(selectedChecklist.submittedAt) : ''}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
