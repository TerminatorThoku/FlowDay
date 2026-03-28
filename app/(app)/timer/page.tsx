"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTimerStore } from "@/stores/timerStore";

/* ------------------------------------------------------------------ */
/*  Constants                                                         */
/* ------------------------------------------------------------------ */

const FOCUS_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;
const LONG_BREAK_TIME = 15 * 60;
const TOTAL_SESSIONS = 4;
const CIRCLE_RADIUS = 110;
const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS; // ~691.15

type SessionType = "focus" | "break" | "longBreak";

/* ------------------------------------------------------------------ */
/*  Audio helper                                                      */
/* ------------------------------------------------------------------ */

function playChime() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 800;
    gain.gain.value = 0.3;
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.stop(ctx.currentTime + 0.5);
  } catch {
    /* silently ignore if AudioContext is unavailable */
  }
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function getDuration(type: SessionType): number {
  if (type === "focus") return FOCUS_TIME;
  if (type === "break") return BREAK_TIME;
  return LONG_BREAK_TIME;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function sessionLabel(type: SessionType): string {
  if (type === "focus") return "Focus";
  if (type === "break") return "Short Break";
  return "Long Break";
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                    */
/* ------------------------------------------------------------------ */

export default function TimerPage() {
  /* ---------- state ---------- */
  const [sessionType, setSessionType] = useState<SessionType>("focus");
  const [sessionNumber, setSessionNumber] = useState(1);
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [taskLabel, setTaskLabel] = useState("");

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const addSession = useTimerStore((s) => s.addSession);
  const completedSessions = useTimerStore((s) => s.completedSessions);
  const totalFocusMinutes = useTimerStore((s) => s.totalFocusMinutes);

  /* ---------- derived ---------- */
  const totalTime = getDuration(sessionType);
  const progress = timeLeft / totalTime;
  const dashOffset = CIRCUMFERENCE - CIRCUMFERENCE * progress;
  const progressStroke = sessionType === "focus" ? "#4f46e5" : "#16a34a";

  /* ---------- advance to next session ---------- */
  const advanceSession = useCallback(() => {
    playChime();

    /* log completed session */
    addSession({
      id: crypto.randomUUID(),
      label: taskLabel || "Untitled",
      type: sessionType,
      duration: Math.round(totalTime / 60),
      completedAt: new Date().toISOString(),
    });

    /* determine next session */
    if (sessionType === "focus") {
      if (sessionNumber >= TOTAL_SESSIONS) {
        /* after 4th focus -> long break, then reset counter */
        setSessionType("longBreak");
        setTimeLeft(LONG_BREAK_TIME);
        setSessionNumber(1);
      } else {
        setSessionType("break");
        setTimeLeft(BREAK_TIME);
      }
    } else {
      /* after any break -> next focus */
      const nextNum =
        sessionType === "longBreak" ? 1 : sessionNumber + 1;
      setSessionType("focus");
      setTimeLeft(FOCUS_TIME);
      setSessionNumber(nextNum);
    }

    setIsRunning(false);
  }, [sessionType, sessionNumber, taskLabel, totalTime, addSession]);

  /* ---------- countdown effect ---------- */
  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          /* Use setTimeout so state updates don't collide */
          setTimeout(() => advanceSession(), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, advanceSession]);

  /* ---------- handlers ---------- */
  function handleStartPause() {
    setIsRunning((r) => !r);
  }

  function handleSkip() {
    setIsRunning(false);
    advanceSession();
  }

  function handleReset() {
    setIsRunning(false);
    setSessionType("focus");
    setSessionNumber(1);
    setTimeLeft(FOCUS_TIME);
  }

  /* ---------------------------------------------------------------- */
  /*  Render                                                          */
  /* ---------------------------------------------------------------- */

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* ---- Title ---- */}
      <h1 className="font-serif text-2xl font-bold text-stone-900">
        Focus Timer
      </h1>

      {/* ---- Task input ---- */}
      <input
        type="text"
        value={taskLabel}
        onChange={(e) => setTaskLabel(e.target.value)}
        placeholder="What are you working on?"
        className="mt-4 bg-stone-50 border border-stone-200 rounded-lg px-4 py-2 text-stone-900 text-sm w-full placeholder:text-stone-400 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition"
      />

      {/* ---- Circular timer ---- */}
      <div className="flex flex-col items-center mt-8">
        <motion.div
          key={sessionType}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35 }}
        >
          <svg viewBox="0 0 260 260" className="w-64 h-64">
            {/* track */}
            <circle
              cx={130}
              cy={130}
              r={CIRCLE_RADIUS}
              fill="none"
              stroke="#e7e5e4"
              strokeWidth={8}
            />
            {/* progress arc */}
            <circle
              cx={130}
              cy={130}
              r={CIRCLE_RADIUS}
              fill="none"
              stroke={progressStroke}
              strokeWidth={8}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 130 130)"
              className="transition-[stroke-dashoffset] duration-700 ease-linear"
            />
            {/* time */}
            <text
              x={130}
              y={125}
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-mono text-6xl font-bold"
              fill="#1c1917"
              fontSize={48}
            >
              {formatTime(timeLeft)}
            </text>
            {/* label */}
            <text
              x={130}
              y={158}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-sm"
              fill="#78716c"
              fontSize={14}
            >
              {sessionLabel(sessionType)}
            </text>
          </svg>
        </motion.div>

        {/* ---- Session dots ---- */}
        <div className="flex items-center gap-3 mt-4">
          {Array.from({ length: TOTAL_SESSIONS }).map((_, i) => {
            const idx = i + 1;
            const isCompleted =
              sessionType !== "focus"
                ? idx <= sessionNumber
                : idx < sessionNumber;
            const isCurrent =
              sessionType === "focus" && idx === sessionNumber;

            return (
              <span
                key={i}
                className={`inline-block h-3 w-3 rounded-full border-2 transition-colors ${
                  isCompleted
                    ? "bg-indigo-600 border-indigo-600"
                    : isCurrent
                    ? "border-indigo-600 bg-transparent ring-2 ring-indigo-300"
                    : "border-stone-300 bg-transparent"
                }`}
              />
            );
          })}
        </div>

        {/* ---- Controls ---- */}
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={handleReset}
            className="bg-stone-100 text-stone-600 border border-stone-200 rounded-lg px-4 py-3 hover:bg-stone-200 transition text-sm font-medium"
          >
            Reset
          </button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleStartPause}
            className="bg-indigo-600 text-white rounded-lg px-8 py-3 text-base font-medium hover:bg-indigo-700 transition"
          >
            {isRunning ? "Pause" : "Start"}
          </motion.button>

          <button
            onClick={handleSkip}
            className="bg-stone-100 text-stone-600 border border-stone-200 rounded-lg px-4 py-3 hover:bg-stone-200 transition text-sm font-medium"
          >
            Skip
          </button>
        </div>

        {/* ---- Session info ---- */}
        <p className="text-sm text-stone-400 mt-4">
          Session {sessionNumber} of {TOTAL_SESSIONS}
        </p>
      </div>

      {/* ---- Stats ribbon ---- */}
      {totalFocusMinutes > 0 && (
        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-stone-500">
          <span>
            <span className="font-semibold text-stone-800">
              {totalFocusMinutes}
            </span>{" "}
            min focused today
          </span>
          <span className="h-4 w-px bg-stone-200" />
          <span>
            <span className="font-semibold text-stone-800">
              {completedSessions.filter((s) => s.type === "focus").length}
            </span>{" "}
            sessions
          </span>
        </div>
      )}

      {/* ---- Completed sessions log ---- */}
      <AnimatePresence>
        {completedSessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <h2 className="text-sm font-semibold text-stone-700 mb-3">
              Completed Sessions
            </h2>
            <ul className="space-y-2">
              {[...completedSessions].reverse().map((session) => (
                <motion.li
                  key={session.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between bg-white border border-stone-200 rounded-lg px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${
                        session.type === "focus"
                          ? "bg-indigo-500"
                          : "bg-green-500"
                      }`}
                    />
                    <span className="text-sm text-stone-800">
                      {session.label}
                    </span>
                    <span className="text-xs text-stone-400 capitalize">
                      {sessionLabel(session.type)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-stone-400">
                      {session.duration} min
                    </span>
                    <span className="text-xs text-stone-300">
                      {new Date(session.completedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
