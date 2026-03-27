"use client";

import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { TimeBlock } from "@/types/schedule";
import TimeBlockCard from "./TimeBlockCard";

interface DayColumnProps {
  date: Date;
  blocks: TimeBlock[];
  isToday: boolean;
  onBlockClick: (block: TimeBlock) => void;
}

const HOUR_HEIGHT = 60;
const START_HOUR = 6;
const END_HOUR = 23;
const TOTAL_HOURS = END_HOUR - START_HOUR;

export default function DayColumn({
  date,
  blocks,
  isToday,
  onBlockClick,
}: DayColumnProps) {
  const dayName = format(date, "EEE");
  const dayNumber = format(date, "d");

  // Current time indicator position
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const showTimeLine =
    isToday &&
    currentMinutes >= START_HOUR * 60 &&
    currentMinutes <= END_HOUR * 60;
  const timeLineTop = currentMinutes - START_HOUR * 60;

  return (
    <div
      className={cn(
        "relative min-w-[140px] flex-shrink-0 border-r border-stone-200",
        isToday && "bg-stone-50"
      )}
    >
      {/* Day header */}
      <div
        className={cn(
          "sticky top-0 z-10 flex flex-col items-center border-b border-stone-200 bg-white py-2",
          isToday && "bg-stone-50"
        )}
      >
        <span className="text-xs text-stone-400">{dayName}</span>
        <span
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold",
            isToday
              ? "bg-indigo-600 text-white"
              : "text-stone-700"
          )}
        >
          {dayNumber}
        </span>
      </div>

      {/* Time grid */}
      <div className="relative" style={{ height: `${TOTAL_HOURS * HOUR_HEIGHT}px` }}>
        {/* Hour lines */}
        {Array.from({ length: TOTAL_HOURS }, (_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 border-t border-stone-200"
            style={{ top: `${i * HOUR_HEIGHT}px` }}
          />
        ))}

        {/* Time blocks */}
        {blocks.map((block) => (
          <TimeBlockCard
            key={block.id}
            block={block}
            onClick={() => onBlockClick(block)}
          />
        ))}

        {/* Current time indicator */}
        {showTimeLine && (
          <div
            className="absolute left-0 right-0 z-10 flex items-center"
            style={{ top: `${timeLineTop}px` }}
          >
            <div className="w-2 h-2 rounded-full bg-red-500 -ml-1 animate-pulse" />
            <div className="h-px flex-1 bg-red-500" />
          </div>
        )}
      </div>
    </div>
  );
}
