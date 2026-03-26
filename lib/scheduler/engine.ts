import type { TimeBlock, Gap, ScheduleConfig } from './types';
import { findGaps } from './conflicts';
import { SCHEDULE_CONFIG } from '@/lib/constants';
import type { Task, Project, ScheduledSlot } from '@/types/schedule';

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Generate a v4-style UUID. Works in browsers and Node 19+. */
function uuid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback: RFC-4122 v4 via getRandomValues
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Convert minutes-from-midnight to HH:MM:SS string. */
function minutesToTimeString(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
}

// ── Task Scoring ────────────────────────────────────────────────────────────

const PRIORITY_WEIGHTS: Record<Task['priority'], number> = {
  critical: 100,
  high: 75,
  medium: 50,
  low: 25,
};

/**
 * Calculate a priority score for a task.
 * Higher score = should be scheduled first.
 *
 * Components:
 *   1. Task priority weight   (25-100)
 *   2. Project priority weight (20-100, P1 highest)
 *   3. Urgency bonus from due date (0-50)
 */
export function taskScore(task: Task, project: Project): number {
  const taskWeight = PRIORITY_WEIGHTS[task.priority];
  const projectWeight = (6 - project.priority) * 20; // P1=100, P2=80, P3=60, P4=40, P5=20

  let urgencyBonus = 0;
  if (task.due_date) {
    const daysUntil = Math.ceil(
      (new Date(task.due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );
    urgencyBonus = Math.max(0, 50 - daysUntil * 5);
  }

  return taskWeight + projectWeight + urgencyBonus;
}

// ── Auto-Scheduler ──────────────────────────────────────────────────────────

interface AutoScheduleParams {
  fixedBlocks: TimeBlock[];
  tasks: Task[];
  projects: Project[];
  /** Seven ISO date strings, Monday first: ['2026-03-23', ...] */
  weekDates: string[];
  existingSlots?: ScheduledSlot[];
  config?: Partial<ScheduleConfig>;
}

/**
 * Generate auto-scheduled slots for a week.
 *
 * Algorithm
 * ─────────
 * 1. Build a merged config from defaults + caller overrides.
 * 2. Group fixed blocks by date.
 * 3. For each date, find the free gaps between fixed blocks.
 * 4. Rank eligible tasks by `taskScore` (descending).
 * 5. Walk tasks in score order; for each task walk gaps chronologically.
 * 6. Fit the task (or a slice of it) into the first gap that is large enough
 *    after subtracting the break buffer.
 * 7. Respect per-project weekly hour caps.
 * 8. Return the generated `ScheduledSlot[]`.
 */
export function autoSchedule(params: AutoScheduleParams): ScheduledSlot[] {
  const {
    fixedBlocks,
    tasks,
    projects,
    weekDates,
    existingSlots = [],
    config: configOverrides = {},
  } = params;

  // ── 1. Merge config ───────────────────────────────────────────────────────
  const config: ScheduleConfig = {
    dayStartMinutes: SCHEDULE_CONFIG.dayStartMinutes,
    dayEndMinutes: SCHEDULE_CONFIG.dayEndMinutes,
    noWorkAfterMinutes: SCHEDULE_CONFIG.noWorkAfterMinutes,
    minSlotMinutes: SCHEDULE_CONFIG.minSlotMinutes,
    breakBetweenMinutes: SCHEDULE_CONFIG.breakBetweenMinutes,
    ...configOverrides,
  };

  // ── 2. Group fixed blocks by date ─────────────────────────────────────────
  const blocksByDate = new Map<string, TimeBlock[]>();
  for (const date of weekDates) {
    blocksByDate.set(date, []);
  }
  for (const block of fixedBlocks) {
    const list = blocksByDate.get(block.date);
    if (list) {
      list.push(block);
    }
  }

  // ── 3. Build gaps for every day of the week ───────────────────────────────
  interface DayGap extends Gap {
    /** Remaining free minutes in this gap (shrinks as we schedule) */
    remaining: number;
    /** Current start cursor (advances as we fill from the left) */
    cursor: number;
  }

  const allGaps: DayGap[] = [];

  for (const date of weekDates) {
    const dayBlocks = blocksByDate.get(date) ?? [];
    // Sort so findGaps works correctly
    dayBlocks.sort((a, b) => a.startMinutes - b.startMinutes);

    const rawGaps = findGaps(dayBlocks, config.dayStartMinutes, config.noWorkAfterMinutes);
    for (const g of rawGaps) {
      // Assign the date (findGaps returns '' for empty input)
      allGaps.push({
        ...g,
        date,
        remaining: g.durationMinutes,
        cursor: g.startMinutes,
      });
    }
  }

  // Sort gaps chronologically (date then start time)
  allGaps.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.startMinutes - b.startMinutes;
  });

  // ── 4. Build project lookup and hour tracking ─────────────────────────────
  const projectMap = new Map<string, Project>();
  for (const p of projects) {
    projectMap.set(p.id, p);
  }

  // Track how many minutes we have already scheduled per project this week,
  // including any pre-existing slots that were passed in.
  const weeklyMinutesUsed = new Map<string, number>();
  for (const slot of existingSlots) {
    if (slot.project_id) {
      const [sh, sm] = slot.start_time.split(':').map(Number);
      const [eh, em] = slot.end_time.split(':').map(Number);
      const duration = (eh * 60 + em) - (sh * 60 + sm);
      weeklyMinutesUsed.set(
        slot.project_id,
        (weeklyMinutesUsed.get(slot.project_id) ?? 0) + duration,
      );
    }
  }

  // ── 5. Score and sort tasks ───────────────────────────────────────────────
  // Only consider tasks that are not done / not blocked
  const eligibleTasks = tasks.filter(
    (t) => t.status === 'todo' || t.status === 'in_progress',
  );

  // Create a placeholder project for tasks that don't belong to any project
  const noProject: Project = {
    id: '__none__',
    user_id: '',
    name: 'No Project',
    short_name: 'NP',
    description: '',
    priority: 3,
    color: '#71717A',
    weekly_hours: 999,
    tech_stack: '',
    status: 'active',
    created_at: '',
    updated_at: '',
  };

  const scoredTasks = eligibleTasks
    .map((task) => {
      const project = task.project_id
        ? projectMap.get(task.project_id) ?? noProject
        : noProject;
      return { task, project, score: taskScore(task, project) };
    })
    .sort((a, b) => b.score - a.score);

  // Track remaining minutes for each task (allows splitting across gaps)
  const taskRemainingMinutes = new Map<string, number>();
  for (const { task } of scoredTasks) {
    taskRemainingMinutes.set(task.id, task.estimated_minutes);
  }

  // ── 6. Fill gaps ──────────────────────────────────────────────────────────
  const newSlots: ScheduledSlot[] = [];

  for (const { task, project } of scoredTasks) {
    let remaining = taskRemainingMinutes.get(task.id) ?? 0;
    if (remaining <= 0) continue;

    for (const gap of allGaps) {
      if (remaining <= 0) break;

      // Usable space in this gap, minus the break buffer
      const usable = gap.remaining - config.breakBetweenMinutes;
      if (usable < config.minSlotMinutes) continue;

      // Check project weekly hour cap
      const projectId = project.id === '__none__' ? null : project.id;
      if (projectId) {
        const usedMinutes = weeklyMinutesUsed.get(projectId) ?? 0;
        const capMinutes = project.weekly_hours * 60;
        if (usedMinutes >= capMinutes) continue;

        // Don't schedule more than the remaining cap allows
        const capRemaining = capMinutes - usedMinutes;
        const slotDuration = Math.min(remaining, usable, capRemaining);
        if (slotDuration < config.minSlotMinutes) continue;

        const slotStart = gap.cursor;
        const slotEnd = slotStart + slotDuration;

        newSlots.push({
          id: uuid(),
          user_id: '',
          task_id: task.id,
          project_id: projectId,
          title: task.title,
          slot_date: gap.date,
          start_time: minutesToTimeString(slotStart),
          end_time: minutesToTimeString(slotEnd),
          slot_type: 'auto',
          status: 'scheduled',
        });

        // Update tracking
        gap.cursor = slotEnd + config.breakBetweenMinutes;
        gap.remaining = gap.endMinutes - gap.cursor;
        remaining -= slotDuration;
        taskRemainingMinutes.set(task.id, remaining);
        weeklyMinutesUsed.set(
          projectId,
          (weeklyMinutesUsed.get(projectId) ?? 0) + slotDuration,
        );
      } else {
        // Task without a project -- no weekly cap
        const slotDuration = Math.min(remaining, usable);
        if (slotDuration < config.minSlotMinutes) continue;

        const slotStart = gap.cursor;
        const slotEnd = slotStart + slotDuration;

        newSlots.push({
          id: uuid(),
          user_id: '',
          task_id: task.id,
          project_id: null,
          title: task.title,
          slot_date: gap.date,
          start_time: minutesToTimeString(slotStart),
          end_time: minutesToTimeString(slotEnd),
          slot_type: 'auto',
          status: 'scheduled',
        });

        gap.cursor = slotEnd + config.breakBetweenMinutes;
        gap.remaining = gap.endMinutes - gap.cursor;
        remaining -= slotDuration;
        taskRemainingMinutes.set(task.id, remaining);
      }
    }
  }

  return newSlots;
}
