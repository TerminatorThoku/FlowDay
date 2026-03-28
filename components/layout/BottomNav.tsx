"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Calendar, CheckSquare, Zap, MoreHorizontal, Target, Dumbbell, TrendingUp, Settings, GraduationCap, BarChart3, Flame, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Dashboard", icon: Home, path: "/" },
  { label: "Calendar", icon: Calendar, path: "/calendar" },
  { label: "Tasks", icon: CheckSquare, path: "/tasks" },
  { label: "Timer", icon: Timer, path: "/timer" },
] as const;

const moreItems = [
  { label: "Focus", icon: Zap, path: "/focus" },
  { label: "Habits", icon: Target, path: "/habits" },
  { label: "Lifestyle", icon: Dumbbell, path: "/lifestyle" },
  { label: "Streaks", icon: Flame, path: "/streaks" },
  { label: "Stats", icon: TrendingUp, path: "/stats" },
  { label: "GPA", icon: GraduationCap, path: "/gpa" },
  { label: "Report", icon: BarChart3, path: "/report" },
  { label: "Settings", icon: Settings, path: "/settings" },
] as const;

export default function BottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!moreOpen) return;
    const h = (e: MouseEvent) => { if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [moreOpen]);

  useEffect(() => { setMoreOpen(false); }, [pathname]);

  const isMoreActive = moreItems.some(item => pathname.startsWith(item.path));

  return (
    <nav className="fixed bottom-3 left-3 right-3 z-50 md:hidden">
      <div className="mx-auto max-w-lg rounded-xl border border-stone-200 bg-white shadow-lg">
        <div className="flex h-14 items-center justify-around px-2">
          {tabs.map((tab) => {
            const isActive = tab.path === "/" ? pathname === "/" : pathname.startsWith(tab.path);
            return (
              <Link key={tab.path} href={tab.path}
                className={cn("relative flex flex-1 flex-col items-center gap-0.5 py-2 transition-colors",
                  isActive ? "text-indigo-600" : "text-stone-400")}>
                <tab.icon className="h-5 w-5" strokeWidth={1.5} />
                <AnimatePresence>
                  {isActive && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="text-[10px] font-medium">{tab.label}</motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
          <div ref={moreRef} className="relative flex flex-1 flex-col items-center">
            <button onClick={() => setMoreOpen(!moreOpen)}
              className={cn("flex flex-col items-center gap-0.5 py-2 transition-colors",
                isMoreActive || moreOpen ? "text-indigo-600" : "text-stone-400")}>
              <MoreHorizontal className="h-5 w-5" strokeWidth={1.5} />
              {(isMoreActive || moreOpen) && <span className="text-[10px] font-medium">More</span>}
            </button>
            <AnimatePresence>
              {moreOpen && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-14 right-0 min-w-[180px] rounded-xl border border-stone-200 bg-white py-1.5 shadow-lg">
                  {moreItems.map((item) => {
                    const isActive = pathname.startsWith(item.path);
                    return (
                      <Link key={item.path} href={item.path}
                        className={cn("flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                          isActive ? "bg-indigo-50 text-indigo-600" : "text-stone-600 hover:text-stone-900 hover:bg-stone-50")}>
                        <item.icon className="h-4 w-4" strokeWidth={1.5} />{item.label}
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
}
