"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import AppHeader from "@/components/layout/AppHeader";
import BottomNav from "@/components/layout/BottomNav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
          <span className="text-sm text-zinc-500">Loading...</span>
        </div>
      </div>
    );
  }

  // Don't render children until user is confirmed
  if (!user) {
    return null;
  }

  const userName = user.user_metadata?.full_name?.split(" ")[0] || user.email?.split("@")[0] || "User";

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <AppHeader userName={userName} />
      <main className="flex-1 overflow-auto pb-20">{children}</main>
      <BottomNav />
    </div>
  );
}
