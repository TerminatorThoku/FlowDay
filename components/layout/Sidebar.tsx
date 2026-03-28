"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, CheckSquare, FolderKanban, Zap, Target, Dumbbell, Flame, TrendingUp, GraduationCap, BarChart3, Settings, ChevronDown, Timer, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps { userName: string }

const navSections = [
  { label: "TODAY", items: [{ label: "Dashboard", icon: Home, path: "/" }] },
  { label: "PLANNING", items: [
    { label: "Calendar", icon: Calendar, path: "/calendar" },
    { label: "Tasks", icon: CheckSquare, path: "/tasks" },
    { label: "Projects", icon: FolderKanban, path: "/projects" },
  ]},
  { label: "TRACKING", items: [
    { label: "Focus", icon: Zap, path: "/focus" },
    { label: "Timer", icon: Timer, path: "/timer" },
    { label: "Habits", icon: Target, path: "/habits" },
    { label: "Lifestyle", icon: Dumbbell, path: "/lifestyle" },
    { label: "Streaks", icon: Flame, path: "/streaks" },
  ]},
  { label: "ANALYTICS", items: [
    { label: "Stats", icon: TrendingUp, path: "/stats" },
    { label: "GPA", icon: GraduationCap, path: "/gpa" },
    { label: "Report", icon: BarChart3, path: "/report" },
    { label: "Achievements", icon: Trophy, path: "/achievements" },
  ]},
];

export default function Sidebar({ userName }: SidebarProps) {
  const pathname = usePathname();
  const initial = userName?.charAt(0)?.toUpperCase() || "U";
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    TODAY: true, PLANNING: true, TRACKING: false, ANALYTICS: false,
  });
  const toggleSection = (label: string) => setOpenSections(prev => ({ ...prev, [label]: !prev[label] }));

  React.useEffect(() => {
    navSections.forEach((section) => {
      if (section.items.some(item => item.path === "/" ? pathname === "/" : pathname.startsWith(item.path))) {
        setOpenSections(prev => ({ ...prev, [section.label]: true }));
      }
    });
  }, [pathname]);

  return (
    <aside className="hidden md:flex md:flex-col md:w-[220px] fixed left-0 top-0 h-screen bg-white border-r border-stone-200 z-50">
      <div className="flex items-center gap-2.5 px-5 h-14 border-b border-stone-200">
        <Zap className="h-5 w-5 text-indigo-600" />
        <span className="font-serif text-lg font-bold text-gray-900 tracking-tight">FlowDay</span>
      </div>
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
        {navSections.map((section) => (
          <div key={section.label}>
            <button onClick={() => toggleSection(section.label)}
              className="flex items-center justify-between w-full px-3 py-1.5 text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-stone-400 hover:text-stone-600 transition-colors">
              <span>{section.label}</span>
              <ChevronDown className={cn("w-3 h-3 transition-transform duration-200 text-stone-300", openSections[section.label] ? "rotate-0" : "-rotate-90")} />
            </button>
            {openSections[section.label] && (
              <div className="space-y-0.5 mt-0.5">
                {section.items.map((item) => {
                  const isActive = item.path === "/" ? pathname === "/" : pathname.startsWith(item.path);
                  return (
                    <Link key={item.path} href={item.path}
                      className={cn("flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-sans font-medium transition-all duration-150",
                        isActive ? "text-indigo-600 bg-indigo-50" : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
                      )}>
                      <item.icon className="h-4 w-4 flex-shrink-0" strokeWidth={1.5} />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>
      <div className="border-t border-stone-200 p-3 space-y-1">
        <Link href="/settings" className={cn("flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-sans font-medium transition-all",
          pathname === "/settings" ? "text-indigo-600 bg-indigo-50" : "text-stone-500 hover:text-stone-900 hover:bg-stone-50")}>
          <Settings className="h-4 w-4" strokeWidth={1.5} /><span>Settings</span>
        </Link>
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-indigo-600 text-white font-medium text-sm flex items-center justify-center">{initial}</div>
          <span className="text-sm text-stone-700 truncate">{userName}</span>
        </div>
      </div>
    </aside>
  );
}
