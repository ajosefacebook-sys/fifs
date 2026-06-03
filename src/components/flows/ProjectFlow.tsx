'use client';

import { useState, useEffect } from 'react';
import { useProjectStore } from '@/store/useProjectStore';
import { useStaffStore } from '@/store/useStaffStore';
import { Project, CreateProjectInput, ProjectTask } from '@/types/project.types';
import { projectStatusConfig } from '@/utils/statusMapper';
import { formatDate, daysBetween } from '@/utils/date';
import { Card } from '@/components/shared/Card';
import { StatusPill } from '@/components/shared/StatusPill';
import { Plus, X, ChevronLeft, Users, DollarSign, Calendar } from 'lucide-react';

const projectTypes = [
  { value: 'renovation' as const, label: 'Renovation', color: '#8B5CF6' },
  { value: 'construction' as const, label: 'Construction', color: '#F97316' },
  { value: 'electrical-upgrade' as const, label: 'Electrical Upgrade', color: '#EAB308' },
  { value: 'hvac-install' as const, label: 'HVAC Install', color: '#06B6D4' },
  { value: 'plumbing' as const, label: 'Plumbing', color: '#3B82F6' },
  { value: 'general-maintenance' as const, label: 'General Maint.', color: '#22C55E' },
];

const projectTypeColors: Record<string, string> = Object.fromEntries(projectTypes.map(t => [t.value, t.color]));

