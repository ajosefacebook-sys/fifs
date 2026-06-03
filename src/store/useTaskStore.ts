'use client';

import { create } from 'zustand';
import { Task, CreateTaskInput, ChatMessage } from '@/types/task.types';
import { taskService } from '@/services/taskService';

interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  filter: 'all' | 'open' | 'in-progress' | 'resolved' | 'verified' | 'closed';
  loading: boolean;
  setFilter: (filter: TaskState['filter']) => void;
  loadTasks: () => void;
  selectTask: (id: string | null) => void;
  createTask: (input: CreateTaskInput, createdBy?: string) => Task;
  updateStatus: (id: string, status: Task['status'], performedBy?: string) => void;
  assignTask: (id: string, staffId: string, staffName: string) => void;
  addMessage: (taskId: string, senderId: string, senderName: string, content: string) => void;
  getFilteredTasks: () => Task[];
  getCriticalTasks: () => Task[];
  getOverdueTasks: () => Task[];
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  selectedTask: null,
  filter: 'all',
  loading: false,

  setFilter: (filter) => set({ filter }),

  loadTasks: () => {
    const tasks = taskService.getAll();
    set({ tasks, loading: false });
  },

  selectTask: (id) => {
    if (!id) { set({ selectedTask: null }); return; }
    const task = taskService.getById(id);
    set({ selectedTask: task || null });
  },

  createTask: (input, createdBy) => {
    const task = taskService.create(input, createdBy);
    set((state) => ({ tasks: [task, ...state.tasks] }));
    return task;
  },

  updateStatus: (id, status, performedBy) => {
    taskService.updateStatus(id, status, performedBy);
    set((state) => ({
      tasks: state.tasks.map(t => t.id === id ? { ...t, status } : t),
      selectedTask: state.selectedTask?.id === id ? { ...state.selectedTask, status } : state.selectedTask,
    }));
  },

  assignTask: (id, staffId, staffName) => {
    taskService.assign(id, staffId, staffName);
    set((state) => ({
      tasks: state.tasks.map(t => t.id === id ? { ...t, assignedTo: staffId, assignedToName: staffName } : t),
      selectedTask: state.selectedTask?.id === id ? { ...state.selectedTask, assignedTo: staffId, assignedToName: staffName } : state.selectedTask,
    }));
  },

  addMessage: (taskId, senderId, senderName, content) => {
    const msg = taskService.addMessage(taskId, senderId, senderName, content);
    if (msg) {
      set((state) => ({
        tasks: state.tasks.map(t => t.id === taskId ? { ...t, chatMessages: [...t.chatMessages, msg] } : t),
        selectedTask: state.selectedTask?.id === taskId
          ? { ...state.selectedTask, chatMessages: [...state.selectedTask.chatMessages, msg] }
          : state.selectedTask,
      }));
    }
  },

  getFilteredTasks: () => {
    const { tasks, filter } = get();
    if (filter === 'all') return tasks;
    return tasks.filter(t => t.status === filter);
  },

  getCriticalTasks: () => {
    return get().tasks.filter(t => t.priority === 'critical' && t.status !== 'closed' && t.status !== 'resolved' && t.status !== 'verified');
  },

  getOverdueTasks: () => {
    return get().tasks.filter(t => t.dueDate && new Date(t.dueDate).getTime() < Date.now() && t.status !== 'closed' && t.status !== 'resolved');
  },
}));
