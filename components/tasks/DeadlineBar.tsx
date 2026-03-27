"use client";

import { useMemo } from "react";
import { differenceInHours, differenceInDays, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

interface DeadlineBarProps {
  dueDate: string | null;
}

function getDeadlineInfo(dueDate: string) {
  const now = new Date();
  const due = parseISO(dueDate);
  const hoursLeft = differenceInHours(due, now);
  const daysLeft = differenceInDays(due, now);

  // Assume task was created 7 days before due date for proportional bar
  const totalDays = 7;
  const elapsed = Math.min(Math.max(((totalDays - daysLeft) / totalDays) * 100, 0), 100);

  let label: string;
  let color: string;
  let barColor: string;
  let flashing = false;

  if (hoursLeft < 0) {
    label = "OVERDUE";
    color = "text-red-400";
    barColor = "bg-red-500";
    flashing = true;
  } else if (hoursLeft < 24) {
    label = "Due tomorrow!";
    color = "text-red-600";
    barColor = "bg-red-500";
  } else if (daysLeft <= 3) {
    label = `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`;
    color = "text-amber-600";
    barColor = "bg-amber-500";
  } else if (daysLeft <= 7) {
    label = `${daysLeft} days left`;
    color = "text-amber-600";
    barColor = "bg-amber-500";
  } else {
    label = `${daysLeft} days left`;
    color = "text-green-600";
    barColor = "bg-green-500";
  }

  return { label, color, barColor, flashing, elapsed };
}

export default function DeadlineBar({ dueDate }: DeadlineBarProps) {
  const info = useMemo(() => {
    if (!dueDate) return null;
    return getDeadlineInfo(dueDate);
  }, [dueDate]);

  if (!info) return null;

  return (
    <div className="mt-2 space-y-1">
      <div className="flex items-center justify-between">
        <span className={cn("text-[10px] font-semibold", info.color, info.flashing && "animate-pulse")}>
          {info.label}
        </span>
      </div>
      <div className="h-[4px] w-full overflow-hidden rounded-full bg-stone-100">
        <div
          className={cn("h-full rounded-full transition-all duration-500", info.barColor, info.flashing && "animate-pulse")}
          style={{ width: `${info.elapsed}%` }}
        />
      </div>
    </div>
  );
}
