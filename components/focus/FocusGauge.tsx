"use client";

import { motion } from "framer-motion";

interface FocusGaugeProps {
  value: number;
  max: number;
  color?: string;
  label?: string;
}

export default function FocusGauge({
  value,
  max,
  color = "#a855f7",
  label = "Focus Time",
}: FocusGaugeProps) {
  const percentage = Math.min(value / max, 1);
  const radius = 70;
  const strokeWidth = 10;
  const circumference = Math.PI * radius;
  const offset = circumference * (1 - percentage);

  const status =
    percentage >= 0.8
      ? { text: "On track", color: "text-green-400" }
      : percentage >= 0.5
      ? { text: "At risk", color: "text-amber-400" }
      : { text: "Behind", color: "text-red-400" };

  return (
    <div className="flex flex-col items-center">
      <svg
        width="160"
        height="100"
        viewBox="0 0 160 100"
        className="overflow-visible"
      >
        {/* Track */}
        <path
          d={`M ${80 - radius} 90 A ${radius} ${radius} 0 0 1 ${80 + radius} 90`}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Fill */}
        <motion.path
          d={`M ${80 - radius} 90 A ${radius} ${radius} 0 0 1 ${80 + radius} 90`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
        />
        {/* Center icon */}
        <text
          x="80"
          y="65"
          textAnchor="middle"
          className="text-2xl"
          fill="white"
        >
          &#x26A1;
        </text>
      </svg>
      <div className="text-center -mt-2">
        <p className="text-xs text-white/40">
          {value.toFixed(1)}h met of your weekly goal: {max}h
        </p>
        <p className={`text-[11px] font-medium mt-1 ${status.color}`}>
          {status.text}
        </p>
      </div>
    </div>
  );
}
