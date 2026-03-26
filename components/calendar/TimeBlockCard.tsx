"use client";

import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TimeBlock } from "@/types/schedule";
import { BLOCK_COLORS, type BlockCategory } from "@/lib/constants";

interface TimeBlockCardProps {
  block: TimeBlock;
  onClick: () => void;
}

function formatMinutes(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const period = h >= 12 ? "PM" : "AM";
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayH}:${m.toString().padStart(2, "0")} ${period}`;
}

export default function TimeBlockCard({ block, onClick }: TimeBlockCardProps) {
  const duration = block.endMinutes - block.startMinutes;
  const height = Math.max(duration, 20); // minimum 20px height
  const colorInfo = BLOCK_COLORS[block.type as BlockCategory] || BLOCK_COLORS.free;

  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const isPast =
    block.date < today || (block.date === today && block.endMinutes < currentMinutes);

  return (
    <button
      onClick={onClick}
      className={cn(
        "absolute left-1 right-1 overflow-hidden rounded-md px-2 py-1 text-left transition-opacity",
        isPast ? "opacity-50" : "opacity-100"
      )}
      style={{
        top: `${block.startMinutes - 360}px`, // 360 = 6 AM offset
        height: `${height}px`,
        backgroundColor: colorInfo.bg,
        color: colorInfo.text,
      }}
    >
      <p className="truncate text-xs font-semibold leading-tight">
        {block.title}
      </p>
      {duration >= 30 && (
        <p className="text-[10px] leading-tight opacity-80">
          {formatMinutes(block.startMinutes)} - {formatMinutes(block.endMinutes)}
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
  );
}
