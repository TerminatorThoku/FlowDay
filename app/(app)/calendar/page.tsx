"use client";

import { startOfWeek, format, addDays } from "date-fns";
import WeekView from "@/components/calendar/WeekView";
import type { TimeBlock } from "@/types/schedule";

// Generate mock data for the current week
function generateWeekBlocks(): TimeBlock[] {
  const today = new Date();
  const monday = startOfWeek(today, { weekStartsOn: 1 });
  const blocks: TimeBlock[] = [];
  let id = 1;

  // Monday: No classes, Gym 7AM, Study Algebra 12PM, GameVault 2-6PM
  const mon = format(monday, "yyyy-MM-dd");
  blocks.push(
    { id: String(id++), type: "gym", title: "Gym", date: mon, startMinutes: 420, endMinutes: 510, color: "#22C55E" },
    { id: String(id++), type: "study", title: "Study: Algebra", date: mon, startMinutes: 720, endMinutes: 810, color: "#8B5CF6" },
    { id: String(id++), type: "project", title: "GameVault [P1]", date: mon, startMinutes: 840, endMinutes: 1080, color: "#EF4444" },
  );

  // Tuesday: OOP 8:30-10:30, Algebra 10:45-12:15, Gym 2PM, Study Algebra 4PM, Swim 5PM, T Trades 6-8PM
  const tue = format(addDays(monday, 1), "yyyy-MM-dd");
  blocks.push(
    { id: String(id++), type: "class", title: "OOP", date: tue, startMinutes: 510, endMinutes: 630, color: "#3B82F6" },
    { id: String(id++), type: "class", title: "Algebra & Discrete Math", date: tue, startMinutes: 645, endMinutes: 735, color: "#3B82F6" },
    { id: String(id++), type: "gym", title: "Gym", date: tue, startMinutes: 840, endMinutes: 930, color: "#22C55E" },
    { id: String(id++), type: "study", title: "Study: Algebra", date: tue, startMinutes: 960, endMinutes: 1020, color: "#8B5CF6" },
    { id: String(id++), type: "swim", title: "Swimming", date: tue, startMinutes: 1020, endMinutes: 1080, color: "#06B6D4", location: "Pool" },
    { id: String(id++), type: "project", title: "T Trades [P4]", date: tue, startMinutes: 1080, endMinutes: 1200, color: "#8B5CF6" },
  );

  // Wednesday: OOP 8:30-10:30, Algebra 10:45-12:15, Gym 1PM, Study OOP 2:30PM, Study SA&D 4PM, TerrorFundingMonitor 6-8PM
  const wed = format(addDays(monday, 2), "yyyy-MM-dd");
  blocks.push(
    { id: String(id++), type: "class", title: "OOP", date: wed, startMinutes: 510, endMinutes: 630, color: "#3B82F6" },
    { id: String(id++), type: "class", title: "Algebra & Discrete Math", date: wed, startMinutes: 645, endMinutes: 735, color: "#3B82F6" },
    { id: String(id++), type: "gym", title: "Gym", date: wed, startMinutes: 780, endMinutes: 870, color: "#22C55E" },
    { id: String(id++), type: "study", title: "Study: OOP Practice", date: wed, startMinutes: 870, endMinutes: 960, color: "#8B5CF6" },
    { id: String(id++), type: "study", title: "Study: SA&D", date: wed, startMinutes: 960, endMinutes: 1050, color: "#8B5CF6" },
    { id: String(id++), type: "project", title: "TerrorFundingMonitor [P5]", date: wed, startMinutes: 1080, endMinutes: 1200, color: "#F97316" },
  );

  // Thursday: OOP 8:30-10:30, Data Analytics 10:45-12:45, Gym 1PM, Study OOP 2:30-4PM, Swim 4PM, GameVault 6-8PM
  const thu = format(addDays(monday, 3), "yyyy-MM-dd");
  blocks.push(
    { id: String(id++), type: "class", title: "OOP", date: thu, startMinutes: 510, endMinutes: 630, color: "#3B82F6", location: "Auditorium" },
    { id: String(id++), type: "class", title: "Intro To Data Analytics", date: thu, startMinutes: 645, endMinutes: 765, color: "#3B82F6", location: "Lab" },
    { id: String(id++), type: "gym", title: "Gym", date: thu, startMinutes: 780, endMinutes: 870, color: "#22C55E" },
    { id: String(id++), type: "study", title: "Study: OOP Practice", date: thu, startMinutes: 870, endMinutes: 960, color: "#8B5CF6", location: "Library" },
    { id: String(id++), type: "swim", title: "Swimming", date: thu, startMinutes: 960, endMinutes: 1020, color: "#06B6D4", location: "Pool" },
    { id: String(id++), type: "project", title: "GameVault [P1]", date: thu, startMinutes: 1080, endMinutes: 1200, color: "#EF4444" },
  );

  // Friday: SA&D 8:30-10:30, Data Analytics 10:45-12:45, Gym 1PM, Study OOP 2PM, Study SA&D 4PM, Geointel 6-8PM
  const fri = format(addDays(monday, 4), "yyyy-MM-dd");
  blocks.push(
    { id: String(id++), type: "class", title: "System Analysis & Design", date: fri, startMinutes: 510, endMinutes: 630, color: "#3B82F6" },
    { id: String(id++), type: "class", title: "Intro To Data Analytics", date: fri, startMinutes: 645, endMinutes: 765, color: "#3B82F6" },
    { id: String(id++), type: "gym", title: "Gym", date: fri, startMinutes: 780, endMinutes: 840, color: "#22C55E" },
    { id: String(id++), type: "study", title: "Study: OOP", date: fri, startMinutes: 840, endMinutes: 960, color: "#8B5CF6" },
    { id: String(id++), type: "study", title: "Study: SA&D", date: fri, startMinutes: 960, endMinutes: 1050, color: "#8B5CF6" },
    { id: String(id++), type: "project", title: "Geointel [P2]", date: fri, startMinutes: 1080, endMinutes: 1200, color: "#3B82F6" },
  );

  // Saturday: Gym 9AM, Swim 11AM, GameVault 1-5PM, Restaurant POS 5-7PM
  const sat = format(addDays(monday, 5), "yyyy-MM-dd");
  blocks.push(
    { id: String(id++), type: "gym", title: "Gym", date: sat, startMinutes: 540, endMinutes: 630, color: "#22C55E" },
    { id: String(id++), type: "swim", title: "Swimming", date: sat, startMinutes: 660, endMinutes: 720, color: "#06B6D4", location: "Pool" },
    { id: String(id++), type: "project", title: "GameVault [P1]", date: sat, startMinutes: 780, endMinutes: 1020, color: "#EF4444" },
    { id: String(id++), type: "project", title: "Restaurant POS [P3]", date: sat, startMinutes: 1020, endMinutes: 1140, color: "#22C55E" },
  );

  // Sunday: Study Weekly Revision 10AM, Geointel 1-5PM, Restaurant POS 5-7PM
  const sun = format(addDays(monday, 6), "yyyy-MM-dd");
  blocks.push(
    { id: String(id++), type: "study", title: "Study: Weekly Revision", date: sun, startMinutes: 600, endMinutes: 720, color: "#8B5CF6" },
    { id: String(id++), type: "project", title: "Geointel [P2]", date: sun, startMinutes: 780, endMinutes: 1020, color: "#3B82F6" },
    { id: String(id++), type: "project", title: "Restaurant POS [P3]", date: sun, startMinutes: 1020, endMinutes: 1140, color: "#22C55E" },
  );

  return blocks;
}

export default function CalendarPage() {
  const today = new Date();
  const monday = startOfWeek(today, { weekStartsOn: 1 });
  const weekStart = format(monday, "yyyy-MM-dd");
  const blocks = generateWeekBlocks();

  return (
    <div className="flex h-[calc(100vh-7.5rem)] flex-col">
      <WeekView blocks={blocks} weekStart={weekStart} />
    </div>
  );
}
