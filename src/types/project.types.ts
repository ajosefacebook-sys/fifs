export type ProjectStatus = 'planning' | 'active' | 'on-hold' | 'complete';
export type ProjectType = 'renovation' | 'construction' | 'electrical-upgrade' | 'hvac-install' | 'plumbing' | 'general-maintenance';

export interface Project {
  id: string;
  name: string;
  description: string;
  type: ProjectType;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  budget: number;
  budgetUsed: number;
  teamMembers: string[];
  tasks: ProjectTask[];
  mediaUrls: string[];
  activityLog: ActivityEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectTask {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assignedTo: string | null;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  completedAt?: string;
}

export interface ActivityEntry {
  id: string;
  projectId: string;
  action: string;
  performedBy: string;
  timestamp: string;
}

export interface CreateProjectInput {
  name: string;
  description: string;
  type: ProjectType;
  startDate: string;
  endDate: string;
  budget: number;
  teamMembers: string[];
}

export type ChecklistType = 'daily' | 'generator' | 'plumbing' | 'electrical' | 'hvac' | 'cleaning';
export type ChecklistItemStatus = 'ok' | 'warning' | 'fault';

export interface Checklist {
  id: string;
  type: ChecklistType;
  date: string;
  items: ChecklistItem[];
  completed: boolean;
  submittedAt?: string;
}

export interface ChecklistItem {
  id: string;
  checklistId: string;
  label: string;
  status: ChecklistItemStatus;
  note?: string;
  photoUrl?: string;
  updatedAt: string;
}

export interface Alert {
  id: string;
  taskName: string;
  taskId?: string;
  assignedPerson: string;
  scheduledTime: string;
  status: 'pending' | 'done' | 'snoozed' | 'escalated';
  escalated: boolean;
  createdAt: string;
  acknowledgedAt?: string;
}
