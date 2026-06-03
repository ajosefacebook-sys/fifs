'use client';

import { create } from 'zustand';
import { Checklist, ChecklistItemStatus } from '@/types/project.types';
import { checklistService } from '@/services/checklistService';

interface ChecklistState {
  checklists: Checklist[];
  selectedChecklist: Checklist | null;
  loading: boolean;
  loadChecklists: () => void;
  selectChecklist: (id: string | null) => void;
  updateItemStatus: (checklistId: string, itemId: string, status: ChecklistItemStatus, note?: string) => void;
  submitChecklist: (checklistId: string) => string | undefined;
  getCompletionPercent: (checklistId: string) => number;
}

export const useChecklistStore = create<ChecklistState>((set, get) => ({
  checklists: [],
  selectedChecklist: null,
  loading: false,

  loadChecklists: () => {
    const checklists = checklistService.getAll();
    set({ checklists, loading: false });
  },

  selectChecklist: (id) => {
    if (!id) { set({ selectedChecklist: null }); return; }
    const checklist = checklistService.getById(id);
    set({ selectedChecklist: checklist || null });
  },

  updateItemStatus: (checklistId, itemId, status, note) => {
    checklistService.updateItemStatus(checklistId, itemId, status, note);
    set((state) => ({
      checklists: state.checklists.map(c =>
        c.id === checklistId
          ? { ...c, items: c.items.map(i => i.id === itemId ? { ...i, status, note, updatedAt: new Date().toISOString() } : i) }
          : c
      ),
      selectedChecklist: state.selectedChecklist?.id === checklistId
        ? { ...state.selectedChecklist, items: state.selectedChecklist.items.map(i => i.id === itemId ? { ...i, status, note, updatedAt: new Date().toISOString() } : i) }
        : state.selectedChecklist,
    }));
  },

  submitChecklist: (checklistId) => {
    const result = checklistService.submitChecklist(checklistId);
    if (!result) return undefined;
    set((state) => ({
      checklists: state.checklists.map(c => c.id === checklistId ? { ...c, completed: true, submittedAt: result.checklist.submittedAt } : c),
      selectedChecklist: state.selectedChecklist?.id === checklistId ? { ...state.selectedChecklist, completed: true, submittedAt: result.checklist.submittedAt } : state.selectedChecklist,
    }));
    return result.generatedTaskId;
  },

  getCompletionPercent: (checklistId) => {
    const checklist = get().checklists.find(c => c.id === checklistId);
    if (!checklist || checklist.items.length === 0) return 0;
    const okCount = checklist.items.filter(i => i.status === 'ok').length;
    return Math.round((okCount / checklist.items.length) * 100);
  },
}));
