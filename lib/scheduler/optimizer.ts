import type { TimeBlock, Task } from '@/types/schedule';
import { findGaps } from './conflicts';
import { SCHEDULE_CONFIG } from '@/lib/constants';

// ── Types ───────────────────────────────────────────────────────────────────

export interface OptimizationConfig {
  energyLevels: {
    morning: number;   // 6-12: 0.8 (moderate after waking)
    midday: number;    // 12-14: 0.5 (post-lunch dip)
    afternoon: number; // 14-18: 0.9 (peak)
    evening: number;   // 18-22: 0.7 (winding down)
  };
  preferDeepWorkMorning: boolean;
  preferExerciseAfterLunch: boolean;
}

interface ScoredBlock {
  block: TimeBlock;
  idealStartMinutes: number;
  priority: number;
}

// ── Defaults ────────────────────────────────────────────────────────────────

const DEFAULT_CONFIG: OptimizationConfig = {
  energyLevels: {
    morning: 0.8,
    midday: 0.5,
    afternoon: 0.9,
    evening: 0.7,
  },
  preferDeepWorkMorning: true,
  preferExerciseAfterLunch: true,
};

// ── Helpers ─────────────────────────────────────────────────────────────────

function uuid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getEnergyForTime(minutes: number, config: OptimizationConfig): number {
  const hours = minutes / 60;
  if (hours < 12) return config.energyLevels.morning;
  if (hours < 14) return config.energyLevels.midday;
  if (hours < 18) return config.energyLevels.afternoon;
  return config.energyLevels.evening;
}

/**
 * Calculate the ideal start time for a flexible block based on heuristic rules.
 *
 * Rules:
 * 1. Classes are fixed -- never move
 * 2. Gym/swim prefer post-lunch slot (1-3 PM)
 * 3. Study blocks go after their related class (if OOP at 8:30, study OOP at 2:30)
 * 4. High-priority project tasks go in afternoon peak (2-6 PM)
 * 5. Low-energy tasks (emails, reading) go in evening
 * 6. Always keep 15 min buffer between blocks
 * 7. Respect sleep boundaries (no blocks after 10 PM)
 */
function getIdealTime(block: TimeBlock, fixedBlocks: TimeBlock[]): number {
  switch (block.type) {
    case 'gym':
    case 'swim':
      // Rule 2: Prefer post-lunch (1 PM - 3 PM)
      return 13 * 60; // 1:00 PM

    case 'study': {
      // Rule 3: After related class if possible
      const subjectMatch = block.title.toLowerCase();
      const relatedClass = fixedBlocks.find(
        (fb) =>
          fb.type === 'class' &&
          (subjectMatch.includes(fb.title.toLowerCase().split(' ')[0]) ||
            fb.title.toLowerCase().includes(subjectMatch.replace('study:', '').trim().split(' ')[0]))
      );
      if (relatedClass) {
        // Schedule 30 min after class ends
        return relatedClass.endMinutes + 30;
      }
      // Default: afternoon study (2:30 PM)
      return 14 * 60 + 30;
    }

    case 'project': {
      // Rule 4: High-priority projects in afternoon peak (2-6 PM)
      const priority = (block.meta?.priority as number) ?? 3;
      if (priority <= 2) return 14 * 60; // 2:00 PM for high priority
      return 16 * 60; // 4:00 PM for lower priority
    }

    case 'task': {
      // Rule 5: Low-energy tasks in evening
      return 18 * 60; // 6:00 PM
    }

    default:
      return 12 * 60; // noon
  }
}

// ── Main Optimizer ──────────────────────────────────────────────────────────

/**
 * Optimize a day's schedule by rearranging flexible blocks into ideal time slots.
 *
 * Algorithm:
 * 1. Separate fixed blocks (classes) from flexible blocks
 * 2. Calculate ideal time for each flexible block
 * 3. Sort flexible blocks by priority (exercise > study > project > task)
 * 4. Greedily place each block into the best available gap
 * 5. Ensure 15-min buffer between all blocks
 * 6. Respect no-work-after boundary (10 PM)
 */
