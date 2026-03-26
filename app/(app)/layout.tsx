"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";
import BottomNav from "@/components/layout/BottomNav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userName, setUserName] = useState("Abdul");
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Try to load auth if Supabase is configured
    const checkAuth = async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          setUserName(
            user.user_metadata?.full_name?.split(" ")[0] ||
            user.email?.split("@")[0] ||
            "Abdul"
          );
        }
        // If no user but Supabase works, we could redirect to login
        // For now, allow access with default name (demo mode)
      } catch {
        // Supabase not available — use demo mode
        console.log("Running in demo mode (Supabase not connected)");
      }
      setAuthChecked(true);
    };

    checkAuth();
  }, [router]);

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
          <span className="text-sm text-zinc-500">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <AppHeader userName={userName} />
      <main className="flex-1 overflow-auto pb-20">{children}</main>
      <BottomNav />
    </div>
  );
}
