"use client";

import { useFocusStore } from "@/stores/focusStore";
import { useHabitStore } from "@/stores/habitStore";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { CountUp } from "@/components/shared/CountUp";
import FocusBreakdown from "@/components/focus/FocusBreakdown";
import {
  BookOpen,
  Dumbbell,
  Clock,
  Brain,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";

export default function StatsPage() {
  const { getThisWeekStats } = useFocusStore();
  const { habits } = useHabitStore();

  const stats = getThisWeekStats();
  const today = new Date().toISOString().split("T")[0];
  const habitsCompletedToday = habits.filter(
    (h) => h.completions[today]
  ).length;

  const breakdownData = [
    { label: "Classes", hours: stats.classes, color: "#6366f1" },
    { label: "Study", hours: stats.study, color: "#22c55e" },
    { label: "Focus", hours: stats.focus, color: "#a855f7" },
    { label: "Gym", hours: stats.gym, color: "#f97316" },
    { label: "Projects", hours: stats.project, color: "#ef4444" },
    { label: "Free", hours: stats.free, color: "#71717a" },
    { label: "Sleep", hours: stats.sleep, color: "#3b82f6" },
  ].filter((d) => d.hours > 0);

  // Mock weekly comparison data
  const weeklyComparison = [
    {
      week: "W1",
      classes: 12,
      study: 8,
      focus: 4,
      gym: 5,
      free: 20,
    },
    {
      week: "W2",
      classes: 14,
      study: 10,
      focus: 6,
      gym: 4,
      free: 18,
    },
    {
      week: "W3",
      classes: 12,
      study: 9,
      focus: 7,
      gym: 6,
      free: 16,
    },
    {
      week: "This Week",
      classes: stats.classes,
      study: stats.study,
      focus: stats.focus,
      gym: stats.gym,
      free: stats.free,
    },
  ];

  const maxWeekTotal = Math.max(
    ...weeklyComparison.map(
      (w) => w.classes + w.study + w.focus + w.gym + w.free
    )
  );

  return (
    <div className="space-y-6 px-4 py-6 max-w-5xl mx-auto">
      <AnimatedSection>
        <h1 className="text-2xl font-semibold tracking-tight text-white/92">
          Stats & Analytics
        </h1>
        <p className="text-sm text-white/40 mt-1">
          Your performance overview
        </p>
      </AnimatedSection>

      {/* Row 1: Time Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatedSection delay={0.1}>
          <Card>
            <CardContent className="p-5">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/32 mb-4">
                My Time Breakdown
              </h3>
              <FocusBreakdown data={breakdownData} />
            </CardContent>
          </Card>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <Card>
            <CardContent className="p-5">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/32 mb-4">
                Weekly Trend
              </h3>
              {/* Stacked bar chart */}
              <div className="flex items-end justify-between gap-3 h-44">
                {weeklyComparison.map((week, wi) => {
                  const segments = [
                    { val: week.classes, color: "#6366f1" },
                    { val: week.study, color: "#22c55e" },
                    { val: week.focus, color: "#a855f7" },
                    { val: week.gym, color: "#f97316" },
                    { val: week.free, color: "#52525b" },
                  ];
                  const total = segments.reduce((s, seg) => s + seg.val, 0);

                  return (
                    <div
                      key={week.week}
                      className="flex-1 flex flex-col items-center gap-1"
                    >
                      <div className="w-full h-36 flex flex-col-reverse rounded-t-md overflow-hidden">
                        {segments.map((seg, si) => (
                          <motion.div
                            key={si}
                            className="w-full"
                            style={{
                              backgroundColor: seg.color,
                              height: `${(seg.val / maxWeekTotal) * 100}%`,
                            }}
                            initial={{ scaleY: 0 }}
                            whileInView={{ scaleY: 1 }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.5,
                              delay: wi * 0.1 + si * 0.05,
                              ease: "easeOut",
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-white/30 font-mono">
                        {week.week}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>

      {/* Row 2: Habits/Tasks + Focus vs Shallow */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatedSection delay={0.2}>
          <Card>
            <CardContent className="p-5">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/32 mb-4">
                Habits & Tasks
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="text-2xl font-bold font-mono text-white/90">
                      <CountUp
                        target={habitsCompletedToday}
                        decimals={0}
                      />
                      /{habits.length}
                    </p>
                    <p className="text-xs text-white/30">
                      Habits done today
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {habits.slice(0, 4).map((habit) => {
                  const completionDays = Object.keys(
                    habit.completions
                  ).length;
                  const rate = Math.min(
                    (completionDays / 30) * 100,
                    100
                  );
                  return (
                    <div
                      key={habit.id}
                      className="flex items-center gap-3"
                    >
                      <span className="text-sm">{habit.icon}</span>
                      <span className="text-sm text-white/60 flex-1 truncate">
                        {habit.name}
                      </span>
                      <div className="w-20 h-[3px] rounded-full bg-white/[0.06]">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: habit.color }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${rate}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                      <span className="text-[10px] text-white/30 font-mono w-8 text-right">
                        {Math.round(rate)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        <AnimatedSection delay={0.25}>
          <Card>
            <CardContent className="p-5">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/32 mb-4">
                Work-Life Balance
              </h3>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white/55">
                      Study hours avg
                    </p>
                    <p className="text-xl font-bold font-mono text-white/90">
                      <CountUp
                        target={
                          (stats.study + stats.classes) / 5
                        }
                        suffix="h/day"
                      />
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <Dumbbell className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white/55">
                      Exercise this week
                    </p>
                    <p className="text-xl font-bold font-mono text-white/90">
                      <CountUp target={stats.gym} suffix="h" />
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white/[0.04] flex items-center justify-center">
                    <Clock className="h-5 w-5 text-white/40" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white/55">
                      Free time this week
                    </p>
                    <p className="text-xl font-bold font-mono text-white/90">
                      <CountUp target={stats.free} suffix="h" />
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <Brain className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white/55">
                      Deep focus hours
                    </p>
                    <p className="text-xl font-bold font-mono text-white/90">
                      <CountUp target={stats.focus} suffix="h" />
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>
    </div>
  );
}
