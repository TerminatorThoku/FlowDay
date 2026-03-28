import { create } from "zustand";

interface PomodoroSession {
  id: string;
  label: string;
  type: "focus" | "break" | "longBreak";
  duration: number;
  completedAt: string;
}

interface TimerState {
  completedSessions: PomodoroSession[];
  totalFocusMinutes: number;
  addSession: (session: PomodoroSession) => void;
}

export const useTimerStore = create<TimerState>((set) => ({
  completedSessions: [],
  totalFocusMinutes: 0,
  addSession: (session) =>
    set((state) => ({
      completedSessions: [...state.completedSessions, session],
      totalFocusMinutes:
        state.totalFocusMinutes +
        (session.type === "focus" ? session.duration : 0),
    })),
}));
