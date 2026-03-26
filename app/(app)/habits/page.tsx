"use client";

import { useHabitStore } from "@/stores/habitStore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import {
  StaggeredList,
  StaggeredItem,
} from "@/components/shared/StaggeredList";
import HabitCalendar from "@/components/habits/HabitCalendar";
import { Flame, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HabitsPage() {
  const { habits, toggleCompletion, getHeatmapData } = useHabitStore();
  const today = new Date().toISOString().split("T")[0];
  const heatmapData = getHeatmapData();

  const freqLabel = (h: typeof habits[0]) => {
    if (h.frequency === "daily") return "Daily";
    if (h.frequency === "weekdays") return "Weekdays";
    return `${h.customDays?.length || 0}x per week`;
  };

  return (
    <div className="space-y-6 px-4 py-6 max-w-5xl mx-auto">
      <AnimatedSection>
        <h1 className="text-2xl font-semibold tracking-tight text-white/92">
          Habits
        </h1>
        <p className="text-sm text-white/40 mt-1">
          Build consistency, track streaks
        </p>
      </AnimatedSection>

      {/* Active Habits */}
      <AnimatedSection delay={0.1}>
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/32 mb-3">
          Active Habits
        </h2>
        <StaggeredList className="space-y-2">
          {habits.map((habit) => {
            const completedToday = habit.completions[today];
            return (
              <StaggeredItem key={habit.id}>
                <Card
                  className={cn(
                    "cursor-pointer transition-all",
                    completedToday && "border-green-500/20 bg-green-500/[0.03]"
                  )}
                  onClick={() => toggleCompletion(habit.id, today)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Check / Icon */}
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-xl text-lg transition-all",
                          completedToday
                            ? "bg-green-500/20"
                            : "bg-white/[0.04]"
                        )}
                      >
                        {completedToday ? (
                          <Check className="h-5 w-5 text-green-400" />
                        ) : (
                          habit.icon
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "text-sm font-medium",
                            completedToday
                              ? "text-green-400"
                              : "text-white/90"
                          )}
                        >
                          {habit.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-white/32">
                            {freqLabel(habit)}
                          </span>
                          <span className="text-xs text-white/20">&middot;</span>
                          <span className="text-xs text-white/32">
                            {habit.duration.min}-{habit.duration.max} min
                          </span>
                        </div>
                      </div>

                      {/* Streak */}
                      <div className="flex items-center gap-1.5">
                        <Flame
                          className="h-4 w-4"
                          style={{ color: habit.color }}
                        />
                        <span className="text-sm font-mono font-bold text-white/80">
                          {habit.streak}
                        </span>
                      </div>

                      {/* Category badge */}
                      <Badge variant="secondary" className="hidden sm:flex">
                        {habit.category}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </StaggeredItem>
            );
          })}
        </StaggeredList>
      </AnimatedSection>

      {/* Heatmap */}
      <AnimatedSection delay={0.2}>
        <Card>
          <CardContent className="p-5">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/32 mb-4">
              Activity Heatmap
            </h3>
            <HabitCalendar data={heatmapData} />
            <div className="flex items-center gap-2 mt-4 justify-end">
              <span className="text-[10px] text-white/25">Less</span>
              <div className="h-[10px] w-[10px] rounded-[2px] bg-white/[0.04]" />
              <div className="h-[10px] w-[10px] rounded-[2px] bg-green-500/20" />
              <div className="h-[10px] w-[10px] rounded-[2px] bg-green-500/40" />
              <div className="h-[10px] w-[10px] rounded-[2px] bg-green-500/70" />
              <span className="text-[10px] text-white/25">More</span>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  );
}
