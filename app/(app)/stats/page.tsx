"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const donutData = [
  { label: "Classes", hours: 10, color: "#6366f1" },
  { label: "Study", hours: 6, color: "#22c55e" },
  { label: "Focus", hours: 2.5, color: "#a855f7" },
  { label: "Gym", hours: 5, color: "#f97316" },
  { label: "Free", hours: 25, color: "rgba(255,255,255,0.08)" },
];

const weeklyTrend = [
  { week: "W1", segments: [
    { val: 12, color: "#6366f1" }, { val: 8, color: "#22c55e" },
    { val: 3, color: "#a855f7" }, { val: 5, color: "#f97316" },
    { val: 22, color: "#3f3f46" },
  ]},
  { week: "W2", segments: [
    { val: 10, color: "#6366f1" }, { val: 7, color: "#22c55e" },
    { val: 2, color: "#a855f7" }, { val: 4, color: "#f97316" },
    { val: 27, color: "#3f3f46" },
  ]},
  { week: "W3", segments: [
    { val: 11, color: "#6366f1" }, { val: 9, color: "#22c55e" },
    { val: 4, color: "#a855f7" }, { val: 6, color: "#f97316" },
    { val: 20, color: "#3f3f46" },
  ]},
  { week: "W4", segments: [
    { val: 10, color: "#6366f1" }, { val: 6, color: "#22c55e" },
    { val: 2.5, color: "#a855f7" }, { val: 5, color: "#f97316" },
    { val: 25, color: "#3f3f46" },
  ]},
];

const tabs = ["My Stats", "Weekly Report"];

export default function StatsPage() {
  const [activeTab, setActiveTab] = useState(0);

  // Donut math
  const total = donutData.reduce((s, d) => s + d.hours, 0);
  const r = 45;
  const circ = 2 * Math.PI * r; // ~283
  let cumOffset = 0;
  const donutSegments = donutData.map((d) => {
    const seg = (d.hours / total) * circ;
    const off = cumOffset;
    cumOffset += seg;
    return { ...d, seg, off };
  });

  // Stacked bar max
  const maxBar = Math.max(
    ...weeklyTrend.map((w) => w.segments.reduce((s, seg) => s + seg.val, 0))
  );

  return (
    <div className="px-4 py-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold tracking-tight text-white/92">
        Stats & Analytics
      </h1>
      <p className="text-sm text-white/40 mt-1">Your performance overview</p>

      {/* Tab bar */}
      <div className="flex gap-1 bg-white/[0.04] rounded-xl p-1 w-fit mt-4">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === i
                ? "bg-white/[0.1] text-white"
                : "text-white/40 hover:text-white/60"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 0 && (
        <>
          {/* Row 1: Donut + Weekly Trend */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            {/* Time Breakdown donut */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white/90 mb-4">Time Breakdown</h3>
              <div className="flex items-center gap-6">
                <svg viewBox="0 0 120 120" className="w-[140px] h-[140px] flex-shrink-0">
                  <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="12" />
                  {donutSegments.map((d) => (
                    <circle
                      key={d.label}
                      cx="60" cy="60" r={r}
                      fill="none" stroke={d.color} strokeWidth="12"
                      strokeDasharray={`${d.seg} ${circ - d.seg}`}
                      strokeDashoffset={-d.off}
                      transform="rotate(-90 60 60)"
                      strokeLinecap={d.label === donutData[0].label ? "round" : undefined}
                    />
                  ))}
                  <text x="60" y="56" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="monospace">
                    {total.toFixed(1)}h
                  </text>
                  <text x="60" y="70" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="8">
                    this week
                  </text>
                </svg>
                <div className="flex flex-col gap-2.5 text-xs">
                  {donutData.map((d) => (
                    <div key={d.label} className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                      <span className="text-white/50 w-14">{d.label}</span>
                      <span className="text-white/80 font-mono">{d.hours}h</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Weekly Trend stacked bars */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white/90 mb-4">Weekly Trend</h3>
              <div className="flex items-end justify-between gap-3 h-[160px]">
                {weeklyTrend.map((week) => {
                  const weekTotal = week.segments.reduce((s, seg) => s + seg.val, 0);
                  return (
                    <div key={week.week} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full h-[140px] flex flex-col-reverse rounded-t-md overflow-hidden">
                        {week.segments.map((seg, si) => (
                          <div
                            key={si}
                            className="w-full"
                            style={{
                              backgroundColor: seg.color,
                              height: `${(seg.val / maxBar) * 100}%`,
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-white/30 font-mono">{week.week}</span>
                    </div>
                  );
                })}
              </div>
              {/* Legend */}
              <div className="flex flex-wrap gap-3 mt-3">
                {[
                  { c: "#6366f1", l: "Classes" },
                  { c: "#22c55e", l: "Study" },
                  { c: "#a855f7", l: "Focus" },
                  { c: "#f97316", l: "Gym" },
                  { c: "#3f3f46", l: "Free" },
                ].map((x) => (
                  <div key={x.l} className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: x.c }} />
                    <span className="text-[10px] text-white/40">{x.l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: 3 stat cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            {/* Habit Completion */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5">
              <p className="text-[11px] uppercase tracking-wider text-white/30">Habit Completion</p>
              <p className="font-mono text-4xl font-bold text-white mt-2">85%</p>
              <p className="text-xs text-white/40 mt-1">This week</p>
              <span className="text-[10px] text-green-400 mt-2 inline-block">+5% ↑</span>
            </div>

            {/* Focus vs Shallow */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5">
              <p className="text-[11px] uppercase tracking-wider text-white/30">Focus vs. Shallow</p>
              <div className="mt-3 space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-2xl font-bold text-purple-400">2.5h</span>
                  <span className="text-xs text-white/30">deep</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-2xl font-bold text-white/40">4h</span>
                  <span className="text-xs text-white/30">shallow</span>
                </div>
              </div>
              <div className="h-[3px] bg-white/[0.06] rounded-full mt-3 overflow-hidden">
                <div className="h-full w-[38%] rounded-full bg-gradient-to-r from-purple-500 to-indigo-500" />
              </div>
            </div>

            {/* Work-Life Balance */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5">
              <p className="text-[11px] uppercase tracking-wider text-white/30">Work-Life Balance</p>
              <div className="mt-3 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-sm">{"\uD83D\uDCDA"}</div>
                  <div>
                    <p className="text-xs text-white/40">Study hours</p>
                    <p className="font-mono text-lg font-bold text-white/90">16h <span className="text-xs text-white/30 font-normal">avg</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center text-sm">{"\uD83C\uDFCB\uFE0F"}</div>
                  <div>
                    <p className="text-xs text-white/40">Exercise hours</p>
                    <p className="font-mono text-lg font-bold text-white/90">7h</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-sm">{"\u231A"}</div>
                  <div>
                    <p className="text-xs text-white/40">Free time</p>
                    <p className="font-mono text-lg font-bold text-white/90">25h</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 1 && (
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-8 text-center mt-4">
          <p className="text-white/40">Weekly report coming soon...</p>
          <p className="text-xs text-white/25 mt-1">A full breakdown of your week will be generated here</p>
        </div>
      )}
    </div>
  );
}
