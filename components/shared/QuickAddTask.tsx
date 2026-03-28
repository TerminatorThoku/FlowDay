"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Calendar, Flag } from "lucide-react";

export default function QuickAddTask() {
  const [open, setOpen] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [project, setProject] = useState("");
  const [priority, setPriority] = useState("medium");
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleSubmit = () => {
    if (!taskName.trim()) return;
    // For now just close — will integrate with task store later
    console.log("Task added:", { taskName, project, priority });
    setTaskName("");
    setProject("");
    setPriority("medium");
    setOpen(false);
  };

  return (
    <>
      {/* Floating + button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 z-40 md:bottom-6 md:right-6 h-12 w-12 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 hover:shadow-xl active:scale-95 transition-all flex items-center justify-center"
      >
        <Plus className="h-5 w-5" />
      </button>

      {/* Quick add form */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/10"
              onClick={() => setOpen(false)}
            />
            <motion.div
              ref={formRef}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="fixed bottom-24 right-4 z-50 md:bottom-20 md:right-6 w-[320px] rounded-xl border border-stone-200 bg-white shadow-2xl p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-stone-900">Quick Add Task</h3>
                <button onClick={() => setOpen(false)} className="text-stone-400 hover:text-stone-600">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <input
                ref={inputRef}
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Task name..."
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
              <div className="flex gap-2 mt-3">
                <select
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-2 py-1.5 text-xs text-stone-600 outline-none"
                >
                  <option value="">No project</option>
                  <option value="gamevault">GameVault</option>
                  <option value="geointel">Geointel</option>
                  <option value="restaurant">Restaurant POS</option>
                  <option value="ttrades">T Trades</option>
                </select>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="bg-stone-50 border border-stone-200 rounded-lg px-2 py-1.5 text-xs text-stone-600 outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <button
                onClick={handleSubmit}
                disabled={!taskName.trim()}
                className="w-full mt-3 bg-indigo-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Task
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}