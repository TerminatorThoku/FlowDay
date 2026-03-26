"use client";

import { useState, useRef, useCallback } from "react";
import { MapPin, GripVertical, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TimeBlock } from "@/types/schedule";
import { BLOCK_COLORS, type BlockCategory } from "@/lib/constants";

interface TimeBlockCardProps {
  block: TimeBlock;
  onClick: () => void;
  onDragStart?: (block: TimeBlock) => void;
  onSkip?: (block: TimeBlock) => void;
}

function formatMinutes(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const period = h >= 12 ? "PM" : "AM";
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayH}:${m.toString().padStart(2, "0")} ${period}`;
}

const LONG_PRESS_MS = 500;
const DRAGGABLE_TYPES = new Set(["gym", "swim", "study", "project", "task"]);

export default function TimeBlockCard({
  block,
  onClick,
  onDragStart,
  onSkip,
}: TimeBlockCardProps) {
  const [isDragMode, setIsDragMode] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPress = useRef(false);

  const duration = block.endMinutes - block.startMinutes;
  const height = Math.max(duration, 20);
  const colorInfo =
    BLOCK_COLORS[block.type as BlockCategory] || BLOCK_COLORS.free;

  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const isPast =
    block.date < today ||
    (block.date === today && block.endMinutes < currentMinutes);

  const isDraggable = DRAGGABLE_TYPES.has(block.type);

  const clearTimer = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handlePointerDown = useCallback(() => {
    if (!isDraggable) return;
    isLongPress.current = false;

    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      setIsDragMode(true);

      // Haptic feedback on supported devices
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, LONG_PRESS_MS);
  }, [isDraggable]);

  const handlePointerUp = useCallback(() => {
    clearTimer();
    if (!isLongPress.current && !isDragMode) {
      onClick();
    }
  }, [clearTimer, isDragMode, onClick]);

  const handlePointerLeave = useCallback(() => {
    clearTimer();
  }, [clearTimer]);

  const handleDragStart = useCallback(() => {
    if (onDragStart) {
      onDragStart(block);
    }
  }, [block, onDragStart]);

  const handleSkip = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation();
      setIsDragMode(false);
      if (onSkip) {
        onSkip(block);
      }
    },
    [block, onSkip]
  );

  const handleCancelDrag = useCallback(() => {
    setIsDragMode(false);
  }, []);

  return (
    <div
      className="absolute left-1 right-1"
      style={{
        top: `${block.startMinutes - 360}px`,
        height: `${height}px`,
        zIndex: isDragMode ? 50 : 1,
      }}
    >
      <button
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onContextMenu={(e) => e.preventDefault()}
        className={cn(
          "relative h-full w-full overflow-hidden rounded-xl px-2 py-1 text-left transition-all duration-200 cursor-pointer hover:brightness-110 hover:shadow-lg",
          isPast && !isDragMode ? "opacity-50" : "opacity-100",
          isDragMode &&
            "scale-[1.02] shadow-lg shadow-black/40 ring-2 ring-orange-500/50"
        )}
        style={{
          backgroundColor: isDragMode
            ? `${colorInfo.bg}cc`
            : colorInfo.bg,
          color: colorInfo.text,
        }}
      >
        {/* Drag handle indicator */}
        {isDragMode && (
          <div className="absolute right-1 top-0.5">
            <GripVertical className="h-3 w-3 opacity-60" />
          </div>
        )}

        <p className="truncate text-xs font-semibold leading-tight">
          {block.title}
        </p>
        {duration >= 30 && (
          <p className="text-[10px] leading-tight opacity-80">
            {formatMinutes(block.startMinutes)} -{" "}
            {formatMinutes(block.endMinutes)}
          </p>
        )}
        {block.location && duration >= 45 && (
          <div className="mt-0.5 flex items-center gap-0.5">
            <MapPin className="h-2.5 w-2.5 flex-shrink-0 opacity-70" />
            <span className="truncate text-[10px] opacity-70">
              {block.location}
            </span>
          </div>
        )}
      </button>

      {/* Drag mode overlay actions */}
      {isDragMode && (
        <div className="absolute -bottom-8 left-0 right-0 flex items-center justify-center gap-2 z-50">
          <button
            onClick={handleDragStart}
            className="flex items-center gap-1 rounded-full bg-orange-500 px-3 py-1 text-[10px] font-semibold text-white shadow-md transition-colors hover:bg-orange-600"
          >
            <GripVertical className="h-3 w-3" />
            Move
          </button>
          {(block.type === "gym" || block.type === "swim") && (
            <button
              onClick={handleSkip}
              className="flex items-center gap-1 rounded-full bg-zinc-700 px-3 py-1 text-[10px] font-semibold text-zinc-200 shadow-md transition-colors hover:bg-zinc-600"
            >
              <SkipForward className="h-3 w-3" />
              Skip
            </button>
          )}
          <button
            onClick={handleCancelDrag}
            className="rounded-full bg-zinc-800 px-3 py-1 text-[10px] font-semibold text-zinc-400 shadow-md transition-colors hover:bg-zinc-700"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
