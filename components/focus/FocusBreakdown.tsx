"use client";

import { motion } from "framer-motion";

interface BreakdownItem {
  label: string;
  hours: number;
  color: string;
}

interface FocusBreakdownProps {
  data: BreakdownItem[];
}

export default function FocusBreakdown({ data }: FocusBreakdownProps) {
  const total = data.reduce((s, d) => s + d.hours, 0);
  // SVG donut
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let cumulativeOffset = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      {/* Donut chart */}
      <div className="relative flex-shrink-0">
        <svg width="150" height="150" viewBox="0 0 150 150">
          {data.map((item, i) => {
            const segmentLength = (item.hours / total) * circumference;
            const offset = cumulativeOffset;
            cumulativeOffset += segmentLength;

            return (
              <motion.circle
                key={item.label}
                cx="75"
                cy="75"
                r={radius}
                fill="none"
                stroke={item.color}
                strokeWidth="14"
                strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                strokeDashoffset={-offset}
                strokeLinecap="round"
                transform="rotate(-90 75 75)"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span className="text-2xl font-bold font-mono text-white/90">
              {total.toFixed(0)}
            </span>
            <span className="block text-[10px] text-white/30">hours</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2 flex-1">
        {data.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <div
              className="h-3 w-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-white/55 flex-1">{item.label}</span>
            <span className="text-sm font-mono text-white/70">
              {item.hours.toFixed(1)}h
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
