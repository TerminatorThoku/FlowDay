"use client";

import { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NotificationPromptProps {
  permission: NotificationPermission;
  onRequestPermission: () => Promise<NotificationPermission>;
}

const DISMISSED_KEY = "flowday-notif-prompt-dismissed";

export default function NotificationPrompt({
  permission,
  onRequestPermission,
}: NotificationPromptProps) {
  const [dismissed, setDismissed] = useState(true);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const wasDismissed = localStorage.getItem(DISMISSED_KEY) === "true";
      setDismissed(wasDismissed);
    }
  }, []);

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
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-4"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-orange-500/10">
              <Bell className="h-5 w-5 text-orange-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white/90">
                Enable notifications
              </p>
              <p className="mt-0.5 text-xs text-white/32">
                Never miss a class or break a streak
              </p>
              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={handleAllow}
                  disabled={requesting}
                  className="bg-orange-500 text-black rounded-xl px-4 py-1.5 text-sm font-medium hover:bg-orange-400 active:scale-[0.97] transition-all disabled:opacity-50"
                >
                  {requesting ? "Requesting..." : "Allow"}
                </button>
                <button
                  onClick={handleDismiss}
                  className="text-white/32 text-sm hover:text-white/55 cursor-pointer transition-colors"
                >
                  Not now
                </button>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="rounded-full p-1 text-white/20 hover:bg-white/[0.05] hover:text-white/40 transition-all"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
