import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Habit {
  id: string;
  name: string;
  icon: string;
  frequency: "daily" | "weekdays" | "custom";
  customDays?: number[];
  duration: { min: number; max: number };
  category: "health" | "study" | "personal" | "work";
  color: string;
  streak: number;
  completions: Record<string, boolean>;
  createdAt: string;
}

interface HabitState {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, "id" | "streak" | "completions" | "createdAt">) => void;
  deleteHabit: (id: string) => void;
  toggleCompletion: (id: string, date: string) => void;
  getCompletionsForDate: (date: string) => number;
  getHeatmapData: () => Record<string, number>;
}

const defaultHabits: Habit[] = [
  {
    id: "h1",
    name: "Gym Workout",
    icon: "\uD83C\uDFCB\uFE0F",
    frequency: "daily",
    duration: { min: 60, max: 90 },
    category: "health",
    color: "#22c55e",
    streak: 7,
    completions: generateRecentCompletions(30, 0.85),
    createdAt: "2025-01-15",
  },
  {
    id: "h2",
    name: "Study Session",
    icon: "\uD83D\uDCDA",
    frequency: "weekdays",
    duration: { min: 60, max: 120 },
    category: "study",
    color: "#a855f7",
    streak: 5,
    completions: generateRecentCompletions(30, 0.75),
    createdAt: "2025-01-10",
  },
  {
    id: "h3",
    name: "Swimming",
    icon: "\uD83C\uDFCA",
    frequency: "custom",
    customDays: [1, 3, 5],
    duration: { min: 30, max: 60 },
    category: "health",
    color: "#06b6d4",
    streak: 3,
    completions: generateRecentCompletions(30, 0.6),
    createdAt: "2025-02-01",
  },
  {
    id: "h4",
    name: "Coding Practice",
    icon: "\uD83D\uDCBB",
    frequency: "daily",
    duration: { min: 30, max: 60 },
    category: "work",
    color: "#f97316",
    streak: 12,
    completions: generateRecentCompletions(30, 0.9),
    createdAt: "2025-01-01",
  },
  {
    id: "h5",
    name: "Reading",
    icon: "\uD83D\uDCD6",
    frequency: "daily",
    duration: { min: 15, max: 30 },
    category: "personal",
    color: "#f59e0b",
    streak: 2,
    completions: generateRecentCompletions(30, 0.5),
    createdAt: "2025-02-15",
  },
];

function generateRecentCompletions(
  days: number,
  probability: number
): Record<string, boolean> {
  const completions: Record<string, boolean> = {};
  const now = new Date();
  for (let i = 0; i < days; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = d.toISOString().split("T")[0];
    if (Math.random() < probability) {
      completions[key] = true;
    }
  }
  return completions;
}

export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
      habits: defaultHabits,

      addHabit: (habit) =>
        set((state) => ({
          habits: [
            ...state.habits,
            {
              ...habit,
              id: `h-${Date.now()}`,
              streak: 0,
              completions: {},
              createdAt: new Date().toISOString().split("T")[0],
            },
          ],
        })),

      deleteHabit: (id) =>
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
        })),

      toggleCompletion: (id, date) =>
        set((state) => ({
          habits: state.habits.map((h) => {
            if (h.id !== id) return h;
            const newCompletions = { ...h.completions };
            if (newCompletions[date]) {
              delete newCompletions[date];
            } else {
              newCompletions[date] = true;
            }
            return { ...h, completions: newCompletions };
          }),
        })),

      getCompletionsForDate: (date) => {
        return get().habits.filter((h) => h.completions[date]).length;
      },

      getHeatmapData: () => {
        const data: Record<string, number> = {};
        const habits = get().habits;
        const now = new Date();

        for (let i = 0; i < 365; i++) {
          const d = new Date(now);
          d.setDate(now.getDate() - i);
          const key = d.toISOString().split("T")[0];
          data[key] = habits.filter((h) => h.completions[key]).length;
        }

        return data;
      },
    }),
    { name: "flowday-habits" }
  )
);
