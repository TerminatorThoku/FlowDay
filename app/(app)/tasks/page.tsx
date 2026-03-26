"use client";

import TaskList from "@/components/tasks/TaskList";
import ProjectCard from "@/components/projects/ProjectCard";
import type { Project, Task } from "@/types/schedule";

// Mock projects
const mockProjects: Project[] = [
  {
    id: "p1",
    user_id: "u1",
    name: "GameVault",
    short_name: "GV",
    description: "Game account trading platform",
    priority: 1,
    color: "#EF4444",
    weekly_hours: 8,
    tech_stack: "FastAPI, SQLite",
    status: "active",
    created_at: "2026-01-15",
    updated_at: "2026-03-25",
  },
  {
    id: "p2",
    user_id: "u1",
    name: "Geointel",
    short_name: "GI",
    description: "Geo-intelligence dashboard",
    priority: 2,
    color: "#3B82F6",
    weekly_hours: 6,
    tech_stack: "Next.js, Supabase, Mapbox",
    status: "active",
    created_at: "2026-02-01",
    updated_at: "2026-03-24",
  },
  {
    id: "p3",
    user_id: "u1",
    name: "Restaurant POS",
    short_name: "POS",
    description: "Restaurant management system",
    priority: 3,
    color: "#22C55E",
    weekly_hours: 4,
    tech_stack: "Docker, FastAPI, Remotion",
    status: "active",
    created_at: "2026-03-01",
    updated_at: "2026-03-26",
  },
  {
    id: "p4",
    user_id: "u1",
    name: "T Trades",
    short_name: "TT",
    description: "Autonomous trading intelligence",
    priority: 4,
    color: "#8B5CF6",
    weekly_hours: 2,
    tech_stack: "Electron, Node.js",
    status: "active",
    created_at: "2026-02-15",
    updated_at: "2026-03-20",
  },
  {
    id: "p5",
    user_id: "u1",
    name: "TerrorFundingMonitor",
    short_name: "TFM",
    description: "Financial intelligence platform",
    priority: 5,
    color: "#F97316",
    weekly_hours: 2,
    tech_stack: "Express, Neo4j, ML",
    status: "active",
    created_at: "2026-01-01",
    updated_at: "2026-03-10",
  },
];

