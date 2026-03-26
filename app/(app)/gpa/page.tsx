"use client";

import GPADisplay from "@/components/gpa/GPADisplay";
import GradeEntry from "@/components/gpa/GradeEntry";
import SubjectGrades from "@/components/gpa/SubjectGrades";

export default function GPAPage() {
  return (
    <div className="space-y-6 px-4 py-4">
      <h1 className="text-xl font-bold text-zinc-100">GPA Calculator</h1>

      {/* Current GPA Display */}
      <GPADisplay />

      {/* Add Grade button */}
      <GradeEntry />

      {/* Per-subject breakdown */}
      <SubjectGrades />
    </div>
  );
}
