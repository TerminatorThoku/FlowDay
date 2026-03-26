"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Trash2, Target } from "lucide-react";
import {
  useGradeStore,
  SUBJECTS,
  type Grade,
} from "@/stores/gradeStore";

function getGradeColor(grade: number): string {
  if (grade >= 80) return "text-green-400";
  if (grade >= 65) return "text-yellow-400";
  if (grade >= 50) return "text-orange-400";
  return "text-red-400";
}

function calculateNeededGrade(
  currentGrades: Grade[],
  targetPercentage: number,
): number | null {
  const currentWeightedSum = currentGrades.reduce(
    (sum, g) => sum + g.grade * g.weight,
    0,
  );
  const currentTotalWeight = currentGrades.reduce(
    (sum, g) => sum + g.weight,
    0,
  );
  const remainingWeight = 100 - currentTotalWeight;

  if (remainingWeight <= 0) return null;

  const needed =
    (targetPercentage * 100 - currentWeightedSum) / remainingWeight;
  return Math.max(0, Math.min(100, needed));
}

export default function SubjectGrades() {
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

  const grades = useGradeStore((s) => s.grades);
  const getSubjectAverage = useGradeStore((s) => s.getSubjectAverage);
  const getSubjectGPA = useGradeStore((s) => s.getSubjectGPA);
  const deleteGrade = useGradeStore((s) => s.deleteGrade);

  const toggle = (subject: string) => {
    setExpandedSubject((prev) => (prev === subject ? null : subject));
  };

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
        Subject Breakdown
      </h2>
      {SUBJECTS.map((subject) => {
        const subjectGrades = grades.filter((g) => g.subject === subject);
        const avg = getSubjectAverage(subject);
        const gpa = getSubjectGPA(subject);
        const isExpanded = expandedSubject === subject;
        const totalWeight = subjectGrades.reduce(
          (sum, g) => sum + g.weight,
          0,
        );

        // Calculate what's needed for an A (90%) on remaining assessments
        const neededFor90 = calculateNeededGrade(subjectGrades, 90);

        return (
          <Card key={subject} className="border-zinc-800 bg-zinc-900/50">
            <CardContent className="p-0">
              {/* Header - clickable */}
              <button
                onClick={() => toggle(subject)}
                className="flex w-full items-center justify-between p-4"
              >
                <div className="text-left">
                  <p className="text-sm font-medium text-zinc-200">
                    {subject}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {subjectGrades.length === 0
                      ? "No grades yet"
                      : `${subjectGrades.length} assessment${subjectGrades.length !== 1 ? "s" : ""} | ${totalWeight}% graded`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {subjectGrades.length > 0 && (
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${getGradeColor(avg)}`}>
                        {avg.toFixed(1)}%
                      </p>
                      <p className="text-[10px] text-zinc-500">
                        GPA: {gpa.toFixed(1)}
                      </p>
                    </div>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-zinc-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-zinc-500" />
                  )}
                </div>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="border-t border-zinc-800 px-4 pb-4 pt-3">
                  {subjectGrades.length === 0 ? (
                    <p className="text-center text-xs text-zinc-600">
                      Add grades using the button above
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {/* Grade list */}
                      {subjectGrades.map((g) => (
                        <div
                          key={g.id}
                          className="flex items-center justify-between rounded-lg bg-zinc-800/50 px-3 py-2"
                        >
                          <div>
                            <p className="text-xs font-medium text-zinc-300">
                              {g.assessment}
                            </p>
                            <p className="text-[10px] text-zinc-500">
                              Weight: {g.weight}%
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={`border-zinc-700 ${getGradeColor(g.grade)}`}
                            >
                              {g.grade}%
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-zinc-600 hover:text-red-400"
                              onClick={() => deleteGrade(g.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}

                      {/* What do I need section */}
                      {totalWeight < 100 && neededFor90 !== null && (
                        <div className="mt-3 flex items-start gap-2 border-t border-zinc-800 pt-3">
                          <Target className="mt-0.5 h-3 w-3 flex-shrink-0 text-orange-500" />
                          <div>
                            <p className="text-xs font-medium text-zinc-300">
                              What do I need?
                            </p>
                            <p className="text-[10px] text-zinc-500">
                              Need{" "}
                              <span className="font-semibold text-orange-400">
                                {neededFor90.toFixed(1)}%
                              </span>{" "}
                              avg on remaining {100 - totalWeight}% to get an A
                              (90%+)
                            </p>
                            {neededFor90 > 100 && (
                              <p className="mt-1 text-[10px] text-red-400">
                                An A is no longer achievable for this subject
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