// Mock tasks
const mockTasks: Task[] = [
  // GameVault P1 tasks
  {
    id: "t1",
    user_id: "u1",
    project_id: "p1",
    title: "Build MVP listing flow",
    description: "Core listing creation and browsing for game accounts",
    priority: "high",
    status: "in_progress",
    estimated_minutes: 120,
    actual_minutes: null,
    due_date: "2026-03-28",
    completed_at: null,
    created_at: "2026-03-20",
    updated_at: "2026-03-25",
  },
  {
    id: "t2",
    user_id: "u1",
    project_id: "p1",
    title: "Implement order management",
    description: "Order creation, status tracking, and fulfillment",
    priority: "high",
    status: "todo",
    estimated_minutes: 90,
    actual_minutes: null,
    due_date: "2026-03-30",
    completed_at: null,
    created_at: "2026-03-20",
    updated_at: "2026-03-20",
  },
  {
    id: "t3",
    user_id: "u1",
    project_id: "p1",
    title: "Add AI reply bot integration",
    description: "Automated response system for buyer inquiries",
    priority: "medium",
    status: "todo",
    estimated_minutes: 180,
    actual_minutes: null,
    due_date: "2026-04-05",
    completed_at: null,
    created_at: "2026-03-18",
    updated_at: "2026-03-18",
  },

  // Geointel P2 tasks
  {
    id: "t4",
    user_id: "u1",
    project_id: "p2",
    title: "Complete map dashboard integration",
    description: "Integrate Mapbox with real-time data layers",
    priority: "high",
    status: "in_progress",
    estimated_minutes: 120,
    actual_minutes: null,
    due_date: "2026-04-01",
    completed_at: null,
    created_at: "2026-03-15",
    updated_at: "2026-03-24",
  },
  {
    id: "t5",
    user_id: "u1",
    project_id: "p2",
    title: "Add earthquake data layer",
    description: "Real-time seismic data visualization on map",
    priority: "medium",
    status: "todo",
    estimated_minutes: 90,
    actual_minutes: null,
    due_date: "2026-04-05",
    completed_at: null,
    created_at: "2026-03-20",
    updated_at: "2026-03-20",
  },
  {
    id: "t6",
    user_id: "u1",
    project_id: "p2",
    title: "Stripe payment integration",
    description: "Subscription billing for premium features",
    priority: "medium",
    status: "todo",
    estimated_minutes: 120,
    actual_minutes: null,
    due_date: "2026-04-10",
    completed_at: null,
    created_at: "2026-03-22",
    updated_at: "2026-03-22",
  },

  // Restaurant POS P3 tasks
  {
    id: "t7",
    user_id: "u1",
    project_id: "p3",
    title: "Docker deployment setup",
    description: "Containerize the POS application for deployment",
    priority: "high",
    status: "todo",
    estimated_minutes: 60,
    actual_minutes: null,
    due_date: "2026-03-29",
    completed_at: null,
    created_at: "2026-03-22",
    updated_at: "2026-03-22",
  },
  {
    id: "t8",
    user_id: "u1",
    project_id: "p3",
    title: "Test POS flow end-to-end",
    description: "Full order lifecycle testing from creation to completion",
    priority: "medium",
    status: "todo",
    estimated_minutes: 90,
    actual_minutes: null,
    due_date: "2026-04-02",
    completed_at: null,
    created_at: "2026-03-22",
    updated_at: "2026-03-22",
  },

  // T Trades P4 tasks
  {
    id: "t9",
    user_id: "u1",
    project_id: "p4",
    title: "Build core trading indicators",
    description: "Implement technical analysis indicators for trading signals",
    priority: "medium",
    status: "todo",
    estimated_minutes: 120,
    actual_minutes: null,
    due_date: "2026-04-10",
    completed_at: null,
    created_at: "2026-03-15",
    updated_at: "2026-03-15",
  },
  {
    id: "t10",
    user_id: "u1",
    project_id: "p4",
    title: "Electron app shell setup",
    description: "Desktop application scaffold with Electron",
    priority: "low",
    status: "todo",
    estimated_minutes: 90,
    actual_minutes: null,
    due_date: null,
    completed_at: null,
    created_at: "2026-03-18",
    updated_at: "2026-03-18",
  },

  // TerrorFundingMonitor P5 tasks
  {
    id: "t11",
    user_id: "u1",
    project_id: "p5",
    title: "Build frontend dashboard",
    description: "Visualization dashboard for financial intelligence data",
    priority: "medium",
    status: "todo",
    estimated_minutes: 180,
    actual_minutes: null,
    due_date: null,
    completed_at: null,
    created_at: "2026-03-10",
    updated_at: "2026-03-10",
  },
  {
    id: "t12",
    user_id: "u1",
    project_id: "p5",
    title: "ML anomaly detection pipeline",
    description: "Machine learning pipeline for detecting suspicious transactions",
    priority: "low",
    status: "todo",
    estimated_minutes: 240,
    actual_minutes: null,
    due_date: null,
    completed_at: null,
    created_at: "2026-03-08",
    updated_at: "2026-03-08",
  },
];

export default function TasksPage() {
  // Calculate task counts per project for the project cards
  const taskCounts = mockProjects.reduce(
    (acc, p) => {
      const projectTasks = mockTasks.filter((t) => t.project_id === p.id);
      acc[p.id] = {
        total: projectTasks.length,
        done: projectTasks.filter((t) => t.status === "done").length,
      };
      return acc;
    },
    {} as Record<string, { total: number; done: number }>
  );

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div className="px-4">
        <h1 className="text-xl font-bold text-zinc-100">Tasks</h1>
        <p className="text-sm text-zinc-500">
          {mockTasks.filter((t) => t.status !== "done").length} tasks remaining
        </p>
      </div>

      {/* Project overview cards */}
      <div className="space-y-2 px-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Projects
        </h2>
        <div className="grid gap-2">
          {mockProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              taskCount={taskCounts[project.id]}
            />
          ))}
        </div>
      </div>

      {/* Task list */}
      <div>
        <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          All Tasks
        </h2>
        <TaskList projects={mockProjects} tasks={mockTasks} />
      </div>
    </div>
  );
}
