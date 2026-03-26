"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";
import type { Task } from "@/types/schedule";

interface TaskFormProps {
  task?: Task;
  open: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
}

const timePresets = [
  { label: "30m", value: 30 },
  { label: "1h", value: 60 },
  { label: "2h", value: 120 },
  { label: "3h", value: 180 },
];

// Mock projects for now
const mockProjects = [
  { id: "p1", name: "GameVault" },
  { id: "p2", name: "Geointel" },
  { id: "p3", name: "Restaurant POS" },
  { id: "p4", name: "T Trades" },
  { id: "p5", name: "TerrorFundingMonitor" },
];

export default function TaskForm({ task, open, onClose, onSave }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState<string>("");
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const [estimatedMinutes, setEstimatedMinutes] = useState(60);
  const [dueDate, setDueDate] = useState<Date | undefined>();

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setProjectId(task.project_id || "");
      setPriority(task.priority);
      setEstimatedMinutes(task.estimated_minutes);
      setDueDate(task.due_date ? new Date(task.due_date) : undefined);
    } else {
      setTitle("");
      setDescription("");
      setProjectId("");
      setPriority("medium");
      setEstimatedMinutes(60);
      setDueDate(undefined);
    }
  }, [task, open]);

  const handleSubmit = () => {
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      description: description.trim(),
      project_id: projectId || null,
      priority,
      estimated_minutes: estimatedMinutes,
      due_date: dueDate ? format(dueDate, "yyyy-MM-dd") : null,
    });
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent
        side="bottom"
        className="max-h-[85vh] overflow-y-auto rounded-t-2xl border-zinc-800 bg-zinc-900"
      >
        <SheetHeader className="text-left">
          <SheetTitle className="text-zinc-100">
            {task ? "Edit Task" : "New Task"}
          </SheetTitle>
          <SheetDescription className="text-zinc-500">
            {task ? "Update the task details." : "Add a new task to your schedule."}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          {/* Title */}
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="border-zinc-700 bg-zinc-800 text-zinc-100"
            />
          </div>

          {/* Project */}
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              Project
            </label>
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger className="border-zinc-700 bg-zinc-800 text-zinc-100">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent className="border-zinc-700 bg-zinc-800">
                {mockProjects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              Priority
            </label>
            <Select
              value={priority}
              onValueChange={(v) => setPriority(v as Task["priority"])}
            >
              <SelectTrigger className="border-zinc-700 bg-zinc-800 text-zinc-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-zinc-700 bg-zinc-800">
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Estimated time */}
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              Estimated Time
            </label>
            <div className="flex gap-2">
              {timePresets.map((preset) => (
                <Button
                  key={preset.value}
                  variant={
                    estimatedMinutes === preset.value ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setEstimatedMinutes(preset.value)}
                  className={
                    estimatedMinutes === preset.value
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "border-zinc-700 text-zinc-400 hover:text-zinc-100"
                  }
                >
                  {preset.label}
                </Button>
              ))}
              <Input
                type="number"
                value={estimatedMinutes}
                onChange={(e) =>
                  setEstimatedMinutes(parseInt(e.target.value) || 0)
                }
                className="w-20 border-zinc-700 bg-zinc-800 text-zinc-100"
                placeholder="min"
              />
            </div>
          </div>

          {/* Due date */}
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              Due Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start border-zinc-700 bg-zinc-800 text-left text-zinc-100"
                >
                  <CalendarDays className="mr-2 h-4 w-4 text-zinc-500" />
                  {dueDate
                    ? format(dueDate, "MMM d, yyyy")
                    : "Pick a due date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto border-zinc-700 bg-zinc-800 p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  className="text-zinc-100"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details..."
              rows={3}
              className="border-zinc-700 bg-zinc-800 text-zinc-100"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-zinc-700 text-zinc-400"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-orange-500 text-white hover:bg-orange-600"
            >
              {task ? "Update" : "Save"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
