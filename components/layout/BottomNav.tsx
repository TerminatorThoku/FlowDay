"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Calendar,
  CheckSquare,
  Dumbbell,
  MoreHorizontal,
  Settings,
  GraduationCap,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Today", icon: Home, path: "/" },
  { label: "Calendar", icon: Calendar, path: "/calendar" },
  { label: "Tasks", icon: CheckSquare, path: "/tasks" },
  { label: "Lifestyle", icon: Dumbbell, path: "/lifestyle" },
] as const;

const moreItems = [
  { label: "Settings", icon: Settings, path: "/settings" },
  { label: "GPA", icon: GraduationCap, path: "/gpa" },
  { label: "Report", icon: BarChart3, path: "/report" },
] as const;

export default function BottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    if (moreOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [moreOpen]);

  // Close menu on route change
  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  const isMoreActive = moreItems.some((item) =>
    pathname.startsWith(item.path)
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 border-t border-zinc-800 bg-zinc-950 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex h-full max-w-lg items-center justify-around px-4">
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
                "flex flex-1 flex-col items-center gap-1 py-2 transition-colors",
                isActive ? "text-orange-500" : "text-zinc-500"
              )}
            >
              <tab.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{tab.label}</span>
            </Link>
          );
        })}

        {/* More menu */}
        <div ref={moreRef} className="relative flex flex-1 flex-col items-center">
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            className={cn(
              "flex flex-col items-center gap-1 py-2 transition-colors",
              isMoreActive || moreOpen ? "text-orange-500" : "text-zinc-500"
            )}
          >
            <MoreHorizontal className="h-5 w-5" />
            <span className="text-xs font-medium">More</span>
          </button>

          {moreOpen && (
            <div className="absolute bottom-16 right-0 min-w-[160px] rounded-xl border border-zinc-800 bg-zinc-900 py-2 shadow-xl shadow-black/40">
              {moreItems.map((item) => {
                const isActive = pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                      isActive
                        ? "bg-orange-500/10 text-orange-500"
                        : "text-zinc-300 hover:bg-zinc-800"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
