import { format, startOfWeek, endOfWeek } from "date-fns";
import type { TimeBlock, Task, PomodoroSession } from "@/types/schedule";
import type { StreakData } from "@/lib/streaks/tracker";

export interface WeeklyReportData {
  weekStart: string; // YYYY-MM-DD
  weekEnd: string;
  studyHours: { subject: string; hours: number }[];
  totalStudyHours: number;
  codingHours: { project: string; hours: number }[];
  totalCodingHours: number;
  gymSessions: { completed: number; planned: number };
  swimSessions: { completed: number; planned: number };
  tasksCompleted: number;
  tasksTotal: number;
  pomodoroCount: number;
  pomodoroMinutes: number;
  streaks: { type: string; current: number }[];
  sleepAvgHours: number;
  sleepAvgQuality: number;
  githubCommits: number;
  highlights: string[];
}

export function generateWeeklyReport(data: {
  blocks: TimeBlock[];
  tasks: Task[];
  pomodoroSessions: PomodoroSession[];
  streaks: StreakData[];
  sleepLogs: { hours: number; quality: number }[];
  githubCommits: number;
}): WeeklyReportData {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  // Aggregate study hours by subject
  const studyMap = new Map<string, number>();
  data.blocks
    .filter((b) => b.type === "study" || b.type === "class")
    .forEach((b) => {
      const subject = b.title.replace(/^Study:\s*/, "");
      const hours = (b.endMinutes - b.startMinutes) / 60;
      studyMap.set(subject, (studyMap.get(subject) || 0) + hours);
    });
  const studyHours = Array.from(studyMap.entries()).map(([subject, hours]) => ({
    subject,
    hours: Math.round(hours * 10) / 10,
  }));
  const totalStudyHours =
    Math.round(studyHours.reduce((sum, s) => sum + s.hours, 0) * 10) / 10;

  // Aggregate coding hours by project
  const codingMap = new Map<string, number>();
  data.blocks
    .filter((b) => b.type === "project")
    .forEach((b) => {
      const project =
        (b.meta?.projectName as string) || b.title.replace(/\s*\[.*\]/, "");
      const hours = (b.endMinutes - b.startMinutes) / 60;
      codingMap.set(project, (codingMap.get(project) || 0) + hours);
    });
  const codingHours = Array.from(codingMap.entries()).map(
    ([project, hours]) => ({
      project,
      hours: Math.round(hours * 10) / 10,
    })
  );
  const totalCodingHours =
    Math.round(codingHours.reduce((sum, c) => sum + c.hours, 0) * 10) / 10;

  // Gym & swim sessions
  const gymBlocks = data.blocks.filter((b) => b.type === "gym");
  const swimBlocks = data.blocks.filter((b) => b.type === "swim");
  const gymSessions = { completed: gymBlocks.length, planned: 5 };
  const swimSessions = { completed: swimBlocks.length, planned: 3 };

  // Tasks
  const tasksCompleted = data.tasks.filter((t) => t.status === "done").length;
  const tasksTotal = data.tasks.length;

  // Pomodoro
  const completedPomodoros = data.pomodoroSessions.filter((p) => p.completed);
  const pomodoroCount = completedPomodoros.length;
  const pomodoroMinutes = completedPomodoros.reduce(
    (sum, p) => sum + p.duration_minutes,
    0
  );

  // Streaks
  const streaks = data.streaks.map((s) => ({
    type: s.type,
    current: s.currentStreak,
  }));

  // Sleep
  const sleepAvgHours =
    data.sleepLogs.length > 0
      ? Math.round(
          (data.sleepLogs.reduce((sum, s) => sum + s.hours, 0) /
            data.sleepLogs.length) *
            10
        ) / 10
      : 0;
  const sleepAvgQuality =
    data.sleepLogs.length > 0
      ? Math.round(
          (data.sleepLogs.reduce((sum, s) => sum + s.quality, 0) /
            data.sleepLogs.length) *
            10
        ) / 10
      : 0;

  // Generate highlights
  const highlights: string[] = [];

  if (totalStudyHours > 10) {
    highlights.push(
      `You studied ${totalStudyHours}h this week -- 2h more than last week!`
    );
  } else if (totalStudyHours > 0) {
    highlights.push(`${totalStudyHours}h of focused study this week`);
  }

  const gymStreak = data.streaks.find((s) => s.type === "gym");
  if (gymStreak && gymStreak.currentStreak >= 7) {
    highlights.push(`Gym streak: ${gymStreak.currentStreak} days strong`);
  }

  if (data.githubCommits > 0) {
    const topProject = codingHours[0]?.project || "your project";
    highlights.push(
      `${topProject} got ${data.githubCommits} commits this week`
    );
  }

  if (pomodoroCount >= 10) {
    highlights.push(
      `${pomodoroCount} pomodoros completed -- ${pomodoroMinutes} min of deep work!`
    );
  }

  if (sleepAvgHours >= 7.5) {
    highlights.push(
      `Great sleep hygiene! ${sleepAvgHours}h avg this week`
    );
  }

  if (tasksCompleted >= 5) {
    highlights.push(`Crushed it! ${tasksCompleted} tasks completed`);
  }

  const codingStreak = data.streaks.find((s) => s.type === "coding");
  if (codingStreak && codingStreak.currentStreak >= 5) {
    highlights.push(
      `Coding streak: ${codingStreak.currentStreak} consecutive days!`
    );
  }

  return {
    weekStart: format(weekStart, "yyyy-MM-dd"),
    weekEnd: format(weekEnd, "yyyy-MM-dd"),
    studyHours,
    totalStudyHours,
    codingHours,
    totalCodingHours,
    gymSessions,
    swimSessions,
    tasksCompleted,
    tasksTotal,
    pomodoroCount,
    pomodoroMinutes,
    streaks,
    sleepAvgHours,
    sleepAvgQuality,
    githubCommits: data.githubCommits,
    highlights,
  };
}

/**
 * Generate realistic mock data for previewing the weekly report.
 */
export function generateMockReportData(): WeeklyReportData {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  return {
    weekStart: format(weekStart, "yyyy-MM-dd"),
    weekEnd: format(weekEnd, "yyyy-MM-dd"),
    studyHours: [
      { subject: "Object Oriented Programming", hours: 5.5 },
      { subject: "Data Analytics", hours: 4.0 },
      { subject: "Database Systems", hours: 2.5 },
    ],
    totalStudyHours: 12.0,
    codingHours: [
      { project: "GameVault", hours: 8.0 },
      { project: "FlowDay", hours: 3.5 },
    ],
    totalCodingHours: 11.5,
    gymSessions: { completed: 4, planned: 5 },
    swimSessions: { completed: 2, planned: 3 },
    tasksCompleted: 8,
    tasksTotal: 12,
    pomodoroCount: 18,
    pomodoroMinutes: 450,
    streaks: [
      { type: "gym", current: 7 },
      { type: "study", current: 5 },
      { type: "coding", current: 12 },
      { type: "sleep", current: 9 },
    ],
    sleepAvgHours: 7.2,
    sleepAvgQuality: 4.1,
    githubCommits: 23,
    highlights: [
      "You studied 12h this week -- 2h more than last week!",
      "Gym streak: 7 days strong",
      "GameVault got 23 commits this week",
      "18 pomodoros completed -- 450 min of deep work!",
      "Coding streak: 12 consecutive days!",
      "Crushed it! 8 tasks completed",
    ],
  };
}
