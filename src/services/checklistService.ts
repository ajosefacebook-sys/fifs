import { Checklist, ChecklistItem, ChecklistItemStatus } from '@/types/project.types';
import { generateId } from '@/utils/helpers';
import { mockChecklists } from '@/data/mockData';

let checklists: Checklist[] = [...mockChecklists];

export const checklistService = {
  getAll: (): Checklist[] => {
    return [...checklists];
  },

  getByType: (type: Checklist['type']): Checklist | undefined => {
    const today = new Date().toISOString().split('T')[0];
    return checklists.find(c => c.type === type && c.date === today);
  },

  getById: (id: string): Checklist | undefined => {
    return checklists.find(c => c.id === id);
  },

  updateItemStatus: (checklistId: string, itemId: string, status: ChecklistItemStatus, note?: string): Checklist | undefined => {
    const checklist = checklists.find(c => c.id === checklistId);
    if (!checklist) return undefined;
    const item = checklist.items.find(i => i.id === itemId);
    if (!item) return undefined;
    item.status = status;
    item.updatedAt = new Date().toISOString();
    if (note) item.note = note;
    return { ...checklist };
  },

  submitChecklist: (checklistId: string): { checklist: Checklist; generatedTaskId?: string } | undefined => {
    const checklist = checklists.find(c => c.id === checklistId);
    if (!checklist) return undefined;
    checklist.completed = true;
    checklist.submittedAt = new Date().toISOString();

    const faultItems = checklist.items.filter(i => i.status === 'fault');
    let generatedTaskId: string | undefined;

    if (faultItems.length > 0) {
      generatedTaskId = generateId();
    }

    return { checklist: { ...checklist }, generatedTaskId };
  },

  addPhoto: (checklistId: string, itemId: string, photoUrl: string): Checklist | undefined => {
    const checklist = checklists.find(c => c.id === checklistId);
    if (!checklist) return undefined;
    const item = checklist.items.find(i => i.id === itemId);
    if (!item) return undefined;
    item.photoUrl = photoUrl;
    return { ...checklist };
  },
};