export function optimizeSchedule(
  fixedBlocks: TimeBlock[],
  flexibleBlocks: TimeBlock[],
  tasks: Task[],
  config?: Partial<OptimizationConfig>
): TimeBlock[] {
  const cfg: OptimizationConfig = { ...DEFAULT_CONFIG, ...config };

  // Sort fixed blocks by time
  const sorted = [...fixedBlocks].sort((a, b) => a.startMinutes - b.startMinutes);

  // Score and sort flexible blocks
  const scored: ScoredBlock[] = flexibleBlocks.map((block) => {
    const idealStart = getIdealTime(block, sorted);

    // Priority ordering: gym/swim=4, study=3, project=2, task=1
    let priority = 1;
    if (block.type === 'gym' || block.type === 'swim') priority = 4;
    else if (block.type === 'study') priority = 3;
    else if (block.type === 'project') priority = 2;

    return { block, idealStartMinutes: idealStart, priority };
  });

  // Sort by priority descending, then by ideal time
  scored.sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return a.idealStartMinutes - b.idealStartMinutes;
  });

  // Place blocks greedily
  const placed: TimeBlock[] = [...sorted]; // Start with fixed blocks
  const result: TimeBlock[] = [];
  const buffer = SCHEDULE_CONFIG.breakBetweenMinutes;
  const noWorkAfter = SCHEDULE_CONFIG.noWorkAfterMinutes;

  for (const { block, idealStartMinutes } of scored) {
    const duration = block.endMinutes - block.startMinutes;

    // Find all gaps given currently placed blocks
    const dayBlocks = placed
      .filter((b) => b.date === block.date)
      .sort((a, b) => a.startMinutes - b.startMinutes);

    const gaps = findGaps(dayBlocks, SCHEDULE_CONFIG.dayStartMinutes, noWorkAfter);

    // Find the best gap closest to the ideal time
    let bestStart: number | null = null;
    let bestDistance = Infinity;

    for (const gap of gaps) {
      const effectiveStart = gap.startMinutes + (dayBlocks.length > 0 ? buffer : 0);
      const effectiveEnd = gap.endMinutes;
      const available = effectiveEnd - effectiveStart;

      if (available < duration) continue;

      // Try placing at ideal time within this gap
      let candidateStart: number;
      if (idealStartMinutes >= effectiveStart && idealStartMinutes + duration <= effectiveEnd) {
        candidateStart = idealStartMinutes;
      } else if (idealStartMinutes < effectiveStart) {
        candidateStart = effectiveStart;
      } else {
        candidateStart = effectiveEnd - duration;
      }

      // Ensure buffer from previous block end
      const prevBlock = dayBlocks.filter((b) => b.endMinutes <= candidateStart).pop();
      if (prevBlock && candidateStart - prevBlock.endMinutes < buffer) {
        candidateStart = prevBlock.endMinutes + buffer;
      }

      if (candidateStart + duration > effectiveEnd) continue;

      const distance = Math.abs(candidateStart - idealStartMinutes);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestStart = candidateStart;
      }
    }

    if (bestStart !== null) {
      const optimizedBlock: TimeBlock = {
        ...block,
        startMinutes: bestStart,
        endMinutes: bestStart + duration,
      };
      result.push(optimizedBlock);
      placed.push(optimizedBlock);
    } else {
      // Could not fit -- keep original time
      result.push(block);
      placed.push(block);
    }
  }

  // Also convert pending tasks into blocks if there is remaining space
  const eligibleTasks = tasks
    .filter((t) => t.status === 'todo' || t.status === 'in_progress')
    .sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

  for (const task of eligibleTasks) {
    if (!task.estimated_minutes || task.estimated_minutes < SCHEDULE_CONFIG.minSlotMinutes) continue;

    const dayBlocks = placed
      .filter((b) => b.date === fixedBlocks[0]?.date || b.date === flexibleBlocks[0]?.date)
      .sort((a, b) => a.startMinutes - b.startMinutes);

    const date = fixedBlocks[0]?.date || flexibleBlocks[0]?.date;
    if (!date) break;

    const gaps = findGaps(dayBlocks, SCHEDULE_CONFIG.dayStartMinutes, noWorkAfter);

    for (const gap of gaps) {
      const effectiveStart = gap.startMinutes + buffer;
      const available = gap.endMinutes - effectiveStart;

      if (available >= task.estimated_minutes) {
        // Place task with ideal time based on priority
        const idealStart = task.priority === 'critical' || task.priority === 'high'
          ? 14 * 60 // 2 PM for high priority
          : 18 * 60; // 6 PM for low priority

        let start = Math.max(effectiveStart, Math.min(idealStart, gap.endMinutes - task.estimated_minutes));
        if (start + task.estimated_minutes > gap.endMinutes) {
          start = effectiveStart;
        }

        const taskBlock: TimeBlock = {
          id: `opt-task-${task.id}`,
          type: 'task',
          title: task.title,
          date,
          startMinutes: start,
          endMinutes: start + task.estimated_minutes,
          color: '#EAB308',
          meta: { taskId: task.id, priority: task.priority },
        };
        result.push(taskBlock);
        placed.push(taskBlock);
        break;
      }
    }
  }

  return result;
}

/**
 * Generate a human-readable summary of the changes made during optimization.
 */
export function generateOptimizationSummary(
  originalBlocks: TimeBlock[],
  optimizedBlocks: TimeBlock[]
): string[] {
  const changes: string[] = [];

  for (const opt of optimizedBlocks) {
    const original = originalBlocks.find((b) => b.id === opt.id);
    if (!original) {
      // New block added (from tasks)
      const h = Math.floor(opt.startMinutes / 60);
      const m = opt.startMinutes % 60;
      const period = h >= 12 ? 'PM' : 'AM';
      const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
      changes.push(`Added ${opt.title} at ${displayH}:${String(m).padStart(2, '0')} ${period}`);
      continue;
    }

    if (original.startMinutes !== opt.startMinutes) {
      const h = Math.floor(opt.startMinutes / 60);
      const m = opt.startMinutes % 60;
      const period = h >= 12 ? 'PM' : 'AM';
      const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
      changes.push(`Moved ${opt.title} to ${displayH}:${String(m).padStart(2, '0')} ${period}`);
    }
  }

  return changes;
}
