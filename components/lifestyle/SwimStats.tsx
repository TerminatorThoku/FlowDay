"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Waves, Clock, Trophy } from "lucide-react";
import { useLifestyleStore } from "@/stores/lifestyleStore";

export default function SwimStats() {
  const allLogs = useLifestyleStore((s) => s.swimLogs);
  const weekLogs = useMemo(() => useLifestyleStore.getState().getSwimLogsForWeek(), [allLogs]);

  // Sessions this week (unique dates)
  const uniqueDates = new Set(weekLogs.map((l) => l.date));
  const sessionsThisWeek = uniqueDates.size;
  const plannedSessions = 3;
  const sessionProgress = Math.min(
    (sessionsThisWeek / plannedSessions) * 100,
    100,
  );

  // Total laps this week
  const totalLaps = weekLogs.reduce((sum, l) => sum + l.laps, 0);

  // Average duration
  const avgDuration =
    weekLogs.length > 0
      ? weekLogs.reduce((sum, l) => sum + l.duration_minutes, 0) /
        weekLogs.length
      : 0;

  // Best session this month (most laps)
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split("T")[0];
  const monthLogs = allLogs.filter((l) => l.date >= monthStart);
  const bestSession =
    monthLogs.length > 0
      ? monthLogs.reduce((best, l) => (l.laps > best.laps ? l : best))
      : null;

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
            className="h-2 bg-zinc-800 [&>div]:bg-cyan-500"
          />
        </CardContent>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10">
              <Waves className="h-4 w-4 text-cyan-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-zinc-100">{totalLaps}</p>
              <p className="text-[10px] text-zinc-500">Total laps</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10">
              <Clock className="h-4 w-4 text-cyan-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-zinc-100">
                {avgDuration > 0 ? Math.round(avgDuration) : 0}
              </p>
              <p className="text-[10px] text-zinc-500">Avg min</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Best Session */}
      {bestSession && (
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm text-zinc-300">
              <Trophy className="h-4 w-4 text-yellow-500" />
              Best Session This Month
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="rounded-lg bg-zinc-800/50 px-3 py-2">
              <p className="text-xs font-medium text-zinc-300">
                {bestSession.laps} laps - {bestSession.stroke_type}
              </p>
              <p className="text-[10px] text-zinc-500">
                {bestSession.duration_minutes} min | {bestSession.date}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {weekLogs.length === 0 && (
        <div className="py-8 text-center">
          <Waves className="mx-auto h-8 w-8 text-zinc-700" />
          <p className="mt-2 text-sm text-zinc-500">
            No swim sessions this week yet
          </p>
          <p className="text-xs text-zinc-600">
            Log a session to see your stats
          </p>
        </div>
      )}
    </div>
  );
}
