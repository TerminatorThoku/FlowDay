import type { TimeBlock, Gap } from './types';

/**
 * Check if two time blocks overlap on the same date.
 * Two blocks overlap if one starts before the other ends and vice versa.
 */
export function blocksOverlap(a: TimeBlock, b: TimeBlock): boolean {
  if (a.date !== b.date) return false;
  return a.startMinutes < b.endMinutes && b.startMinutes < a.endMinutes;
}

/**
 * Merge overlapping blocks on the same date into continuous ranges.
 * Returns a new array of merged blocks sorted by startMinutes.
 * Merged blocks take the properties of the earlier block.
 */
export function mergeOverlapping(blocks: TimeBlock[]): TimeBlock[] {
  if (blocks.length === 0) return [];

  const sorted = [...blocks].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.startMinutes - b.startMinutes;
  });

  const merged: TimeBlock[] = [{ ...sorted[0] }];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const last = merged[merged.length - 1];

    if (current.date === last.date && current.startMinutes <= last.endMinutes) {
      // Overlapping or adjacent on the same date -- extend the end if needed
      last.endMinutes = Math.max(last.endMinutes, current.endMinutes);
    } else {
      merged.push({ ...current });
    }
  }

  return merged;
}

/**
 * Find free gaps between occupied blocks for a single day.
 *
 * @param blocks - All time blocks for the day (will be sorted internally)
 * @param dayStart - Start of schedulable window in minutes from midnight
 * @param dayEnd - End of schedulable window in minutes from midnight
 * @returns Array of Gap objects representing free time
 */
export function findGaps(
  blocks: TimeBlock[],
  dayStart: number,
  dayEnd: number,
): Gap[] {
  if (blocks.length === 0) {
    const duration = dayEnd - dayStart;
    if (duration <= 0) return [];
    return [
      {
        date: '',
        startMinutes: dayStart,
        endMinutes: dayEnd,
        durationMinutes: duration,
      },
    ];
  }

  // Merge overlapping blocks first so we don't double-count occupied time
  const merged = mergeOverlapping(blocks);
  const date = merged[0].date;
  const gaps: Gap[] = [];

  // Gap before the first block
  if (merged[0].startMinutes > dayStart) {
    const start = dayStart;
    const end = merged[0].startMinutes;
    gaps.push({
      date,
      startMinutes: start,
      endMinutes: end,
      durationMinutes: end - start,
    });
  }

  // Gaps between consecutive blocks
  for (let i = 0; i < merged.length - 1; i++) {
    const gapStart = merged[i].endMinutes;
    const gapEnd = merged[i + 1].startMinutes;
    if (gapEnd > gapStart) {
      gaps.push({
        date,
        startMinutes: gapStart,
        endMinutes: gapEnd,
        durationMinutes: gapEnd - gapStart,
      });
    }
  }

  // Gap after the last block
  const lastEnd = merged[merged.length - 1].endMinutes;
  if (lastEnd < dayEnd) {
    gaps.push({
      date,
      startMinutes: lastEnd,
      endMinutes: dayEnd,
      durationMinutes: dayEnd - lastEnd,
    });
  }

  return gaps;
}
