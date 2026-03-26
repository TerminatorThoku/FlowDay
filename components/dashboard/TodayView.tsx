"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import {
  Clock,
  MapPin,
  Dumbbell,
  BookOpen,
  Code2,
  Coffee,
  Moon,
  Timer,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProgressRing from "./ProgressRing";
import QuickActions from "./QuickActions";
import StreakBar from "./StreakBar";
import UpcomingDeadlines from "./UpcomingDeadlines";
import OptimizeButton from "./OptimizeButton";
import SpotifyWidget from "@/components/shared/SpotifyWidget";
import { cn } from "@/lib/utils";
import type { TimeBlock, Task } from "@/types/schedule";
import type { StreakData } from "@/lib/streaks/tracker";
import { BLOCK_COLORS, type BlockCategory } from "@/lib/constants";

interface TodayViewProps {
  blocks: TimeBlock[];
  userName: string;
  streaks?: StreakData[];
  deadlineTasks?: Task[];
  onStartFocus?: () => void;
  onOptimized?: (blocks: TimeBlock[]) => void;
  studyPlaylistUrl?: string;
  gymPlaylistUrl?: string;
}

function formatMinutes(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const period = h >= 12 ? "PM" : "AM";
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayH}:${m.toString().padStart(2, "0")} ${period}`;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getBlockIcon(type: string) {
  switch (type) {
    case "class":
      return BookOpen;
    case "gym":
    case "swim":
      return Dumbbell;
    case "study":
      return BookOpen;
    case "project":
      return Code2;
    case "meal":
      return Coffee;
    case "sleep":
      return Moon;
    default:
      return Clock;
  }
}

function formatCountdown(minutes: number): string {
  if (minutes <= 0) return "Now";
  if (minutes < 60) return `in ${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `in ${h}h ${m}m` : `in ${h}h`;
}

const SPOTIFY_BLOCK_TYPES = new Set(["study", "gym", "swim"]);

