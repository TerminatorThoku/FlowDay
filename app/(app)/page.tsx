"use client";

import TodayView from "@/components/dashboard/TodayView";
import type { TimeBlock } from "@/types/schedule";

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

export default function DashboardPage() {
  return <TodayView blocks={mockBlocks} userName="Abdul Wahid" />;
}
