'use client';

import { create } from 'zustand';
import { Staff, StaffStatus } from '@/types/staff.types';
import { staffService } from '@/services/staffService';

interface StaffState {
  staff: Staff[];
  selectedStaff: Staff | null;
  loading: boolean;
  loadStaff: () => void;
  selectStaff: (id: string | null) => void;
  updateStatus: (id: string, status: StaffStatus) => void;
  getOnSiteCount: () => number;
}

export const useStaffStore = create<StaffState>((set, get) => ({
  staff: [],
  selectedStaff: null,
  loading: false,

  loadStaff: () => {
    const staff = staffService.getAll();
    set({ staff, loading: false });
  },

  selectStaff: (id) => {
    if (!id) { set({ selectedStaff: null }); return; }
    const member = staffService.getById(id);
    set({ selectedStaff: member || null });
  },

  updateStatus: (id, status) => {
    staffService.updateStatus(id, status);
    set((state) => ({
      staff: state.staff.map(s => s.id === id ? { ...s, status } : s),
      selectedStaff: state.selectedStaff?.id === id ? { ...state.selectedStaff, status } : state.selectedStaff,
    }));
  },

  getOnSiteCount: () => {
    return get().staff.filter(s => s.status === 'on-site').length;
  },
}));
