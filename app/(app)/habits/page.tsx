"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { StaggeredList, StaggeredItem } from "@/components/shared/StaggeredList";
import { motion } from "framer-motion";
import { Plus, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

const mockHabits = [
  { id: "h1", name: "Gym", icon: "\uD83C\uDFCB\uFE0F", frequency: "5x/week", duration: "1-1.5h", streak: 7, nextTime: "Tomorrow, 7:00 AM", completionRate: 85, color: "#22c55e" },
  { id: "h2", name: "Swimming", icon: "\uD83C\uDFCA", frequency: "2x/week", duration: "1h", streak: 3, nextTime: "Saturday, 11:00 AM", completionRate: 70, color: "#06b6d4" },
  { id: "h3", name: "Study Session", icon: "\uD83D\uDCDA", frequency: "Daily", duration: "1.5-2h", streak: 5, nextTime: "Today, 2:30 PM", completionRate: 60, color: "#a855f7" },
  { id: "h4", name: "Sleep 7h+", icon: "\uD83D\uDE34", frequency: "Daily", duration: "7-8h", streak: 12, nextTime: "Tonight", completionRate: 90, color: "#6366f1" },
];

// Generate heatmap data (12 weeks x 7 days)
function generateHeatmapData(): { date: string; count: number; dayOfWeek: number; weekIdx: number }[] {
  const data: { date: string; count: number; dayOfWeek: number; weekIdx: number }[] = [];
  const now = new Date();
  for (let w = 11; w >= 0; w--) {
    for (let d = 0; d < 7; d++) {
      const date = new Date(now);
      date.setDate(now.getDate() - (w * 7 + (6 - d)));
      const key = date.toISOString().split("T")[0];
      data.push({
        date: key,
        count: Math.floor(Math.random() * 5),
        dayOfWeek: d,
        weekIdx: 11 - w,
      });
    }
  }
  return data;
}

// Small circular progress ring
function MiniRing({ percent, color, size = 36 }: { percent: number; color: string; size?: number }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - percent / 100);
  return (
    <svg width={size} height={size} className="flex-shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={3} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={circ}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        initial={{ strokeDashoffset: circ }}
        whileInView={{ strokeDashoffset: offset }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      <text x={size / 2} y={size / 2 + 4} textAnchor="middle" className="text-[9px] font-mono" fill="rgba(255,255,255,0.5)">
        {percent}%
      </text>
    </svg>
  );
}

function getHeatmapColor(count: number) {
  if (count === 0) return "bg-white/[0.04]";
  if (count === 1) return "bg-green-500/25";
  if (count === 2) return "bg-green-500/50";
  return "bg-green-500/75";
}

const dayLabels = ["", "M", "", "W", "", "F", ""];
const monthLabels = (() => {
  const months: string[] = [];
  const now = new Date();
  for (let w = 11; w >= 0; w--) {
    const d = new Date(now);
    d.setDate(now.getDate() - w * 7);
    const m = d.toLocaleString("en", { month: "short" });
    if (!months.includes(m)) months.push(m);
  }
  return months;
})();

export default function HabitsPage() {
  const heatmapData = useMemo(() => generateHeatmapData(), []);

  // Group by weekIdx
  const weeks = useMemo(() => {
    const map = new Map<number, typeof heatmapData>();
    heatmapData.forEach((cell) => {
      if (!map.has(cell.weekIdx)) map.set(cell.weekIdx, []);
      map.get(cell.weekIdx)!.push(cell);
    });
    return Array.from(map.entries()).sort(([a], [b]) => a - b);
  }, [heatmapData]);

  return (
    <div className="space-y-6 px-4 py-6 max-w-5xl mx-auto">
      {/* Header */}
      <AnimatedSection>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white/92">Habits</h1>
            <p className="text-sm text-white/40 mt-1">Build consistency, track streaks</p>
          </div>
          <Button className="rounded-xl bg-orange-500 text-black px-4 py-2">
            <Plus className="h-4 w-4 mr-1" />
            Add Habit
          </Button>
        </div>
      </AnimatedSection>

      {/* Active Habits */}
      <AnimatedSection delay={0.1}>
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/32 mb-3">Active Habits</h2>
        <StaggeredList className="space-y-2">
          {mockHabits.map((habit) => (
            <StaggeredItem key={habit.id}>
              <Card className="hover:scale-[1.005] transition-all duration-300 cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center text-lg flex-shrink-0">
                      {habit.icon}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white/90">{habit.name}</p>
                      <p className="text-xs text-white/40 mt-0.5">
                        {habit.frequency} &middot; {habit.duration}
                      </p>
                      <p className="text-[10px] text-white/25 mt-0.5">Next: {habit.nextTime}</p>
                    </div>

                    {/* Streak */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <Flame className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-mono font-bold text-white/80">{habit.streak}</span>
                    </div>

                    {/* Mini Ring */}
                    <MiniRing percent={habit.completionRate} color={habit.color} />
                  </div>
                </CardContent>
              </Card>
            </StaggeredItem>
          ))}
        </StaggeredList>
      </AnimatedSection>

      {/* Heatmap */}
      <AnimatedSection delay={0.2}>
        <Card>
          <CardContent className="p-5">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/32 mb-4">Activity</h3>

            {/* Month labels */}
            <div className="flex gap-1 mb-1 ml-6">
              {monthLabels.map((m, i) => (
                <span key={`${m}-${i}`} className="text-[10px] text-white/25 flex-1">{m}</span>
              ))}
            </div>

            <div className="flex gap-[3px]">
              {/* Day labels */}
              <div className="flex flex-col gap-[3px] mr-1">
                {dayLabels.map((label, i) => (
                  <div key={i} className="h-3 w-4 text-[9px] text-white/20 flex items-center justify-end pr-0.5">
                    {label}
                  </div>
                ))}
              </div>

              {/* Grid */}
              {weeks.map(([weekIdx, cells]) => (
                <div key={weekIdx} className="flex flex-col gap-[3px]">
                  {Array.from({ length: 7 }).map((_, dayIdx) => {
                    const cell = cells.find((c) => c.dayOfWeek === dayIdx);
                    return (
                      <motion.div
                        key={dayIdx}
                        className={cn("h-3 w-3 rounded-sm", getHeatmapColor(cell?.count || 0))}
                        title={cell ? `${cell.count} habits on ${cell.date}` : ""}
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.15, delay: weekIdx * 0.02 }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-1.5 mt-3 justify-end">
              <span className="text-[10px] text-white/25">Less</span>
              <div className="h-3 w-3 rounded-sm bg-white/[0.04]" />
              <div className="h-3 w-3 rounded-sm bg-green-500/25" />
              <div className="h-3 w-3 rounded-sm bg-green-500/50" />
              <div className="h-3 w-3 rounded-sm bg-green-500/75" />
              <span className="text-[10px] text-white/25">More</span>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  );
}
