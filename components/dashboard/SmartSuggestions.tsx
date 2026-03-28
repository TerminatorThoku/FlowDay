"use client";
import { useState } from "react";
import { Lightbulb, X, Zap, AlertTriangle, Dumbbell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const initialSuggestions = [
  { id: "1", icon: Zap, text: "You have a 1h gap at 5 PM — schedule a study session?", type: "info" as const },
  { id: "2", icon: AlertTriangle, text: "OOP Assignment 3 due tomorrow — only 0/3 tasks done", type: "warning" as const },
  { id: "3", icon: Dumbbell, text: "Your 7-day gym streak is at risk — workout today!", type: "warning" as const },
  { id: "4", icon: Zap, text: "Best focus hours: 9-11 AM. Block it for deep work tomorrow?", type: "info" as const },
];

export default function SmartSuggestions() {
  const [suggestions, setSuggestions] = useState(initialSuggestions);

  const dismiss = (id: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== id));
  };

  if (suggestions.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-4 w-4 text-amber-500" />
        <h3 className="text-[11px] uppercase tracking-wider text-stone-400 font-medium">Suggestions</h3>
      </div>
      <AnimatePresence mode="popLayout">
        {suggestions.map((s) => (
          <motion.div
            key={s.id}
            layout
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 50, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex items-start gap-3 rounded-lg border p-3 ${
              s.type === "warning"
                ? "bg-amber-50 border-amber-200"
                : "bg-blue-50 border-blue-200"
            }`}
          >
            <s.icon className={`h-4 w-4 mt-0.5 shrink-0 ${
              s.type === "warning" ? "text-amber-600" : "text-blue-600"
            }`} />
            <p className={`text-xs flex-1 ${
              s.type === "warning" ? "text-amber-800" : "text-blue-800"
            }`}>{s.text}</p>
            <button
              onClick={() => dismiss(s.id)}
              className={`shrink-0 ${
                s.type === "warning" ? "text-amber-400 hover:text-amber-600" : "text-blue-400 hover:text-blue-600"
              }`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
