"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export type PomodoroPhase = "work" | "break" | "long_break";

const WORK_DURATION = 25 * 60; // 25 minutes in seconds
const BREAK_DURATION = 5 * 60; // 5 minutes
const LONG_BREAK_DURATION = 15 * 60; // 15 minutes
const SESSIONS_BEFORE_LONG_BREAK = 4;

function playBeep() {
  try {
    const ctx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.frequency.setValueAtTime(880, ctx.currentTime);
    oscillator.type = "sine";
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.8);

    // Second beep
    setTimeout(() => {
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.frequency.setValueAtTime(1100, ctx.currentTime);
      osc2.type = "sine";
      gain2.gain.setValueAtTime(0.3, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
      osc2.start(ctx.currentTime);
      osc2.stop(ctx.currentTime + 0.8);
    }, 300);
  } catch {
    // Web Audio API not available
  }
}

function getDurationForPhase(phase: PomodoroPhase): number {
  switch (phase) {
    case "work":
      return WORK_DURATION;
    case "break":
      return BREAK_DURATION;
    case "long_break":
      return LONG_BREAK_DURATION;
  }
}

interface UsePomodoroReturn {
  timeRemaining: number;
  totalDuration: number;
  isActive: boolean;
  isPaused: boolean;
  currentPhase: PomodoroPhase;
  sessionCount: number;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  skipBreak: () => void;
}

export function usePomodoro(
  onPhaseComplete?: (phase: PomodoroPhase, sessionCount: number) => void
): UsePomodoroReturn {
  const [currentPhase, setCurrentPhase] = useState<PomodoroPhase>("work");
  const [timeRemaining, setTimeRemaining] = useState(WORK_DURATION);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onPhaseCompleteRef = useRef(onPhaseComplete);

  useEffect(() => {
    onPhaseCompleteRef.current = onPhaseComplete;
  }, [onPhaseComplete]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const transitionToNextPhase = useCallback(
    (completedPhase: PomodoroPhase, currentSessionCount: number) => {
      playBeep();

      let nextPhase: PomodoroPhase;
      let nextSessionCount = currentSessionCount;

      if (completedPhase === "work") {
        nextSessionCount = currentSessionCount + 1;
        if (nextSessionCount % SESSIONS_BEFORE_LONG_BREAK === 0) {
          nextPhase = "long_break";
        } else {
          nextPhase = "break";
        }
      } else {
        nextPhase = "work";
      }

      onPhaseCompleteRef.current?.(completedPhase, nextSessionCount);

      setSessionCount(nextSessionCount);
      setCurrentPhase(nextPhase);
      setTimeRemaining(getDurationForPhase(nextPhase));
      setIsActive(false);
      setIsPaused(false);
    },
    []
  );

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearTimer();
            // Use setTimeout to avoid state update during render
            setTimeout(() => {
              transitionToNextPhase(currentPhase, sessionCount);
            }, 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearTimer();
    }

    return clearTimer;
  }, [isActive, isPaused, clearTimer, currentPhase, sessionCount, transitionToNextPhase]);

  const start = useCallback(() => {
    setIsActive(true);
    setIsPaused(false);
  }, []);

  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    setCurrentPhase("work");
    setTimeRemaining(WORK_DURATION);
    setIsActive(false);
    setIsPaused(false);
    setSessionCount(0);
  }, [clearTimer]);

  const skipBreak = useCallback(() => {
    if (currentPhase === "break" || currentPhase === "long_break") {
      clearTimer();
      setCurrentPhase("work");
      setTimeRemaining(WORK_DURATION);
      setIsActive(false);
      setIsPaused(false);
    }
  }, [currentPhase, clearTimer]);

  const totalDuration = getDurationForPhase(currentPhase);

  return {
    timeRemaining,
    totalDuration,
    isActive,
    isPaused,
    currentPhase,
    sessionCount,
    start,
    pause,
    resume,
    reset,
    skipBreak,
  };
}
