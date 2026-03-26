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
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 flex h-14 items-center justify-between px-4 md:hidden transition-all duration-300 ${
        scrolled
          ? "bg-[#111111]/95 border-b border-[#2a2a2a]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <span className="font-serif text-base font-bold text-[#e8e4dc] tracking-tight">
        FlowDay
      </span>
      <span className="text-xs text-[#6b6560] font-mono">{dateStr}</span>
      <Avatar className="h-8 w-8 ring-1 ring-[#2a2a2a]">
        <AvatarFallback className="bg-[#c8a44e]/20 text-sm font-semibold text-[#c8a44e]">
          {initial}
        </AvatarFallback>
      </Avatar>
    </header>
  );
}
