import { cn } from "@/lib/utils";

interface PriorityBadgeProps {
  priority: number;
  className?: string;
}

const priorityStyles: Record<number, string> = {
  1: "bg-red-500 text-white",
  2: "bg-orange-500 text-white",
  3: "bg-yellow-500 text-zinc-900",
  4: "bg-blue-500 text-white",
  5: "bg-zinc-500 text-white",
};

export default function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const style = priorityStyles[priority] || priorityStyles[5];

  return (
    <span
      className={cn(
        "inline-flex h-5 items-center justify-center rounded px-1.5 text-[10px] font-bold",
        style,
        className
      )}
    >
      P{priority}
    </span>
  );
}
