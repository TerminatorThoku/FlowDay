import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PriorityItem {
  id: string;
  title: string;
  type: "task" | "habit" | "project";
  priority: "critical" | "high" | "medium" | "low";
  dueDate?: string;
  projectId?: string;
  projectName?: string;
  completed: boolean;
  category?: string;
}

interface PriorityState {
  items: PriorityItem[];
  addItem: (item: Omit<PriorityItem, "id">) => void;
  updateItem: (id: string, updates: Partial<PriorityItem>) => void;
  deleteItem: (id: string) => void;
  changePriority: (id: string, priority: PriorityItem["priority"]) => void;
  toggleComplete: (id: string) => void;
  getByPriority: (
    priority: PriorityItem["priority"]
  ) => PriorityItem[];
}

const defaultItems: PriorityItem[] = [
  {
    id: "pri-1",
    title: "OOP Assignment 3",
    type: "task",
    priority: "critical",
    dueDate: new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0],
    projectName: "OOP",
    completed: false,
    category: "Assignments",
  },
  {
    id: "pri-2",
    title: "Data Analytics Report",
    type: "task",
    priority: "critical",
    dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0],
    projectName: "Data Analytics",
    completed: false,
    category: "Assignments",
  },
  {
    id: "pri-3",
    title: "GameVault API Integration",
    type: "project",
    priority: "high",
    dueDate: new Date(Date.now() + 10 * 86400000).toISOString().split("T")[0],
    projectName: "GameVault",
    completed: false,
    category: "Projects",
  },
  {
    id: "pri-4",
    title: "System Analysis Diagrams",
    type: "task",
    priority: "high",
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
    projectName: "System Analysis",
    completed: false,
    category: "Assignments",
  },
  {
    id: "pri-5",
    title: "Gym: Increase bench PR",
    type: "habit",
    priority: "medium",
    completed: false,
    category: "Habits",
  },
  {
    id: "pri-6",
    title: "Read 20 pages daily",
    type: "habit",
    priority: "medium",
    completed: false,
    category: "Habits",
  },
  {
    id: "pri-7",
    title: "Update LinkedIn Profile",
    type: "task",
    priority: "low",
    completed: false,
    category: "Personal",
  },
  {
    id: "pri-8",
    title: "Explore React Native",
    type: "task",
    priority: "low",
    completed: false,
    category: "Personal",
  },
];

export const usePriorityStore = create<PriorityState>()(
  persist(
    (set, get) => ({
      items: defaultItems,

      addItem: (item) =>
        set((state) => ({
          items: [...state.items, { ...item, id: `pri-${Date.now()}` }],
        })),

      updateItem: (id, updates) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        })),

      deleteItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      changePriority: (id, priority) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, priority } : item
          ),
        })),

      toggleComplete: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, completed: !item.completed } : item
          ),
        })),

      getByPriority: (priority) => {
        return get().items.filter((item) => item.priority === priority);
      },
    }),
    { name: "flowday-priorities" }
  )
);
