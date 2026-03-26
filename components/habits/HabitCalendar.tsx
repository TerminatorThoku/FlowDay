"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

interface HabitCalendarProps {
  data: Record<string, number>;
}

export default function HabitCalendar({ data }: HabitCalendarProps) {
  const { weeks, months } = useMemo(() => {
    const now = new Date();
    const weeksArr: { date: string; count: number; dayOfWeek: number }[][] = [];
    const monthLabels: { label: string; col: number }[] = [];

    // Go back 52 weeks
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - 52 * 7 - now.getDay() + 1);

    let currentWeek: { date: string; count: number; dayOfWeek: number }[] = [];
    let lastMonth = -1;

    for (let i = 0; i < 53 * 7; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      if (d > now) break;

      const key = d.toISOString().split("T")[0];
      const dayOfWeek = d.getDay();
      const month = d.getMonth();

      if (dayOfWeek === 0 && currentWeek.length > 0) {
        weeksArr.push(currentWeek);
        currentWeek = [];
      }

      if (month !== lastMonth) {
        const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        monthLabels.push({ label: monthNames[month], col: weeksArr.length });
        lastMonth = month;
      }

      currentWeek.push({
        date: key,
        count: data[key] || 0,
        dayOfWeek,
      });
    }

    if (currentWeek.length > 0) weeksArr.push(currentWeek);

    return { weeks: weeksArr, months: monthLabels };
  }, [data]);

  const getColor = (count: number) => {
    if (count === 0) return "bg-white/[0.04]";
    if (count === 1) return "bg-green-500/20";
    if (count === 2) return "bg-green-500/40";
    return "bg-green-500/70";
  };

  const dayLabels = ["", "M", "", "W", "", "F", ""];

  return (
    <div className="overflow-x-auto">
      {/* Month labels */}
      <div className="flex gap-[3px] mb-1 ml-6">
        {months.map((m, i) => (
          <div
            key={`${m.label}-${i}`}
            className="text-[10px] text-white/25"
            style={{
              position: "relative",
              left: `${m.col * 13}px`,
            }}
          >
            {m.label}
          </div>
        ))}
      </div>

      <div className="flex gap-0.5">
        {/* Day labels */}
        <div className="flex flex-col gap-[3px] mr-1">
          {dayLabels.map((label, i) => (
            <div
              key={i}
              className="h-[10px] w-4 text-[9px] text-white/20 flex items-center justify-end pr-0.5"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Grid */}
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {Array.from({ length: 7 }).map((_, di) => {
              const cell = week.find((c) => c.dayOfWeek === di);
              if (!cell) {
                return (
                  <div key={di} className="h-[10px] w-[10px]" />
                );
              }
              return (
                <motion.div
                  key={cell.date}
                  className={`h-[10px] w-[10px] rounded-[2px] ${getColor(cell.count)}`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.2,
                    delay: wi * 0.01,
                  }}
                  title={`${cell.date}: ${cell.count} habits`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