export function ProjectFlow() {
  const { projects, selectedProject, selectProject, createProject, updateStatus, addTask, updateTaskStatus, loadProjects } = useProjectStore();
  const { staff, loadStaff } = useStaffStore();
  const [showCreate, setShowCreate] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [projectForm, setProjectForm] = useState({
    name: '', description: '', type: 'renovation' as CreateProjectInput['type'],
    startDate: '', endDate: '', budget: 0, teamMembers: [] as string[],
  });
  const [taskForm, setTaskForm] = useState({ title: '', description: '', assignedTo: '', dueDate: '' });

  useEffect(() => { loadProjects(); loadStaff(); }, [loadProjects, loadStaff]);

  const openDetail = (project: Project) => {
    selectProject(project.id);
    setShowDetail(true);
  };

  const closeDetail = () => {
    selectProject(null);
    setShowDetail(false);
  };

  const handleCreateProject = () => {
    if (!projectForm.name.trim()) return;
    createProject(projectForm, 'Current User');
    setProjectForm({ name: '', description: '', type: 'renovation', startDate: '', endDate: '', budget: 0, teamMembers: [] });
    setShowCreate(false);
  };

  const handleAddTask = () => {
    if (!taskForm.title.trim() || !selectedProject) return;
    addTask(selectedProject.id, {
      title: taskForm.title,
      description: taskForm.description,
      assignedTo: taskForm.assignedTo,
      dueDate: taskForm.dueDate,
      status: 'pending',
    });
    setTaskForm({ title: '', description: '', assignedTo: '', dueDate: '' });
    setShowAddTask(false);
  };

  return (
    <div className="relative">
      <div className="space-y-3">
        {projects.map(project => {
          const statusInfo = projectStatusConfig[project.status];
          const progress = project.budget > 0 ? Math.round((project.budgetUsed / project.budget) * 100) : 0;
          return (
            <Card key={project.id} hover onClick={() => openDetail(project)}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-white font-semibold">{project.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-medium" style={{ color: projectTypeColors[project.type] || '#888' }}>
                      {projectTypes.find(t => t.value === project.type)?.label || project.type}
                    </span>
                    <StatusPill label={statusInfo.label} color={statusInfo.color} bg={statusInfo.bg} />
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-[#888] mb-1">
                  <span>Budget: ₦{(project.budgetUsed / 1000000).toFixed(1)}M / ₦{(project.budget / 1000000).toFixed(1)}M</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 bg-[#1E1E1E] rounded-full overflow-hidden">
                  <div className="h-full bg-[#D4A843] rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>
              <div className="flex items-center gap-3 mt-2 text-xs text-[#888]">
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {project.teamMembers.length}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(project.startDate)}</span>
              </div>
            </Card>
          );
        })}
      </div>

      <button onClick={() => setShowCreate(true)} className="fixed bottom-20 md:bottom-8 right-6 w-14 h-14 bg-[#D4A843] text-black rounded-full shadow-lg flex items-center justify-center hover:bg-[#C8960C] transition-all duration-200 z-30">
        <Plus className="w-6 h-6" />
      </button>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowCreate(false)}>
          <div className="bg-[#161616] border border-[rgba(212,168,67,0.2)] rounded-t-2xl md:rounded-2xl w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-bold text-lg">Create Project</h2>
              <button onClick={() => setShowCreate(false)} className="text-[#888] hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[#888] text-xs block mb-1">Project Name</label>
                <input value={projectForm.name} onChange={e => setProjectForm(p => ({ ...p, name: e.target.value }))} className="w-full bg-[#1E1E1E] border border-[rgba(212,168,67,0.2)] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#D4A843]" />
              </div>
              <div>
                <label className="text-[#888] text-xs block mb-1">Description</label>
                <textarea value={projectForm.description} onChange={e => setProjectForm(p => ({ ...p, description: e.target.value }))} className="w-full bg-[#1E1E1E] border border-[rgba(212,168,67,0.2)] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#D4A843] h-20 resize-none" />
              </div>
              <div>
                <label className="text-[#888] text-xs block mb-1">Type</label>
                <select value={projectForm.type} onChange={e => setProjectForm(p => ({ ...p, type: e.target.value as CreateProjectInput['type'] }))} className="w-full bg-[#1E1E1E] border border-[rgba(212,168,67,0.2)] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#D4A843]">
                  {projectTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#888] text-xs block mb-1">Start Date</label>
                  <input type="date" value={projectForm.startDate} onChange={e => setProjectForm(p => ({ ...p, startDate: e.target.value }))} className="w-full bg-[#1E1E1E] border border-[rgba(212,168,67,0.2)] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#D4A843]" />
                </div>
                <div>
                  <label className="text-[#888] text-xs block mb-1">End Date</label>
                  <input type="date" value={projectForm.endDate} onChange={e => setProjectForm(p => ({ ...p, endDate: e.target.value }))} className="w-full bg-[#1E1E1E] border border-[rgba(212,168,67,0.2)] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#D4A843]" />
                </div>
              </div>
              <div>
                <label className="text-[#888] text-xs block mb-1">Budget (NGN)</label>
                <input type="number" value={projectForm.budget} onChange={e => setProjectForm(p => ({ ...p, budget: Number(e.target.value) }))} className="w-full bg-[#1E1E1E] border border-[rgba(212,168,67,0.2)] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#D4A843]" />
              </div>
              <div>
                <label className="text-[#888] text-xs block mb-1">Team Members</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {staff.map(s => {
                    const selected = projectForm.teamMembers.includes(s.id);
                    return (
                      <button key={s.id} onClick={() => setProjectForm(p => ({
                        ...p, teamMembers: selected ? p.teamMembers.filter(id => id !== s.id) : [...p.teamMembers, s.id]
                      }))} className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${selected ? 'bg-[#D4A843] text-black' : 'bg-[#1E1E1E] text-[#888] hover:text-white'}`}>
                        {s.name.split(' ')[0]}
                      </button>
                    );
                  })}
                </div>
              </div>
              <button onClick={handleCreateProject} className="w-full py-3 bg-[#D4A843] text-black font-bold rounded-xl hover:bg-[#C8960C] transition-all duration-200">Create Project</button>
            </div>
          </div>
        </div>
      )}

      {showDetail && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm" onClick={closeDetail}>
          <div className="bg-[#161616] border border-[rgba(212,168,67,0.2)] rounded-t-2xl md:rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-[#161616] border-b border-[rgba(212,168,67,0.1)] p-4 flex items-center gap-3">
              <button onClick={closeDetail} className="text-[#888] hover:text-white"><ChevronLeft className="w-5 h-5" /></button>
              <h2 className="text-white font-bold flex-1">{selectedProject.name}</h2>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium" style={{ color: projectTypeColors[selectedProject.type] }}>
                  {projectTypes.find(t => t.value === selectedProject.type)?.label}
                </span>
                <StatusPill label={projectStatusConfig[selectedProject.status].label} color={projectStatusConfig[selectedProject.status].color} bg={projectStatusConfig[selectedProject.status].bg} />
              </div>
              <p className="text-[#888] text-sm">{selectedProject.description}</p>

              <div className="bg-[#1E1E1E] rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#888] text-sm">Budget Progress</span>
                  <span className="text-[#D4A843] font-semibold">{Math.round((selectedProject.budgetUsed / selectedProject.budget) * 100)}%</span>
                </div>
                <div className="h-2 bg-[#0A0A0A] rounded-full overflow-hidden">
                  <div className="h-full bg-[#D4A843] rounded-full" style={{ width: `${(selectedProject.budgetUsed / selectedProject.budget) * 100}%` }} />
                </div>
                <div className="flex items-center justify-between text-xs text-[#888] mt-2">
                  <span>₦{(selectedProject.budgetUsed / 1000000).toFixed(1)}M used</span>
                  <span>₦{(selectedProject.budget / 1000000).toFixed(1)}M total</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-[#888]">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(selectedProject.startDate)} - {formatDate(selectedProject.endDate)}</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {selectedProject.teamMembers.length} members</span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-semibold text-sm">Tasks</h3>
                  {selectedProject.status !== 'complete' && (
                    <button onClick={() => setShowAddTask(true)} className="text-[#D4A843] text-xs font-medium hover:underline">+ Add Task</button>
                  )}
                </div>
                <div className="space-y-1.5">
                  {selectedProject.tasks.map(t => (
                    <div key={t.id} className="flex items-center gap-3 bg-[#1E1E1E] rounded-xl px-4 py-3">
                      <button
                        onClick={() => {
                          const next: Record<string, ProjectTask['status']> = { pending: 'in-progress', 'in-progress': 'completed', completed: 'pending' };
                          updateTaskStatus(selectedProject.id, t.id, next[t.status]);
                        }}
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${t.status === 'completed' ? 'bg-[#22C55E] border-[#22C55E]' : 'border-[#888] hover:border-[#D4A843]'}`}
                      >
                        {t.status === 'completed' && <div className="w-2 h-2 bg-white rounded-full" />}
                      </button>
                      <div className="flex-1">
                        <p className={`text-sm ${t.status === 'completed' ? 'text-[#888] line-through' : 'text-white'}`}>{t.title}</p>
                        <p className="text-[10px] text-[#888]">{t.assignedTo ? staff.find(s => s.id === t.assignedTo)?.name || 'Unassigned' : 'Unassigned'} · {formatDate(t.dueDate)}</p>
                      </div>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${t.status === 'completed' ? 'bg-[rgba(34,197,94,0.15)] text-[#22C55E]' : t.status === 'in-progress' ? 'bg-[rgba(234,179,8,0.15)] text-[#EAB308]' : 'bg-[rgba(136,136,136,0.15)] text-[#888]'}`}>
                        {t.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold text-sm mb-2">Activity Log</h3>
                <div className="space-y-1.5">
                  {selectedProject.activityLog.map(log => (
                    <div key={log.id} className="flex items-start gap-2 text-xs text-[#888]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D4A843] mt-1.5 shrink-0" />
                      <span>{log.action} - <span className="text-white">{log.performedBy}</span> <span className="text-[#666]">{formatDate(log.timestamp)}</span></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowAddTask(false)}>
          <div className="bg-[#161616] border border-[rgba(212,168,67,0.2)] rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-bold mb-4">Add Task</h3>
            <div className="space-y-3">
              <input value={taskForm.title} onChange={e => setTaskForm(p => ({ ...p, title: e.target.value }))} className="w-full bg-[#1E1E1E] border border-[rgba(212,168,67,0.2)] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#D4A843]" placeholder="Task title" />
              <textarea value={taskForm.description} onChange={e => setTaskForm(p => ({ ...p, description: e.target.value }))} className="w-full bg-[#1E1E1E] border border-[rgba(212,168,67,0.2)] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#D4A843] h-16 resize-none" placeholder="Description" />
              <select value={taskForm.assignedTo} onChange={e => setTaskForm(p => ({ ...p, assignedTo: e.target.value }))} className="w-full bg-[#1E1E1E] border border-[rgba(212,168,67,0.2)] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#D4A843]">
                <option value="">Assign to...</option>
                {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <input type="date" value={taskForm.dueDate} onChange={e => setTaskForm(p => ({ ...p, dueDate: e.target.value }))} className="w-full bg-[#1E1E1E] border border-[rgba(212,168,67,0.2)] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#D4A843]" />
              <button onClick={handleAddTask} className="w-full py-2.5 bg-[#D4A843] text-black font-bold rounded-xl hover:bg-[#C8960C] transition-all">Add Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
