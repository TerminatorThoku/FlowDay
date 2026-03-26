"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Moon, Star, Lightbulb } from "lucide-react";
import { useLifestyleStore } from "@/stores/lifestyleStore";
import { format, subDays } from "date-fns";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function SleepStats() {
  const allLogs = useLifestyleStore((s) => s.sleepLogs);
  const weekLogs = useMemo(() => useLifestyleStore.getState().getSleepLogsForWeek(), [allLogs]);

  // Average sleep this week
  const avgSleep =
    weekLogs.length > 0
      ? weekLogs.reduce((sum, l) => sum + l.hours, 0) / weekLogs.length
      : 0;

  // Average quality this week
  const avgQuality =
    weekLogs.length > 0
      ? weekLogs.reduce((sum, l) => sum + l.quality, 0) / weekLogs.length
      : 0;

  // Build 7-day chart data
  const chartData = useMemo(() => {
    const today = new Date();
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = subDays(today, i);
      const dateStr = format(d, "yyyy-MM-dd");
      const dayLabel = DAY_LABELS[d.getDay() === 0 ? 6 : d.getDay() - 1];
      const dayLogs = allLogs.filter((l) => l.date === dateStr);
      const hours =
        dayLogs.length > 0
          ? dayLogs.reduce((sum, l) => sum + l.hours, 0) / dayLogs.length
          : 0;
      const quality =
        dayLogs.length > 0
          ? Math.round(
              dayLogs.reduce((sum, l) => sum + l.quality, 0) / dayLogs.length,
            )
          : 0;
      days.push({ dayLabel, hours, quality, date: dateStr });
    }
    return days;
  }, [allLogs]);

  // Bar width calculation (max 10 hours = full width)
  const maxHours = 10;

  return (
    <div className="space-y-4">
      {/* Averages Row */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10">
              <Moon className="h-4 w-4 text-indigo-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-zinc-100">
                {avgSleep > 0 ? avgSleep.toFixed(1) : "--"}
              </p>
              <p className="text-[10px] text-zinc-500">Avg hours</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-500/10">
              <Star className="h-4 w-4 text-yellow-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-zinc-100">
                {avgQuality > 0 ? avgQuality.toFixed(1) : "--"}
              </p>
              <p className="text-[10px] text-zinc-500">Avg quality /5</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 7-Day Chart */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-zinc-300">
            Last 7 Days
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          {chartData.map((day) => (
            <div key={day.date} className="flex items-center gap-2">
              <span className="w-8 text-right text-[10px] font-medium text-zinc-500">
                {day.dayLabel}
              </span>
              <div className="flex-1">
                <div className="h-4 w-full overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      day.hours >= 7
                        ? "bg-indigo-500"
                        : day.hours >= 5
                          ? "bg-yellow-500"
                          : day.hours > 0
                            ? "bg-red-500"
                            : "bg-zinc-800"
                    }`}
                    style={{
                      width: `${Math.min((day.hours / maxHours) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
              <span className="w-10 text-right text-[10px] text-zinc-400">
                {day.hours > 0 ? `${day.hours.toFixed(1)}h` : "--"}
              </span>
              <div className="flex w-14 items-center gap-0.5">
                {day.quality > 0
                  ? [1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-2 w-2 ${
                          s <= day.quality
                            ? "fill-yellow-500 text-yellow-500"
                            : "text-zinc-700"
                        }`}
                      />
                    ))
                  : <span className="text-[10px] text-zinc-700">--</span>
                }
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Insight */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardContent className="flex items-start gap-3 p-4">
          <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-500" />
          <p className="text-xs text-zinc-400">
            Best productivity correlates with 7+ hours of sleep. Try to
            maintain a consistent sleep schedule for optimal performance.
          </p>
        </CardContent>
      </Card>

      {weekLogs.length === 0 && (
        <div className="py-8 text-center">
          <Moon className="mx-auto h-8 w-8 text-zinc-700" />
          <p className="mt-2 text-sm text-zinc-500">
            No sleep data this week yet
          </p>
          <p className="text-xs text-zinc-600">
            Log your sleep to see patterns
          </p>
        </div>
      )}
    </div>
  );
}
