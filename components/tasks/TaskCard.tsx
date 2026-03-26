"use client";

import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Clock, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/schedule";

interface TaskCardProps {
  task: Task;
  projectColor: string;
  onComplete: () => void;
  onEdit: () => void;
}

const priorityConfig = {
  critical: { label: "Critical", className: "bg-red-500/20 text-red-400 border-red-500/30" },
  high: { label: "High", className: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  medium: { label: "Medium", className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  low: { label: "Low", className: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30" },
} as const;

function formatEstimate(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export default function TaskCard({
  task,
  projectColor,
  onComplete,
  onEdit,
}: TaskCardProps) {
  const priority = priorityConfig[task.priority];
  const isDone = task.status === "done";

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 100 }}
      dragElastic={0.1}
      onDragEnd={(_, info) => {
        if (info.offset.x > 80) {
          onComplete();
        }
      }}
      className={cn(
        "relative flex items-start gap-3 rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-3",
        isDone && "opacity-50"
      )}
    >
      {/* Project color dot */}
      <div
        className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full"
        style={{ backgroundColor: projectColor }}
      />

      {/* Content */}
      <div className="flex-1" onClick={onEdit}>
        <p
          className={cn(
            "text-sm font-medium text-zinc-200",
            isDone && "line-through text-zinc-500"
          )}
        >
          {task.title}
        </p>
        {task.description && (
          <p className="mt-0.5 line-clamp-1 text-xs text-zinc-500">
            {task.description}
          </p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge variant="outline" className={cn("text-[10px]", priority.className)}>
            {priority.label}
          </Badge>

          {task.estimated_minutes > 0 && (
            <div className="flex items-center gap-1 text-xs text-zinc-500">
              <Clock className="h-3 w-3" />
              <span>{formatEstimate(task.estimated_minutes)}</span>
            </div>
          )}

          {task.due_date && (
            <div className="flex items-center gap-1 text-xs text-zinc-500">
              <CalendarDays className="h-3 w-3" />
              <span>
                {new Date(task.due_date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Checkbox */}
      <Checkbox
        checked={isDone}
        onCheckedChange={() => onComplete()}
        className="mt-1 h-5 w-5 rounded-full border-zinc-600 data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-500"
      />
    </motion.div>
  );
}
