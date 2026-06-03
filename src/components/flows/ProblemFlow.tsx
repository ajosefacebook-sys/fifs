'use client';

import { useState, useEffect } from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import { useStaffStore } from '@/store/useStaffStore';
import { CreateTaskInput, Task, TaskStatus, Priority } from '@/types/task.types';
import { CATEGORY_MAP } from '@/constants/categories';
import { PRIORITY_MAP } from '@/constants/priorities';
import { taskStatusConfig, getTimeAgo } from '@/utils/statusMapper';
import { Card } from '@/components/shared/Card';
import { StatusPill } from '@/components/shared/StatusPill';
import { formatDateTime } from '@/utils/date';
import { Plus, MessageSquare, Send, X, ChevronLeft, Camera, History } from 'lucide-react';

const statusFilters: { key: TaskStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'open', label: 'Open' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'resolved', label: 'Resolved' },
  { key: 'verified', label: 'Verified' },
  { key: 'closed', label: 'Closed' },
];

export function ProblemFlow() {
  const { tasks, filter, setFilter, selectedTask, selectTask, createTask, updateStatus, assignTask, addMessage, loadTasks } = useTaskStore();
  const { staff, loadStaff } = useStaffStore();
  const [showCreate, setShowCreate] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [formData, setFormData] = useState<CreateTaskInput>({
    title: '', description: '', category: 'plumbing', priority: 'medium', location: '', assignedTo: null,
  });

  useEffect(() => { loadTasks(); loadStaff(); }, [loadTasks, loadStaff]);

  const filteredTasks = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

  const handleCreate = () => {
    if (!formData.title.trim()) return;
    createTask(formData, 'Current User');
    setFormData({ title: '', description: '', category: 'plumbing', priority: 'medium', location: '', assignedTo: null });
    setShowCreate(false);
  };

  const openDetail = (task: Task) => {
    selectTask(task.id);
    setShowDetail(true);
  };

  const closeDetail = () => {
    selectTask(null);
    setShowDetail(false);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedTask) return;
    addMessage(selectedTask.id, 'user', 'Current User', messageInput);
    setMessageInput('');
  };

  const handleStatusUpdate = (status: TaskStatus) => {
    if (!selectedTask) return;
    updateStatus(selectedTask.id, status, 'Current User');
  };

  const statusOptions: TaskStatus[] = ['open', 'in-progress', 'resolved', 'verified', 'closed'];

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1 overflow-x-auto pb-1">
          {statusFilters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${filter === f.key ? 'bg-[#D4A843] text-black' : 'bg-[#1E1E1E] text-[#888] hover:text-white'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredTasks.map(task => {
          const catInfo = CATEGORY_MAP[task.category];
          const priInfo = PRIORITY_MAP[task.priority];
          const statusInfo = taskStatusConfig[task.status];
          return (
            <Card key={task.id} hover onClick={() => openDetail(task)}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-medium" style={{ color: catInfo?.color }}>{catInfo?.label}</span>
                    <StatusPill label={priInfo.label} color={priInfo.color} bg={priInfo.bg} />
                    <StatusPill label={statusInfo.label} color={statusInfo.color} bg={statusInfo.bg} />
                  </div>
                  <h4 className="text-white font-semibold text-sm truncate">{task.title}</h4>
                  <p className="text-[#888] text-xs mt-0.5">{task.location}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-[#888]">
                    {task.assignedToName && <span>{task.assignedToName}</span>}
                    <span>{getTimeAgo(task.createdAt)}</span>
                    {task.chatMessages.length > 0 && (
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" /> {task.chatMessages.length}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#D4A843] text-sm">No issues found</p>
          </div>
        )}
      </div>

      <button
        onClick={() => setShowCreate(true)}
        className="fixed bottom-20 md:bottom-8 right-6 w-14 h-14 bg-[#D4A843] text-black rounded-full shadow-lg flex items-center justify-center hover:bg-[#C8960C] transition-all duration-200 z-30"
      >
        <Plus className="w-6 h-6" />
      </button>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowCreate(false)}>
          <div className="bg-[#161616] border border-[rgba(212,168,67,0.2)] rounded-t-2xl md:rounded-2xl w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-bold text-lg">Create Issue</h2>
              <button onClick={() => setShowCreate(false)} className="text-[#888] hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[#888] text-xs block mb-1">Title</label>
                <input value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} className="w-full bg-[#1E1E1E] border border-[rgba(212,168,67,0.2)] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#D4A843] transition-colors" placeholder="Describe the issue..." />
              </div>
              <div>
                <label className="text-[#888] text-xs block mb-1">Description</label>
                <textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} className="w-full bg-[#1E1E1E] border border-[rgba(212,168,67,0.2)] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#D4A843] transition-colors h-20 resize-none" placeholder="Details..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#888] text-xs block mb-1">Category</label>
                  <select value={formData.category} onChange={e => setFormData(p => ({ ...p, category: e.target.value as CreateTaskInput['category'] }))} className="w-full bg-[#1E1E1E] border border-[rgba(212,168,67,0.2)] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#D4A843] transition-colors">
                    {Object.entries(CATEGORY_MAP).map(([key, cat]) => (
                      <option key={key} value={key}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[#888] text-xs block mb-1">Priority</label>
                  <select value={formData.priority} onChange={e => setFormData(p => ({ ...p, priority: e.target.value as Priority }))} className="w-full bg-[#1E1E1E] border border-[rgba(212,168,67,0.2)] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#D4A843] transition-colors">
                    {Object.entries(PRIORITY_MAP).map(([key, pri]) => (
                      <option key={key} value={key}>{pri.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[#888] text-xs block mb-1">Location</label>
                <input value={formData.location} onChange={e => setFormData(p => ({ ...p, location: e.target.value }))} className="w-full bg-[#1E1E1E] border border-[rgba(212,168,67,0.2)] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#D4A843] transition-colors" placeholder="e.g. Block A - Floor 2" />
              </div>
              <div>
                <label className="text-[#888] text-xs block mb-1">Assign To</label>
                <select value={formData.assignedTo || ''} onChange={e => setFormData(p => ({ ...p, assignedTo: e.target.value || null }))} className="w-full bg-[#1E1E1E] border border-[rgba(212,168,67,0.2)] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#D4A843] transition-colors">
                  <option value="">Unassigned</option>
                  {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <button onClick={handleCreate} className="w-full py-3 bg-[#D4A843] text-black font-bold rounded-xl hover:bg-[#C8960C] transition-all duration-200">
                Create Issue
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetail && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm" onClick={closeDetail}>
          <div className="bg-[#161616] border border-[rgba(212,168,67,0.2)] rounded-t-2xl md:rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-[#161616] border-b border-[rgba(212,168,67,0.1)] p-4 flex items-center gap-3">
              <button onClick={closeDetail} className="text-[#888] hover:text-white"><ChevronLeft className="w-5 h-5" /></button>
              <h2 className="text-white font-bold flex-1">{selectedTask.title}</h2>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex flex-wrap gap-2">
                <StatusPill label={CATEGORY_MAP[selectedTask.category]?.label} color={CATEGORY_MAP[selectedTask.category]?.color} bg={CATEGORY_MAP[selectedTask.category]?.color + '25'} />
                <StatusPill label={PRIORITY_MAP[selectedTask.priority]?.label} color={PRIORITY_MAP[selectedTask.priority]?.color} bg={PRIORITY_MAP[selectedTask.priority]?.bg} />
                <StatusPill label={taskStatusConfig[selectedTask.status]?.label} color={taskStatusConfig[selectedTask.status]?.color} bg={taskStatusConfig[selectedTask.status]?.bg} />
              </div>
              <p className="text-[#888] text-sm">{selectedTask.description}</p>
              <div className="text-xs text-[#888] space-y-1">
                <p>Location: <span className="text-white">{selectedTask.location}</span></p>
                <p>Assigned: <span className="text-white">{selectedTask.assignedToName || 'Unassigned'}</span></p>
                <p>Created: {formatDateTime(selectedTask.createdAt)}</p>
              </div>

              <div>
                <h3 className="text-white font-semibold text-sm mb-2 flex items-center gap-2"><History className="w-4 h-4" /> History</h3>
                <div className="space-y-1.5">
                  {selectedTask.history.map(h => (
                    <div key={h.id} className="text-xs text-[#888] flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D4A843] mt-1.5 shrink-0" />
                      <span>{h.action} - <span className="text-white">{h.performedBy}</span> <span className="text-[#666]">{formatDateTime(h.timestamp)}</span></span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold text-sm mb-2">Update Status</h3>
                <div className="flex gap-2 flex-wrap">
                  {statusOptions.map(s => {
                    const info = taskStatusConfig[s];
                    if (s === selectedTask.status) return null;
                    return (
                      <button key={s} onClick={() => handleStatusUpdate(s)} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200" style={{ color: info.color, backgroundColor: info.bg, border: `1px solid ${info.color}33` }}>
                        {info.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Chat</h3>
                <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                  {selectedTask.chatMessages.map(msg => (
                    <div key={msg.id} className="bg-[#1E1E1E] rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[#D4A843] text-xs font-medium">{msg.senderName}</span>
                        <span className="text-[#666] text-[10px]">{formatDateTime(msg.timestamp)}</span>
                      </div>
                      <p className="text-white text-sm">{msg.content}</p>
                    </div>
                  ))}
                  {selectedTask.chatMessages.length === 0 && <p className="text-[#888] text-xs">No messages yet</p>}
                </div>
                <div className="flex gap-2">
                  <input value={messageInput} onChange={e => setMessageInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} className="flex-1 bg-[#1E1E1E] border border-[rgba(212,168,67,0.2)] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#D4A843] transition-colors" placeholder="Type a message..." />
                  <button onClick={handleSendMessage} className="w-10 h-10 bg-[#D4A843] text-black rounded-xl flex items-center justify-center hover:bg-[#C8960C] transition-colors"><Send className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
