"use client";

import { useState } from "react";

interface CommitDay {
  date: string;
  count: number;
}

interface CommitHistoryProps {
  repoName: string;
  data: CommitDay[];
}

function getColor(count: number): string {
  if (count === 0) return "bg-zinc-800";
  if (count <= 2) return "bg-green-700";
  return "bg-green-500";
}

export default function CommitHistory({ repoName, data }: CommitHistoryProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Ensure we always have 7 days
  const days = data.slice(-7);
  while (days.length < 7) {
    days.unshift({ date: "", count: 0 });
  }

  return (
    <div className="space-y-1">
      <p className="text-[10px] font-medium text-zinc-500">{repoName}</p>
      <div className="flex items-center gap-1">
        {days.map((day, idx) => (
          <div key={idx} className="relative">
            <div
              className={`h-3 w-3 rounded-sm ${getColor(day.count)} cursor-pointer transition-colors`}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            />
            {hoveredIdx === idx && day.date && (
              <div className="absolute -top-8 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded bg-zinc-800 px-2 py-1 text-[10px] text-zinc-300 shadow-lg">
                {day.date}: {day.count} {day.count === 1 ? "commit" : "commits"}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
