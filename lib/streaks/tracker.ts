import { format, subDays, parseISO, isToday } from "date-fns";

export interface StreakData {
  type: string; // 'gym', 'study', 'coding', 'sleep', 'overall'
  currentStreak: number;
  bestStreak: number;
  todayCompleted: boolean;
  lastCompletedDate: string | null;
}

/**
 * Calculate streak from array of completion records.
 * Records should have { date: 'YYYY-MM-DD', completed: boolean }.
 * Counts consecutive completed days working backward from today.
 */
export function calculateStreak(
  records: { date: string; completed: boolean }[]
): { current: number; best: number } {
  if (records.length === 0) return { current: 0, best: 0 };

  // Build a set of completed dates for O(1) lookup
  const completedDates = new Set(
    records.filter((r) => r.completed).map((r) => r.date)
  );

  if (completedDates.size === 0) return { current: 0, best: 0 };

  // Calculate current streak: count consecutive days backward from today
  let current = 0;
  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");

  // Start from today. If today is not completed, check yesterday as starting point
  let startDate = today;
  if (!completedDates.has(todayStr)) {
    const yesterday = subDays(today, 1);
    const yesterdayStr = format(yesterday, "yyyy-MM-dd");
    if (!completedDates.has(yesterdayStr)) {
      // Streak is broken - neither today nor yesterday completed
      // Still need to calculate best streak
    } else {
      startDate = yesterday;
    }
  }

  // Count backward from startDate
  if (
    completedDates.has(format(startDate, "yyyy-MM-dd"))
  ) {
    let checkDate = startDate;
    while (completedDates.has(format(checkDate, "yyyy-MM-dd"))) {
      current++;
      checkDate = subDays(checkDate, 1);
    }
  }

  // Calculate best streak: scan all sorted dates
  const sortedDates = Array.from(completedDates).sort();
  let best = 0;
  let tempStreak = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = parseISO(sortedDates[i - 1]);
    const currDate = parseISO(sortedDates[i]);
    const diffDays = Math.round(
      (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      tempStreak++;
    } else {
      best = Math.max(best, tempStreak);
      tempStreak = 1;
    }
  }
  best = Math.max(best, tempStreak);
  best = Math.max(best, current);

  return { current, best };
}

/**
 * Get all streak types and their current values.
 */
export function getAllStreaks(
  completions: Record<string, { date: string; completed: boolean }[]>
): StreakData[] {
  const streakTypes = ["gym", "study", "coding", "sleep", "overall"];

  return streakTypes.map((type) => {
    const records = completions[type] || [];
    const { current, best } = calculateStreak(records);

    const completedDates = records
      .filter((r) => r.completed)
      .map((r) => r.date)
      .sort()
      .reverse();

    const lastCompletedDate = completedDates[0] || null;

    let todayCompleted = false;
    if (lastCompletedDate) {
      const lastDate = parseISO(lastCompletedDate);
      todayCompleted = isToday(lastDate);
    }

    return {
      type,
      currentStreak: current,
      bestStreak: best,
      todayCompleted,
      lastCompletedDate,
    };
  });
}
