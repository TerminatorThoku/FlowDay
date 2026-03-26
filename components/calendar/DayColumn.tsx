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
        "relative min-w-[140px] flex-shrink-0 border-r border-zinc-800/50",
        isToday && "border-l-2 border-l-orange-500/40"
      )}
    >
      {/* Day header */}
      <div
        className={cn(
          "sticky top-0 z-10 flex flex-col items-center border-b border-zinc-800/50 bg-zinc-950 py-2",
          isToday && "bg-zinc-900/80"
        )}
      >
        <span className="text-xs text-zinc-500">{dayName}</span>
        <span
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold",
            isToday
              ? "bg-orange-500 text-white"
              : "text-zinc-200"
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
            className="absolute left-0 right-0 border-t border-zinc-800/30"
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

        {/* Current time red line */}
        {showTimeLine && (
          <div
            className="absolute left-0 right-0 z-20 flex items-center"
            style={{ top: `${timeLineTop}px` }}
          >
            <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <div className="h-0.5 flex-1 bg-red-500" />
          </div>
        )}
      </div>
    </div>
  );
}
