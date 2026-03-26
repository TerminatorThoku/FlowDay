"use client";

import { useStreakStore } from "@/stores/streakStore";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { CountUp } from "@/components/shared/CountUp";
import { StaggeredList, StaggeredItem } from "@/components/shared/StaggeredList";
import { Flame, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const STREAK_ICONS: Record<string, string> = {
  gym: "\uD83C\uDFCB\uFE0F",
  study: "\uD83D\uDCDA",
  coding: "\uD83D\uDCBB",
  sleep: "\uD83D\uDE34",
  swim: "\uD83C\uDFCA",
};

export default function StreaksPage() {
  const { streaks, markCompleted } = useStreakStore();
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6 px-4 py-6 max-w-3xl mx-auto">
      <AnimatedSection>
        <h1 className="text-2xl font-semibold tracking-tight text-white/92">
          Streaks
        </h1>
        <p className="text-sm text-white/40 mt-1">
          Keep your momentum going
        </p>
      </AnimatedSection>

      <StaggeredList className="space-y-3">
        {streaks.map((streak) => (
          <StaggeredItem key={streak.type}>
            <Card
              className={cn(
                "cursor-pointer",
                streak.todayCompleted && "border-green-500/20"
              )}
              onClick={() => !streak.todayCompleted && markCompleted(streak.type, today)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">
                    {STREAK_ICONS[streak.type] || "\u2B50"}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white/90 capitalize">
                      {streak.type}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1">
                        <Flame className="h-3.5 w-3.5 text-orange-500" />
                        <span className="text-lg font-bold font-mono text-white/90">
                          <CountUp target={streak.currentStreak} decimals={0} />
                        </span>
                        <span className="text-xs text-white/30">current</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="h-3 w-3 text-amber-500" />
                        <span className="text-xs text-white/40">
                          Best: {streak.bestStreak}
                        </span>
                      </div>
                    </div>
                  </div>
                  {streak.todayCompleted ? (
                    <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
                      Done today
                    </span>
                  ) : (
                    <span className="text-xs text-white/30 bg-white/[0.04] px-2 py-1 rounded-full">
                      Tap to complete
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </StaggeredItem>
        ))}
      </StaggeredList>
    </div>
  );
}
