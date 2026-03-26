"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, BookOpen, User, CheckCircle2 } from "lucide-react";
import type { TimeBlock } from "@/types/schedule";
import { BLOCK_COLORS, type BlockCategory } from "@/lib/constants";

interface BlockDetailProps {
  block: TimeBlock | null;
  open: boolean;
  onClose: () => void;
}

function formatMinutes(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const period = h >= 12 ? "PM" : "AM";
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayH}:${m.toString().padStart(2, "0")} ${period}`;
}

function formatDuration(startMins: number, endMins: number): string {
  const diff = endMins - startMins;
  const hours = Math.floor(diff / 60);
  const mins = diff % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export default function BlockDetail({ block, open, onClose }: BlockDetailProps) {
  if (!block) return null;

  const colorInfo =
    BLOCK_COLORS[block.type as BlockCategory] || BLOCK_COLORS.free;
  const meta = block.meta || {};

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent
        side="bottom"
        className="rounded-t-2xl border-zinc-800 bg-zinc-900"
      >
        <SheetHeader className="text-left">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <SheetTitle className="text-xl text-zinc-100">
                {block.title}
              </SheetTitle>
              <SheetDescription className="sr-only">
                Details for {block.title}
              </SheetDescription>
            </div>
            <Badge
              className="ml-2 flex-shrink-0"
              style={{
                backgroundColor: colorInfo.bg,
                color: colorInfo.text,
              }}
            >
              {colorInfo.label}
            </Badge>
          </div>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          {/* Time info */}
          <div className="flex items-center gap-3 text-zinc-300">
            <Clock className="h-4 w-4 text-zinc-500" />
            <span className="text-sm">
              {formatMinutes(block.startMinutes)} -{" "}
              {formatMinutes(block.endMinutes)}
            </span>
            <span className="text-xs text-zinc-500">
              ({formatDuration(block.startMinutes, block.endMinutes)})
            </span>
          </div>

          {/* Location */}
          {block.location ? (
            <div className="flex items-center gap-3 text-zinc-300">
              <MapPin className="h-4 w-4 text-zinc-500" />
              <span className="text-sm">{block.location}</span>
            </div>
          ) : null}

          {/* Class-specific: lecturer, room */}
          {block.type === "class" && Boolean(meta.lecturer) ? (
            <div className="flex items-center gap-3 text-zinc-300">
              <User className="h-4 w-4 text-zinc-500" />
              <span className="text-sm">{String(meta.lecturer)}</span>
            </div>
          ) : null}

          {block.type === "class" && Boolean(meta.moduleCode) ? (
            <div className="flex items-center gap-3 text-zinc-300">
              <BookOpen className="h-4 w-4 text-zinc-500" />
              <span className="text-sm">{String(meta.moduleCode)}</span>
            </div>
          ) : null}

          {/* Task-specific: project, priority, complete button */}
          {(block.type === "task" || block.type === "project") &&
            Boolean(meta.projectName) ? (
              <div className="flex items-center gap-3 text-zinc-300">
                <BookOpen className="h-4 w-4 text-zinc-500" />
                <span className="text-sm">{String(meta.projectName)}</span>
              </div>
            ) : null}

          {(block.type === "task" || block.type === "project") &&
            Boolean(meta.priority) ? (
              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className={
                    meta.priority === "critical"
                      ? "border-red-500 text-red-400"
                      : meta.priority === "high"
                        ? "border-orange-500 text-orange-400"
                        : meta.priority === "medium"
                          ? "border-yellow-500 text-yellow-400"
                          : "border-zinc-500 text-zinc-400"
                  }
                >
                  {String(meta.priority).charAt(0).toUpperCase() +
                    String(meta.priority).slice(1)}{" "}
                  Priority
                </Badge>
              </div>
            ) : null}

          {(block.type === "task" || block.type === "project") && (
            <Button className="mt-4 w-full bg-orange-500 text-white hover:bg-orange-600">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Mark Completed
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
