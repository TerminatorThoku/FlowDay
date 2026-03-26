"use client";

import { format, parseISO } from "date-fns";
import {
  BookOpen,
  Code2,
  CheckCircle2,
  Timer,
  Dumbbell,
  Waves,
  Moon,
  Flame,
  GitCommitHorizontal,
  Trophy,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import StatCard from "./StatCard";
import { cn } from "@/lib/utils";
import type { WeeklyReportData } from "@/lib/reports/generator";

interface WeeklyReportProps {
  data: WeeklyReportData;
}

export default function WeeklyReport({ data }: WeeklyReportProps) {
  const weekStartFormatted = format(parseISO(data.weekStart), "MMM d");
  const weekEndFormatted = format(parseISO(data.weekEnd), "MMM d, yyyy");

  return (
    <div className="space-y-6 px-4 py-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-zinc-100">Weekly Report</h1>
        <p className="text-sm text-zinc-500">
          {weekStartFormatted} - {weekEndFormatted}
        </p>
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Study Hours"
          value={`${data.totalStudyHours}h`}
          trend={{ direction: "up", percentage: 20 }}
          icon={BookOpen}
          color="#8B5CF6"
        />
        <StatCard
          label="Coding Hours"
          value={`${data.totalCodingHours}h`}
          trend={{ direction: "up", percentage: 15 }}
          icon={Code2}
          color="#F97316"
        />
        <StatCard
          label="Tasks Done"
          value={`${data.tasksCompleted}/${data.tasksTotal}`}
          trend={{ direction: "up", percentage: 33 }}
          icon={CheckCircle2}
          color="#22C55E"
        />
        <StatCard
          label="Pomodoros"
          value={data.pomodoroCount}
          trend={{ direction: "up", percentage: 12 }}
          icon={Timer}
          color="#EF4444"
        />
      </div>

      {/* Fitness Section */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm text-zinc-300">
            <Dumbbell className="h-4 w-4 text-green-500" />
            Fitness
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Gym */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-sm text-zinc-300">Gym Sessions</span>
              <span className="text-sm font-semibold text-zinc-100">
                {data.gymSessions.completed}/{data.gymSessions.planned}
              </span>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-green-500 transition-all"
                style={{
                  width: `${Math.min(
                    100,
                    (data.gymSessions.completed / data.gymSessions.planned) * 100
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Swim */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Waves className="h-3.5 w-3.5 text-cyan-500" />
                <span className="text-sm text-zinc-300">Swim Sessions</span>
              </div>
              <span className="text-sm font-semibold text-zinc-100">
                {data.swimSessions.completed}/{data.swimSessions.planned}
              </span>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-cyan-500 transition-all"
                style={{
                  width: `${Math.min(
                    100,
                    (data.swimSessions.completed / data.swimSessions.planned) *
                      100
                  )}%`,
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sleep Section */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm text-zinc-300">
            <Moon className="h-4 w-4 text-indigo-400" />
            Sleep
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-zinc-100">
                {data.sleepAvgHours}h
              </p>
              <p className="text-xs text-zinc-500">Avg Hours</p>
            </div>
            <div className="h-10 w-px bg-zinc-800" />
            <div className="text-center">
              <p className="text-2xl font-bold text-zinc-100">
                {data.sleepAvgQuality}/5
              </p>
              <p className="text-xs text-zinc-500">Avg Quality</p>
            </div>
            <div className="h-10 w-px bg-zinc-800" />
            <div className="text-center">
              <p
                className={cn(
                  "text-2xl font-bold",
                  data.sleepAvgHours >= 7
                    ? "text-green-500"
                    : data.sleepAvgHours >= 6
                    ? "text-yellow-500"
                    : "text-red-500"
                )}
              >
                {data.sleepAvgHours >= 7
                  ? "Good"
                  : data.sleepAvgHours >= 6
                  ? "OK"
                  : "Low"}
              </p>
              <p className="text-xs text-zinc-500">Rating</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Section */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm text-zinc-300">
            <Code2 className="h-4 w-4 text-orange-500" />
            Projects
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.codingHours.map((project) => (
            <div key={project.project}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm text-zinc-300">{project.project}</span>
                <span className="text-sm font-semibold text-zinc-100">
                  {project.hours}h
                </span>
              </div>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-orange-500 transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      (project.hours / data.totalCodingHours) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>
          ))}
          {data.studyHours.map((subject) => (
            <div key={subject.subject}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm text-zinc-300">
                  {subject.subject}
                </span>
                <span className="text-sm font-semibold text-zinc-100">
                  {subject.hours}h
                </span>
              </div>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-violet-500 transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      (subject.hours / data.totalStudyHours) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Streaks Section */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm text-zinc-300">
            <Flame className="h-4 w-4 text-orange-500" />
            Streaks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {data.streaks.map((streak) => (
              <div
                key={streak.type}
                className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                  <Flame className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-lg font-bold text-zinc-100">
                    {streak.current}
                  </p>
                  <p className="text-xs capitalize text-zinc-500">
                    {streak.type}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* GitHub Section */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm text-zinc-300">
            <GitCommitHorizontal className="h-4 w-4 text-zinc-400" />
            GitHub
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-zinc-800">
              <span className="text-2xl font-bold text-zinc-100">
                {data.githubCommits}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-200">
                Commits This Week
              </p>
              <p className="text-xs text-zinc-500">
                Across all repositories
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Highlights Section */}
      {data.highlights.length > 0 && (
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm text-zinc-300">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              Highlights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.highlights.map((highlight, index) => (
              <div
                key={index}
                className="flex items-start gap-2 rounded-lg border border-zinc-800 bg-zinc-900 p-3"
              >
                <Trophy className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-500" />
                <p className="text-sm text-zinc-300">{highlight}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
