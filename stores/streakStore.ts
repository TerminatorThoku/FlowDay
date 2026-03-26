import { create } from "zustand";
import { persist } from "zustand/middleware";
import { format } from "date-fns";
import {
  type StreakData,
  getAllStreaks,
} from "@/lib/streaks/tracker";

interface StreakState {
  streaks: StreakData[];
  completions: Record<string, { date: string; completed: boolean }[]>;

  markCompleted: (type: string, date?: string) => void;
  refreshStreaks: () => void;
}

export const useStreakStore = create<StreakState>()(
  persist(
    (set, get) => ({
      streaks: [],
      completions: {},

      markCompleted: (type, date) => {
        const dateStr = date || format(new Date(), "yyyy-MM-dd");

        set((state) => {
          const typeRecords = state.completions[type] || [];

          // Check if already has a record for this date
          const existingIdx = typeRecords.findIndex(
            (r) => r.date === dateStr
          );

          let updatedRecords: { date: string; completed: boolean }[];
          if (existingIdx >= 0) {
            // Toggle the completion
            updatedRecords = typeRecords.map((r, i) =>
              i === existingIdx ? { ...r, completed: !r.completed } : r
            );
          } else {
            updatedRecords = [
              ...typeRecords,
              { date: dateStr, completed: true },
            ];
          }

          const newCompletions = {
            ...state.completions,
            [type]: updatedRecords,
          };

          return {
            completions: newCompletions,
            streaks: getAllStreaks(newCompletions),
          };
        });
      },

      refreshStreaks: () => {
        const { completions } = get();
        set({ streaks: getAllStreaks(completions) });
      },
    }),
    {
      name: "flowday-streaks",
    }
  )
);
