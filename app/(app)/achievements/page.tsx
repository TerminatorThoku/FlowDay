"use client";
import { motion } from "framer-motion";

interface Achievement {
  id: string;
  emoji: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedDate?: string;
  category: string;
  requirement: string;
}

const achievements: Achievement[] = [
  // Unlocked
  { id: "1", emoji: "\uD83D\uDD25", title: "7-Day Streak", description: "Complete habits 7 days in a row", unlocked: true, unlockedDate: "Mar 25, 2026", category: "Streaks", requirement: "7 consecutive days" },
  { id: "2", emoji: "\uD83C\uDFCB\uFE0F", title: "Iron Will", description: "Complete 30 gym sessions", unlocked: true, unlockedDate: "Mar 20, 2026", category: "Fitness", requirement: "30 gym sessions" },
  { id: "3", emoji: "\uD83D\uDCDA", title: "Bookworm", description: "Study for 50 total hours", unlocked: true, unlockedDate: "Mar 15, 2026", category: "Academic", requirement: "50h study time" },
  { id: "4", emoji: "\u23F0", title: "Early Bird", description: "Start a task before 8 AM five times", unlocked: true, unlockedDate: "Mar 10, 2026", category: "Habits", requirement: "5 early starts" },
  // Locked
  { id: "5", emoji: "\u26A1", title: "Deep Focus", description: "5 hours of focus in one day", unlocked: false, category: "Focus", requirement: "5h focus in 1 day" },
  { id: "6", emoji: "\uD83C\uDFAF", title: "Task Crusher", description: "Complete 10 tasks in a single day", unlocked: false, category: "Productivity", requirement: "10 tasks in 1 day" },
  { id: "7", emoji: "\uD83D\uDCCA", title: "Honor Roll", description: "Achieve a semester GPA of 3.7+", unlocked: false, category: "Academic", requirement: "3.7+ semester GPA" },
  { id: "8", emoji: "\uD83C\uDFCA", title: "Aquaman", description: "Complete 20 swimming sessions", unlocked: false, category: "Fitness", requirement: "20 swim sessions" },
  { id: "9", emoji: "\uD83C\uDF19", title: "Sleep Champion", description: "30-day sleep 7h+ streak", unlocked: false, category: "Health", requirement: "30-day sleep streak" },
  { id: "10", emoji: "\uD83D\uDCBB", title: "Code Machine", description: "Work on projects for 100 hours total", unlocked: false, category: "Projects", requirement: "100h project work" },
  { id: "11", emoji: "\uD83D\uDD25", title: "30-Day Streak", description: "Any habit for 30 consecutive days", unlocked: false, category: "Streaks", requirement: "30 consecutive days" },
  { id: "12", emoji: "\uD83C\uDFC6", title: "Semester MVP", description: "Complete all tasks before deadline for an entire semester", unlocked: false, category: "Academic", requirement: "100% on-time completion" },
];

export default function AchievementsPage() {
  const unlocked = achievements.filter(a => a.unlocked);
  const locked = achievements.filter(a => !a.unlocked);

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="font-serif text-2xl font-bold text-stone-900">Achievements</h1>
      <p className="text-sm text-stone-400 mt-1">{unlocked.length} of {achievements.length} unlocked</p>

      {/* Progress bar */}
      <div className="mt-4 h-2 bg-stone-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(unlocked.length / achievements.length) * 100}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-indigo-500 rounded-full"
        />
      </div>

      {/* Unlocked */}
      <h2 className="text-[11px] uppercase tracking-wider text-stone-400 font-medium mt-8 mb-3">Unlocked</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {unlocked.map((a, i) => (
          <motion.div key={a.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-2xl shrink-0">{a.emoji}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-stone-900">{a.title}</p>
              <p className="text-xs text-stone-500 mt-0.5">{a.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-green-50 text-green-700 border border-green-200 font-medium">Unlocked</span>
                <span className="text-[10px] text-stone-400">{a.unlockedDate}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Locked */}
      <h2 className="text-[11px] uppercase tracking-wider text-stone-400 font-medium mt-8 mb-3">Locked</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {locked.map((a, i) => (
          <motion.div key={a.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex items-start gap-4 opacity-60"
          >
            <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-2xl shrink-0 grayscale">{a.emoji}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-stone-600">{a.title}</p>
              <p className="text-xs text-stone-400 mt-0.5">{a.description}</p>
              <p className="text-[10px] text-stone-400 mt-2">Requires: {a.requirement}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
