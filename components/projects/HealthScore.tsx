"use client";

import { useState } from "react";
import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProjectHealth } from "@/lib/projects/health";
import { HEALTH_COLORS } from "@/lib/projects/health";

interface HealthScoreProps {
  health: ProjectHealth;
  compact?: boolean;
}

export default function HealthScore({ health, compact = false }: HealthScoreProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const colors = HEALTH_COLORS[health.level];

  if (compact) {
    return (
      <div className="relative inline-flex items-center gap-1">
        <button
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={() => setShowTooltip(!showTooltip)}
          className="flex items-center gap-1"
        >
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: colors.dot }}
          />
          <span className={cn("text-xs font-semibold", colors.text)}>
            {health.score}
          </span>
        </button>

        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute left-0 top-full z-50 mt-2 w-48 rounded-xl border border-zinc-800 bg-zinc-950 p-3 shadow-xl">
            <HealthBreakdown health={health} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Shield className={cn("h-4 w-4", colors.text)} />
        <span className={cn("text-xs font-semibold", colors.text)}>
          {colors.label}
        </span>
        <span className="text-sm font-bold text-zinc-200">{health.score}</span>
      </div>
      <HealthBreakdown health={health} />
    </div>
  );
}

function HealthBreakdown({ health }: { health: ProjectHealth }) {
  const breakdown = [
    { label: "Tasks", score: health.breakdown.tasksScore, weight: "40%" },
    { label: "Hours", score: health.breakdown.hoursScore, weight: "30%" },
    { label: "Commits", score: health.breakdown.commitsScore, weight: "20%" },
    { label: "Recent", score: health.breakdown.recencyScore, weight: "10%" },
  ];

  return (
    <div className="space-y-1.5">
      {breakdown.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span className="w-12 text-[10px] text-zinc-500">{item.label}</span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${item.score}%`,
                backgroundColor: getBarColor(item.score),
              }}
            />
          </div>
          <span className="w-6 text-right text-[10px] text-zinc-500">
            {item.score}
          </span>
        </div>
      ))}
    </div>
  );
}

function getBarColor(score: number): string {
  if (score < 30) return "#EF4444";
  if (score < 60) return "#EAB308";
  if (score < 85) return "#22C55E";
  return "#3B82F6";
}
