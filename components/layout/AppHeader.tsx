"use client";

import { format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AppHeaderProps {
  userName: string;
}

export default function AppHeader({ userName }: AppHeaderProps) {
  const today = new Date();
  const dateStr = format(today, "EEE, MMM d");
  const initial = userName?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-zinc-800 bg-zinc-950/90 px-4 backdrop-blur-sm">
      <span className="text-lg font-bold text-orange-500">FlowDay</span>

      <span className="text-sm text-zinc-400">{dateStr}</span>

      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-orange-500/20 text-sm font-semibold text-orange-500">
          {initial}
        </AvatarFallback>
      </Avatar>
    </header>
  );
}
