"use client";

import { useMemo } from "react";
import { format, subDays } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Flame, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StreakData } from "@/lib/streaks/tracker";

interface StreakCardProps {
  streak: StreakData;
  onClose: () => void;
}

function getMotivation(streak: number): string {
  if (streak >= 30) return "Legendary! You're unstoppable!";
  if (streak >= 21) return "Three weeks strong! Almost a habit!";
  if (streak >= 14) return "Two weeks! You're building momentum!";
  if (streak >= 7) return "One week streak! Keep it going!";
  if (streak >= 3) return "Nice start! Stay consistent!";
  if (streak >= 1) return "Every day counts. Keep going!";
  return "Start your streak today!";
}

export default function StreakCard({ streak, onClose }: StreakCardProps) {
  // Generate last 30 days for the mini heatmap
  const days = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 30 }, (_, i) => {
      const date = subDays(today, 29 - i);
      const dateStr = format(date, "yyyy-MM-dd");
      const todayStr = format(today, "yyyy-MM-dd");
      const isFuture = dateStr > todayStr;
      const isToday = dateStr === todayStr;

      // Simulate completed days based on streak data
      // In real app, this would come from completions data
      let completed = false;
      if (!isFuture && streak.currentStreak > 0) {
        const daysAgo = 29 - i;
        completed = daysAgo < streak.currentStreak;
      }

      return { date: dateStr, completed, isFuture, isToday };
    });
  }, [streak]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4">
      <Card className="w-full max-w-sm border-zinc-800 bg-zinc-900">
        <CardContent className="p-5">
          {/* Header */}
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Flame className="h-6 w-6 text-orange-500" />
              <h3 className="text-lg font-bold capitalize text-zinc-100">
                {streak.type} Streak
              </h3>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Streak numbers */}
          <div className="mb-5 flex items-center gap-6">
            <div className="text-center">
              <div className="flex items-center gap-1">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="text-3xl font-bold text-zinc-100">
                  {streak.currentStreak}
                </span>
              </div>
              <p className="text-xs text-zinc-500">Current</p>
            </div>
            <div className="h-10 w-px bg-zinc-800" />
            <div className="text-center">
              <div className="flex items-center gap-1">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span className="text-3xl font-bold text-zinc-100">
                  {streak.bestStreak}
                </span>
              </div>
              <p className="text-xs text-zinc-500">Best</p>
            </div>
          </div>

          {/* Mini calendar heatmap - last 30 days */}
          <div className="mb-4">
            <p className="mb-2 text-xs font-medium text-zinc-500">
              Last 30 days
            </p>
            <div className="grid grid-cols-10 gap-1">
              {days.map((day) => (
                <div
                  key={day.date}
                  title={day.date}
                  className={cn(
                    "h-5 w-full rounded-sm",
                    day.isFuture
                      ? "bg-zinc-800/50"
                      : day.completed
                      ? "bg-green-500"
                      : "bg-red-500/40",
                    day.isToday && "ring-1 ring-zinc-500"
                  )}
                />
              ))}
            </div>
            <div className="mt-1.5 flex items-center justify-end gap-3 text-[10px] text-zinc-600">
              <div className="flex items-center gap-1">
                <div className="h-2.5 w-2.5 rounded-sm bg-red-500/40" />
                <span>Missed</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2.5 w-2.5 rounded-sm bg-green-500" />
                <span>Done</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2.5 w-2.5 rounded-sm bg-zinc-800/50" />
                <span>Future</span>
              </div>
            </div>
          </div>

          {/* Motivation */}
          <p className="text-center text-sm font-medium text-zinc-400">
            {getMotivation(streak.currentStreak)}
          </p>

          {/* Close button */}
          <Button
            variant="outline"
            onClick={onClose}
            className="mt-4 w-full border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
          >
            Close
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
