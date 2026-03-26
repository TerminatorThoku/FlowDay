"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useGradeStore } from "@/stores/gradeStore";

function getGPAColor(gpa: number): string {
  if (gpa >= 3.5) return "#22C55E"; // green
  if (gpa >= 3.0) return "#EAB308"; // yellow
  if (gpa >= 2.5) return "#F97316"; // orange
  return "#EF4444"; // red
}

export default function GPADisplay() {
  const gpa = useGradeStore((s) => s.getOverallGPA());
  const subjects = useGradeStore((s) => s.getSubjects());
  const grades = useGradeStore((s) => s.grades);

  const totalCredits = subjects.length * 3; // assume 3 credits per subject
  const earnedCredits = subjects.filter(
    (s) => useGradeStore.getState().getSubjectGPA(s) >= 1.0,
  ).length * 3;

  const color = getGPAColor(gpa);
  const percentage = (gpa / 4.0) * 100;

  // SVG circle properties
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <Card className="border-zinc-800 bg-zinc-900/50">
      <CardContent className="flex flex-col items-center gap-4 p-6">
        {/* Circular GPA indicator */}
        <div className="relative h-36 w-36">
          <svg
            className="h-full w-full -rotate-90"
            viewBox="0 0 120 120"
          >
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="#27272a"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={grades.length === 0 ? circumference : offset}
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="text-3xl font-bold"
              style={{ color }}
            >
              {grades.length === 0 ? "---" : gpa.toFixed(2)}
            </span>
            <span className="text-xs text-zinc-500">/ 4.00</span>
          </div>
        </div>

        {/* Stats */}
        <div className="w-full space-y-2">
          <p className="text-center text-sm font-medium text-zinc-200">
            Current Semester GPA
          </p>
          <div className="flex justify-between text-xs text-zinc-500">
            <span>Credits attempted: {totalCredits}</span>
            <span>Credits earned: {earnedCredits}</span>
          </div>
          <div className="flex items-center justify-center gap-1 text-xs text-zinc-400">
            <span>Target:</span>
            <span className="font-semibold text-green-400">4.00 GPA</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
