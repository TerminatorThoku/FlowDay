"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

const mockHabits = [
  { name: "Gym", icon: "\uD83C\uDFCB\uFE0F", frequency: "5x/week", duration: "1-1.5h", streak: 7, nextTime: "Tomorrow, 7:00 AM", completionRate: 85, color: "#22c55e" },
  { name: "Swimming", icon: "\uD83C\uDFCA", frequency: "2x/week", duration: "1h", streak: 3, nextTime: "Saturday, 11:00 AM", completionRate: 70, color: "#06b6d4" },
  { name: "Study Session", icon: "\uD83D\uDCDA", frequency: "Daily", duration: "1.5-2h", streak: 5, nextTime: "Today, 2:30 PM", completionRate: 60, color: "#a855f7" },
  { name: "Sleep 7h+", icon: "\uD83D\uDE34", frequency: "Daily", duration: "7-8h", streak: 12, nextTime: "Tonight", completionRate: 90, color: "#6366f1" },
];

function MiniRing({ pct, color }: { pct: number; color: string }) {
  const r = 15;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  return (
    <svg width="36" height="36" className="flex-shrink-0">
      <circle cx="18" cy="18" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
      <circle
        cx="18" cy="18" r={r} fill="none" stroke={color} strokeWidth="3"
        strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
        transform="rotate(-90 18 18)"
      />
      <text x="18" y="22" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8" fontFamily="monospace">
        {pct}%
      </text>
    </svg>
  );
}

function getHeatColor(count: number) {
  if (count === 0) return "bg-white/[0.04]";
  if (count === 1) return "bg-green-500/25";
  if (count === 2) return "bg-green-500/50";
  return "bg-green-500/75";
}

// Generate 12 weeks x 7 days of random data
function generateGrid() {
  const now = new Date();
  const grid: { date: string; count: number }[][] = [];
  for (let w = 11; w >= 0; w--) {
    const week: { date: string; count: number }[] = [];
    for (let d = 0; d < 7; d++) {
      const dt = new Date(now);
      dt.setDate(now.getDate() - w * 7 - (6 - d));
      week.push({
        date: dt.toISOString().split("T")[0],
        count: Math.floor(Math.random() * 5),
      });
    }
    grid.push(week);
  }
  return grid;
}

export default function HabitsPage() {
  const heatmap = useMemo(() => generateGrid(), []);

  // Compute month labels from the grid
  const monthLabels = useMemo(() => {
    const labels: { label: string; idx: number }[] = [];
    let lastMonth = -1;
    heatmap.forEach((week, i) => {
      const m = new Date(week[0].date).getMonth();
      if (m !== lastMonth) {
        labels.push({ label: new Date(week[0].date).toLocaleString("en", { month: "short" }), idx: i });
        lastMonth = m;
      }
    });
    return labels;
  }, [heatmap]);

  return (
    <div className="px-4 py-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white/92">Habits</h1>
          <p className="text-sm text-white/40 mt-1">Build consistency, track streaks</p>
        </div>
        <button className="rounded-xl bg-orange-500 text-black px-4 py-2 text-sm font-medium hover:bg-orange-400 active:scale-[0.97] transition-all">
          + Add Habit
        </button>
      </div>

      {/* Active Habits */}
      <h2 className="text-[11px] uppercase tracking-wider text-white/30 mt-6 mb-3">Active Habits</h2>
      <div className="space-y-2">
        {mockHabits.map((h) => (
          <div
            key={h.name}
            className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-4 hover:border-white/[0.12] hover:scale-[1.005] transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center text-lg flex-shrink-0">
                {h.icon}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white/90">{h.name}</p>
                <p className="text-xs text-white/40 mt-0.5">
                  {h.frequency} &middot; {h.duration}
                </p>
                <p className="text-[10px] text-white/25 mt-0.5">Next: {h.nextTime}</p>
              </div>

              {/* Streak */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="text-sm">{"\uD83D\uDD25"}</span>
                <span className="text-sm font-mono font-bold text-white/80">{h.streak}</span>
              </div>

              {/* Mini ring */}
              <MiniRing pct={h.completionRate} color={h.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Heatmap */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5 mt-6">
        <h3 className="text-[11px] uppercase tracking-wider text-white/30 mb-4">Activity</h3>

        {/* Month labels row */}
        <div className="flex ml-6 mb-1">
          {monthLabels.map((m, i) => (
            <span
              key={`${m.label}-${i}`}
              className="text-[10px] text-white/25"
              style={{ position: "absolute", marginLeft: `${m.idx * 15}px` }}
            >
              {m.label}
            </span>
          ))}
        </div>
        <div className="h-4" />

        <div className="flex gap-[3px]">
          {/* Day labels */}
          <div className="flex flex-col gap-[3px] mr-1">
            {["", "M", "", "W", "", "F", ""].map((label, i) => (
              <div key={i} className="h-3 w-4 text-[9px] text-white/20 flex items-center justify-end pr-0.5">
                {label}
              </div>
            ))}
          </div>

          {/* Grid columns (weeks) */}
          {heatmap.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((cell, di) => (
                <div
                  key={di}
                  className={cn("w-3 h-3 rounded-sm", getHeatColor(cell.count))}
                  title={`${cell.count} habits completed on ${cell.date}`}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 mt-3 justify-end">
          <span className="text-[10px] text-white/25">Less</span>
          <div className="w-3 h-3 rounded-sm bg-white/[0.04]" />
          <div className="w-3 h-3 rounded-sm bg-green-500/25" />
          <div className="w-3 h-3 rounded-sm bg-green-500/50" />
          <div className="w-3 h-3 rounded-sm bg-green-500/75" />
          <span className="text-[10px] text-white/25">More</span>
        </div>
      </div>
    </div>
  );
}
