"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { TimeBlock } from "@/types/schedule";
import {
  calculateNotificationTimes,
  getStreakWarningNotifications,
  getCodingReminderNotification,
  type NotificationConfig,
} from "@/lib/notifications/scheduler";

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return "denied";
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, []);

  const scheduleNotification = useCallback(
    (title: string, body: string, delayMs: number) => {
      if (permission !== "granted") return;
      if (delayMs < 0) return;

      const timeout = setTimeout(() => {
        new Notification(title, {
          body,
          icon: "/icons/icon-192.png",
          badge: "/icons/icon-192.png",
        });
      }, delayMs);

      timeoutsRef.current.push(timeout);
    },
    [permission]
  );

  const clearScheduled = useCallback(() => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
  }, []);

  const scheduleBlockReminders = useCallback(
    (
      blocks: TimeBlock[],
      config?: NotificationConfig
    ) => {
      if (permission !== "granted") return;

      // Clear previously scheduled notifications
      clearScheduled();

      const now = Date.now();
      const notifications = calculateNotificationTimes(blocks, config);

      notifications.forEach((n) => {
        const delayMs = n.fireAt.getTime() - now;
        if (delayMs > 0) {
          scheduleNotification(n.title, n.body, delayMs);
        }
      });
    },
    [permission, clearScheduled, scheduleNotification]
  );

  const scheduleStreakWarnings = useCallback(
    (
      streaks: { type: string; current: number; todayCompleted: boolean }[],
      date: string
    ) => {
      if (permission !== "granted") return;

      const now = Date.now();
      const warnings = getStreakWarningNotifications(streaks, date);

      warnings.forEach((n) => {
        const delayMs = n.fireAt.getTime() - now;
        if (delayMs > 0) {
          scheduleNotification(n.title, n.body, delayMs);
        }
      });
    },
    [permission, scheduleNotification]
  );

  const scheduleCodingReminder = useCallback(
    (hasCodingToday: boolean, date: string, projectName?: string) => {
      if (permission !== "granted") return;

      const notification = getCodingReminderNotification(
        hasCodingToday,
        date,
        projectName
      );
      if (notification) {
        const delayMs = notification.fireAt.getTime() - Date.now();
        if (delayMs > 0) {
          scheduleNotification(notification.title, notification.body, delayMs);
        }
      }
    },
    [permission, scheduleNotification]
  );

  // Clean up on unmount
  useEffect(() => {
    return () => {
      clearScheduled();
    };
  }, [clearScheduled]);

  return {
    permission,
    requestPermission,
    scheduleNotification,
    scheduleBlockReminders,
    scheduleStreakWarnings,
    scheduleCodingReminder,
    clearScheduled,
  };
}
