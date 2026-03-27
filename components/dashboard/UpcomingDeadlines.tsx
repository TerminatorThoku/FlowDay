"use client";

import { useMemo } from "react";
import { parseISO } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";
import DeadlineBar from "@/components/tasks/DeadlineBar";
import type { Task } from "@/types/schedule";

interface UpcomingDeadlinesProps {
  tasks: Task[];
}

export default function UpcomingDeadlines({ tasks }: UpcomingDeadlinesProps) {
  const deadlineTasks = useMemo(() => {
    return tasks
      .filter(
        (t) =>
          t.due_date &&
          t.status !== "done" &&
          // Include overdue tasks and upcoming ones
          true
      )
      .sort((a, b) => {
        const dateA = a.due_date ? parseISO(a.due_date).getTime() : Infinity;
        const dateB = b.due_date ? parseISO(b.due_date).getTime() : Infinity;
        return dateA - dateB;
      })
      .slice(0, 5);
  }, [tasks]);

  if (deadlineTasks.length === 0) {
    return (
      <div>
        <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
          Upcoming Deadlines
        </h2>
        <Card className="border-stone-200 bg-white">
          <CardContent className="flex flex-col items-center gap-2 p-6">
            <CalendarDays className="h-8 w-8 text-stone-600" />
            <p className="text-sm text-stone-500">No upcoming deadlines</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
        Upcoming Deadlines
      </h2>
      <div className="space-y-2">
        {deadlineTasks.map((task) => (
          <Card
            key={task.id}
            className="border-stone-200 bg-white"
          >
            <CardContent className="p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-stone-800">
                    {task.title}
                  </p>
                  {task.project_id && (
                    <p className="text-xs text-stone-500">
                      Project task
                    </p>
                  )}
                </div>
              </div>
              <DeadlineBar dueDate={task.due_date} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
