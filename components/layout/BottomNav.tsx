"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Calendar,
  CheckSquare,
  Dumbbell,
  MoreHorizontal,
  Settings,
  GraduationCap,
  BarChart3,
  Zap,
  Target,
  TrendingUp,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Dashboard", icon: Home, path: "/" },
  { label: "Calendar", icon: Calendar, path: "/calendar" },
  { label: "Tasks", icon: CheckSquare, path: "/tasks" },
  { label: "Focus", icon: Zap, path: "/focus" },
] as const;

const moreItems = [
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
    function handleClickOutside(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    if (moreOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [moreOpen]);

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  const isMoreActive = moreItems.some((item) =>
    pathname.startsWith(item.path)
  );

  const activeTabPath =
    tabs.find((tab) =>
      tab.path === "/" ? pathname === "/" : pathname.startsWith(tab.path)
    )?.path || (isMoreActive ? "__more__" : null);

  return (
    <nav className="fixed bottom-3 left-3 right-3 z-50 md:hidden">
      <div className="mx-auto max-w-lg rounded-xl border border-[#2a2a2a] bg-[#1a1a1a]">
        <div className="flex h-14 items-center justify-around px-2">
          {tabs.map((tab) => {
            const isActive =
              tab.path === "/"
                ? pathname === "/"
                : pathname.startsWith(tab.path);

            return (
              <Link
                key={tab.path}
                href={tab.path}
                className={cn(
                  "relative flex flex-1 flex-col items-center gap-0.5 py-2 transition-colors",
                  isActive ? "text-[#c8a44e]" : "text-[#6b6560]"
                )}
              >
                <tab.icon className="h-5 w-5" strokeWidth={1.5} />
                <AnimatePresence>
                  {isActive && (
                    <>
                      <motion.span
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        className="text-[10px] font-medium"
                      >
                        {tab.label}
                      </motion.span>
                      <motion.div
                        layoutId="activeNavDot"
                        className="absolute -bottom-1 h-1 w-1 rounded-full bg-[#c8a44e] shadow-[0_0_6px_rgba(200,164,78,0.4)]"
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 30,
                        }}
                      />
                    </>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}

          {/* More menu */}
          <div
            ref={moreRef}
            className="relative flex flex-1 flex-col items-center"
          >
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className={cn(
                "relative flex flex-col items-center gap-0.5 py-2 transition-colors",
                isMoreActive || moreOpen
                  ? "text-[#c8a44e]"
                  : "text-[#6b6560]"
              )}
            >
              <MoreHorizontal className="h-5 w-5" strokeWidth={1.5} />
              <AnimatePresence>
                {(isMoreActive || moreOpen) && (
                  <>
                    <motion.span
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      className="text-[10px] font-medium"
                    >
                      More
                    </motion.span>
                    {isMoreActive && (
                      <motion.div
                        layoutId="activeNavDot"
                        className="absolute -bottom-1 h-1 w-1 rounded-full bg-[#c8a44e] shadow-[0_0_6px_rgba(200,164,78,0.4)]"
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 30,
                        }}
                      />
                    )}
                  </>
                )}
              </AnimatePresence>
            </button>

            <AnimatePresence>
              {moreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-14 right-0 min-w-[180px] rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] py-1.5 shadow-lg"
                >
                  {moreItems.map((item) => {
                    const isActive = pathname.startsWith(item.path);
                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                          isActive
                            ? "bg-[#1a1a1a] text-[#c8a44e]"
                            : "text-[#a8a29e] hover:text-[#e8e4dc] hover:bg-[#222222]"
                        )}
                      >
                        <item.icon className="h-4 w-4" strokeWidth={1.5} />
                        {item.label}
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
