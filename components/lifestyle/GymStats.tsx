"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dumbbell, TrendingUp, TrendingDown, Trophy, Minus } from "lucide-react";
import { useLifestyleStore } from "@/stores/lifestyleStore";

export default function GymStats() {
  const gymLogs = useLifestyleStore((s) => s.gymLogs);
  const weekLogs = useMemo(() => useLifestyleStore.getState().getGymLogsForWeek(), [gymLogs]);

  // Unique sessions this week (unique dates)
  const uniqueDates = new Set(weekLogs.map((l) => l.date));
  const sessionsThisWeek = uniqueDates.size;
  const plannedSessions = 5;
  const sessionProgress = Math.min(
    (sessionsThisWeek / plannedSessions) * 100,
    100,
  );

  // Total volume: sum of sets * reps * weight
  const totalVolume = weekLogs.reduce(
    (sum, l) => sum + l.sets * l.reps * l.weight_kg,
    0,
  );

  // Per-exercise progression (group by exercise, find max weight)
  const exerciseMap = new Map<
    string,
    { maxWeight: number; entries: typeof weekLogs }
  >();
  weekLogs.forEach((log) => {
    const existing = exerciseMap.get(log.exercise);
    if (!existing) {
      exerciseMap.set(log.exercise, {
        maxWeight: log.weight_kg,
        entries: [log],
      });
    } else {
      existing.maxWeight = Math.max(existing.maxWeight, log.weight_kg);
      existing.entries.push(log);
    }
  });

  // Personal records (all time)
  const allLogs = useLifestyleStore((s) => s.gymLogs);
  const prMap = new Map<string, number>();
  allLogs.forEach((log) => {
    const current = prMap.get(log.exercise) || 0;
    if (log.weight_kg > current) {
      prMap.set(log.exercise, log.weight_kg);
    }
  });

  return (
    <div className="space-y-4">
      {/* Sessions Progress */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardContent className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-300">
              This Week
            </span>
            <span className="text-xs text-zinc-500">
              {sessionsThisWeek}/{plannedSessions} sessions
            </span>
          </div>
          <Progress
            value={sessionProgress}
            className="h-2 bg-zinc-800 [&>div]:bg-green-500"
          />
        </CardContent>
      </Card>

      {/* Total Volume */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
            <Dumbbell className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-zinc-100">
              {totalVolume.toLocaleString()} kg
            </p>
            <p className="text-xs text-zinc-500">Total volume this week</p>
          </div>
        </CardContent>
      </Card>

      {/* Exercise Progression */}
      {exerciseMap.size > 0 && (
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-300">
              Exercise Progression
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            {Array.from(exerciseMap.entries()).map(([exercise, data]) => {
              const entries = data.entries.sort(
                (a, b) => a.date.localeCompare(b.date),
              );
              const first = entries[0]?.weight_kg || 0;
              const last = entries[entries.length - 1]?.weight_kg || 0;
              const trend = last - first;

              return (
                <div
                  key={exercise}
                  className="flex items-center justify-between rounded-lg bg-zinc-800/50 px-3 py-2"
                >
                  <span className="text-xs text-zinc-300">{exercise}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-zinc-400">
                      {first}kg
                      {entries.length > 1 ? ` → ${last}kg` : ""}
                    </span>
                    {trend > 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-400" />
                    ) : trend < 0 ? (
                      <TrendingDown className="h-3 w-3 text-red-400" />
                    ) : (
                      <Minus className="h-3 w-3 text-zinc-500" />
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Personal Records */}
      {prMap.size > 0 && (
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm text-zinc-300">
              <Trophy className="h-4 w-4 text-yellow-500" />
              Personal Records
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 pt-0">
            {Array.from(prMap.entries()).map(([exercise, weight]) => (
              <div
                key={exercise}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-zinc-400">{exercise}</span>
                <span className="font-semibold text-yellow-400">
                  {weight} kg
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {weekLogs.length === 0 && (
        <div className="py-8 text-center">
          <Dumbbell className="mx-auto h-8 w-8 text-zinc-700" />
          <p className="mt-2 text-sm text-zinc-500">
            No gym sessions this week yet
          </p>
          <p className="text-xs text-zinc-600">
            Log a workout to see your stats
          </p>
        </div>
      )}
    </div>
  );
}
