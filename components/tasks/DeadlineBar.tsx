"use client";

import { useMemo } from "react";
import { differenceInHours, differenceInDays, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

interface DeadlineBarProps {
  dueDate: string | null;
}

function getDeadlineInfo(dueDate: string): {
  label: string;
  color: string;
  barColor: string;
  flashing: boolean;
} {
  const now = new Date();
  const due = parseISO(dueDate);
  const hoursLeft = differenceInHours(due, now);
  const daysLeft = differenceInDays(due, now);

  if (hoursLeft < 0) {
    return {
      label: "OVERDUE",
      color: "text-red-400",
      barColor: "bg-red-500",
      flashing: true,
    };
  }

  if (hoursLeft < 24) {
    return {
      label: "Due tomorrow!",
      color: "text-red-400",
      barColor: "bg-red-500",
      flashing: false,
    };
  }

  if (daysLeft <= 3) {
    return {
      label: `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`,
      color: "text-orange-400",
      barColor: "bg-orange-500",
      flashing: false,
    };
  }

  if (daysLeft <= 7) {
    return {
      label: `${daysLeft} days left`,
      color: "text-yellow-400",
      barColor: "bg-yellow-500",
      flashing: false,
    };
  }

  return {
    label: `${daysLeft} days left`,
    color: "text-green-400",
    barColor: "bg-green-500",
    flashing: false,
  };
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
        <span
          className={cn("text-[10px] font-semibold", info.color, info.flashing && "animate-pulse")}
        >
          {info.label}
        </span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-800">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            info.barColor,
            info.flashing && "animate-pulse"
          )}
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
}
