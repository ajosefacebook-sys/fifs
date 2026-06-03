import { Staff, StaffStatus } from '@/types/staff.types';
import { mockStaff } from '@/data/mockData';

let staff: Staff[] = [...mockStaff];

export const staffService = {
  getAll: (): Staff[] => {
    return [...staff];
  },

  getById: (id: string): Staff | undefined => {
    return staff.find(s => s.id === id);
  },

  updateStatus: (id: string, status: StaffStatus): Staff | undefined => {
    const member = staff.find(s => s.id === id);
    if (!member) return undefined;
    member.status = status;
    return { ...member };
  },

  getByStatus: (status: StaffStatus): Staff[] => {
    return staff.filter(s => s.status === status);
  },

  getOnSite: (): Staff[] => {
    return staff.filter(s => s.status === 'on-site');
  },

  updatePerformanceScore: (id: string, score: number): Staff | undefined => {
    const member = staff.find(s => s.id === id);
    if (!member) return undefined;
    member.performanceScore = Math.min(100, Math.max(0, score));
    return { ...member };
  },

  getTopPerformers: (limit: number = 3): Staff[] => {
    return [...staff].sort((a, b) => b.performanceScore - a.performanceScore).slice(0, limit);
  },
};
