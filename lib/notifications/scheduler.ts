import type { TimeBlock } from "@/types/schedule";

export interface NotificationConfig {
  classReminder: number; // minutes before
  taskReminder: number;
  gymReminder: number;
}

export interface ScheduledNotification {
  title: string;
  body: string;
  fireAt: Date;
}

const DEFAULT_CONFIG: NotificationConfig = {
  classReminder: 15,
  taskReminder: 10,
  gymReminder: 30,
};

function minutesToDate(date: string, minutes: number): Date {
  const [year, month, day] = date.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  d.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
  return d;
}

function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const period = h >= 12 ? "PM" : "AM";
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayH}:${m.toString().padStart(2, "0")} ${period}`;
}

/**
 * Calculate notification times for a set of time blocks.
 * Returns notifications that should fire in the future.
 */
export function calculateNotificationTimes(
  blocks: TimeBlock[],
  config: NotificationConfig = DEFAULT_CONFIG
): ScheduledNotification[] {
  const now = new Date();
  const notifications: ScheduledNotification[] = [];

  blocks.forEach((block) => {
    const blockStart = minutesToDate(block.date, block.startMinutes);
    const timeStr = formatTime(block.startMinutes);

    switch (block.type) {
      case "class": {
        const fireAt = new Date(
          blockStart.getTime() - config.classReminder * 60 * 1000
        );
        if (fireAt > now) {
          const location = block.location ? ` -- ${block.location}` : "";
          notifications.push({
            title: `${block.title} in ${config.classReminder} min`,
            body: `Class starts at ${timeStr}${location}`,
            fireAt,
          });
        }
        break;
      }

      case "project": {
        const fireAt = new Date(
          blockStart.getTime() - config.taskReminder * 60 * 1000
        );
        if (fireAt > now) {
          const projectName =
            (block.meta?.projectName as string) || block.title;
          notifications.push({
            title: `${projectName} time! Start coding.`,
            body: `Project block at ${timeStr}`,
            fireAt,
          });
        }
        break;
      }

      case "gym": {
        const fireAt = new Date(
          blockStart.getTime() - config.gymReminder * 60 * 1000
        );
        if (fireAt > now) {
          notifications.push({
            title: `Gym in ${config.gymReminder} min`,
            body: "Get your gear ready!",
            fireAt,
          });
        }
        break;
      }

      case "swim": {
        const fireAt = new Date(
          blockStart.getTime() - config.gymReminder * 60 * 1000
        );
        if (fireAt > now) {
          notifications.push({
            title: `Swimming in ${config.gymReminder} min`,
            body: "Time to hit the pool!",
            fireAt,
          });
        }
        break;
      }

      case "study": {
        const fireAt = new Date(
          blockStart.getTime() - config.taskReminder * 60 * 1000
        );
        if (fireAt > now) {
          notifications.push({
            title: `Study session starting soon`,
            body: `${block.title} at ${timeStr}`,
            fireAt,
          });
        }
        break;
      }

      case "task": {
        const fireAt = new Date(
          blockStart.getTime() - config.taskReminder * 60 * 1000
        );
        if (fireAt > now) {
          notifications.push({
            title: `Task reminder`,
            body: `${block.title} at ${timeStr}`,
            fireAt,
          });
        }
        break;
      }
    }
  });

  return notifications.sort(
    (a, b) => a.fireAt.getTime() - b.fireAt.getTime()
  );
}

/**
 * Build streak-warning notifications for the evening.
 * Fires at 9 PM if streaks haven't been completed today.
 */
export function getStreakWarningNotifications(
  streaks: { type: string; current: number; todayCompleted: boolean }[],
  date: string
): ScheduledNotification[] {
  const now = new Date();
  const notifications: ScheduledNotification[] = [];

  // 9 PM streak warning
  const warningTime = minutesToDate(date, 21 * 60); // 9:00 PM
  if (warningTime <= now) return notifications;

  const incompleteStreaks = streaks.filter(
    (s) => s.current > 0 && !s.todayCompleted
  );

  incompleteStreaks.forEach((streak) => {
    notifications.push({
      title: `Don't break your ${streak.current}-day ${streak.type} streak!`,
      body: `Complete a ${streak.type} session now.`,
      fireAt: warningTime,
    });
  });

  return notifications;
}

/**
 * Build a "you haven't coded today" reminder for 6 PM.
 */
export function getCodingReminderNotification(
  hasCodingToday: boolean,
  date: string,
  projectName: string = "your project"
): ScheduledNotification | null {
  if (hasCodingToday) return null;

  const now = new Date();
  const reminderTime = minutesToDate(date, 18 * 60); // 6:00 PM
  if (reminderTime <= now) return null;

  return {
    title: `You haven't coded today`,
    body: `Open ${projectName}?`,
    fireAt: reminderTime,
  };
}
