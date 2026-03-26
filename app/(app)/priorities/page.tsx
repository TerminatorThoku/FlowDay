"use client";

import { useState } from "react";
import { usePriorityStore, type PriorityItem } from "@/stores/priorityStore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import {
  StaggeredList,
  StaggeredItem,
} from "@/components/shared/StaggeredList";
import { Search, Check, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const COLUMNS: {
  priority: PriorityItem["priority"];
  label: string;
  color: string;
  borderColor: string;
}[] = [
  {
    priority: "critical",
    label: "Critical",
    color: "text-red-400",
    borderColor: "border-t-red-500",
  },
  {
    priority: "high",
    label: "High Priority",
    color: "text-orange-400",
    borderColor: "border-t-orange-500",
  },
  {
    priority: "medium",
    label: "Medium Priority",
    color: "text-amber-400",
    borderColor: "border-t-amber-500",
  },
  {
    priority: "low",
    label: "Low Priority",
    color: "text-blue-400",
    borderColor: "border-t-blue-500",
  },
];

export default function PrioritiesPage() {
  const { items, toggleComplete, changePriority } = usePriorityStore();
  const [search, setSearch] = useState("");

  const filtered = items.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 px-4 py-6 max-w-7xl mx-auto">
      <AnimatedSection>
        <h1 className="text-2xl font-semibold tracking-tight text-white/92">
          Priorities
        </h1>
        <p className="text-sm text-white/40 mt-1">
          Organize tasks by importance
        </p>
      </AnimatedSection>

      {/* Search bar */}
      <AnimatedSection delay={0.05}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <input
            type="text"
            placeholder="Search tasks, projects, habits..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 pl-11 text-sm text-white/80 placeholder:text-white/25 focus:outline-none focus:border-white/[0.15] focus:ring-2 focus:ring-orange-500/20 transition-all"
          />
        </div>
      </AnimatedSection>

      {/* Kanban columns */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {COLUMNS.map((col, ci) => {
          const colItems = filtered.filter(
            (item) => item.priority === col.priority
          );

          return (
            <AnimatedSection key={col.priority} delay={0.1 + ci * 0.05}>
              <Card
                className={cn(
                  "min-h-[400px] border-t-2",
                  col.borderColor
                )}
              >
                <CardContent className="p-4">
                  {/* Column header */}
                  <div className="flex items-center justify-between mb-4">
                    <h3
                      className={cn("text-sm font-semibold", col.color)}
                    >
                      {col.label}
                    </h3>
                    <Badge variant="secondary" className="text-[10px]">
                      {colItems.length}
                    </Badge>
                  </div>

                  {/* Items */}
                  <StaggeredList className="space-y-2">
                    {colItems.map((item) => (
                      <StaggeredItem key={item.id}>
                        <div
                          className={cn(
                            "p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all group",
                            item.completed && "opacity-50"
                          )}
                        >
                          <div className="flex items-start gap-2">
                            <button
                              onClick={() => toggleComplete(item.id)}
                              className={cn(
                                "mt-0.5 h-4 w-4 rounded-sm border flex-shrink-0 flex items-center justify-center transition-colors",
                                item.completed
                                  ? "bg-green-500/20 border-green-500/40"
                                  : "border-white/20 hover:border-white/40"
                              )}
                            >
                              {item.completed && (
                                <Check className="h-3 w-3 text-green-400" />
                              )}
                            </button>
                            <div className="flex-1 min-w-0">
                              <p
                                className={cn(
                                  "text-sm text-white/80",
                                  item.completed && "line-through"
                                )}
                              >
                                {item.title}
                              </p>
                              {item.projectName && (
                                <p className="text-xs text-white/30 mt-0.5">
                                  {item.projectName}
                                </p>
                              )}
                              {item.dueDate && (
                                <div className="flex items-center gap-1 mt-1.5">
                                  <Calendar className="h-3 w-3 text-white/25" />
                                  <span className="text-[10px] text-white/30 font-mono">
                                    {format(new Date(item.dueDate), "MMM d")}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Priority change buttons (visible on hover) */}
                          <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {COLUMNS.filter(
                              (c) => c.priority !== item.priority
                            ).map((c) => (
                              <Button
                                key={c.priority}
                                variant="ghost"
                                size="sm"
                                className="h-5 px-1.5 text-[9px]"
                                onClick={() =>
                                  changePriority(item.id, c.priority)
                                }
                              >
                                <span className={c.color}>
                                  {c.label.split(" ")[0]}
                                </span>
                              </Button>
                            ))}
                          </div>
                        </div>
                      </StaggeredItem>
                    ))}

                    {colItems.length === 0 && (
                      <div className="text-center py-8 text-white/20 text-sm">
                        No items
                      </div>
                    )}
                  </StaggeredList>
                </CardContent>
              </Card>
            </AnimatedSection>
          );
        })}
      </div>
    </div>
  );
}
