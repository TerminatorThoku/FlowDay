"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Home, Calendar, CheckSquare, Zap, Target, TrendingUp, Settings, FolderKanban, Dumbbell, Flame, GraduationCap, BarChart3, Timer, Plus } from "lucide-react";

const commands = [
  // Navigation
  { id: "home", label: "Dashboard", icon: Home, action: "navigate", path: "/", section: "Navigate" },
  { id: "calendar", label: "Calendar", icon: Calendar, action: "navigate", path: "/calendar", section: "Navigate" },
  { id: "tasks", label: "Tasks", icon: CheckSquare, action: "navigate", path: "/tasks", section: "Navigate" },
  { id: "projects", label: "Projects", icon: FolderKanban, action: "navigate", path: "/projects", section: "Navigate" },
  { id: "focus", label: "Focus Analytics", icon: Zap, action: "navigate", path: "/focus", section: "Navigate" },
  { id: "habits", label: "Habits", icon: Target, action: "navigate", path: "/habits", section: "Navigate" },
  { id: "streaks", label: "Streaks", icon: Flame, action: "navigate", path: "/streaks", section: "Navigate" },
  { id: "stats", label: "Stats & Analytics", icon: TrendingUp, action: "navigate", path: "/stats", section: "Navigate" },
  { id: "lifestyle", label: "Lifestyle", icon: Dumbbell, action: "navigate", path: "/lifestyle", section: "Navigate" },
  { id: "gpa", label: "GPA Calculator", icon: GraduationCap, action: "navigate", path: "/gpa", section: "Navigate" },
  { id: "settings", label: "Settings", icon: Settings, action: "navigate", path: "/settings", section: "Navigate" },
  // Quick Actions
  { id: "start-focus", label: "Start Focus Timer", icon: Timer, action: "navigate", path: "/timer", section: "Actions" },
  { id: "add-task", label: "Add New Task", icon: Plus, action: "add-task", path: "", section: "Actions" },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Listen for Cmd+K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(prev => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Focus input when open
  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Filter commands
  const filtered = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  // Group by section
  const sections = filtered.reduce((acc, cmd) => {
    if (!acc[cmd.section]) acc[cmd.section] = [];
    acc[cmd.section].push(cmd);
    return acc;
  }, {} as Record<string, typeof commands>);

  // Handle selection
  const handleSelect = useCallback((cmd: typeof commands[0]) => {
    setOpen(false);
    if (cmd.action === "navigate" && cmd.path) {
      router.push(cmd.path);
    }
  }, [router]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      handleSelect(filtered[selectedIndex]);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed left-1/2 top-[20%] z-[101] w-[90vw] max-w-[560px] -translate-x-1/2 rounded-xl border border-stone-200 bg-white shadow-2xl overflow-hidden"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 border-b border-stone-200 px-4 py-3">
              <Search className="h-4 w-4 text-stone-400 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                onKeyDown={handleKeyDown}
                placeholder="Search pages, actions..."
                className="flex-1 bg-transparent text-sm text-stone-900 placeholder:text-stone-400 outline-none"
              />
              <kbd className="hidden sm:inline-flex items-center gap-1 rounded-md border border-stone-200 bg-stone-50 px-1.5 py-0.5 text-[10px] font-mono text-stone-400">ESC</kbd>
            </div>
            {/* Results */}
            <div className="max-h-[320px] overflow-y-auto py-2">
              {filtered.length === 0 && (
                <p className="px-4 py-8 text-center text-sm text-stone-400">No results found</p>
              )}
              {Object.entries(sections).map(([section, items]) => (
                <div key={section}>
                  <p className="px-4 py-1.5 text-[11px] font-medium uppercase tracking-wider text-stone-400">{section}</p>
                  {items.map((cmd) => {
                    const globalIdx = filtered.indexOf(cmd);
                    const isSelected = globalIdx === selectedIndex;
                    return (
                      <button
                        key={cmd.id}
                        onClick={() => handleSelect(cmd)}
                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                        className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                          isSelected ? "bg-indigo-50 text-indigo-700" : "text-stone-600 hover:bg-stone-50"
                        }`}
                      >
                        <cmd.icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                        <span className="flex-1 text-left">{cmd.label}</span>
                        {cmd.action === "navigate" && (
                          <span className="text-[10px] text-stone-300 font-mono">{cmd.path}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
            {/* Footer */}
            <div className="border-t border-stone-100 px-4 py-2 flex items-center gap-4 text-[10px] text-stone-400">
              <span>↑↓ navigate</span>
              <span>↵ select</span>
              <span>esc close</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}