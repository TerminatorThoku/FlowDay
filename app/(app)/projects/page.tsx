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
    id: "p3", name: "Restaurant POS", color: "#5b9a6f", priority: "P3", status: "Active",
    hours: "4h / week", tech: ["Docker", "FastAPI", "Remotion"],
    tasks: [
      { name: "Order Flow", due: "Apr 1", done: false },
      { name: "Payment Integration", due: "Apr 8", done: false },
    ],
    totalTasks: 2, completedTasks: 0,
    description: "Point of sale system for restaurant management",
  },
  {
    id: "p4", name: "T Trades", color: "#8b7ab8", priority: "P4", status: "Active",
    hours: "2h / week", tech: ["Electron", "Node.js"],
    tasks: [
      { name: "Trading Bot Logic", due: "Apr 4", done: false },
      { name: "UI Dashboard", due: "Apr 10", done: false },
    ],
    totalTasks: 2, completedTasks: 0,
    description: "Automated trading terminal",
  },
  {
    id: "p5", name: "TerrorFundingMonitor", color: "#c8944e", priority: "P5", status: "Active",
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
          <h1 className="text-2xl font-bold text-[#e8e4dc]">Projects</h1>
          <p className="text-sm text-[#a8a29e] mt-1">{projects.length} active projects &middot; {projects.reduce((a, p) => a + p.totalTasks, 0)} total tasks</p>
        </div>
        <button className="bg-[#c8a44e] text-black font-medium rounded-xl px-4 py-2 text-sm hover:bg-[#d4b05a] active:scale-[0.97] transition-all">
          + New Project
        </button>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-[#3a3a3a] transition-all">
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ background: project.color }} />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-semibold text-[#e8e4dc]">{project.name}</h2>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-[#222222] text-[#a8a29e]">{project.priority}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#5b9a6f]/10 text-[#5b9a6f] border border-[#5b9a6f]/20">{project.status}</span>
                    </div>
                    <p className="text-xs text-[#6b6560] mt-0.5">{project.description}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-[#a8a29e]">{project.hours}</p>
                  <p className="font-mono text-sm text-[#a8a29e] mt-0.5">{project.completedTasks}/{project.totalTasks}</p>
                </div>
              </div>
              <div className="flex gap-1.5 mt-3 ml-6">
                {project.tech.map((t) => (
                  <span key={t} className="text-[10px] bg-[#222222] text-[#a8a29e] rounded-md px-2 py-0.5">{t}</span>
                ))}
              </div>
              <div className="mt-3 ml-6 h-[3px] bg-[#222222] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{
                  width: `${project.totalTasks > 0 ? (project.completedTasks / project.totalTasks) * 100 : 0}%`,
                  background: project.color
                }} />
              </div>
            </div>
            <div className="border-t border-[#2a2a2a] bg-[#1a1a1a]">
              {project.tasks.map((task, i) => (
                <div key={i}
                  onClick={() => toggleTask(project.id, i)}
                  className="flex items-center gap-3 px-5 py-3 border-b border-[#2a2a2a] last:border-b-0 hover:bg-[#1a1a1a] transition-colors cursor-pointer select-none">
                  <div
                    className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all
                      ${task.done ? 'border-[#5b9a6f] bg-[#5b9a6f]/20' : 'border-[#3a3a3a] hover:border-[#4a4540]'}`}
                  >
                    {task.done && <span className="text-[10px] text-[#5b9a6f]">{"\u2713"}</span>}
                  </div>
                  <span className={`text-sm flex-1 transition-all ${task.done ? 'text-[#6b6560] line-through' : 'text-[#a8a29e]'}`}>{task.name}</span>
                  <span className="text-[11px] text-[#6b6560] font-mono shrink-0">{task.due}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
