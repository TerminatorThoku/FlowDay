"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, Calendar, CheckSquare, FolderKanban, Zap, Target,
  Dumbbell, Flame, TrendingUp, GraduationCap, BarChart3,
  Settings, ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface SidebarProps {
  userName: string;
}

const navSections = [
  { label: "TODAY", items: [{ label: "Dashboard", icon: Home, path: "/" }] },
  { label: "PLANNING", items: [
    { label: "Calendar", icon: Calendar, path: "/calendar" },
    { label: "Tasks", icon: CheckSquare, path: "/tasks" },
    { label: "Projects", icon: FolderKanban, path: "/projects" },
  ]},
  { label: "TRACKING", items: [
    { label: "Focus", icon: Zap, path: "/focus" },
    { label: "Habits", icon: Target, path: "/habits" },
    { label: "Lifestyle", icon: Dumbbell, path: "/lifestyle" },
    { label: "Streaks", icon: Flame, path: "/streaks" },
  ]},
  { label: "ANALYTICS", items: [
    { label: "Stats", icon: TrendingUp, path: "/stats" },
    { label: "GPA", icon: GraduationCap, path: "/gpa" },
    { label: "Report", icon: BarChart3, path: "/report" },
  ]},
];

export default function Sidebar({ userName }: SidebarProps) {
  const pathname = usePathname();
  const initial = userName?.charAt(0)?.toUpperCase() || "U";
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    TODAY: true, PLANNING: true, TRACKING: false, ANALYTICS: false,
  });

  const toggleSection = (label: string) => {
    setOpenSections(prev => ({ ...prev, [label]: !prev[label] }));
  };

  React.useEffect(() => {
    navSections.forEach((section) => {
      if (section.items.some(item => item.path === "/" ? pathname === "/" : pathname.startsWith(item.path))) {
        setOpenSections(prev => ({ ...prev, [section.label]: true }));
      }
    });
  }, [pathname]);

  return (
    <aside className="hidden md:flex md:flex-col md:w-[220px] fixed left-0 top-0 h-screen bg-[#111111] border-r border-[#2a2a2a] z-50">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-14 border-b border-[#2a2a2a]">
        <span className="font-serif text-lg font-bold text-[#e8e4dc] tracking-tight">FlowDay</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-4">
        {navSections.map((section) => (
          <div key={section.label}>
            <button
              onClick={() => toggleSection(section.label)}
              className="flex items-center justify-between w-full px-2 mb-1.5 text-[11px] font-sans font-semibold uppercase tracking-[0.1em] text-[#6b6560] hover:text-[#a8a29e] transition-colors"
            >
              <span>{section.label}</span>
              <ChevronDown className={cn("w-3 h-3 transition-transform duration-200", openSections[section.label] ? "rotate-0" : "-rotate-90")} />
            </button>
            {openSections[section.label] && (
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = item.path === "/" ? pathname === "/" : pathname.startsWith(item.path);
                  return (
                    <Link key={item.path} href={item.path}
                      className={cn(
                        "relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-sans transition-all duration-200",
                        isActive
                          ? "bg-[#1a1a1a] text-[#e8e4dc] border-l-2 border-l-[#c8a44e] ml-0"
                          : "text-[#a8a29e] hover:text-[#e8e4dc] hover:bg-[#1a1a1a]"
                      )}
                    >
                      <item.icon className="h-[18px] w-[18px] flex-shrink-0" strokeWidth={1.5} />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-[#2a2a2a] p-3 space-y-1">
        <Link href="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-sans transition-all duration-200",
            pathname === "/settings" ? "bg-[#1a1a1a] text-[#e8e4dc]" : "text-[#a8a29e] hover:text-[#e8e4dc] hover:bg-[#1a1a1a]"
          )}
        >
          <Settings className="h-[18px] w-[18px]" strokeWidth={1.5} />
          <span>Settings</span>
        </Link>
        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar className="h-7 w-7 ring-1 ring-[#2a2a2a]">
            <AvatarFallback className="bg-[#c8a44e]/20 text-xs font-semibold text-[#c8a44e]">
              {initial}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-[#6b6560] truncate">{userName}</span>
        </div>
      </div>
    </aside>
  );
}
