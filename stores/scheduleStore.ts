import { create } from 'zustand';
import type { TimeBlock, ScheduledSlot } from '@/types/schedule';
import { format, addDays, subDays, startOfWeek, parseISO } from 'date-fns';

/** Return the Monday of the week containing `date`. */
function weekMonday(date: Date): string {
  // date-fns startOfWeek defaults to Sunday; we want Monday (weekStartsOn: 1)
  const monday = startOfWeek(date, { weekStartsOn: 1 });
  return format(monday, 'yyyy-MM-dd');
}

interface ScheduleState {
  weekStartDate: string; // ISO date of Monday
  blocks: TimeBlock[];
  slots: ScheduledSlot[];

  setWeekStart: (date: string) => void;
  setBlocks: (blocks: TimeBlock[]) => void;
  setSlots: (slots: ScheduledSlot[]) => void;
  previousWeek: () => void;
  nextWeek: () => void;

  /** Get blocks for a specific date (YYYY-MM-DD). */
  getBlocksForDate: (date: string) => TimeBlock[];
  /** Get blocks for today. */
  getCurrentDayBlocks: () => TimeBlock[];
  /** Get the 7 ISO date strings for the current week (Mon-Sun). */
  getWeekDates: () => string[];
}

export const useScheduleStore = create<ScheduleState>()((set, get) => ({
  weekStartDate: weekMonday(new Date()),
  blocks: [],
  slots: [],

  setWeekStart: (date) => set({ weekStartDate: date }),
  setBlocks: (blocks) => set({ blocks }),
  setSlots: (slots) => set({ slots }),

  previousWeek: () =>
    set((state) => ({
      weekStartDate: format(
        subDays(parseISO(state.weekStartDate), 7),
        'yyyy-MM-dd',
      ),
    })),

  nextWeek: () =>
    set((state) => ({
      weekStartDate: format(
        addDays(parseISO(state.weekStartDate), 7),
        'yyyy-MM-dd',
      ),
    })),

  getBlocksForDate: (date) => get().blocks.filter((b) => b.date === date),

  getCurrentDayBlocks: () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return get().blocks.filter((b) => b.date === today);
  },

  getWeekDates: () => {
    const monday = parseISO(get().weekStartDate);
    return Array.from({ length: 7 }, (_, i) =>
      format(addDays(monday, i), 'yyyy-MM-dd'),
    );
  },
}));
