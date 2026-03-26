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
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Today", icon: Home, path: "/" },
  { label: "Calendar", icon: Calendar, path: "/calendar" },
  { label: "Tasks", icon: CheckSquare, path: "/tasks" },
  { label: "Lifestyle", icon: Dumbbell, path: "/lifestyle" },
] as const;

const moreItems = [
  { label: "Focus", icon: Zap, path: "/focus" },
  { label: "Habits", icon: Target, path: "/habits" },
  { label: "Stats", icon: TrendingUp, path: "/stats" },
  { label: "Settings", icon: Settings, path: "/settings" },
  { label: "GPA", icon: GraduationCap, path: "/gpa" },
  { label: "Report", icon: BarChart3, path: "/report" },
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
    <nav className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
      <div className="mx-auto max-w-lg rounded-2xl border border-white/[0.08] bg-zinc-900/80 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
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
                  isActive ? "text-orange-500" : "text-white/30"
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
                        className="absolute -bottom-1 h-1 w-1 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]"
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
                  ? "text-orange-500"
                  : "text-white/30"
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
                        className="absolute -bottom-1 h-1 w-1 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]"
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
                  className="absolute bottom-14 right-0 min-w-[180px] rounded-xl border border-white/[0.08] bg-zinc-900/95 backdrop-blur-2xl py-1.5 shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
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
                            ? "bg-white/[0.06] text-orange-500"
                            : "text-white/60 hover:text-white/90 hover:bg-white/[0.04]"
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
