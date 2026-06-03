import { StaffRole } from '@/types/staff.types';

export interface RoleInfo {
  value: StaffRole;
  label: string;
  department: string;
}

export const ROLES: RoleInfo[] = [
  { value: 'technician', label: 'Technician', department: 'Maintenance' },
  { value: 'supervisor', label: 'Supervisor', department: 'Management' },
  { value: 'manager', label: 'Manager', department: 'Management' },
  { value: 'engineer', label: 'Engineer', department: 'Engineering' },
  { value: 'cleaner', label: 'Cleaner', department: 'Housekeeping' },
  { value: 'carpenter', label: 'Carpenter', department: 'Maintenance' },
  { value: 'electrician', label: 'Electrician', department: 'Electrical' },
  { value: 'plumber', label: 'Plumber', department: 'Plumbing' },
  { value: 'hvac-tech', label: 'HVAC Tech', department: 'HVAC' },
];

export const ROLE_MAP: Record<StaffRole, RoleInfo> = Object.fromEntries(
  ROLES.map(r => [r.value, r])
) as Record<StaffRole, RoleInfo>;
