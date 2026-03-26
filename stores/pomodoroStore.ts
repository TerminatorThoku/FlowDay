import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PomodoroSession } from "@/types/schedule";
import { format } from "date-fns";

interface PomodoroState {
  sessions: PomodoroSession[];
  currentTask: { id: string; title: string } | null;
  isRunning: boolean;

  addSession: (session: PomodoroSession) => void;
  startSession: (task: { id: string; title: string } | null) => void;
  endSession: () => void;

  // Computed-like helpers
  getTodayCount: () => number;
  getTodayMinutes: () => number;
  getTodaySessions: () => PomodoroSession[];
}

export const usePomodoroStore = create<PomodoroState>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentTask: null,
      isRunning: false,

      addSession: (session) =>
        set((state) => ({
          sessions: [...state.sessions, session],
        })),

      startSession: (task) =>
        set({
          currentTask: task,
          isRunning: true,
        }),

      endSession: () =>
        set({
          isRunning: false,
        }),

      getTodayCount: () => {
        const today = format(new Date(), "yyyy-MM-dd");
        return get().sessions.filter(
          (s) => s.started_at.startsWith(today) && s.completed
        ).length;
      },

      getTodayMinutes: () => {
        const today = format(new Date(), "yyyy-MM-dd");
        return get()
          .sessions.filter(
            (s) => s.started_at.startsWith(today) && s.completed
          )
          .reduce((sum, s) => sum + s.duration_minutes, 0);
      },

      getTodaySessions: () => {
        const today = format(new Date(), "yyyy-MM-dd");
        return get().sessions.filter((s) => s.started_at.startsWith(today));
      },
    }),
    {
      name: "flowday-pomodoro",
    }
  )
);
