'use client';

import { useEffect, useState } from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import { useStaffStore } from '@/store/useStaffStore';
import { useProjectStore } from '@/store/useProjectStore';
import { Task } from '@/types/task.types';
import { getDashboardStats } from '@/data/mockData';
import { Card } from '@/components/shared/Card';
import { StatusPill } from '@/components/shared/StatusPill';
import { PRIORITY_MAP } from '@/constants/priorities';
import { CATEGORY_MAP } from '@/constants/categories';
import { taskStatusConfig, getTimeAgo } from '@/utils/statusMapper';
import { getOverdueDuration } from '@/utils/date';
import { AlertTriangle, Clock, ChevronRight, Zap } from 'lucide-react';
import { ChecklistType } from '@/types/project.types';
import { useChecklistStore } from '@/store/useChecklistStore';

const checklistNames: Record<ChecklistType, string> = {
  daily: 'Daily', generator: 'Generator', plumbing: 'Plumbing',
  electrical: 'Electrical', hvac: 'HVAC', cleaning: 'Cleaning',
};

const checklistColors: Record<ChecklistType, { bg: string; border: string }> = {
  daily: { bg: '#D4A843', border: 'rgba(212,168,67,0.3)' },
  generator: { bg: '#F97316', border: 'rgba(249,115,22,0.3)' },
  plumbing: { bg: '#3B82F6', border: 'rgba(59,130,246,0.3)' },
  electrical: { bg: '#EAB308', border: 'rgba(234,179,8,0.3)' },
  hvac: { bg: '#06B6D4', border: 'rgba(6,182,212,0.3)' },
  cleaning: { bg: '#22C55E', border: 'rgba(34,197,94,0.3)' },
};

