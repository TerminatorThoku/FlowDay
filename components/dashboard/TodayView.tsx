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
  Plus,
  Zap,
  CheckCircle2,
  Flame,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import {
  StaggeredList,
  StaggeredItem,
} from "@/components/shared/StaggeredList";
import { CountUp } from "@/components/shared/CountUp";
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

const STREAK_EMOJI: Record<string, string> = {
  gym: "\uD83D\uDD25",
  study: "\uD83D\uDCDA",
  coding: "\uD83D\uDCBB",
  sleep: "\uD83D\uDE34",
  swim: "\uD83C\uDFCA",
};

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

  const completedBlocks = sortedBlocks.filter(
    (b) => b.endMinutes <= currentMinutes
  ).length;
  const totalBlocks = sortedBlocks.length;

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

  const showSpotify =
    upNext && SPOTIFY_BLOCK_TYPES.has(upNext.block.type);

  return (
    <div className="space-y-6 px-4 py-4">
      {/* Greeting */}
      <AnimatedSection>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              {getGreeting()}, {firstName}
            </h1>
            <p className="text-sm text-white/32 font-mono mt-1">
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
      </AnimatedSection>

      {/* Streak chips */}
      {streaks.length > 0 && (
        <AnimatedSection delay={0.1}>
          <StaggeredList className="flex flex-wrap gap-2">
            {streaks.map((s) => (
              <StaggeredItem key={s.type}>
                <div className="flex items-center gap-1.5 bg-white/[0.04] rounded-full px-3 py-1.5 text-xs">
                  <span>{STREAK_EMOJI[s.type] || "\u2B50"}</span>
                  <span className="font-mono font-bold text-white/90">
                    {s.currentStreak}
                  </span>
                  <span className="text-white/40">
                    {s.type}
                  </span>
                </div>
              </StaggeredItem>
            ))}
          </StaggeredList>
        </AnimatedSection>
      )}

      {/* Quick Stats Row */}
      <AnimatedSection delay={0.12}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="surface-1 rounded-xl p-4 border border-white/[0.06]">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-3.5 w-3.5 text-purple-400" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/32">Focus Today</span>
            </div>
            <p className="font-mono text-2xl font-bold text-white/90">
              <CountUp target={1.5} suffix="h" />
            </p>
          </div>
          <div className="surface-1 rounded-xl p-4 border border-white/[0.06]">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/32">Tasks Done</span>
            </div>
            <p className="font-mono text-2xl font-bold text-white/90">
              <CountUp target={completedBlocks} decimals={0} />
              <span className="text-sm text-white/30 font-normal">/{totalBlocks}</span>
            </p>
          </div>
          <div className="surface-1 rounded-xl p-4 border border-white/[0.06]">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="h-3.5 w-3.5 text-orange-400" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/32">Best Streak</span>
            </div>
            <p className="font-mono text-2xl font-bold text-white/90">
              <CountUp target={streaks.length > 0 ? Math.max(...streaks.map(s => s.currentStreak)) : 0} decimals={0} suffix=" days" />
            </p>
          </div>
          <div className="surface-1 rounded-xl p-4 border border-white/[0.06]">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/32">Next Deadline</span>
            </div>
            {deadlineTasks.length > 0 ? (
              <>
                <p className="font-mono text-lg font-bold text-white/90 truncate">{deadlineTasks[0].title.split(' ').slice(0, 2).join(' ')}</p>
                <p className="text-[10px] text-white/32">
                  in {Math.max(1, Math.ceil((new Date(deadlineTasks[0].due_date!).getTime() - Date.now()) / 86400000))} days
                </p>
              </>
            ) : (
              <p className="text-sm text-white/40">All clear</p>
            )}
          </div>
        </div>
      </AnimatedSection>

      {/* Up Next card */}
      {upNext ? (
        <AnimatedSection delay={0.15}>
          <Card className="relative overflow-hidden border-white/[0.08]">
            {/* Gradient top border */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-500 via-orange-400 to-transparent" />

            <CardContent className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/32">
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
                  <h3 className="font-semibold text-white/92">
                    {upNext.block.title}
                  </h3>
                  <p className="text-sm text-white/40">
                    {formatMinutes(upNext.block.startMinutes)} -{" "}
                    {formatMinutes(upNext.block.endMinutes)}
                  </p>
                </div>
              </div>
              {upNext.block.location && (
                <div className="mt-2 flex items-center gap-1 text-white/32">
                  <MapPin className="h-3 w-3" />
                  <span className="text-xs">{upNext.block.location}</span>
                </div>
              )}

              {showSpotify && (
                <div className="mt-3">
                  <SpotifyWidget
                    blockType={upNext.block.type as "study" | "gym" | "swim"}
                    studyPlaylistUrl={studyPlaylistUrl}
                    gymPlaylistUrl={gymPlaylistUrl}
                  />
                </div>
              )}

              {onStartFocus && (
                <div className="mt-4 flex justify-center">
                  <Button
                    onClick={onStartFocus}
                    className="rounded-full px-8"
                  >
                    <Timer className="mr-2 h-4 w-4" />
                    Start Focus
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </AnimatedSection>
      ) : allDone ? (
        <AnimatedSection delay={0.15}>
          <Card>
            <CardContent className="flex flex-col items-center gap-2 p-6">
              <Moon className="h-8 w-8 text-white/30" />
              <p className="font-semibold text-white/90">
                You&apos;re done for today!
              </p>
              <p className="text-sm text-white/40">Rest up.</p>
            </CardContent>
          </Card>
        </AnimatedSection>
      ) : null}

      {/* Progress row */}
      <AnimatedSection delay={0.2}>
        <div className="flex items-center gap-4">
          <ProgressRing completed={completedBlocks} total={totalBlocks} />
          <div className="flex-1">
            <p className="text-sm font-medium text-white/90">
              Today&apos;s Progress
            </p>
            <p className="mt-1 text-xs text-white/32">{stats}</p>
          </div>
          <Button
            variant="secondary"
            size="icon"
            className="h-10 w-10 rounded-full"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </AnimatedSection>

      {/* Timeline */}
      <AnimatedSection delay={0.25}>
        <div>
          <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/32">
            Schedule
          </h2>
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-[18px] top-0 bottom-0 w-px bg-white/[0.08]" />

            <StaggeredList className="space-y-1.5">
              {sortedBlocks.map((block) => {
                const colorInfo =
                  BLOCK_COLORS[block.type as BlockCategory] ||
                  BLOCK_COLORS.free;
                const isPast = block.endMinutes <= currentMinutes;
                const isCurrent =
                  block.startMinutes <= currentMinutes &&
                  block.endMinutes > currentMinutes;
                const Icon = getBlockIcon(block.type);
                const hasSpotify = SPOTIFY_BLOCK_TYPES.has(block.type);

                return (
                  <StaggeredItem key={block.id}>
                    <div className="flex items-start gap-3 group">
                      {/* Timeline dot */}
                      <div className="relative z-10 mt-3 flex-shrink-0">
                        <div
                          className={cn(
                            "h-[10px] w-[10px] rounded-full border-2",
                            isCurrent
                              ? "bg-orange-500 border-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)] animate-pulse-slow"
                              : isPast
                              ? "bg-white/20 border-white/20"
                              : "bg-transparent border-white/20"
                          )}
                          style={
                            !isCurrent && !isPast
                              ? { borderColor: colorInfo.text || "#a1a1aa" }
                              : undefined
                          }
                        />
                      </div>

                      {/* Card */}
                      <div
                        className={cn(
                          "flex-1 rounded-xl surface-1 border border-white/[0.06] p-3 transition-all duration-200",
                          isPast && "opacity-40",
                          isCurrent &&
                            "border-white/[0.12] bg-white/[0.05]",
                          !isPast &&
                            "group-hover:border-white/[0.12] group-hover:bg-white/[0.04]"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            className="h-4 w-4 flex-shrink-0"
                            style={{ color: colorInfo.text || "#a1a1aa" }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white/90 truncate">
                              {block.title}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-white/32 font-mono">
                                {formatMinutes(block.startMinutes)} -{" "}
                                {formatMinutes(block.endMinutes)}
                              </span>
                              {block.location && (
                                <span className="flex items-center gap-0.5 text-xs text-white/25">
                                  <MapPin className="h-2.5 w-2.5" />
                                  {block.location}
                                </span>
                              )}
                            </div>
                          </div>
                          {isCurrent && (
                            <span className="rounded-full bg-orange-500/15 px-2 py-0.5 text-[10px] font-semibold text-orange-500 border border-orange-500/20">
                              NOW
                            </span>
                          )}
                          {hasSpotify && isCurrent && (
                            <SpotifyWidget
                              blockType={
                                block.type as "study" | "gym" | "swim"
                              }
                              className="ml-1 scale-90"
                              studyPlaylistUrl={studyPlaylistUrl}
                              gymPlaylistUrl={gymPlaylistUrl}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </StaggeredItem>
                );
              })}
            </StaggeredList>
          </div>
        </div>
      </AnimatedSection>

      {/* Upcoming Deadlines */}
      <AnimatedSection delay={0.3}>
        <UpcomingDeadlines tasks={deadlineTasks} />
      </AnimatedSection>

      <AnimatedSection delay={0.35}>
        <QuickActions />
      </AnimatedSection>
    </div>
  );
}
