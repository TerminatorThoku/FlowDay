"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  Calendar,
  CheckSquare,
  FolderKanban,
  Zap,
  Target,
  Dumbbell,
  Flame,
  TrendingUp,
  GraduationCap,
  BarChart3,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface SidebarProps {
  userName: string;
}

const navSections = [
  {
    label: "TODAY",
    items: [{ label: "Dashboard", icon: Home, path: "/" }],
  },
  {
    label: "PLANNING",
    items: [
      { label: "Calendar", icon: Calendar, path: "/calendar" },
      { label: "Tasks", icon: CheckSquare, path: "/tasks" },
      { label: "Projects", icon: FolderKanban, path: "/projects" },
    ],
  },
  {
    label: "TRACKING",
    items: [
      { label: "Focus", icon: Zap, path: "/focus" },
      { label: "Habits", icon: Target, path: "/habits" },
      { label: "Lifestyle", icon: Dumbbell, path: "/lifestyle" },
      { label: "Streaks", icon: Flame, path: "/streaks" },
    ],
  },
  {
    label: "ANALYTICS",
    items: [
      { label: "Stats", icon: TrendingUp, path: "/stats" },
      { label: "GPA", icon: GraduationCap, path: "/gpa" },
      { label: "Report", icon: BarChart3, path: "/report" },
    ],
  },
];

export default function Sidebar({ userName }: SidebarProps) {
  const pathname = usePathname();
  const initial = userName?.charAt(0)?.toUpperCase() || "U";

  return (
    <aside className="hidden md:flex md:flex-col md:w-[220px] fixed left-0 top-0 h-screen bg-zinc-950 border-r border-white/[0.06] z-50">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 h-14 border-b border-white/[0.04]">
        <div className="h-7 w-7 rounded-lg bg-orange-500 flex items-center justify-center">
          <Zap className="h-4 w-4 text-black" />
        </div>
        <span className="text-base font-semibold text-white tracking-tight">
          FlowDay
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navSections.map((section) => (
          <div key={section.label}>
            <div className="px-2 mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/25">
              {section.label}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  item.path === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.path);

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={cn(
                      "relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                      isActive
                        ? "bg-white/[0.06] text-white"
                        : "text-white/40 hover:text-white/70 hover:bg-white/[0.03]"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="sidebarActiveIndicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-full bg-orange-500"
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 30,
                        }}
                      />
                    )}
                    <item.icon
                      className="h-[18px] w-[18px] flex-shrink-0"
                      strokeWidth={1.5}
                    />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom: Settings + Avatar */}
      <div className="border-t border-white/[0.04] p-3 space-y-1">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
            pathname === "/settings"
              ? "bg-white/[0.06] text-white"
              : "text-white/40 hover:text-white/70 hover:bg-white/[0.03]"
          )}
        >
          <Settings className="h-[18px] w-[18px]" strokeWidth={1.5} />
          <span>Settings</span>
        </Link>

        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar className="h-7 w-7 ring-2 ring-white/[0.08]">
            <AvatarFallback className="bg-orange-500/20 text-xs font-semibold text-orange-500">
              {initial}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-white/50 truncate">{userName}</span>
        </div>
      </div>
    </aside>
  );
}
