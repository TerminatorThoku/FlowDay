"use client";

import { useMemo } from "react";

const habits = [
  { name: "Gym", icon: "\uD83C\uDFCB\uFE0F", freq: "5x / week", duration: "1\u20131.5h", streak: 7, next: "Tomorrow, 7:00 AM", pct: 85, color: "#22c55e" },
  { name: "Swimming", icon: "\uD83C\uDFCA", freq: "2x / week", duration: "1h", streak: 3, next: "Saturday, 11:00 AM", pct: 70, color: "#06b6d4" },
  { name: "Study Session", icon: "\uD83D\uDCDA", freq: "Daily", duration: "1.5\u20132h", streak: 5, next: "Today, 2:30 PM", pct: 60, color: "#a855f7" },
  { name: "Sleep 7h+", icon: "\uD83D\uDE34", freq: "Daily", duration: "7\u20138h", streak: 12, next: "Tonight", pct: 90, color: "#6366f1" },
];

function ProgressRing({ pct, color }: { pct: number; color: string }) {
  const r = 14;
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

function heatColor(v: number) {
  if (v === 0) return "bg-white/[0.04]";
  if (v === 1) return "bg-green-500/20";
  if (v === 2) return "bg-green-500/40";
  if (v === 3) return "bg-green-500/60";
  return "bg-green-500/80";
}

export default function HabitsPage() {
  // 84 random values (12 weeks x 7 days) — stable across renders
  const heatmapData = useMemo(
    () => Array.from({ length: 84 }, () => Math.floor(Math.random() * 5)),
    []
  );

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
      <div className="space-y-3">
        {habits.map((h) => (
          <div
            key={h.name}
            className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-4 hover:border-white/[0.12] hover:scale-[1.005] transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              {/* Icon box */}
              <div className="w-11 h-11 rounded-xl bg-white/[0.05] flex items-center justify-center text-xl flex-shrink-0">
                {h.icon}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white/90">{h.name}</p>
                <p className="text-xs text-white/40 mt-0.5">
                  {h.freq} &middot; {h.duration}
                </p>
                <p className="text-xs text-white/30 mt-0.5">Next: {h.next}</p>
              </div>

              {/* Streak */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <span className="text-sm">{"\uD83D\uDD25"}</span>
                <span className="text-sm font-mono font-bold text-white/80">{h.streak}</span>
              </div>

              {/* Progress ring */}
              <ProgressRing pct={h.pct} color={h.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Heatmap */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5 mt-6">
        <h3 className="text-[11px] uppercase tracking-wider text-white/30 mb-3">Activity</h3>

        <div className="flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-1 mr-1 pt-0">
            {["", "M", "", "W", "", "F", ""].map((label, i) => (
              <div key={i} className="w-3 h-3 text-[9px] text-white/20 flex items-center justify-end">
                {label}
              </div>
            ))}
          </div>

          {/* 12-column grid */}
          <div className="grid grid-cols-12 gap-1 flex-1">
            {heatmapData.map((v, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-sm ${heatColor(v)}`}
                title={`${v} habits completed`}
              />
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 mt-3 justify-end">
          <span className="text-[10px] text-white/25">Less</span>
          <div className="w-3 h-3 rounded-sm bg-white/[0.04]" />
          <div className="w-3 h-3 rounded-sm bg-green-500/20" />
          <div className="w-3 h-3 rounded-sm bg-green-500/40" />
          <div className="w-3 h-3 rounded-sm bg-green-500/60" />
          <div className="w-3 h-3 rounded-sm bg-green-500/80" />
          <span className="text-[10px] text-white/25">More</span>
        </div>
      </div>
    </div>
  );
}
