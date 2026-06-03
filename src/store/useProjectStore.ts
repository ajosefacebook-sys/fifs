'use client';

import { create } from 'zustand';
import { Project, CreateProjectInput, ProjectTask } from '@/types/project.types';
import { projectService } from '@/services/projectService';

interface ProjectState {
  projects: Project[];
  selectedProject: Project | null;
  loading: boolean;
  loadProjects: () => void;
  selectProject: (id: string | null) => void;
  createProject: (input: CreateProjectInput, createdBy?: string) => Project;
  updateStatus: (id: string, status: Project['status'], performedBy?: string) => void;
  addTask: (projectId: string, task: Omit<ProjectTask, 'id' | 'projectId'>) => void;
  updateTaskStatus: (projectId: string, taskId: string, status: ProjectTask['status']) => void;
  getActiveCount: () => number;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  selectedProject: null,
  loading: false,

  loadProjects: () => {
    const projects = projectService.getAll();
    set({ projects, loading: false });
  },

  selectProject: (id) => {
    if (!id) { set({ selectedProject: null }); return; }
    const project = projectService.getById(id);
    set({ selectedProject: project || null });
  },

  createProject: (input, createdBy) => {
    const project = projectService.create(input, createdBy);
    set((state) => ({ projects: [project, ...state.projects] }));
    return project;
  },

  updateStatus: (id, status, performedBy) => {
    projectService.updateStatus(id, status, performedBy);
    set((state) => ({
      projects: state.projects.map(p => p.id === id ? { ...p, status } : p),
      selectedProject: state.selectedProject?.id === id ? { ...state.selectedProject, status } : state.selectedProject,
    }));
  },

  addTask: (projectId, task) => {
    const updated = projectService.addTask(projectId, task);
    if (updated) {
      set((state) => ({
        projects: state.projects.map(p => p.id === projectId ? updated : p),
        selectedProject: state.selectedProject?.id === projectId ? updated : state.selectedProject,
      }));
    }
  },

  updateTaskStatus: (projectId, taskId, status) => {
    const updated = projectService.updateTaskStatus(projectId, taskId, status);
    if (updated) {
      set((state) => ({
        projects: state.projects.map(p => p.id === projectId ? updated : p),
        selectedProject: state.selectedProject?.id === projectId ? updated : state.selectedProject,
      }));
    }
  },

  getActiveCount: () => {
    return get().projects.filter(p => p.status === 'active').length;
  },
}));
