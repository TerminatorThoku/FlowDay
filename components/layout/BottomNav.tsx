"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, CheckSquare, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Today", icon: Home, path: "/" },
  { label: "Calendar", icon: Calendar, path: "/calendar" },
  { label: "Tasks", icon: CheckSquare, path: "/tasks" },
  { label: "Settings", icon: Settings, path: "/settings" },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 border-t border-zinc-800 bg-zinc-950 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex h-full max-w-lg items-center justify-around px-4">
        {tabs.map((tab) => {
          const isActive =
            tab.path === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.path);

          // Also highlight Settings when on sub-pages like /gpa or /lifestyle
          const isSettingsActive =
            tab.path === "/settings" &&
            (pathname.startsWith("/settings") ||
              pathname.startsWith("/gpa") ||
              pathname.startsWith("/lifestyle"));

          const active = isActive || isSettingsActive;

          return (
            <Link
              key={tab.path}
              href={tab.path}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2 transition-colors",
                active ? "text-orange-500" : "text-zinc-500"
              )}
            >
              <tab.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