export function Dashboard() {
  const { tasks, loadTasks } = useTaskStore();
  const { staff, loadStaff } = useStaffStore();
  const { projects, loadProjects } = useProjectStore();
  const { checklists, loadChecklists } = useChecklistStore();
  const [stats, setStats] = useState({ openIssuesCount: 0, criticalExists: false, tasksDueTodayCount: 0, overdueTasks: [] as Task[], staffOnSite: 0, activeProjects: 0 });

  useEffect(() => {
    loadTasks(); loadStaff(); loadProjects(); loadChecklists();
    const s = getDashboardStats();
    setStats(s);
  }, [loadTasks, loadStaff, loadProjects, loadChecklists]);

  const openCriticalIssues = tasks.filter(t => t.priority === 'critical' && t.status !== 'closed' && t.status !== 'resolved' && t.status !== 'verified');
  const openIssues = tasks.filter(t => t.status === 'open' || t.status === 'in-progress');
  const todayOverdue = tasks.filter(t => t.dueDate && new Date(t.dueDate).getTime() < Date.now() && t.status !== 'closed' && t.status !== 'resolved');

  const getChecklistProgress = (clId: string) => {
    const cl = checklists.find(c => c.id === clId);
    if (!cl || cl.items.length === 0) return { green: 0, yellow: 0, red: 0 };
    const total = cl.items.length;
    return {
      green: (cl.items.filter(i => i.status === 'ok').length / total) * 100,
      yellow: (cl.items.filter(i => i.status === 'warning').length / total) * 100,
      red: (cl.items.filter(i => i.status === 'fault').length / total) * 100,
    };
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card>
          <p className="text-[#888] text-xs mb-1">Open Issues</p>
          <div className="flex items-center gap-2">
            <span className="text-white text-2xl font-bold">{openIssues.length}</span>
            {stats.criticalExists && <span className="flex items-center gap-1 text-[#EF4444] text-xs"><Zap className="w-3 h-3" /> Critical</span>}
          </div>
        </Card>
        <Card>
          <p className="text-[#888] text-xs mb-1">Tasks Due Today</p>
          <div className="flex items-center gap-2">
            <span className="text-white text-2xl font-bold">{todayOverdue.length}</span>
            {todayOverdue.length > 0 && <AlertTriangle className="w-4 h-4 text-[#EAB308]" />}
          </div>
        </Card>
        <Card>
          <p className="text-[#888] text-xs mb-1">Staff On-Site</p>
          <span className="text-white text-2xl font-bold">{staff.filter(s => s.status === 'on-site').length}</span>
        </Card>
        <Card>
          <p className="text-[#888] text-xs mb-1">Active Projects</p>
          <span className="text-white text-2xl font-bold">{projects.filter(p => p.status === 'active').length}</span>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1">
          <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-[#EF4444]" /> What's Broken</h3>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {openCriticalIssues.length > 0 && (
              <div className="mb-2">
                <p className="text-[#EF4444] text-[10px] font-semibold uppercase mb-1">Critical</p>
                {openCriticalIssues.map(task => (
                  <div key={task.id} className="flex items-start justify-between py-1.5 border-b border-[rgba(255,255,255,0.05)] last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium truncate">{task.title}</p>
                      <p className="text-[#888] text-[10px]">{task.location} · {task.assignedToName || 'Unassigned'}</p>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <StatusPill label={PRIORITY_MAP[task.priority].label} color={PRIORITY_MAP[task.priority].color} bg={PRIORITY_MAP[task.priority].bg} />
                      <p className="text-[#666] text-[10px] mt-0.5">{getTimeAgo(task.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {openIssues.filter(t => t.priority !== 'critical').slice(0, 5).map(task => (
              <div key={task.id} className="flex items-start justify-between py-1.5 border-b border-[rgba(255,255,255,0.05)] last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-medium truncate">{task.title}</p>
                  <p className="text-[#888] text-[10px]">{task.location} · {task.assignedToName || 'Unassigned'}</p>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <StatusPill label={taskStatusConfig[task.status].label} color={taskStatusConfig[task.status].color} bg={taskStatusConfig[task.status].bg} />
                  <p className="text-[#666] text-[10px] mt-0.5">{getTimeAgo(task.createdAt)}</p>
                </div>
              </div>
            ))}
            {openIssues.length === 0 && <p className="text-[#888] text-xs text-center py-4">No open issues</p>}
          </div>
        </Card>

        <Card className="lg:col-span-1">
          <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-[#D4A843]" /> Today's Checklist Status</h3>
          <div className="space-y-3">
            {checklists.map(cl => {
              const prog = getChecklistProgress(cl.id);
              const colors = checklistColors[cl.type];
              return (
                <div key={cl.id}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[#888]">{checklistNames[cl.type]}</span>
                    <span className={`font-medium ${cl.completed ? 'text-[#22C55E]' : 'text-[#EAB308]'}`}>
                      {cl.completed ? 'Done' : 'Pending'}
                    </span>
                  </div>
                  <div className="h-2 bg-[#1E1E1E] rounded-full overflow-hidden flex">
                    {prog.green > 0 && <div className="h-full" style={{ width: `${prog.green}%`, backgroundColor: '#22C55E' }} />}
                    {prog.yellow > 0 && <div className="h-full" style={{ width: `${prog.yellow}%`, backgroundColor: '#EAB308' }} />}
                    {prog.red > 0 && <div className="h-full" style={{ width: `${prog.red}%`, backgroundColor: '#EF4444' }} />}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="lg:col-span-1">
          <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-[#EAB308]" /> Overdue Tasks</h3>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {todayOverdue.map(task => (
              <div key={task.id} className="bg-[#1E1E1E] rounded-xl p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-medium truncate">{task.title}</p>
                    <p className="text-[#888] text-[10px]">{task.assignedToName || 'Unassigned'}</p>
                  </div>
                  <span className="text-[#EF4444] text-[10px] font-medium shrink-0 ml-2">
                    {task.dueDate ? getOverdueDuration(task.dueDate) : ''}
                  </span>
                </div>
                <button className="mt-1.5 text-[#D4A843] text-[10px] font-medium hover:underline flex items-center gap-1">
                  Escalate <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            ))}
            {todayOverdue.length === 0 && <p className="text-[#888] text-xs text-center py-4">No overdue tasks</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}
