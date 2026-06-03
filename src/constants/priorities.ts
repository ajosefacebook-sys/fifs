import { Priority } from '@/types/task.types';

export interface PriorityInfo {
  value: Priority;
  label: string;
  color: string;
  bg: string;
  border: string;
}

export const PRIORITIES: PriorityInfo[] = [
  { value: 'low', label: 'Low', color: '#22C55E', bg: 'rgba(34,197,94,0.15)', border: 'rgba(34,197,94,0.3)' },
  { value: 'medium', label: 'Medium', color: '#EAB308', bg: 'rgba(234,179,8,0.15)', border: 'rgba(234,179,8,0.3)' },
  { value: 'high', label: 'High', color: '#F97316', bg: 'rgba(249,115,22,0.15)', border: 'rgba(249,115,22,0.3)' },
  { value: 'critical', label: 'Critical', color: '#EF4444', bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)' },
];

export const PRIORITY_MAP: Record<Priority, PriorityInfo> = Object.fromEntries(
  PRIORITIES.map(p => [p.value, p])
) as Record<Priority, PriorityInfo>;
