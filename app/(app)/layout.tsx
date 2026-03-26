"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";
import BottomNav from "@/components/layout/BottomNav";
import Sidebar from "@/components/layout/Sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userName, setUserName] = useState("Abdul");
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setUserName(
            user.user_metadata?.full_name?.split(" ")[0] ||
              user.email?.split("@")[0] ||
              "Abdul"
          );
        }
      } catch {
        console.log("Running in demo mode (Supabase not connected)");
      }
      setAuthChecked(true);
    };

    checkAuth();
  }, [router]);

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
          <span className="text-sm text-white/30">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#111111]">
      {/* Desktop sidebar */}
      <Sidebar userName={userName} />

      {/* Main content area */}
      <div className="flex flex-1 flex-col md:ml-[220px]">
        {/* Mobile header */}
        <AppHeader userName={userName} />

        <main className="flex-1 overflow-auto pb-24 md:pb-8">{children}</main>

        {/* Mobile bottom nav */}
        <BottomNav />
      </div>
    </div>
  );
}
