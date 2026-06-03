export type StaffStatus = 'on-site' | 'off-site' | 'on-leave';
export type StaffRole = 'technician' | 'supervisor' | 'manager' | 'engineer' | 'cleaner' | 'carpenter' | 'electrician' | 'plumber' | 'hvac-tech';

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  status: StaffStatus;
  avatar: string;
  performanceScore: number;
  attendanceLog: AttendanceEntry[];
  taskHistory: string[];
  discipline: DisciplineEntry[];
}

export interface AttendanceEntry {
  id: string;
  date: string;
  checkIn: string;
  checkOut: string | null;
  status: 'present' | 'late' | 'absent';
}

export interface DisciplineEntry {
  id: string;
  date: string;
  type: 'warning' | 'commendation' | 'incident';
  description: string;
  issuedBy: string;
}

export interface Vendor {
  id: string;
  companyName: string;
  trade: string;
  rating: number;
  slaScore: number;
  contactPerson: string;
  phone: string;
  email: string;
  jobHistory: VendorJob[];
  responseTimeAvg: number;
  slaCompliance: number;
}

export interface VendorJob {
  id: string;
  taskId: string;
  description: string;
  date: string;
  rating: number;
  cost: number;
}
