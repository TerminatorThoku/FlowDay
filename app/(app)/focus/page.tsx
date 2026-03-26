"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const weeks = ["Last week", "This week", "Next week"];

const dailyBars = [
  { day: "M", h: 0 },
  { day: "T", h: 0.5 },
  { day: "W", h: 0 },
  { day: "T", h: 1 },
  { day: "F", h: 1 },
  { day: "S", h: 0 },
  { day: "S", h: 0 },
];

const donutLegend = [
  { color: "#a855f7", label: "Focus", hours: "2.5h" },
  { color: "#6366f1", label: "Classes", hours: "10h" },
  { color: "#22c55e", label: "Study", hours: "6h" },
  { color: "#f97316", label: "Gym/Swim", hours: "5h" },
  { color: "rgba(255,255,255,0.15)", label: "Free", hours: "25.5h" },
];

const categories = [
  { category: "Focus Time", hours: "2.5h", detail: "Deep work sessions", pct: 15, color: "bg-purple-500" },
  { category: "Classes", hours: "10h", detail: "OOP, Algebra, Data Analytics, System Analysis", pct: 60, color: "bg-indigo-500" },
  { category: "Study", hours: "6h", detail: "OOP Practice, Algebra Review", pct: 37, color: "bg-green-500" },
  { category: "Exercise", hours: "5h", detail: "Gym 3x, Swimming 2x", pct: 31, color: "bg-orange-500" },
];

