"use client";

import { motion } from "framer-motion";

interface DailyFocusChartProps {
  data: { day: string; hours: number }[];
  dailyGoal: number;
}

export default function DailyFocusChart({
  data,
  dailyGoal,
}: DailyFocusChartProps) {
  const maxHours = Math.max(...data.map((d) => d.hours), dailyGoal, 1);

  return (
    <div className="w-full">
      <div className="flex items-end justify-between gap-2 h-40 relative">
        {/* Goal line */}
        <div
          className="absolute left-0 right-0 border-t border-dashed border-white/20"
          style={{ bottom: `${(dailyGoal / maxHours) * 100}%` }}
        >
          <span className="absolute -top-4 right-0 text-[10px] text-white/30 font-mono">
            {dailyGoal}h goal
          </span>
        </div>

        {data.map((item, i) => {
          const heightPercent = (item.hours / maxHours) * 100;
          return (
            <div
              key={item.day}
              className="flex-1 flex flex-col items-center gap-1"
            >
              <span className="text-[10px] text-white/40 font-mono mb-1">
                {item.hours > 0 ? `${item.hours}h` : ""}
              </span>
              <div className="w-full relative h-32 flex items-end justify-center">
                <motion.div
                  className="w-full max-w-[32px] rounded-t-md bg-gradient-to-t from-purple-600 to-indigo-500"
                  initial={{ height: 0 }}
                  whileInView={{ height: `${heightPercent}%` }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.08,
                    ease: "easeOut",
                  }}
                />
              </div>
              <span className="text-[10px] text-white/32 font-mono">
                {item.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
