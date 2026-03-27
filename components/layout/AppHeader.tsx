"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns";

interface AppHeaderProps { userName: string }

export default function AppHeader({ userName }: AppHeaderProps) {
  const dateStr = format(new Date(), "EEE, MMM d");
  const initial = userName?.charAt(0)?.toUpperCase() || "U";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <header className={`sticky top-0 z-40 flex h-14 items-center justify-between px-4 md:hidden transition-all duration-200 ${
      scrolled ? "bg-white/95 border-b border-stone-200 shadow-sm" : "bg-transparent border-b border-transparent"
    }`}>
      <span className="font-serif text-base font-bold text-gray-900 tracking-tight">FlowDay</span>
      <span className="text-xs text-stone-400 font-mono">{dateStr}</span>
      <div className="h-8 w-8 rounded-full bg-indigo-600 text-white font-medium text-sm flex items-center justify-center">{initial}</div>
    </header>
  );
}
