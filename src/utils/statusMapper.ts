import { TaskStatus, Priority } from '@/types/task.types';
import { StaffStatus } from '@/types/staff.types';
import { ProjectStatus } from '@/types/project.types';

export const taskStatusConfig: Record<TaskStatus, { label: string; color: string; bg: string }> = {
  'open': { label: 'Open', color: '#3B82F6', bg: 'rgba(59,130,246,0.15)' },
  'in-progress': { label: 'In Progress', color: '#EAB308', bg: 'rgba(234,179,8,0.15)' },
  'resolved': { label: 'Resolved', color: '#22C55E', bg: 'rgba(34,197,94,0.15)' },
  'verified': { label: 'Verified', color: '#06B6D4', bg: 'rgba(6,182,212,0.15)' },
  'closed': { label: 'Closed', color: '#888888', bg: 'rgba(136,136,136,0.15)' },
};

export const staffStatusConfig: Record<StaffStatus, { label: string; color: string; bg: string }> = {
  'on-site': { label: 'On Site', color: '#22C55E', bg: 'rgba(34,197,94,0.15)' },
  'off-site': { label: 'Off Site', color: '#F97316', bg: 'rgba(249,115,22,0.15)' },
  'on-leave': { label: 'On Leave', color: '#EF4444', bg: 'rgba(239,68,68,0.15)' },
};

export const projectStatusConfig: Record<ProjectStatus, { label: string; color: string; bg: string }> = {
  'planning': { label: 'Planning', color: '#8B5CF6', bg: 'rgba(139,92,246,0.15)' },
  'active': { label: 'Active', color: '#22C55E', bg: 'rgba(34,197,94,0.15)' },
  'on-hold': { label: 'On Hold', color: '#EAB308', bg: 'rgba(234,179,8,0.15)' },
  'complete': { label: 'Complete', color: '#3B82F6', bg: 'rgba(59,130,246,0.15)' },
};

export const priorityLabel: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

export function getTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
