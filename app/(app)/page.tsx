"use client";

import { useState } from "react";
import TodayView from "@/components/dashboard/TodayView";
import PomodoroSheet from "@/components/pomodoro/PomodoroSheet";
import type { TimeBlock, Task } from "@/types/schedule";
import type { StreakData } from "@/lib/streaks/tracker";

// Mock data for today's schedule
const today = new Date();
const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

const mockBlocks: TimeBlock[] = [
  {
    id: "1",
    type: "class",
    title: "Object Oriented Programming",
    date: todayStr,
    startMinutes: 510, // 8:30 AM
    endMinutes: 630, // 10:30 AM
    color: "#3B82F6",
    location: "Auditorium",
  },
  {
    id: "2",
    type: "class",
    title: "Introduction To Data Analytics",
    date: todayStr,
    startMinutes: 645, // 10:45 AM
    endMinutes: 765, // 12:45 PM
    color: "#3B82F6",
    location: "Lab",
  },
  {
    id: "3",
    type: "gym",
    title: "Gym - Workout",
    date: todayStr,
    startMinutes: 780, // 1:00 PM
    endMinutes: 870, // 2:30 PM
    color: "#22C55E",
  },
  {
    id: "4",
    type: "study",
    title: "Study: OOP Practice",
    date: todayStr,
    startMinutes: 870, // 2:30 PM
    endMinutes: 960, // 4:00 PM
    color: "#8B5CF6",
    location: "Library",
  },
  {
    id: "5",
    type: "swim",
    title: "Swimming",
    date: todayStr,
    startMinutes: 960, // 4:00 PM
    endMinutes: 1020, // 5:00 PM
    color: "#06B6D4",
    location: "Pool",
  },
  {
    id: "6",
    type: "free",
    title: "FREE",
    date: todayStr,
    startMinutes: 1020, // 5:00 PM
    endMinutes: 1080, // 6:00 PM
    color: "#71717A",
  },
  {
    id: "7",
    type: "project",
    title: "GameVault [P1]",
    date: todayStr,
    startMinutes: 1080, // 6:00 PM
    endMinutes: 1200, // 8:00 PM
    color: "#EF4444",
    meta: { projectName: "GameVault", priority: "high" },
  },
  {
    id: "8",
    type: "sleep",
    title: "Sleep",
    date: todayStr,
    startMinutes: 1380, // 11:00 PM
    endMinutes: 1440, // midnight (continues next day)
    color: "#6366F1",
  },
];

// Mock streak data
const mockStreaks: StreakData[] = [
  {
    type: "gym",
    currentStreak: 7,
    bestStreak: 14,
    todayCompleted: true,
    lastCompletedDate: todayStr,
  },
  {
    type: "study",
    currentStreak: 5,
    bestStreak: 10,
    todayCompleted: true,
    lastCompletedDate: todayStr,
  },
  {
    type: "coding",
    currentStreak: 3,
    bestStreak: 21,
    todayCompleted: false,
    lastCompletedDate: null,
  },
  {
    type: "sleep",
    currentStreak: 12,
    bestStreak: 30,
    todayCompleted: true,
    lastCompletedDate: todayStr,
  },
];

// Mock deadline tasks
const mockDeadlineTasks: Task[] = [
  {
    id: "t1",
    user_id: "u1",
    project_id: "p1",
    title: "OOP Assignment 3",
    description: "Implement design patterns",
    priority: "high",
    status: "in_progress",
    estimated_minutes: 120,
    actual_minutes: null,
    due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    completed_at: null,
    created_at: todayStr,
    updated_at: todayStr,
  },
  {
    id: "t2",
    user_id: "u1",
    project_id: "p2",
    title: "Data Analytics Report",
    description: "Final analysis report",
    priority: "critical",
    status: "todo",
    estimated_minutes: 180,
    actual_minutes: null,
    due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    completed_at: null,
    created_at: todayStr,
    updated_at: todayStr,
  },
  {
    id: "t3",
    user_id: "u1",
    project_id: "p1",
    title: "GameVault API Integration",
    description: "Connect to backend endpoints",
    priority: "medium",
    status: "in_progress",
    estimated_minutes: 90,
    actual_minutes: null,
    due_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    completed_at: null,
    created_at: todayStr,
    updated_at: todayStr,
  },
];

export default function DashboardPage() {
  const [pomodoroOpen, setPomodoroOpen] = useState(false);
  const [focusTask, setFocusTask] = useState<{ title?: string; subject?: string }>({});

  const handleStartFocus = (title?: string, subject?: string) => {
    setFocusTask({ title, subject });
    setPomodoroOpen(true);
  };

  return (
    <>
      <TodayView
        blocks={mockBlocks}
        userName="Abdul Wahid"
        streaks={mockStreaks}
        deadlineTasks={mockDeadlineTasks}
        onStartFocus={() => handleStartFocus("Current Task", "Study")}
      />
      <PomodoroSheet
        open={pomodoroOpen}
        onClose={() => setPomodoroOpen(false)}
        taskTitle={focusTask.title}
        subject={focusTask.subject}
      />
    </>
  );
}
