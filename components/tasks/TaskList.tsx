"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import TaskCard from "./TaskCard";
import EmptyState from "@/components/shared/EmptyState";
import { cn } from "@/lib/utils";
import type { Task, Project } from "@/types/schedule";

interface TaskListProps {
  projects: Project[];
  tasks: Task[];
}

type FilterStatus = "all" | "todo" | "in_progress" | "done";

const filterButtons: { label: string; value: FilterStatus }[] = [
  { label: "All", value: "all" },
  { label: "To Do", value: "todo" },
  { label: "In Progress", value: "in_progress" },
  { label: "Done", value: "done" },
];

export default function TaskList({ projects, tasks }: TaskListProps) {
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(
    new Set(projects.map((p) => p.id))
  );

  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  const toggleProject = (projectId: string) => {
    setExpandedProjects((prev) => {
      const next = new Set(prev);
      if (next.has(projectId)) {
        next.delete(projectId);
      } else {
        next.add(projectId);
      }
      return next;
    });
  };

  const handleComplete = (taskId: string) => {
    // Placeholder: will connect to store
    console.log("Complete task:", taskId);
  };

  const handleEdit = (taskId: string) => {
    // Placeholder: will open edit form
    console.log("Edit task:", taskId);
  };

  // Group tasks by project
  const grouped = projects.map((project) => {
    const projectTasks = filteredTasks.filter(
      (t) => t.project_id === project.id
    );
    const allProjectTasks = tasks.filter((t) => t.project_id === project.id);
    const doneCount = allProjectTasks.filter(
      (t) => t.status === "done"
    ).length;
    return {
      project,
      tasks: projectTasks,
      total: allProjectTasks.length,
      done: doneCount,
    };
  });

  // Tasks without a project
  const unassigned = filteredTasks.filter((t) => !t.project_id);

  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="No tasks yet"
        description="Add your first task to get started with your schedule."
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter buttons */}
      <div className="flex gap-2 overflow-x-auto px-4 pb-1">
        {filterButtons.map((btn) => (
          <Button
            key={btn.value}
            variant={filter === btn.value ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(btn.value)}
            className={cn(
              "flex-shrink-0",
              filter === btn.value
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "border-zinc-700 text-zinc-400 hover:text-zinc-100"
            )}
          >
            {btn.label}
          </Button>
        ))}
      </div>

      {/* Project groups */}
      <div className="space-y-3 px-4">
        {grouped.map(
          ({ project, tasks: projectTasks, total, done }) =>
            projectTasks.length > 0 && (
              <div
                key={project.id}
                className="rounded-xl border border-zinc-800/50 bg-zinc-900/30"
              >
                {/* Project header */}
                <button
                  onClick={() => toggleProject(project.id)}
                  className="flex w-full items-center gap-3 p-3"
                >
                  {expandedProjects.has(project.id) ? (
                    <ChevronDown className="h-4 w-4 text-zinc-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-zinc-500" />
                  )}
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  <span className="flex-1 text-left text-sm font-semibold text-zinc-200">
                    {project.name}
                  </span>
                  <Badge
                    variant="outline"
                    className="border-zinc-700 text-xs text-zinc-500"
                  >
                    {projectTasks.length}
                  </Badge>
                  <div className="w-16">
                    <Progress
                      value={total > 0 ? (done / total) * 100 : 0}
                      className="h-1.5"
                    />
                  </div>
                </button>

                {/* Tasks */}
                {expandedProjects.has(project.id) && (
                  <div className="space-y-2 px-3 pb-3">
                    {projectTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        projectColor={project.color}
                        onComplete={() => handleComplete(task.id)}
                        onEdit={() => handleEdit(task.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
        )}

        {/* Unassigned tasks */}
        {unassigned.length > 0 && (
          <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30">
            <div className="flex items-center gap-3 p-3">
              <div className="h-3 w-3 rounded-full bg-zinc-600" />
              <span className="text-sm font-semibold text-zinc-400">
                No Project
              </span>
              <Badge
                variant="outline"
                className="border-zinc-700 text-xs text-zinc-500"
              >
                {unassigned.length}
              </Badge>
            </div>
            <div className="space-y-2 px-3 pb-3">
              {unassigned.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  projectColor="#52525b"
                  onComplete={() => handleComplete(task.id)}
                  onEdit={() => handleEdit(task.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
