import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Project } from '@/types/schedule';
import { DEFAULT_PROJECTS } from '@/lib/scheduler/defaults';

interface ProjectState {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  reorderPriority: (orderedIds: string[]) => void;
}

/** Generate a v4-style UUID. */
function uuid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Seed default projects with generated IDs and timestamps. */
function seedProjects(): Project[] {
  const now = new Date().toISOString();
  return DEFAULT_PROJECTS.map((p) => ({
    ...p,
    id: uuid(),
    user_id: '',
    created_at: now,
    updated_at: now,
  }));
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],

      setProjects: (projects) => set({ projects }),

      addProject: (project) =>
        set((state) => ({ projects: [...state.projects, project] })),

      updateProject: (id, updates) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id
              ? { ...p, ...updates, updated_at: new Date().toISOString() }
              : p,
          ),
        })),

      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),

      reorderPriority: (orderedIds) =>
        set((state) => ({
          projects: state.projects
            .map((p) => {
              const newPriority = orderedIds.indexOf(p.id);
              if (newPriority === -1) return p;
              return {
                ...p,
                priority: newPriority + 1,
                updated_at: new Date().toISOString(),
              };
            })
            .sort((a, b) => a.priority - b.priority),
        })),
    }),
    {
      name: 'flowday-projects',
      onRehydrateStorage: () => (state) => {
        // Pre-seed check: if empty after rehydration, load defaults
        if (state && state.projects.length === 0) {
          state.setProjects(seedProjects());
        }
      },
    },
  ),
);
