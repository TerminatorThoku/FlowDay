"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import PriorityBadge from "./PriorityBadge";
import HealthScore from "./HealthScore";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/schedule";
import type { ProjectHealth } from "@/lib/projects/health";

interface ProjectCardProps {
  project: Project;
  taskCount: { total: number; done: number };
  health?: ProjectHealth;
  children?: React.ReactNode;
}

const statusConfig = {
  active: { label: "Active", className: "bg-green-500/20 text-green-400 border-green-500/30" },
  parked: { label: "Parked", className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  done: { label: "Done", className: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30" },
} as const;

export default function ProjectCard({
  project,
  taskCount,
  health,
  children,
}: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);
  const status = statusConfig[project.status];
  const progressPercent =
    taskCount.total > 0 ? (taskCount.done / taskCount.total) * 100 : 0;

  return (
    <Card className="border-zinc-800/50 bg-zinc-900/50">
      <CardContent className="p-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-start gap-3 text-left"
        >
          {/* Color indicator */}
          <div
            className="mt-1 h-4 w-4 flex-shrink-0 rounded"
            style={{ backgroundColor: project.color }}
          />

          <div className="flex-1 space-y-2">
            {/* Top row: name + badges + health */}
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-zinc-100">
                {project.name}
              </h3>
              <PriorityBadge priority={project.priority} />
              <Badge variant="outline" className={cn("text-[10px]", status.className)}>
                {status.label}
              </Badge>
              {health && <HealthScore health={health} compact />}
            </div>

            {/* Meta info */}
            <div className="flex items-center gap-3 text-xs text-zinc-500">
              <span>{project.weekly_hours}h / week</span>
              {project.tech_stack && (
                <span className="truncate">{project.tech_stack}</span>
              )}
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-2">
              <Progress value={progressPercent} className="h-1.5 flex-1" />
              <span className="text-xs text-zinc-500">
                {taskCount.done}/{taskCount.total}
              </span>
            </div>
          </div>

          {/* Expand arrow */}
          {children && (
            <div className="mt-1">
              {expanded ? (
                <ChevronDown className="h-4 w-4 text-zinc-500" />
              ) : (
                <ChevronRight className="h-4 w-4 text-zinc-500" />
              )}
            </div>
          )}
        </button>

        {/* Expanded children (tasks) */}
        {expanded && children && (
          <div className="mt-3 border-t border-zinc-800/50 pt-3">{children}</div>
        )}
      </CardContent>
    </Card>
  );
}
