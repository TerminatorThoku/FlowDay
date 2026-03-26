"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { StreakData } from "@/lib/streaks/tracker";
import StreakCard from "@/components/streaks/StreakCard";

interface StreakBarProps {
  streaks: StreakData[];
}

const streakEmojis: Record<string, string> = {
  gym: "\uD83D\uDD25",
  study: "\uD83D\uDCDA",
  coding: "\uD83D\uDCBB",
  sleep: "\uD83D\uDE34",
  overall: "\uD83C\uDFC6",
};

export default function StreakBar({ streaks }: StreakBarProps) {
  const [selectedStreak, setSelectedStreak] = useState<StreakData | null>(null);

  const activeStreaks = streaks.filter((s) => s.currentStreak > 0);

  if (activeStreaks.length === 0) return null;

  return (
    <>
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {activeStreaks.map((streak) => {
          const emoji = streakEmojis[streak.type] || "\uD83D\uDD25";
          const isHot = streak.currentStreak >= 7;

          return (
            <button
              key={streak.type}
              onClick={() => setSelectedStreak(streak)}
              className={cn(
                "flex flex-shrink-0 items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-800",
                isHot && "border-orange-500/30 bg-orange-500/10"
              )}
            >
              <span className={cn("text-sm", isHot && "animate-pulse")}>
                {emoji}
              </span>
              <span className={cn("font-bold", isHot && "text-orange-400")}>
                {streak.currentStreak}
              </span>
              <span className="text-zinc-500">{streak.type}</span>
            </button>
          );
        })}
      </div>

      {selectedStreak && (
        <StreakCard
          streak={selectedStreak}
          onClose={() => setSelectedStreak(null)}
        />
      )}
    </>
  );
}
