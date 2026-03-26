"use client";

import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { X, Play, Pause, SkipForward, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePomodoro, type PomodoroPhase } from "@/hooks/usePomodoro";
import { usePomodoroStore } from "@/stores/pomodoroStore";

interface PomodoroTimerProps {
  taskTitle?: string;
  subject?: string;
  onComplete: (session: { duration: number; completed: boolean }) => void;
  onClose: () => void;
}

const phaseConfig: Record<
  PomodoroPhase,
  { label: string; color: string; trackColor: string; bgGlow: string }
> = {
  work: {
    label: "Focus",
    color: "text-orange-500",
    trackColor: "#f97316",
    bgGlow: "shadow-orange-500/10",
  },
  break: {
    label: "Break",
    color: "text-green-500",
    trackColor: "#22c55e",
    bgGlow: "shadow-green-500/10",
  },
  long_break: {
    label: "Long Break",
    color: "text-blue-500",
    trackColor: "#3b82f6",
    bgGlow: "shadow-blue-500/10",
  },
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function PomodoroTimer({
  taskTitle,
  subject,
  onComplete,
  onClose,
}: PomodoroTimerProps) {
  const addSession = usePomodoroStore((s) => s.addSession);
  const endSession = usePomodoroStore((s) => s.endSession);

  const handlePhaseComplete = useCallback(
    (phase: PomodoroPhase) => {
      if (phase === "work") {
        const session = {
          id: crypto.randomUUID(),
          task_id: null,
          subject: subject || null,
          started_at: new Date().toISOString(),
          duration_minutes: 25,
          completed: true,
        };
        addSession(session);
        onComplete({ duration: 25, completed: true });
      }
    },
    [addSession, onComplete, subject]
  );

  const {
    timeRemaining,
    totalDuration,
    isActive,
    isPaused,
    currentPhase,
    sessionCount,
    start,
    pause,
    resume,
    reset,
    skipBreak,
  } = usePomodoro(handlePhaseComplete);

  const config = phaseConfig[currentPhase];

  // SVG ring calculations
  const size = 280;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = totalDuration > 0 ? timeRemaining / totalDuration : 1;
  const offset = circumference - progress * circumference;

  const handleClose = () => {
    endSession();
    onClose();
  };

  const handleReset = () => {
    reset();
  };

  const currentSessionDisplay = Math.min(sessionCount + 1, 4);

  return (
    <div className="flex h-full flex-col items-center justify-between bg-zinc-950 px-6 py-8">
      {/* Header */}
      <div className="flex w-full items-center justify-between">
        <button
          onClick={handleClose}
          className="rounded-full p-2 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="text-center">
          <span
            className={cn(
              "text-xs font-semibold uppercase tracking-widest",
              config.color
            )}
          >
            {config.label}
          </span>
        </div>
        <div className="w-9" /> {/* Spacer for centering */}
      </div>

      {/* Task info */}
      {(taskTitle || subject) && (
        <div className="mt-4 text-center">
          {taskTitle && (
            <p className="text-sm font-medium text-zinc-300">{taskTitle}</p>
          )}
          {subject && (
            <p className="text-xs text-zinc-500">{subject}</p>
          )}
        </div>
      )}

      {/* Timer Ring */}
      <div className={cn("relative flex items-center justify-center", config.bgGlow)}>
        <svg
          width={size}
          height={size}
          className="-rotate-90"
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-zinc-800"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={config.trackColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        {/* Time display */}
        <div className="absolute flex flex-col items-center">
          <span className="text-5xl font-bold tabular-nums text-zinc-100">
            {formatTime(timeRemaining)}
          </span>
          <span className="mt-1 text-sm text-zinc-500">
            Session {currentSessionDisplay} of 4
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handleReset}
            className="h-12 w-12 rounded-full border-zinc-700 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>

          {!isActive ? (
            <Button
              size="icon"
              onClick={start}
              className="h-16 w-16 rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/25 hover:bg-orange-600"
            >
              <Play className="h-7 w-7 ml-0.5" />
            </Button>
          ) : isPaused ? (
            <Button
              size="icon"
              onClick={resume}
              className="h-16 w-16 rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/25 hover:bg-orange-600"
            >
              <Play className="h-7 w-7 ml-0.5" />
            </Button>
          ) : (
            <Button
              size="icon"
              onClick={pause}
              className="h-16 w-16 rounded-full bg-zinc-700 text-zinc-100 shadow-lg hover:bg-zinc-600"
            >
              <Pause className="h-7 w-7" />
            </Button>
          )}

          {(currentPhase === "break" || currentPhase === "long_break") && (
            <Button
              variant="outline"
              size="icon"
              onClick={skipBreak}
              className="h-12 w-12 rounded-full border-zinc-700 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          )}

          {currentPhase === "work" && (
            <div className="h-12 w-12" /> // Spacer when skip is hidden
          )}
        </div>

        {/* Session dots */}
        <div className="flex items-center gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-2.5 w-2.5 rounded-full transition-colors",
                i < sessionCount
                  ? "bg-orange-500"
                  : i === sessionCount && currentPhase === "work"
                  ? "bg-orange-500/40"
                  : "bg-zinc-700"
              )}
            />
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 text-center">
          <div>
            <p className="text-lg font-bold text-zinc-100">{sessionCount}</p>
            <p className="text-xs text-zinc-500">Sessions</p>
          </div>
          <div className="h-8 w-px bg-zinc-800" />
          <div>
            <p className="text-lg font-bold text-zinc-100">
              {sessionCount * 25}m
            </p>
            <p className="text-xs text-zinc-500">Focus time</p>
          </div>
        </div>
      </div>
    </div>
  );
}
