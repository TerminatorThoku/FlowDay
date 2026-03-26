"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { CountUp } from "@/components/shared/CountUp";
import { motion } from "framer-motion";
import { Zap, BookOpen, GraduationCap, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const mockData = {
  focusHours: 2.5,
  focusGoal: 16,
  classHours: 10,
  studyHours: 6,
  freeHours: 25,
  dailyFocus: [
    { day: "Mon", hours: 0 },
    { day: "Tue", hours: 0.5 },
    { day: "Wed", hours: 0 },
    { day: "Thu", hours: 1 },
    { day: "Fri", hours: 1 },
    { day: "Sat", hours: 0 },
    { day: "Sun", hours: 0 },
  ],
};

const breakdownCategories = [
  { label: "Focus", hours: 2.5, color: "#a855f7" },
  { label: "Classes", hours: 10, color: "#6366f1" },
  { label: "Study", hours: 6, color: "#22c55e" },
  { label: "Personal", hours: 5, color: "#f97316" },
  { label: "Free", hours: 25, color: "#52525b" },
];

const weeks = ["Last week", "This week", "Next week"];

// Semi-circle gauge component
function FocusGauge({ value, max }: { value: number; max: number }) {
  const percentage = Math.min(value / max, 1);
  const radius = 70;
  const circumference = Math.PI * radius;
  const offset = circumference * (1 - percentage);
  const status =
    percentage >= 0.5
      ? { text: "On track", cls: "text-green-400 bg-green-500/10 border-green-500/20" }
      : percentage >= 0.25
      ? { text: "At risk", cls: "text-amber-400 bg-amber-500/10 border-amber-500/20" }
      : { text: "Behind", cls: "text-red-400 bg-red-500/10 border-red-500/20" };

  return (
    <div className="flex flex-col items-center mt-2">
      <svg width="160" height="95" viewBox="0 0 160 95" className="overflow-visible">
        <path
          d={`M ${80 - radius} 85 A ${radius} ${radius} 0 0 1 ${80 + radius} 85`}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={10}
          strokeLinecap="round"
        />
        <motion.path
          d={`M ${80 - radius} 85 A ${radius} ${radius} 0 0 1 ${80 + radius} 85`}
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
        <text x="80" y="60" textAnchor="middle" fontSize="22" fill="white" opacity="0.5">&#x26A1;</text>
      </svg>
      <p className="text-xs text-white/40 mt-1">{value}h / {max}h goal</p>
      <Badge className={cn("mt-1.5 text-[10px] border", status.cls)}>{status.text}</Badge>
    </div>
  );
}

// Donut chart
function DonutChart({ data }: { data: typeof breakdownCategories }) {
  const total = data.reduce((s, d) => s + d.hours, 0);
  const radius = 55;
  const circumference = 2 * Math.PI * radius;
  let cumOffset = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative flex-shrink-0">
        <svg width="140" height="140" viewBox="0 0 140 140">
          {data.map((item, i) => {
            const seg = (item.hours / total) * circumference;
            const off = cumOffset;
            cumOffset += seg;
            return (
              <motion.circle
                key={item.label}
                cx="70" cy="70" r={radius}
                fill="none" stroke={item.color} strokeWidth="12"
                strokeDasharray={`${seg} ${circumference - seg}`}
                strokeDashoffset={-off}
                strokeLinecap="round"
                transform="rotate(-90 70 70)"
                initial={{ opacity: 0, strokeDashoffset: 0 }}
                whileInView={{ opacity: 1, strokeDashoffset: -off }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span className="text-xl font-bold font-mono text-white/90">{total.toFixed(1)}</span>
            <span className="block text-[10px] text-white/30">hours</span>
          </div>
        </div>
      </div>
      <div className="space-y-2 flex-1">
        {data.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-sm text-white/55 flex-1">{item.label}</span>
            <span className="text-sm font-mono text-white/70">{item.hours}h</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FocusPage() {
  const [activeWeek, setActiveWeek] = useState(1);
  const maxDaily = Math.max(...mockData.dailyFocus.map((d) => d.hours), mockData.focusGoal / 7, 1);
  const dailyGoal = mockData.focusGoal / 7;

  const focusPct = mockData.focusHours / mockData.focusGoal;
  const trendBadge = focusPct >= 0.5 ? "+2h" : "-1h";

  return (
    <div className="space-y-6 px-4 py-6 max-w-5xl mx-auto">
      {/* Header + week toggle */}
      <AnimatedSection>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white/92">Focus Analytics</h1>
            <p className="text-sm text-white/40 mt-1">Track your productive hours</p>
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
      </AnimatedSection>

      {/* 4 Stat Cards */}
      <AnimatedSection delay={0.1}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Focus Time with gauge */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/32">Focus Time</span>
                <Zap className="h-4 w-4 text-purple-400" />
              </div>
              <div className="font-mono text-3xl font-bold text-white/92 tabular-nums">
                <CountUp target={mockData.focusHours} suffix="h" />
              </div>
              <Badge variant="focus" className="mt-1">{trendBadge} this week</Badge>
              <FocusGauge value={mockData.focusHours} max={mockData.focusGoal} />
            </CardContent>
          </Card>

          {/* Classes */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/32">Classes</span>
                <GraduationCap className="h-4 w-4 text-indigo-400" />
              </div>
              <div className="font-mono text-3xl font-bold text-white/92 tabular-nums">
                <CountUp target={mockData.classHours} suffix="h" />
              </div>
              <p className="text-xs text-white/32 mt-1">Lecture + lab hours</p>
              <Badge variant="info" className="mt-2">On track</Badge>
            </CardContent>
          </Card>

          {/* Study Time */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/32">Study Time</span>
                <BookOpen className="h-4 w-4 text-green-400" />
              </div>
              <div className="font-mono text-3xl font-bold text-white/92 tabular-nums">
                <CountUp target={mockData.studyHours} suffix="h" />
              </div>
              <p className="text-xs text-white/32 mt-1">Self-study sessions</p>
              <Badge variant="success" className="mt-2">+1h vs last week</Badge>
            </CardContent>
          </Card>

          {/* Free Time */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/32">Free Time</span>
                <Clock className="h-4 w-4 text-white/40" />
              </div>
              <div className="font-mono text-3xl font-bold text-white/92 tabular-nums">
                <CountUp target={mockData.freeHours} suffix="h" />
              </div>
              <p className="text-xs text-white/32 mt-1">Unscheduled hours</p>
              <Badge variant="secondary" className="mt-2">No change</Badge>
            </CardContent>
          </Card>
        </div>
      </AnimatedSection>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Daily Focus Time Bar Chart */}
        <AnimatedSection delay={0.2}>
          <Card>
            <CardContent className="p-5">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/32 mb-6">
                Daily Focus Time
              </h3>
              <div className="flex items-end justify-between gap-2 h-40 relative">
                {/* Goal line */}
                <div
                  className="absolute left-0 right-0 border-t border-dashed border-white/20"
                  style={{ bottom: `${(dailyGoal / maxDaily) * 100}%` }}
                >
                  <span className="absolute -top-4 right-0 text-[10px] text-white/30 font-mono">
                    {dailyGoal.toFixed(1)}h goal
                  </span>
                </div>
                {mockData.dailyFocus.map((item, i) => {
                  const pct = maxDaily > 0 ? (item.hours / maxDaily) * 100 : 0;
                  return (
                    <div key={item.day} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] text-white/40 font-mono mb-1">
                        {item.hours > 0 ? `${item.hours}h` : ""}
                      </span>
                      <div className="w-full h-32 flex items-end justify-center">
                        <motion.div
                          className="w-full max-w-[32px] rounded-t-md bg-gradient-to-t from-purple-600 to-indigo-500"
                          initial={{ height: 0 }}
                          whileInView={{ height: `${pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
                          style={{ minHeight: item.hours > 0 ? "4px" : "0px" }}
                        />
                      </div>
                      <span className="text-[10px] text-white/32 font-mono">{item.day}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Time Breakdown Donut */}
        <AnimatedSection delay={0.25}>
          <Card>
            <CardContent className="p-5">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/32 mb-6">
                Time Breakdown
              </h3>
              <DonutChart data={breakdownCategories} />
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>
    </div>
  );
}
