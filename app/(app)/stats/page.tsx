"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { CountUp } from "@/components/shared/CountUp";
import { motion } from "framer-motion";
import { BookOpen, Dumbbell, Clock, TrendingUp, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const donutData = [
  { label: "Classes", hours: 10, color: "#6366f1" },
  { label: "Study", hours: 6, color: "#22c55e" },
  { label: "Focus", hours: 2.5, color: "#a855f7" },
  { label: "Gym", hours: 5, color: "#f97316" },
  { label: "Free", hours: 25, color: "#52525b" },
];

const weeklyTrend = [
  { week: "W1", classes: 12, study: 8, focus: 3, gym: 5, free: 22 },
  { week: "W2", classes: 10, study: 7, focus: 2, gym: 4, free: 27 },
  { week: "W3", classes: 11, study: 9, focus: 4, gym: 6, free: 20 },
  { week: "W4", classes: 10, study: 6, focus: 2.5, gym: 5, free: 25 },
];

const tabs = ["My Stats", "Weekly Report"];

function DonutChart({ data }: { data: typeof donutData }) {
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
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
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

function StackedBarChart({ data }: { data: typeof weeklyTrend }) {
  const segColors = ["#6366f1", "#22c55e", "#a855f7", "#f97316", "#52525b"];
  const maxTotal = Math.max(...data.map((w) => w.classes + w.study + w.focus + w.gym + w.free));

  return (
    <div className="flex items-end justify-between gap-3 h-44">
      {data.map((week, wi) => {
        const segments = [
          { val: week.classes, color: segColors[0] },
          { val: week.study, color: segColors[1] },
          { val: week.focus, color: segColors[2] },
          { val: week.gym, color: segColors[3] },
          { val: week.free, color: segColors[4] },
        ];
        return (
          <div key={week.week} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full h-36 flex flex-col-reverse rounded-t-md overflow-hidden">
              {segments.map((seg, si) => (
                <motion.div
                  key={si}
                  className="w-full"
                  style={{ backgroundColor: seg.color, height: `${(seg.val / maxTotal) * 100}%` }}
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: wi * 0.1 + si * 0.03, ease: "easeOut" }}
                />
              ))}
            </div>
            <span className="text-[10px] text-white/30 font-mono">{week.week}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function StatsPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="space-y-6 px-4 py-6 max-w-5xl mx-auto">
      <AnimatedSection>
        <h1 className="text-2xl font-semibold tracking-tight text-white/92">Stats & Analytics</h1>
        <p className="text-sm text-white/40 mt-1">Your performance overview</p>
      </AnimatedSection>

      {/* Tab bar */}
      <AnimatedSection delay={0.05}>
        <div className="flex gap-1 bg-white/[0.04] rounded-xl p-1 w-fit">
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
      </AnimatedSection>

      {activeTab === 0 && (
        <>
          {/* Row 1: Time Breakdown + Weekly Trend */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <AnimatedSection delay={0.1}>
              <Card>
                <CardContent className="p-5">
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/32 mb-4">Time Breakdown</h3>
                  <DonutChart data={donutData} />
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <Card>
                <CardContent className="p-5">
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/32 mb-4">Weekly Trend</h3>
                  <StackedBarChart data={weeklyTrend} />
                  {/* Legend */}
                  <div className="flex flex-wrap gap-3 mt-3">
                    {["Classes", "Study", "Focus", "Gym", "Free"].map((l, i) => (
                      <div key={l} className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: ["#6366f1","#22c55e","#a855f7","#f97316","#52525b"][i] }} />
                        <span className="text-[10px] text-white/40">{l}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>

          {/* Row 2: 3 stat cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <AnimatedSection delay={0.2}>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/32">Habit Completion</span>
                  </div>
                  <div className="font-mono text-4xl font-bold text-white/92">
                    <CountUp target={85} decimals={0} suffix="%" />
                  </div>
                  <p className="text-xs text-white/40 mt-1">This week</p>
                  <Badge variant="success" className="mt-2">+5% vs last week</Badge>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={0.25}>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-purple-400" />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/32">Focus vs. Shallow</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-2xl font-bold text-purple-400">2.5h</span>
                    <span className="text-white/30">deep</span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-mono text-2xl font-bold text-white/40">4h</span>
                    <span className="text-white/30">shallow</span>
                  </div>
                  <div className="h-[3px] rounded-full bg-white/[0.06] mt-3">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
                      initial={{ width: 0 }}
                      whileInView={{ width: "38%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <Card>
                <CardContent className="p-5">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/32">Work-Life Balance</span>
                  <div className="space-y-4 mt-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-indigo-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-white/40">Study hours</p>
                        <p className="text-lg font-bold font-mono text-white/90">16h <span className="text-xs text-white/30 font-normal">avg</span></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <Dumbbell className="h-4 w-4 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-white/40">Exercise hours</p>
                        <p className="text-lg font-bold font-mono text-white/90">7h</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
                        <Clock className="h-4 w-4 text-white/40" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-white/40">Free time</p>
                        <p className="text-lg font-bold font-mono text-white/90">25h</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </>
      )}

      {activeTab === 1 && (
        <AnimatedSection delay={0.1}>
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-white/40">Weekly report coming soon...</p>
              <p className="text-xs text-white/25 mt-1">A full breakdown of your week will be generated here</p>
            </CardContent>
          </Card>
        </AnimatedSection>
      )}
    </div>
  );
}