export default function TodayView({
  blocks,
  userName,
  streaks = [],
  deadlineTasks = [],
  onStartFocus,
  onOptimized,
  studyPlaylistUrl,
  gymPlaylistUrl,
}: TodayViewProps) {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const todayStr = format(now, "yyyy-MM-dd");
  const firstName = userName.split(" ")[0];

  const sortedBlocks = useMemo(
    () => [...blocks].sort((a, b) => a.startMinutes - b.startMinutes),
    [blocks]
  );

  // Find current / next block
  const upNext = useMemo(() => {
    const current = sortedBlocks.find(
      (b) =>
        b.startMinutes <= currentMinutes && b.endMinutes > currentMinutes
    );
    if (current) return { block: current, isCurrent: true };

    const next = sortedBlocks.find((b) => b.startMinutes > currentMinutes);
    if (next) return { block: next, isCurrent: false };

    return null;
  }, [sortedBlocks, currentMinutes]);

  // Progress
  const completedBlocks = sortedBlocks.filter(
    (b) => b.endMinutes <= currentMinutes
  ).length;
  const totalBlocks = sortedBlocks.length;

  // Quick stats
  const stats = useMemo(() => {
    const counts: Record<string, number> = {};
    sortedBlocks.forEach((b) => {
      counts[b.type] = (counts[b.type] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([type, count]) => {
        const label = BLOCK_COLORS[type as BlockCategory]?.label || type;
        return `${count} ${label.toLowerCase()}`;
      })
      .join(" | ");
  }, [sortedBlocks]);

  const allDone = !upNext && completedBlocks > 0;

  // Check if the up-next block supports Spotify
  const showSpotify =
    upNext && SPOTIFY_BLOCK_TYPES.has(upNext.block.type);

  return (
    <div className="space-y-6 px-4 py-4">
      {/* Greeting + Optimize */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">
            {getGreeting()}, {firstName}
          </h1>
          <p className="text-sm text-zinc-500">
            {format(now, "EEEE, MMMM d, yyyy")}
          </p>
        </div>
        {onOptimized && (
          <OptimizeButton
            blocks={blocks}
            tasks={deadlineTasks}
            date={todayStr}
            onOptimized={onOptimized}
          />
        )}
      </div>

      {/* Streak Bar */}
      {streaks.length > 0 && <StreakBar streaks={streaks} />}

      {/* Up Next card */}
      {upNext ? (
        <Card className="border-zinc-800 bg-zinc-900/80">
          <CardContent className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                {upNext.isCurrent ? "Happening Now" : "Up Next"}
              </span>
              <span className="text-xs font-semibold text-orange-500">
                {upNext.isCurrent
                  ? `${Math.max(0, upNext.block.endMinutes - currentMinutes)}m left`
                  : formatCountdown(
                      upNext.block.startMinutes - currentMinutes
                    )}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{
                  backgroundColor:
                    BLOCK_COLORS[upNext.block.type as BlockCategory]?.bg ||
                    "#27272a",
                }}
              >
                {(() => {
                  const Icon = getBlockIcon(upNext.block.type);
                  return (
                    <Icon
                      className="h-6 w-6"
                      style={{
                        color:
                          BLOCK_COLORS[upNext.block.type as BlockCategory]
                            ?.text || "#a1a1aa",
                      }}
                    />
                  );
                })()}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-zinc-100">
                  {upNext.block.title}
                </h3>
                <p className="text-sm text-zinc-500">
                  {formatMinutes(upNext.block.startMinutes)} -{" "}
                  {formatMinutes(upNext.block.endMinutes)}
                </p>
              </div>
            </div>
            {upNext.block.location && (
              <div className="mt-2 flex items-center gap-1 text-zinc-500">
                <MapPin className="h-3 w-3" />
                <span className="text-xs">{upNext.block.location}</span>
              </div>
            )}

            {/* Spotify Widget */}
            {showSpotify && (
              <div className="mt-3">
                <SpotifyWidget
                  blockType={upNext.block.type as "study" | "gym" | "swim"}
                  studyPlaylistUrl={studyPlaylistUrl}
                  gymPlaylistUrl={gymPlaylistUrl}
                />
              </div>
            )}

            {/* Start Focus button */}
            {onStartFocus && (
              <Button
                onClick={onStartFocus}
                size="sm"
                className="mt-3 w-full bg-orange-500 text-white hover:bg-orange-600"
              >
                <Timer className="mr-2 h-4 w-4" />
                Start Focus
              </Button>
            )}
          </CardContent>
        </Card>
      ) : allDone ? (
        <Card className="border-zinc-800 bg-zinc-900/80">
          <CardContent className="flex flex-col items-center gap-2 p-6">
            <Moon className="h-8 w-8 text-zinc-500" />
            <p className="font-semibold text-zinc-200">
              You&apos;re done for today!
            </p>
            <p className="text-sm text-zinc-500">Rest up.</p>
          </CardContent>
        </Card>
      ) : null}

      {/* Progress + stats row */}
      <div className="flex items-center gap-4">
        <ProgressRing completed={completedBlocks} total={totalBlocks} />
        <div className="flex-1">
          <p className="text-sm font-medium text-zinc-200">
            Today&apos;s Progress
          </p>
          <p className="mt-1 text-xs text-zinc-500">{stats}</p>
        </div>
      </div>

      {/* Timeline */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">
          Schedule
        </h2>
        <div className="space-y-2">
          {sortedBlocks.map((block) => {
            const colorInfo =
              BLOCK_COLORS[block.type as BlockCategory] || BLOCK_COLORS.free;
            const isPast = block.endMinutes <= currentMinutes;
            const isCurrent =
              block.startMinutes <= currentMinutes &&
              block.endMinutes > currentMinutes;
            const Icon = getBlockIcon(block.type);
            const hasSpotify = SPOTIFY_BLOCK_TYPES.has(block.type);

            return (
              <div
                key={block.id}
                className={cn(
                  "flex items-stretch gap-3 rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-3 transition-opacity",
                  isPast && "opacity-50",
                  isCurrent && "border-orange-500/50 bg-zinc-900"
                )}
              >
                {/* Time column */}
                <div className="flex w-14 flex-shrink-0 flex-col items-end justify-center text-right">
                  <span className="text-xs font-medium text-zinc-400">
                    {formatMinutes(block.startMinutes)}
                  </span>
                  <span className="text-[10px] text-zinc-600">
                    {formatMinutes(block.endMinutes)}
                  </span>
                </div>

                {/* Color bar */}
                <div
                  className="w-1 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: colorInfo.bg }}
                />

                {/* Block content */}
                <div className="flex flex-1 items-center gap-2">
                  <Icon className="h-4 w-4 flex-shrink-0 text-zinc-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-zinc-200">
                      {block.title}
                    </p>
                    {block.location && (
                      <p className="text-xs text-zinc-500">{block.location}</p>
                    )}
                  </div>
                  {isCurrent && (
                    <span className="rounded-full bg-orange-500/20 px-2 py-0.5 text-[10px] font-semibold text-orange-500">
                      NOW
                    </span>
                  )}
                  {hasSpotify && isCurrent && (
                    <SpotifyWidget
                      blockType={block.type as "study" | "gym" | "swim"}
                      className="ml-1 scale-90"
                      studyPlaylistUrl={studyPlaylistUrl}
                      gymPlaylistUrl={gymPlaylistUrl}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <UpcomingDeadlines tasks={deadlineTasks} />

      <QuickActions />
    </div>
  );
}
