"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { AnimateIn } from "@/components/shared/AnimateIn";

const tabs = ["My Stats", "Weekly Report"];

// Same donut as Focus page
const donutLegend = [
  { color: "#a855f7", label: "Focus", hours: "2.5h" },
  { color: "#6366f1", label: "Classes", hours: "10h" },
  { color: "#22c55e", label: "Study", hours: "6h" },
  { color: "#f97316", label: "Gym/Swim", hours: "5h" },
  { color: "rgba(255,255,255,0.15)", label: "Free", hours: "25.5h" },
];

const weeks = [
  { label: "W1", classes: 10, study: 5, focus: 1, gym: 4, free: 28 },
  { label: "W2", classes: 10, study: 6, focus: 2, gym: 5, free: 25 },
  { label: "W3", classes: 10, study: 4, focus: 1.5, gym: 3, free: 29.5 },
  { label: "W4", classes: 10, study: 6, focus: 2.5, gym: 5, free: 24.5 },
];

const segColors = {
  classes: "#6366f1",
  study: "#22c55e",
  focus: "#a855f7",
  gym: "#f97316",
  free: "rgba(255,255,255,0.08)",
};

export default function StatsPage() {
  const [activeTab, setActiveTab] = useState(0);

  // Stacked bar max (excluding Free for clearer visualization)
  const maxBar = Math.max(
    ...weeks.map((w) => w.classes + w.study + w.focus + w.gym)
  );

  return (
    <div className="px-4 py-6 max-w-5xl mx-auto">
      <AnimateIn>
      <h1 className="text-2xl font-semibold tracking-tight text-white/92">
        Stats & Analytics
      </h1>
      <p className="text-sm text-white/40 mt-1">Your performance overview</p>
      </AnimateIn>

      {/* Tab bar — underline style */}
      <div className="flex gap-6 mt-4 border-b border-white/[0.06]">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={cn(
              "pb-2.5 text-sm transition-all relative",
              activeTab === i
                ? "text-white border-b-2 border-orange-500"
                : "text-white/40 hover:text-white/60"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 0 && (
        <>
          {/* Row 1 — donut + weekly trend */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-6">
            {/* Card 1: Time Breakdown — same donut as Focus page */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white/90 mb-4">
                Time Breakdown
              </h3>
              <div className="flex items-center gap-6">
                <svg
                  viewBox="0 0 120 120"
                  className="w-[140px] h-[140px] flex-shrink-0"
                >
                  <circle cx="60" cy="60" r="45" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="12" />
                  {/* Focus 2.5h */}
                  <circle cx="60" cy="60" r="45" fill="none" stroke="#a855f7" strokeWidth="12"
                    strokeDasharray="14.4 268.6" strokeDashoffset="0"
                    transform="rotate(-90 60 60)" strokeLinecap="round" />
                  {/* Classes 10h */}
                  <circle cx="60" cy="60" r="45" fill="none" stroke="#6366f1" strokeWidth="12"
                    strokeDasharray="57.7 225.3" strokeDashoffset="-14.4"
                    transform="rotate(-90 60 60)" />
                  {/* Study 6h */}
                  <circle cx="60" cy="60" r="45" fill="none" stroke="#22c55e" strokeWidth="12"
                    strokeDasharray="34.5 248.5" strokeDashoffset="-72.1"
                    transform="rotate(-90 60 60)" />
                  {/* Gym 5h */}
                  <circle cx="60" cy="60" r="45" fill="none" stroke="#f97316" strokeWidth="12"
                    strokeDasharray="28.9 254.1" strokeDashoffset="-106.6"
                    transform="rotate(-90 60 60)" />
                  {/* Free 25.5h */}
                  <circle cx="60" cy="60" r="45" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12"
                    strokeDasharray="147 136" strokeDashoffset="-135.5"
                    transform="rotate(-90 60 60)" />
                  <text x="60" y="56" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="monospace">49h</text>
                  <text x="60" y="70" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="8">this week</text>
                </svg>

                <div className="flex flex-col gap-2.5 text-xs">
                  {donutLegend.map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                      <span className="text-white/50 w-16">{item.label}</span>
                      <span className="text-white/80 font-mono">{item.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2: Weekly Trend — stacked bars */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white/90 mb-4">
                Weekly Trend
              </h3>
              <div className="flex items-end justify-between gap-3 h-[160px]">
                {weeks.map((w) => {
                  const segs = [
                    { val: w.classes, color: segColors.classes },
                    { val: w.study, color: segColors.study },
                    { val: w.focus, color: segColors.focus },
                    { val: w.gym, color: segColors.gym },
                  ];
                  return (
                    <div key={w.label} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full h-[140px] flex flex-col-reverse rounded-t-md overflow-hidden">
                        {segs.map((seg, si) => (
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
                      <span className="text-[10px] text-white/30 font-mono">{w.label}</span>
                    </div>
                  );
                })}
              </div>
              {/* Legend */}
              <div className="flex flex-wrap gap-3 mt-3">
                {(["Classes", "Study", "Focus", "Gym"] as const).map((l) => (
                  <div key={l} className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: segColors[l.toLowerCase() as keyof typeof segColors] }} />
                    <span className="text-[10px] text-white/40">{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2 — three stat cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            {/* Habit Completion */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5">
              <p className="font-mono text-3xl font-bold text-white">85%</p>
              <p className="text-[11px] uppercase tracking-wider text-white/30 mt-1">Completion rate</p>
              <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                +5%
              </span>
            </div>

            {/* Focus vs. Shallow */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5">
              <p className="text-[11px] uppercase tracking-wider text-white/30 mb-3">Focus vs. Shallow</p>
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-2xl font-bold text-purple-400">2.5h</span>
                <span className="text-xs text-white/30">deep</span>
                <span className="text-white/15">/</span>
                <span className="font-mono text-2xl font-bold text-white/40">4h</span>
                <span className="text-xs text-white/30">shallow</span>
              </div>
              <div className="h-[3px] bg-white/[0.06] rounded-full mt-3 overflow-hidden">
                <div className="h-full w-[38%] rounded-full bg-gradient-to-r from-purple-500 to-indigo-500" />
              </div>
            </div>

            {/* Work-Life Balance */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5">
              <p className="text-[11px] uppercase tracking-wider text-white/30 mb-3">Work-Life Balance</p>
              <div className="divide-y divide-white/[0.06]">
                <div className="flex items-center gap-3 pb-3">
                  <span className="text-base">{"\uD83D\uDCDA"}</span>
                  <span className="text-xs text-white/40 flex-1">Study</span>
                  <span className="font-mono text-sm font-bold text-white/80">16h avg</span>
                </div>
                <div className="flex items-center gap-3 py-3">
                  <span className="text-base">{"\uD83C\uDFCB\uFE0F"}</span>
                  <span className="text-xs text-white/40 flex-1">Exercise</span>
                  <span className="font-mono text-sm font-bold text-white/80">7h</span>
                </div>
                <div className="flex items-center gap-3 pt-3">
                  <span className="text-base">{"\uD83C\uDFAE"}</span>
                  <span className="text-xs text-white/40 flex-1">Free time</span>
                  <span className="font-mono text-sm font-bold text-white/80">25h</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 1 && (
        <div className="space-y-4 mt-6">
          {/* Week Header */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-white">Week of Mar 23 &ndash; Mar 29</h2>
                <p className="text-xs text-white/30 mt-1">Auto-generated weekly summary</p>
              </div>
              <span className="text-[11px] px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">Good week</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Productive Hours", value: "18.5h", change: "+2h", up: true },
                { label: "Classes Attended", value: "8/8", change: "100%", up: true },
                { label: "Tasks Completed", value: "3/12", change: "-2", up: false },
                { label: "Streak Days", value: "5/7", change: "+1", up: true },
              ].map(m => (
                <div key={m.label} className="bg-white/[0.02] rounded-xl p-3">
                  <p className="text-[10px] uppercase tracking-wider text-white/30">{m.label}</p>
                  <p className="font-mono text-xl font-bold text-white mt-1">{m.value}</p>
                  <span className={`text-[10px] ${m.up ? 'text-green-400' : 'text-red-400'}`}>{m.change} vs last week</span>
                </div>
              ))}
            </div>
          </div>
          {/* Highlights */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white/90 mb-3">Highlights</h3>
            <div className="space-y-2.5">
              {[
                { emoji: "\uD83C\uDFC6", text: "Longest gym streak this month \u2014 7 days" },
                { emoji: "\uD83D\uDCDA", text: "Study time increased by 2h compared to last week" },
                { emoji: "\u26A0\uFE0F", text: "Only 2.5h of focus time \u2014 below your 16h goal" },
                { emoji: "\uD83C\uDFAF", text: "OOP Assignment 3 due tomorrow \u2014 not started yet" },
              ].map((h, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <span className="text-base">{h.emoji}</span>
                  <span className="text-white/60">{h.text}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Day-by-Day */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white/90 mb-3">Day by Day</h3>
            <div className="space-y-1">
              {[
                { day: "Mon", classes: 2, study: "1.5h", gym: true, focus: "0h", score: "Good" },
                { day: "Tue", classes: 2, study: "0.5h", gym: false, focus: "0.5h", score: "OK" },
                { day: "Wed", classes: 2, study: "0h", gym: false, focus: "0h", score: "Low" },
                { day: "Thu", classes: 2, study: "1h", gym: false, focus: "1h", score: "Good" },
                { day: "Fri", classes: 1, study: "1.5h", gym: true, focus: "1h", score: "Great" },
                { day: "Sat", classes: 0, study: "0h", gym: true, focus: "0h", score: "OK" },
                { day: "Sun", classes: 0, study: "2h", gym: false, focus: "0h", score: "OK" },
              ].map(d => (
                <div key={d.day} className="flex items-center gap-4 py-2 border-b border-white/[0.03] last:border-0">
                  <span className="text-xs font-mono text-white/40 w-8">{d.day}</span>
                  <span className="text-xs text-white/50 w-20">{d.classes} classes</span>
                  <span className="text-xs text-white/50 w-16">{d.study} study</span>
                  <span className="text-xs w-8">{d.gym ? '\u2705' : '\u2014'}</span>
                  <span className="text-xs text-white/50 w-16">{d.focus} focus</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ml-auto ${
                    d.score === 'Great' ? 'bg-green-500/10 text-green-400' :
                    d.score === 'Good' ? 'bg-blue-500/10 text-blue-400' :
                    d.score === 'Low' ? 'bg-red-500/10 text-red-400' :
                    'bg-white/[0.05] text-white/30'
                  }`}>{d.score}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Suggestions */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white/90 mb-3">Suggestions for Next Week</h3>
            <div className="space-y-2">
              {[
                "Block 2h focus sessions on Mon/Wed mornings \u2014 those were your lowest days",
                "Start OOP Assignment 3 ASAP \u2014 it\u2019s overdue tomorrow",
                "Consider adding a swimming session mid-week to balance gym days",
                "Your study hours peak on Fri/Sun \u2014 try to spread more evenly",
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-orange-400 mt-0.5 shrink-0">{"\u2192"}</span>
                  <span className="text-white/50">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
