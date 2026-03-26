"use client";

import { useState, useRef, useEffect } from "react";
import { addDays, format, parseISO, isSameDay, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TimeBlock } from "@/types/schedule";
import DayColumn from "./DayColumn";
import BlockDetail from "./BlockDetail";

interface WeekViewProps {
  blocks: TimeBlock[];
  weekStart: string; // YYYY-MM-DD of Monday
}

const HOUR_HEIGHT = 60;
const START_HOUR = 6;
const END_HOUR = 23;
const TOTAL_HOURS = END_HOUR - START_HOUR;

export default function WeekView({ blocks, weekStart }: WeekViewProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    parseISO(weekStart)
  );
  const [selectedBlock, setSelectedBlock] = useState<TimeBlock | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const weekDays = Array.from({ length: 7 }, (_, i) =>
    addDays(currentWeekStart, i)
  );

  const weekEndDate = addDays(currentWeekStart, 6);
  const weekLabel = `${format(currentWeekStart, "MMM d")} - ${format(
    weekEndDate,
    "MMM d, yyyy"
  )}`;

  const handlePrevWeek = () => {
    setCurrentWeekStart((prev) => addDays(prev, -7));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart((prev) => addDays(prev, 7));
  };

  const handleToday = () => {
    const today = new Date();
    const monday = startOfWeek(today, { weekStartsOn: 1 });
    setCurrentWeekStart(monday);
  };

  const handleBlockClick = (block: TimeBlock) => {
    setSelectedBlock(block);
    setDetailOpen(true);
  };

  // Scroll to current time on mount
  useEffect(() => {
    if (scrollRef.current) {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const scrollTo = Math.max(0, currentMinutes - START_HOUR * 60 - 120);
      scrollRef.current.scrollTop = scrollTo;
    }
  }, []);

  return (
    <div className="flex h-full flex-col">
      {/* Week navigation header */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 py-3">
        <Button variant="ghost" size="icon" onClick={handlePrevWeek}>
          <ChevronLeft className="h-5 w-5 text-zinc-400" />
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-zinc-200">{weekLabel}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToday}
            className="h-6 border-zinc-700 px-2 text-xs text-zinc-400 hover:text-zinc-100"
          >
            Today
          </Button>
        </div>

        <Button variant="ghost" size="icon" onClick={handleNextWeek}>
          <ChevronRight className="h-5 w-5 text-zinc-400" />
        </Button>
      </div>

      {/* Calendar grid */}
      <div className="flex flex-1 overflow-hidden">
        {/* Time gutter */}
        <div className="flex w-12 flex-shrink-0 flex-col border-r border-zinc-800/50">
          {/* Spacer for day header */}
          <div className="h-[52px] border-b border-zinc-800/50" />
          <div className="relative" style={{ height: `${TOTAL_HOURS * HOUR_HEIGHT}px` }}>
            {Array.from({ length: TOTAL_HOURS }, (_, i) => (
              <div
                key={i}
                className="absolute right-2 -translate-y-1/2 text-[10px] text-zinc-600"
                style={{ top: `${i * HOUR_HEIGHT}px` }}
              >
                {START_HOUR + i > 12
                  ? `${START_HOUR + i - 12}PM`
                  : START_HOUR + i === 12
                    ? "12PM"
                    : `${START_HOUR + i}AM`}
              </div>
            ))}
          </div>
        </div>

        {/* Scrollable week columns */}
        <div ref={scrollRef} className="flex flex-1 overflow-auto">
          {weekDays.map((day) => {
            const dateStr = format(day, "yyyy-MM-dd");
            const dayBlocks = blocks.filter((b) => b.date === dateStr);
            const today = new Date();

            return (
              <DayColumn
                key={dateStr}
                date={day}
                blocks={dayBlocks}
                isToday={isSameDay(day, today)}
                onBlockClick={handleBlockClick}
              />
            );
          })}
        </div>
      </div>

      {/* Block detail sheet */}
      <BlockDetail
        block={selectedBlock}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
    </div>
  );
}
