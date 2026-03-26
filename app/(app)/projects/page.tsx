"use client";

const projects = [
  {
    id: "p1", name: "GameVault", color: "#ef4444", priority: "P1", status: "Active",
    hours: "8h / week", tech: ["FastAPI", "SQLite"],
    tasks: [
      { name: "API Integration", due: "Mar 29", done: false },
      { name: "Auth System", due: "Apr 2", done: false },
      { name: "Database Schema", due: "Apr 5", done: false },
    ],
    progress: 0, totalTasks: 3, completedTasks: 0,
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
    progress: 0, totalTasks: 3, completedTasks: 0,
    description: "Geospatial intelligence visualization platform",
  },
  {
    id: "p3", name: "Restaurant POS", color: "#22c55e", priority: "P3", status: "Active",
    hours: "4h / week", tech: ["Docker", "FastAPI", "Remotion"],
    tasks: [
      { name: "Order Flow", due: "Apr 1", done: false },
      { name: "Payment Integration", due: "Apr 8", done: false },
    ],
    progress: 0, totalTasks: 2, completedTasks: 0,
    description: "Point of sale system for restaurant management",
  },
  {
    id: "p4", name: "T Trades", color: "#a855f7", priority: "P4", status: "Active",
    hours: "2h / week", tech: ["Electron", "Node.js"],
    tasks: [
      { name: "Trading Bot Logic", due: "Apr 4", done: false },
      { name: "UI Dashboard", due: "Apr 10", done: false },
    ],
    progress: 0, totalTasks: 2, completedTasks: 0,
    description: "Automated trading terminal",
  },
  {
    id: "p5", name: "TerrorFundingMonitor", color: "#f97316", priority: "P5", status: "Active",
    hours: "2h / week", tech: ["Express", "Neo4j", "ML"],
    tasks: [
      { name: "Graph Database Setup", due: "Apr 6", done: false },
      { name: "ML Model Training", due: "Apr 12", done: false },
    ],
    progress: 0, totalTasks: 2, completedTasks: 0,
    description: "Financial network analysis with graph ML",
  },
];

export default function ProjectsPage() {
  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-sm text-white/40 mt-1">{projects.length} active projects &middot; {projects.reduce((a, p) => a + p.totalTasks, 0)} total tasks</p>
        </div>
        <button className="bg-orange-500 text-black font-medium rounded-xl px-4 py-2 text-sm hover:bg-orange-400 active:scale-[0.97] transition-all">
          + New Project
        </button>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/[0.12] transition-all">
            {/* Project Header */}
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ background: project.color }} />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-semibold text-white">{project.name}</h2>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-white/[0.06] text-white/50">{project.priority}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">{project.status}</span>
                    </div>
                    <p className="text-xs text-white/30 mt-0.5">{project.description}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-white/40">{project.hours}</p>
                  <p className="font-mono text-sm text-white/60 mt-0.5">{project.completedTasks}/{project.totalTasks}</p>
                </div>
              </div>

              {/* Tech Stack */}
              <div className="flex gap-1.5 mt-3 ml-6">
                {project.tech.map((t) => (
                  <span key={t} className="text-[10px] bg-white/[0.04] text-white/40 rounded-md px-2 py-0.5">{t}</span>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="mt-3 ml-6 h-[3px] bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{
                  width: `${project.totalTasks > 0 ? (project.completedTasks / project.totalTasks) * 100 : 0}%`,
                  background: project.color
                }} />
              </div>
            </div>

            {/* Tasks List */}
            <div className="border-t border-white/[0.04] bg-white/[0.01]">
              {project.tasks.map((task, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.03] last:border-b-0 hover:bg-white/[0.02] transition-colors">
                  <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-all cursor-pointer
                    ${task.done ? 'border-green-500 bg-green-500/20' : 'border-white/20 hover:border-white/40'}`}>
                    {task.done && <span className="text-[8px] text-green-400">{"\u2713"}</span>}
                  </div>
                  <span className={`text-sm flex-1 ${task.done ? 'text-white/30 line-through' : 'text-white/70'}`}>{task.name}</span>
                  <span className="text-[11px] text-white/25 font-mono shrink-0">{task.due}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
