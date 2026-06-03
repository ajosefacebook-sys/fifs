import { Project, CreateProjectInput, ProjectTask, ActivityEntry } from '@/types/project.types';
import { generateId } from '@/utils/helpers';
import { mockProjects } from '@/data/mockData';

let projects: Project[] = [...mockProjects];

export const projectService = {
  getAll: (): Project[] => {
    return [...projects];
  },

  getById: (id: string): Project | undefined => {
    return projects.find(p => p.id === id);
  },

  create: (input: CreateProjectInput, createdBy: string = 'System'): Project => {
    const project: Project = {
      id: generateId(),
      ...input,
      status: 'planning',
      budgetUsed: 0,
      mediaUrls: [],
      tasks: [],
      activityLog: [{
        id: generateId(),
        projectId: generateId(),
        action: 'Project created',
        performedBy: createdBy,
        timestamp: new Date().toISOString(),
      }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    projects = [project, ...projects];
    return project;
  },

  updateStatus: (id: string, status: Project['status'], performedBy: string = 'System'): Project | undefined => {
    const project = projects.find(p => p.id === id);
    if (!project) return undefined;
    project.status = status;
    project.updatedAt = new Date().toISOString();
    project.activityLog.push({
      id: generateId(),
      projectId: id,
      action: `Status changed to ${status}`,
      performedBy,
      timestamp: new Date().toISOString(),
    });
    return { ...project };
  },

  addTask: (projectId: string, task: Omit<ProjectTask, 'id' | 'projectId'>): Project | undefined => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return undefined;
    const newTask: ProjectTask = {
      ...task,
      id: generateId(),
      projectId,
      status: 'pending',
    };
    project.tasks.push(newTask);
    project.updatedAt = new Date().toISOString();
    return { ...project };
  },

  updateTaskStatus: (projectId: string, taskId: string, status: ProjectTask['status']): Project | undefined => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return undefined;
    const task = project.tasks.find(t => t.id === taskId);
    if (!task) return undefined;
    task.status = status;
    if (status === 'completed') task.completedAt = new Date().toISOString();
    project.updatedAt = new Date().toISOString();
    return { ...project };
  },

  updateBudget: (projectId: string, amount: number): Project | undefined => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return undefined;
    project.budgetUsed += amount;
    project.updatedAt = new Date().toISOString();
    return { ...project };
  },

  addMedia: (projectId: string, url: string): Project | undefined => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return undefined;
    project.mediaUrls.push(url);
    project.updatedAt = new Date().toISOString();
    return { ...project };
  },

  addActivity: (projectId: string, action: string, performedBy: string): Project | undefined => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return undefined;
    project.activityLog.push({
      id: generateId(),
      projectId,
      action,
      performedBy,
      timestamp: new Date().toISOString(),
    });
    project.updatedAt = new Date().toISOString();
    return { ...project };
  },
};
