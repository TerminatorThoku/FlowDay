"use client";

import { useState, useCallback } from "react";
import { Sparkles, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { TimeBlock, Task } from "@/types/schedule";

interface OptimizeButtonProps {
  blocks: TimeBlock[];
  tasks?: Task[];
  date: string;
  onOptimized: (blocks: TimeBlock[]) => void;
}

export default function OptimizeButton({
  blocks,
  tasks = [],
  date,
  onOptimized,
}: OptimizeButtonProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleOptimize = useCallback(async () => {
    setLoading(true);
    setSuccess(false);

    try {
      const response = await fetch("/api/ai-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, blocks, tasks }),
      });

      if (!response.ok) {
        throw new Error("Failed to optimize schedule");
      }

      const data = await response.json();

      onOptimized(data.blocks);
      setSuccess(true);

      const summaryText =
        data.summary.length > 0
          ? data.summary.join(", ")
          : "Schedule is already optimized!";

      toast({
        title: "Schedule optimized!",
        description: summaryText,
      });

      // Reset success state after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      toast({
        title: "Optimization failed",
        description: "Could not optimize your schedule. Try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [blocks, date, tasks, onOptimized, toast]);

  return (
    <Button
      onClick={handleOptimize}
      disabled={loading || blocks.length === 0}
      size="sm"
      className="gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md transition-all hover:from-orange-600 hover:to-amber-600 disabled:opacity-50"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Optimizing...
        </>
      ) : success ? (
        <>
          <Check className="h-4 w-4" />
          Optimized!
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4" />
          Optimize Today
        </>
      )}
    </Button>
  );
}
