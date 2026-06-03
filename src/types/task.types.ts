export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type TaskStatus = 'open' | 'in-progress' | 'resolved' | 'verified' | 'closed';
export type Category = 'plumbing' | 'electrical' | 'hvac' | 'generator' | 'smart-systems' | 'cleaning' | 'carpentry' | 'logistics';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  status: TaskStatus;
  location: string;
  assignedTo: string | null;
  assignedToName?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  mediaUrls: string[];
  chatMessages: ChatMessage[];
  history: HistoryEntry[];
  isVerified?: boolean;
}

export interface ChatMessage {
  id: string;
  taskId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}

export interface HistoryEntry {
  id: string;
  taskId: string;
  action: string;
  performedBy: string;
  timestamp: string;
  details?: string;
}

export interface CreateTaskInput {
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  location: string;
  assignedTo: string | null;
  dueDate?: string;
}
