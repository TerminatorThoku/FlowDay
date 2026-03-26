"use client";

import { useFocusStore } from "@/stores/focusStore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { CountUp } from "@/components/shared/CountUp";
import FocusGauge from "@/components/focus/FocusGauge";
import DailyFocusChart from "@/components/focus/DailyFocusChart";
import FocusBreakdown from "@/components/focus/FocusBreakdown";
import { Zap, BookOpen, GraduationCap, Clock } from "lucide-react";

export default function FocusPage() {
  const { weeklyGoalHours, dailyGoalHours, getThisWeekStats, getDailyBreakdown } =
    useFocusStore();

  const stats = getThisWeekStats();
  const dailyData = getDailyBreakdown();

  const totalFocusStudy = stats.focus + stats.study;
  const focusTrend = totalFocusStudy > weeklyGoalHours * 0.7 ? "+2h" : "-1h";

  const breakdownData = [
    { label: "Focus", hours: stats.focus, color: "#a855f7" },
    { label: "Classes", hours: stats.classes, color: "#6366f1" },
    { label: "Study", hours: stats.study, color: "#22c55e" },
    { label: "Gym", hours: stats.gym, color: "#f97316" },
    { label: "Free", hours: stats.free, color: "#71717a" },
    { label: "Sleep", hours: stats.sleep, color: "#3b82f6" },
  ].filter((d) => d.hours > 0);

  return (
    <div className="space-y-6 px-4 py-6 max-w-5xl mx-auto">
      <AnimatedSection>
        <h1 className="text-2xl font-semibold tracking-tight text-white/92">
          Focus Analytics
        </h1>
        <p className="text-sm text-white/40 mt-1">
          Track your productive hours this week
        </p>
      </AnimatedSection>

      {/* Stat cards */}
      <AnimatedSection delay={0.1}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Focus Time */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/32">
                  Focus Time
                </span>
                <Zap className="h-4 w-4 text-purple-400" />
              </div>
              <div className="font-mono text-3xl font-bold text-white/92 tabular-nums">
                <CountUp target={totalFocusStudy} suffix="h" />
              </div>
              <Badge variant="focus" className="mt-2">
                {focusTrend} this week
              </Badge>
              <div className="mt-3">
                <FocusGauge
                  value={totalFocusStudy}
                  max={weeklyGoalHours}
                />
              </div>
            </CardContent>
          </Card>

          {/* Classes */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/32">
                  Classes
                </span>
                <GraduationCap className="h-4 w-4 text-indigo-400" />
              </div>
              <div className="font-mono text-3xl font-bold text-white/92 tabular-nums">
                <CountUp target={stats.classes} suffix="h" />
              </div>
              <p className="text-xs text-white/32 mt-2">
                Lecture + lab hours
              </p>
            </CardContent>
          </Card>

          {/* Study */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/32">
                  Study Time
                </span>
                <BookOpen className="h-4 w-4 text-green-400" />
              </div>
              <div className="font-mono text-3xl font-bold text-white/92 tabular-nums">
                <CountUp target={stats.study} suffix="h" />
              </div>
              <p className="text-xs text-white/32 mt-2">
                Self-study sessions
              </p>
            </CardContent>
          </Card>

          {/* Free Time */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/32">
                  Free Time
                </span>
                <Clock className="h-4 w-4 text-white/40" />
              </div>
              <div className="font-mono text-3xl font-bold text-white/92 tabular-nums">
                <CountUp target={stats.free} suffix="h" />
              </div>
              <p className="text-xs text-white/32 mt-2">
                Unscheduled hours
              </p>
            </CardContent>
          </Card>
        </div>
      </AnimatedSection>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatedSection delay={0.2}>
          <Card>
            <CardContent className="p-5">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/32 mb-4">
                Daily Focus Time
              </h3>
              <DailyFocusChart
                data={dailyData}
                dailyGoal={dailyGoalHours}
              />
            </CardContent>
          </Card>
        </AnimatedSection>

        <AnimatedSection delay={0.25}>
          <Card>
            <CardContent className="p-5">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/32 mb-4">
                Time Breakdown
              </h3>
              <FocusBreakdown data={breakdownData} />
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>
    </div>
  );
}
