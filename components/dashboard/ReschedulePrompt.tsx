"use client";

import { useMemo } from "react";
import { CalendarClock, Clock, X, SkipForward } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import type { TimeBlock } from "@/types/schedule";
import { suggestRescheduleOptions } from "@/lib/scheduler/reschedule";
import { BLOCK_COLORS, type BlockCategory } from "@/lib/constants";

interface ReschedulePromptProps {
  block: TimeBlock;
  onReschedule: (date: string, startMinutes: number) => void;
  onSkip: () => void;
  open: boolean;
  onClose: () => void;
  weekBlocks?: TimeBlock[];
}

export default function ReschedulePrompt({
  block,
  onReschedule,
  onSkip,
  open,
  onClose,
  weekBlocks = [],
}: ReschedulePromptProps) {
  const suggestions = useMemo(
    () => suggestRescheduleOptions(block, weekBlocks, 3),
    [block, weekBlocks]
  );

  const colorInfo =
    BLOCK_COLORS[block.type as BlockCategory] || BLOCK_COLORS.free;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="bottom" className="border-zinc-800 bg-zinc-950 px-4 pb-8 pt-4">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-left text-zinc-100">
            <div className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-orange-500" />
              Reschedule
            </div>
          </SheetTitle>
        </SheetHeader>

        {/* Skipped block info */}
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-3">
          <div
            className="h-10 w-10 flex-shrink-0 rounded-lg"
            style={{ backgroundColor: colorInfo.bg }}
          />
          <div>
            <p className="text-sm font-semibold text-zinc-200">
              You skipped {block.title}
            </p>
            <p className="text-xs text-zinc-500">
              Want to reschedule?
            </p>
          </div>
        </div>

        {/* Suggested slots */}
        {suggestions.length > 0 ? (
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Suggested Slots
            </p>
            {suggestions.map((slot, i) => (
              <button
                key={`${slot.date}-${slot.startMinutes}`}
                onClick={() => onReschedule(slot.date, slot.startMinutes)}
                className="flex w-full items-center gap-3 rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-3 text-left transition-colors hover:border-orange-500/30 hover:bg-zinc-900"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10">
                  <Clock className="h-4 w-4 text-orange-500" />
                </div>
                <span className="flex-1 text-sm font-medium text-zinc-200">
                  {slot.label}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-4 text-center">
            <p className="text-sm text-zinc-400">
              No available slots found this week.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-5 flex gap-2">
          <Button
            onClick={onSkip}
            variant="outline"
            className="flex-1 border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
          >
            <SkipForward className="mr-2 h-4 w-4" />
            Skip entirely
          </Button>
          <Button
            onClick={onClose}
            variant="ghost"
            className="text-zinc-500 hover:text-zinc-300"
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
