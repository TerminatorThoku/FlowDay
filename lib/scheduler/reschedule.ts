import type { TimeBlock } from '@/types/schedule';
import { blocksOverlap, findGaps } from './conflicts';
import { SCHEDULE_CONFIG } from '@/lib/constants';
import { format, addDays, parseISO } from 'date-fns';

// ── Helpers ─────────────────────────────────────────────────────────────────

function formatMinutes(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayH}:${m.toString().padStart(2, '0')} ${period}`;
}

function formatDateLabel(dateStr: string): string {
  const date = parseISO(dateStr);
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  const tomorrowStr = format(addDays(today, 1), 'yyyy-MM-dd');

  if (dateStr === todayStr) return 'Today';
  if (dateStr === tomorrowStr) return 'Tomorrow';
  return format(date, 'EEE, MMM d');
}

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Check if a block can be moved to a new time without conflicts.
 */
export function canReschedule(
  block: TimeBlock,
  newStartMinutes: number,
  newDate: string,
  existingBlocks: TimeBlock[]
): { canMove: boolean; conflicts: TimeBlock[] } {
  const duration = block.endMinutes - block.startMinutes;
  const newEndMinutes = newStartMinutes + duration;

  // Cannot schedule outside day boundaries
  if (newStartMinutes < SCHEDULE_CONFIG.dayStartMinutes || newEndMinutes > SCHEDULE_CONFIG.dayEndMinutes) {
    return { canMove: false, conflicts: [] };
  }

  // Cannot schedule after no-work cutoff
  if (newEndMinutes > SCHEDULE_CONFIG.noWorkAfterMinutes) {
    return { canMove: false, conflicts: [] };
  }

  const movedBlock: TimeBlock = {
    ...block,
    date: newDate,
    startMinutes: newStartMinutes,
    endMinutes: newEndMinutes,
  };

  // Filter out the original block from existing blocks
  const otherBlocks = existingBlocks.filter((b) => b.id !== block.id);

  const conflicts = otherBlocks.filter((b) => blocksOverlap(movedBlock, b));

  return {
    canMove: conflicts.length === 0,
    conflicts,
  };
}

/**
 * Find the next available slot for a given duration.
 */
export function findNextAvailableSlot(
  date: string,
  durationMinutes: number,
  existingBlocks: TimeBlock[],
  afterMinutes: number = SCHEDULE_CONFIG.dayStartMinutes
): { startMinutes: number; endMinutes: number } | null {
  const dayBlocks = existingBlocks
    .filter((b) => b.date === date)
    .sort((a, b) => a.startMinutes - b.startMinutes);

  const gaps = findGaps(dayBlocks, afterMinutes, SCHEDULE_CONFIG.noWorkAfterMinutes);

  for (const gap of gaps) {
    // Apply break buffer
    const effectiveStart = gap.startMinutes + SCHEDULE_CONFIG.breakBetweenMinutes;
    const availableDuration = gap.endMinutes - effectiveStart;

    if (availableDuration >= durationMinutes) {
      return {
        startMinutes: effectiveStart,
        endMinutes: effectiveStart + durationMinutes,
      };
    }
  }

  return null;
}

/**
 * When a block is skipped, suggest alternative reschedule options.
 */
export function suggestRescheduleOptions(
  block: TimeBlock,
  weekBlocks: TimeBlock[],
  maxSuggestions: number = 3
): { date: string; startMinutes: number; endMinutes: number; label: string }[] {
  const duration = block.endMinutes - block.startMinutes;
  const suggestions: { date: string; startMinutes: number; endMinutes: number; label: string }[] = [];

  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  const currentMinutes = today.getHours() * 60 + today.getMinutes();

  // Try today first (after current time)
  const todaySlot = findNextAvailableSlot(
    todayStr,
    duration,
    weekBlocks,
    Math.max(currentMinutes + 15, SCHEDULE_CONFIG.dayStartMinutes)
  );

  if (todaySlot) {
    suggestions.push({
      date: todayStr,
      ...todaySlot,
      label: `${formatDateLabel(todayStr)} ${formatMinutes(todaySlot.startMinutes)} - ${formatMinutes(todaySlot.endMinutes)}`,
    });
  }

  // Try next 6 days
  for (let i = 1; i <= 6 && suggestions.length < maxSuggestions; i++) {
    const dateStr = format(addDays(today, i), 'yyyy-MM-dd');
    const slot = findNextAvailableSlot(dateStr, duration, weekBlocks);

    if (slot) {
      suggestions.push({
        date: dateStr,
        ...slot,
        label: `${formatDateLabel(dateStr)} ${formatMinutes(slot.startMinutes)} - ${formatMinutes(slot.endMinutes)}`,
      });
    }
  }

  return suggestions.slice(0, maxSuggestions);
}
