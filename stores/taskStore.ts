import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task } from '@/types/schedule';

interface TaskState {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  getTasksByProject: (projectId: string) => Task[];
  getTasksByStatus: (status: Task['status']) => Task[];
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],

      addTask: (task) =>
        set((state) => ({ tasks: [...state.tasks, task] })),

      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? { ...t, ...updates, updated_at: new Date().toISOString() }
              : t,
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),

      completeTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  status: 'done' as const,
                  completed_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                }
              : t,
          ),
        })),

      getTasksByProject: (projectId) =>
        get().tasks.filter((t) => t.project_id === projectId),

      getTasksByStatus: (status) =>
        get().tasks.filter((t) => t.status === status),
    }),
    {
      name: 'flowday-tasks',
    },
  ),
);
