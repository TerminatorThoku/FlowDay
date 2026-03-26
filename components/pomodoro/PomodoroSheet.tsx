"use client";

import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import PomodoroTimer from "./PomodoroTimer";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface PomodoroSheetProps {
  open: boolean;
  onClose: () => void;
  taskTitle?: string;
  subject?: string;
}

export default function PomodoroSheet({
  open,
  onClose,
  taskTitle,
  subject,
}: PomodoroSheetProps) {
  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="bottom"
        className="h-[95dvh] rounded-t-3xl border-zinc-800 bg-zinc-950 p-0"
      >
        <VisuallyHidden>
          <SheetTitle>Pomodoro Timer</SheetTitle>
        </VisuallyHidden>
        <PomodoroTimer
          taskTitle={taskTitle}
          subject={subject}
          onComplete={(session) => {
            // Session complete callback - could show toast here
            console.log("Pomodoro session completed:", session);
          }}
          onClose={onClose}
        />
      </SheetContent>
    </Sheet>
  );
}
