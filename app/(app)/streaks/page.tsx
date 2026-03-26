"use client";

import { useMemo } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimateIn } from "@/components/shared/AnimateIn";

const streaks = [
  { label: "Gym", emoji: "\uD83C\uDFCB\uFE0F", current: 7, best: 14, color: "#22c55e" },
  { label: "Study", emoji: "\uD83D\uDCDA", current: 5, best: 21, color: "#a855f7" },
  { label: "Sleep 7h+", emoji: "\uD83D\uDE34", current: 12, best: 30, color: "#6366f1" },
  { label: "No Skip", emoji: "\uD83D\uDD25", current: 3, best: 10, color: "#f97316" },
];

export default function StreaksPage() {
  // 14-day timeline — stable across renders
  const days = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => {
        const date = new Date(Date.now() - (13 - i) * 86400000);
        return {
          date,
          dayLabel: date.toLocaleDateString("en", { weekday: "short" }).slice(0, 2),
          dateLabel: date.getDate().toString(),
          completed: Math.random() > 0.3,
          isToday: i === 13,
        };
      }),
    []
  );

  return (
    <div className="px-4 py-6 max-w-5xl mx-auto">
      <AnimateIn>
      <h1 className="text-2xl font-semibold tracking-tight text-white/92">
        Streaks
      </h1>
      <p className="text-sm text-white/40 mt-1">Keep your momentum going</p>
      </AnimateIn>

      {/* Overview Cards */}
      <AnimateIn delay={0.1}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
        {streaks.map((s) => {
          const pct = Math.min((s.current / s.best) * 100, 100);
          return (
            <div
              key={s.label}
              className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5"
            >
              {/* Emoji */}
              <div className="w-9 h-9 rounded-lg bg-white/[0.05] flex items-center justify-center text-lg mb-3">
                {s.emoji}
              </div>

              {/* Current streak */}
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-3xl font-bold text-white">
                  {s.current}
                </span>
                <span className="text-xs text-white/40">days</span>
              </div>

              {/* Best */}
              <p className="text-xs text-white/30 mt-1">Best: {s.best}d</p>

              {/* Progress bar */}
              <div className="h-[3px] bg-white/[0.06] rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, backgroundColor: s.color }}
                />
              </div>

              {/* Label */}
              <p className="text-[11px] uppercase tracking-wider text-white/30 mt-3">
                {s.label}
              </p>
            </div>
          );
        })}
      </div>

      </AnimateIn>

      {/* Streak History — 14-day timeline */}
      <AnimateIn delay={0.2}>
      <div className="mt-8">
        <h3 className="text-[11px] uppercase tracking-wider text-white/30 mb-4">
          Streak History
        </h3>

        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {days.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 flex-shrink-0">
                {/* Circle */}
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                    d.completed
                      ? "bg-green-500/20 border-2 border-green-500"
                      : "bg-white/[0.04] border border-white/[0.08]",
                    d.isToday && "ring-2 ring-orange-500 ring-offset-1 ring-offset-[#09090b]"
                  )}
                >
                  {d.completed && (
                    <Check className="h-3.5 w-3.5 text-green-400" />
                  )}
                </div>

                {/* Day label */}
                <span className="text-[9px] text-white/30 font-mono">
                  {d.dayLabel}
                </span>
                <span className="text-[9px] text-white/20 font-mono -mt-1">
                  {d.dateLabel}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      </AnimateIn>
    </div>
  );
}
