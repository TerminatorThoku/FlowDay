import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface FocusSession {
  id: string;
  date: string;
  category: "focus" | "class" | "study" | "gym" | "project" | "free" | "sleep";
  minutes: number;
  startTime: number;
  endTime: number;
}

interface FocusState {
  weeklyGoalHours: number;
  dailyGoalHours: number;
  focusSessions: FocusSession[];
  setWeeklyGoal: (hours: number) => void;
  setDailyGoal: (hours: number) => void;
  addSession: (session: FocusSession) => void;
  getThisWeekStats: () => {
    focus: number;
    classes: number;
    study: number;
    free: number;
    gym: number;
    project: number;
    sleep: number;
  };
  getDailyBreakdown: () => { day: string; hours: number }[];
}

function getWeekDates(): string[] {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));

  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}

// Generate mock data for the current week
function generateMockSessions(): FocusSession[] {
  const weekDates = getWeekDates();
  const sessions: FocusSession[] = [];
  const categories: FocusSession["category"][] = [
    "focus", "class", "study", "gym", "project", "free", "sleep",
  ];

  weekDates.forEach((date, dayIdx) => {
    // Classes Mon-Fri
    if (dayIdx < 5) {
      sessions.push({
        id: `mock-class-${dayIdx}`,
        date,
        category: "class",
        minutes: 120 + Math.floor(Math.random() * 60),
        startTime: 510,
        endTime: 690,
      });
    }
    // Study most days
    if (dayIdx < 6) {
      sessions.push({
        id: `mock-study-${dayIdx}`,
        date,
        category: "study",
        minutes: 60 + Math.floor(Math.random() * 90),
        startTime: 840,
        endTime: 960,
      });
    }
    // Focus sessions
    sessions.push({
      id: `mock-focus-${dayIdx}`,
      date,
      category: "focus",
      minutes: 30 + Math.floor(Math.random() * 120),
      startTime: 600,
      endTime: 720,
    });
    // Gym some days
    if (dayIdx % 2 === 0) {
      sessions.push({
        id: `mock-gym-${dayIdx}`,
        date,
        category: "gym",
        minutes: 60 + Math.floor(Math.random() * 30),
        startTime: 780,
        endTime: 870,
      });
    }
    // Sleep every day
    sessions.push({
      id: `mock-sleep-${dayIdx}`,
      date,
      category: "sleep",
      minutes: 360 + Math.floor(Math.random() * 120),
      startTime: 1380,
      endTime: 1440,
    });
  });

  return sessions;
}

export const useFocusStore = create<FocusState>()(
  persist(
    (set, get) => ({
      weeklyGoalHours: 16,
      dailyGoalHours: 3,
      focusSessions: generateMockSessions(),

      setWeeklyGoal: (hours) => set({ weeklyGoalHours: hours }),
      setDailyGoal: (hours) => set({ dailyGoalHours: hours }),

      addSession: (session) =>
        set((state) => ({
          focusSessions: [...state.focusSessions, session],
        })),

      getThisWeekStats: () => {
        const weekDates = new Set(getWeekDates());
        const sessions = get().focusSessions.filter((s) =>
          weekDates.has(s.date)
        );
        const totals = {
          focus: 0, classes: 0, study: 0, free: 0,
          gym: 0, project: 0, sleep: 0,
        };
        sessions.forEach((s) => {
          const hours = s.minutes / 60;
          switch (s.category) {
            case "class": totals.classes += hours; break;
            case "study": totals.study += hours; break;
            case "focus": totals.focus += hours; break;
            case "free": totals.free += hours; break;
            case "gym": totals.gym += hours; break;
            case "project": totals.project += hours; break;
            case "sleep": totals.sleep += hours; break;
          }
        });
        return totals;
      },

      getDailyBreakdown: () => {
        const weekDates = getWeekDates();
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const sessions = get().focusSessions;

        return weekDates.map((date, i) => {
          const dayFocus = sessions
            .filter(
              (s) =>
                s.date === date &&
                (s.category === "focus" || s.category === "study")
            )
            .reduce((sum, s) => sum + s.minutes / 60, 0);
          return { day: days[i], hours: Math.round(dayFocus * 10) / 10 };
        });
      },
    }),
    { name: "flowday-focus" }
  )
);
