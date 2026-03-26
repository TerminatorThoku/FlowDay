"use client";

import { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface NotificationPromptProps {
  permission: NotificationPermission;
  onRequestPermission: () => Promise<NotificationPermission>;
}

const DISMISSED_KEY = "flowday-notif-prompt-dismissed";

export default function NotificationPrompt({
  permission,
  onRequestPermission,
}: NotificationPromptProps) {
  const [dismissed, setDismissed] = useState(true); // Start hidden to avoid flash
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const wasDismissed = localStorage.getItem(DISMISSED_KEY) === "true";
      setDismissed(wasDismissed);
    }
  }, []);

  // Don't show if already granted, denied, or dismissed
  if (permission !== "default" || dismissed) {
    return null;
  }

  const handleAllow = async () => {
    setRequesting(true);
    await onRequestPermission();
    setRequesting(false);
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem(DISMISSED_KEY, "true");
  };

  return (
    <Card className="border-orange-500/20 bg-zinc-900/80">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-orange-500/10">
            <Bell className="h-5 w-5 text-orange-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-zinc-200">
              Enable notifications
            </p>
            <p className="mt-0.5 text-xs text-zinc-500">
              Never miss a class or break a streak
            </p>
            <div className="mt-3 flex items-center gap-2">
              <Button
                onClick={handleAllow}
                disabled={requesting}
                size="sm"
                className="bg-orange-500 text-white hover:bg-orange-600"
              >
                {requesting ? "Requesting..." : "Allow"}
              </Button>
              <Button
                onClick={handleDismiss}
                variant="ghost"
                size="sm"
                className="text-zinc-500 hover:text-zinc-300"
              >
                Not now
              </Button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="rounded-full p-1 text-zinc-600 hover:bg-zinc-800 hover:text-zinc-400"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