export default function FocusPage() {
  const [activeWeek, setActiveWeek] = useState(1);

  return (
    <div className="px-4 py-6 max-w-5xl mx-auto">
      {/* Header + week toggle */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white/92">
            Focus Analytics
          </h1>
          <p className="text-sm text-white/40 mt-1">
            Track your productive hours
          </p>
        </div>
        <div className="flex items-center gap-1 bg-white/[0.04] rounded-full p-1">
          {weeks.map((w, i) => (
            <button
              key={w}
              onClick={() => setActiveWeek(i)}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs transition-all",
                activeWeek === i
                  ? "bg-white/[0.1] text-white"
                  : "text-white/32 hover:text-white/55"
              )}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Section 1: Stat Cards ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
        {/* Card 1 — Focus Time with SVG gauge */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5">
          <svg viewBox="0 0 120 70" className="w-full max-w-[160px] mx-auto">
            {/* Gray track */}
            <path
              d="M 10 65 A 50 50 0 0 1 110 65"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Purple fill — 2.5/16 = 15.6%, offset = 157 - (157 * 0.156) = ~132.6 */}
            <path
              d="M 10 65 A 50 50 0 0 1 110 65"
              fill="none"
              stroke="url(#purpleGrad)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="157"
              strokeDashoffset="132.6"
            />
            <defs>
              <linearGradient id="purpleGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
            {/* Center icon */}
            <text x="60" y="50" textAnchor="middle" fill="white" fontSize="14">
              &#x26A1;
            </text>
          </svg>
          <div className="text-center mt-2">
            <span className="font-mono text-2xl font-bold text-white">
              2.5h
            </span>
            <span className="text-xs text-white/40 ml-1">/ 16h goal</span>
          </div>
          <div className="text-center mt-1">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              At risk
            </span>
          </div>
          <p className="text-[11px] uppercase tracking-wider text-white/30 text-center mt-3">
            Focus Time
          </p>
        </div>

        {/* Card 2 — Classes */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5">
          <p className="font-mono text-3xl font-bold text-white">10h</p>
          <p className="text-[11px] uppercase tracking-wider text-white/30 mt-1">
            Classes
          </p>
          <span className="text-[10px] text-white/40 mt-2 block">
            No change from last week
          </span>
        </div>

        {/* Card 3 — Study Time */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5">
          <p className="font-mono text-3xl font-bold text-white">6h</p>
          <p className="text-[11px] uppercase tracking-wider text-white/30 mt-1">
            Study Time
          </p>
          <span className="text-[10px] text-green-400 mt-2 block">
            +2h ↑
          </span>
        </div>

        {/* Card 4 — Free Time */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5">
          <p className="font-mono text-3xl font-bold text-white">25h</p>
          <p className="text-[11px] uppercase tracking-wider text-white/30 mt-1">
            Free Time
          </p>
          <span className="text-[10px] text-red-400 mt-2 block">
            ↓ 5h decrease
          </span>
        </div>
      </div>

      {/* ─── Section 2: Charts Row ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-4">
        {/* Chart 1 — Daily Focus Time bar chart */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white/90 mb-4">
            Daily Focus Time
          </h3>
          <div className="flex items-end justify-between gap-2 h-[140px] relative">
            {/* Dashed goal line at 3h mark (~60% of 5h max) */}
            <div className="absolute w-full border-t border-dashed border-white/10 bottom-[60%] left-0" />
            <div className="absolute text-[9px] text-white/20 left-0 bottom-[60%] -translate-y-1/2">
              3h
            </div>

            {dailyBars.map((d, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-purple-600 to-indigo-500 transition-all duration-500"
                  style={{
                    height: `${(d.h / 5) * 100}%`,
                    minHeight: d.h > 0 ? "4px" : "0px",
                  }}
                />
                <span className="text-[10px] text-white/30 font-mono">
                  {d.day}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3 text-[10px] text-white/30">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-500" /> Focus
            </span>
            <span>— Goal: 3h/day</span>
            <span>✓ Complete: 2.5h</span>
          </div>
        </div>

        {/* Chart 2 — Time Breakdown SVG donut */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white/90 mb-4">
            Time Breakdown
          </h3>
          <div className="flex items-center gap-6">
            <svg
              viewBox="0 0 120 120"
              className="w-[140px] h-[140px] flex-shrink-0"
            >
              {/* Background track */}
              <circle
                cx="60"
                cy="60"
                r="45"
                fill="none"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="12"
              />
              {/* Focus 2.5h (5.1%) = 14.4 */}
              <circle
                cx="60"
                cy="60"
                r="45"
                fill="none"
                stroke="#a855f7"
                strokeWidth="12"
                strokeDasharray="14.4 268.6"
                strokeDashoffset="0"
                transform="rotate(-90 60 60)"
                strokeLinecap="round"
              />
              {/* Classes 10h (20.4%) = 57.7 */}
              <circle
                cx="60"
                cy="60"
                r="45"
                fill="none"
                stroke="#6366f1"
                strokeWidth="12"
                strokeDasharray="57.7 225.3"
                strokeDashoffset="-14.4"
                transform="rotate(-90 60 60)"
              />
              {/* Study 6h (12.2%) = 34.5 */}
              <circle
                cx="60"
                cy="60"
                r="45"
                fill="none"
                stroke="#22c55e"
                strokeWidth="12"
                strokeDasharray="34.5 248.5"
                strokeDashoffset="-72.1"
                transform="rotate(-90 60 60)"
              />
              {/* Gym 5h (10.2%) = 28.9 */}
              <circle
                cx="60"
                cy="60"
                r="45"
                fill="none"
                stroke="#f97316"
                strokeWidth="12"
                strokeDasharray="28.9 254.1"
                strokeDashoffset="-106.6"
                transform="rotate(-90 60 60)"
              />
              {/* Free 25.5h (52%) = 147 */}
              <circle
                cx="60"
                cy="60"
                r="45"
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="12"
                strokeDasharray="147 136"
                strokeDashoffset="-135.5"
                transform="rotate(-90 60 60)"
              />
              {/* Center text */}
              <text
                x="60"
                y="56"
                textAnchor="middle"
                fill="white"
                fontSize="14"
                fontWeight="bold"
                fontFamily="monospace"
              >
                49h
              </text>
              <text
                x="60"
                y="70"
                textAnchor="middle"
                fill="rgba(255,255,255,0.3)"
                fontSize="8"
              >
                this week
              </text>
            </svg>

            {/* Legend */}
            <div className="flex flex-col gap-2.5 text-xs">
              {donutLegend.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: item.color }}
                  />
                  <span className="text-white/50 w-16">{item.label}</span>
                  <span className="text-white/80 font-mono">{item.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Section 3: Category Breakdown ─── */}
      <div className="mt-4">
        <h3 className="text-[11px] uppercase tracking-wider text-white/30 mb-3">
          Breakdown by Category
        </h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <div
              key={cat.category}
              className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-white/90">
                    {cat.category}
                  </p>
                  <p className="text-xs text-white/30 mt-0.5">{cat.detail}</p>
                </div>
                <span className="font-mono text-lg font-bold text-white/80">
                  {cat.hours}
                </span>
              </div>
              <div className="mt-2 h-[3px] bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className={`h-full ${cat.color} rounded-full`}
                  style={{ width: `${cat.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
