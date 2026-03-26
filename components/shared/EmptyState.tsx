import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 px-6 py-12 text-center",
        className
      )}
    >
      <div className="rounded-full bg-zinc-800/60 p-4">
        <Icon className="h-8 w-8 text-zinc-500" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-zinc-100">{title}</h3>
        <p className="text-sm text-zinc-500">{description}</p>
      </div>
      {action && (
        <Button
          onClick={action.onClick}
          className="mt-2 bg-orange-500 text-white hover:bg-orange-600"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
