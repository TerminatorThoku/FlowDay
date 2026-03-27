"use client";

import { useState } from "react";

const initialProjects = [
  {
    id: "p1", name: "GameVault", color: "#ef4444", priority: "P1", status: "Active",
    hours: "8h / week", tech: ["FastAPI", "SQLite"],
    tasks: [
      { name: "API Integration", due: "Mar 29", done: false },
      { name: "Auth System", due: "Apr 2", done: false },
      { name: "Database Schema", due: "Apr 5", done: false },
    ],
    totalTasks: 3, completedTasks: 0,
    description: "Game trading platform with real-time pricing",
  },
  {
    id: "p2", name: "Geointel", color: "#3b82f6", priority: "P2", status: "Active",
    hours: "6h / week", tech: ["Next.js", "Supabase", "Mapbox"],
    tasks: [
      { name: "Map Component", due: "Mar 30", done: false },
      { name: "Data Pipeline", due: "Apr 3", done: false },
      { name: "Dashboard UI", due: "Apr 7", done: false },
    ],
    totalTasks: 3, completedTasks: 0,
    description: "Geospatial intelligence visualization platform",
  },
  {
    id: "p3", name: "Restaurant POS", color: "#16a34a", priority: "P3", status: "Active",
    hours: "4h / week", tech: ["Docker", "FastAPI", "Remotion"],
    tasks: [
      { name: "Order Flow", due: "Apr 1", done: false },
      { name: "Payment Integration", due: "Apr 8", done: false },
    ],
    totalTasks: 2, completedTasks: 0,
    description: "Point of sale system for restaurant management",
  },
  {
    id: "p4", name: "T Trades", color: "#7c3aed", priority: "P4", status: "Active",
    hours: "2h / week", tech: ["Electron", "Node.js"],
    tasks: [
      { name: "Trading Bot Logic", due: "Apr 4", done: false },
      { name: "UI Dashboard", due: "Apr 10", done: false },
    ],
    totalTasks: 2, completedTasks: 0,
    description: "Automated trading terminal",
  },
  {
    id: "p5", name: "TerrorFundingMonitor", color: "#ea580c", priority: "P5", status: "Active",
    hours: "2h / week", tech: ["Express", "Neo4j", "ML"],
    tasks: [
      { name: "Graph Database Setup", due: "Apr 6", done: false },
      { name: "ML Model Training", due: "Apr 12", done: false },
    ],
    totalTasks: 2, completedTasks: 0,
    description: "Financial network analysis with graph ML",
  },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState(initialProjects);

  const toggleTask = (projectId: string, taskIndex: number) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const newTasks = [...p.tasks];
      newTasks[taskIndex] = { ...newTasks[taskIndex], done: !newTasks[taskIndex].done };
      const completedCount = newTasks.filter(t => t.done).length;
      return { ...p, tasks: newTasks, completedTasks: completedCount };
    }));
  };

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Projects</h1>
          <p className="text-sm text-stone-500 mt-1">{projects.length} active projects &middot; {projects.reduce((a, p) => a + p.totalTasks, 0)} total tasks</p>
        </div>
        <button className="bg-indigo-600 text-white font-medium rounded-xl px-4 py-2 text-sm hover:bg-indigo-700 active:scale-[0.97] transition-all">
          + New Project
        </button>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-white border border-stone-200 rounded-xl overflow-hidden hover:border-stone-300 transition-all">
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ background: project.color }} />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-semibold text-stone-900">{project.name}</h2>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-500">{project.priority}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-200">{project.status}</span>
                    </div>
                    <p className="text-xs text-stone-400 mt-0.5">{project.description}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-stone-500">{project.hours}</p>
                  <p className="font-mono text-sm text-stone-500 mt-0.5">{project.completedTasks}/{project.totalTasks}</p>
                </div>
              </div>
              <div className="flex gap-1.5 mt-3 ml-6">
                {project.tech.map((t) => (
                  <span key={t} className="text-[10px] bg-stone-100 text-stone-500 rounded-md px-2 py-0.5">{t}</span>
                ))}
              </div>
              <div className="mt-3 ml-6 h-[3px] bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{
                  width: `${project.totalTasks > 0 ? (project.completedTasks / project.totalTasks) * 100 : 0}%`,
                  background: project.color
                }} />
              </div>
            </div>
            <div className="border-t border-stone-200 bg-white">
              {project.tasks.map((task, i) => (
                <div key={i}
                  onClick={() => toggleTask(project.id, i)}
                  className="flex items-center gap-3 px-5 py-3 border-b border-stone-200 last:border-b-0 hover:bg-white transition-colors cursor-pointer select-none">
                  <div
                    className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all
                      ${task.done ? 'border-green-500 bg-green-100' : 'border-stone-300 hover:border-stone-300'}`}
                  >
                    {task.done && <span className="text-[10px] text-green-600">{"\u2713"}</span>}
                  </div>
                  <span className={`text-sm flex-1 transition-all ${task.done ? 'text-stone-400 line-through' : 'text-stone-500'}`}>{task.name}</span>
                  <span className="text-[11px] text-stone-400 font-mono shrink-0">{task.due}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
