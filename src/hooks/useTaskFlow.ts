'use client';

import { useCallback, useState } from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import { CreateTaskInput } from '@/types/task.types';

export function useTaskFlow() {
  const { createTask, updateStatus, assignTask, addMessage, tasks, selectedTask, selectTask, setFilter, filter } = useTaskStore();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateIssue = useCallback((input: CreateTaskInput, createdBy?: string) => {
    const task = createTask(input, createdBy);
    setIsCreating(false);
    return task;
  }, [createTask]);

  const handleStatusChange = useCallback((id: string, status: CreateTaskInput['priority'], performedBy?: string) => {
    updateStatus(id, status as unknown as 'open' | 'in-progress' | 'resolved' | 'verified' | 'closed', performedBy);
  }, [updateStatus]);

  const handleAssign = useCallback((id: string, staffId: string, staffName: string) => {
    assignTask(id, staffId, staffName);
  }, [assignTask]);

  const handleSendMessage = useCallback((taskId: string, senderId: string, senderName: string, content: string) => {
    addMessage(taskId, senderId, senderName, content);
  }, [addMessage]);

  return {
    tasks,
    selectedTask,
    filter,
    isCreating,
    setIsCreating,
    selectTask,
    setFilter,
    handleCreateIssue,
    handleStatusChange,
    handleAssign,
    handleSendMessage,
  };
}
