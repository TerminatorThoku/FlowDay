"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AppHeaderProps {
  userName: string;
}

export default function AppHeader({ userName }: AppHeaderProps) {
  const today = new Date();
  const dateStr = format(today, "EEE, MMM d");
  const initial = userName?.charAt(0)?.toUpperCase() || "U";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 flex h-14 items-center justify-between px-4 md:hidden transition-all duration-300 ${
        scrolled
          ? "bg-zinc-950/80 backdrop-blur-xl border-b border-white/[0.06]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <span className="text-base font-semibold text-white tracking-tight">
        FlowDay
      </span>

      <span className="text-xs text-white/30 font-mono">{dateStr}</span>

      <Avatar className="h-8 w-8 ring-2 ring-white/[0.08]">
        <AvatarFallback className="bg-orange-500/20 text-sm font-semibold text-orange-500">
          {initial}
        </AvatarFallback>
      </Avatar>
    </header>
  );
}
