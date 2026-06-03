import { Vendor } from '@/types/staff.types';
import { mockVendors } from '@/data/mockData';

let vendors: Vendor[] = [...mockVendors];

export const vendorService = {
  getAll: (): Vendor[] => {
    return [...vendors];
  },

  getById: (id: string): Vendor | undefined => {
    return vendors.find(v => v.id === id);
  },

  getByTrade: (trade: string): Vendor[] => {
    return vendors.filter(v => v.trade.toLowerCase() === trade.toLowerCase());
  },

  getBestSLA: (): Vendor | undefined => {
    return [...vendors].sort((a, b) => b.slaScore - a.slaScore)[0];
  },

  getTopRated: (): Vendor | undefined => {
    return [...vendors].sort((a, b) => b.rating - a.rating)[0];
  },
};
