import { Task, CreateTaskInput, ChatMessage, HistoryEntry } from '@/types/task.types';
import { generateId } from '@/utils/helpers';
import { mockTasks } from '@/data/mockData';

let tasks: Task[] = [...mockTasks];

export const taskService = {
  getAll: (): Task[] => {
    return [...tasks];
  },

  getById: (id: string): Task | undefined => {
    return tasks.find(t => t.id === id);
  },

  getByStatus: (status: Task['status'][]): Task[] => {
    return tasks.filter(t => status.includes(t.status));
  },

  create: (input: CreateTaskInput, createdBy: string = 'System'): Task => {
    const newTask: Task = {
      id: generateId(),
      ...input,
      status: 'open',
      assignedToName: input.assignedTo ? undefined : undefined,
      createdBy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      mediaUrls: [],
      chatMessages: [],
      history: [{
        id: generateId(),
        taskId: generateId(),
        action: 'Issue created',
        performedBy: createdBy,
        timestamp: new Date().toISOString(),
      }],
      isVerified: false,
    };
    tasks = [newTask, ...tasks];
    return newTask;
  },

  updateStatus: (id: string, status: Task['status'], performedBy: string = 'System'): Task | undefined => {
    const task = tasks.find(t => t.id === id);
    if (!task) return undefined;
    task.status = status;
    task.updatedAt = new Date().toISOString();
    task.history.push({
      id: generateId(),
      taskId: id,
      action: `Status changed to ${status}`,
      performedBy,
      timestamp: new Date().toISOString(),
    });
    if (status === 'verified') task.isVerified = true;
    return { ...task };
  },

  assign: (id: string, staffId: string, staffName: string): Task | undefined => {
    const task = tasks.find(t => t.id === id);
    if (!task) return undefined;
    task.assignedTo = staffId;
    task.assignedToName = staffName;
    task.updatedAt = new Date().toISOString();
    task.history.push({
      id: generateId(),
      taskId: id,
      action: `Assigned to ${staffName}`,
      performedBy: 'System',
      timestamp: new Date().toISOString(),
    });
    return { ...task };
  },

  addMessage: (taskId: string, senderId: string, senderName: string, content: string): ChatMessage | undefined => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return undefined;
    const msg: ChatMessage = {
      id: generateId(),
      taskId,
      senderId,
      senderName,
      content,
      timestamp: new Date().toISOString(),
    };
    task.chatMessages.push(msg);
    return msg;
  },

  addMedia: (taskId: string, url: string): Task | undefined => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return undefined;
    task.mediaUrls.push(url);
    task.updatedAt = new Date().toISOString();
    return { ...task };
  },

  search: (query: string): Task[] => {
    const q = query.toLowerCase();
    return tasks.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.location.toLowerCase().includes(q) ||
      t.assignedToName?.toLowerCase().includes(q)
    );
  },
};
