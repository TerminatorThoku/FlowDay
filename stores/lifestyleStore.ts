import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { startOfWeek, endOfWeek, parseISO, isWithinInterval } from 'date-fns';

export interface GymEntry {
  id: string;
  date: string;
  exercise: string;
  sets: number;
  reps: number;
  weight_kg: number;
}

export interface SwimEntry {
  id: string;
  date: string;
  laps: number;
  duration_minutes: number;
  stroke_type: string;
  notes: string;
}

export interface SleepEntry {
  id: string;
  date: string;
  hours: number;
  quality: number;
  notes: string;
}

interface LifestyleState {
  gymLogs: GymEntry[];
  swimLogs: SwimEntry[];
  sleepLogs: SleepEntry[];
  addGymEntry: (entry: Omit<GymEntry, 'id'>) => void;
  addSwimEntry: (entry: Omit<SwimEntry, 'id'>) => void;
  addSleepEntry: (entry: Omit<SleepEntry, 'id'>) => void;
  deleteGymEntry: (id: string) => void;
  deleteSwimEntry: (id: string) => void;
  deleteSleepEntry: (id: string) => void;
  getGymLogsForDate: (date: string) => GymEntry[];
  getSwimLogsForWeek: () => SwimEntry[];
  getSleepLogsForWeek: () => SleepEntry[];
  getGymLogsForWeek: () => GymEntry[];
}

function isInThisWeek(dateStr: string): boolean {
  const date = parseISO(dateStr);
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  return isWithinInterval(date, { start: weekStart, end: weekEnd });
}

export const GYM_EXERCISES = [
  'Bench Press',
  'Squat',
  'Deadlift',
  'Overhead Press',
  'Barbell Row',
  'Pull-up',
  'Dumbbell Curl',
  'Lat Pulldown',
  'Leg Press',
  'Plank',
] as const;

export const STROKE_TYPES = [
  'Freestyle',
  'Backstroke',
  'Breaststroke',
  'Butterfly',
  'Mixed',
] as const;

export const useLifestyleStore = create<LifestyleState>()(
  persist(
    (set, get) => ({
      gymLogs: [],
      swimLogs: [],
      sleepLogs: [],

      addGymEntry: (entry) =>
        set((state) => ({
          gymLogs: [...state.gymLogs, { ...entry, id: crypto.randomUUID() }],
        })),

      addSwimEntry: (entry) =>
        set((state) => ({
          swimLogs: [...state.swimLogs, { ...entry, id: crypto.randomUUID() }],
        })),

      addSleepEntry: (entry) =>
        set((state) => ({
          sleepLogs: [...state.sleepLogs, { ...entry, id: crypto.randomUUID() }],
        })),

      deleteGymEntry: (id) =>
        set((state) => ({
          gymLogs: state.gymLogs.filter((e) => e.id !== id),
        })),

      deleteSwimEntry: (id) =>
        set((state) => ({
          swimLogs: state.swimLogs.filter((e) => e.id !== id),
        })),

      deleteSleepEntry: (id) =>
        set((state) => ({
          sleepLogs: state.sleepLogs.filter((e) => e.id !== id),
        })),

      getGymLogsForDate: (date) =>
        get().gymLogs.filter((e) => e.date === date),

      getSwimLogsForWeek: () =>
        get().swimLogs.filter((e) => isInThisWeek(e.date)),

      getSleepLogsForWeek: () =>
        get().sleepLogs.filter((e) => isInThisWeek(e.date)),

      getGymLogsForWeek: () =>
        get().gymLogs.filter((e) => isInThisWeek(e.date)),
    }),
    {
      name: 'flowday-lifestyle',
    },
  ),
);
