import { APU_API_URL, DEFAULT_INTAKE } from '@/lib/constants';
import type { APUClassEntry } from '@/types/schedule';

/**
 * Fetch the weekly timetable from the APU S3 endpoint.
 * The endpoint returns a JSON array of all class entries across all intakes.
 * We filter by the given intake code to get only the relevant classes.
 */
export async function fetchTimetable(
  intake: string = DEFAULT_INTAKE
): Promise<APUClassEntry[]> {
  const response = await fetch(APU_API_URL, {
    headers: {
      Accept: 'application/json',
    },
    next: { revalidate: 3600 }, // cache for 1 hour in Next.js fetch cache
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch timetable: ${response.status} ${response.statusText}`
    );
  }

  const data: APUClassEntry[] = await response.json();

  // Filter entries by intake code (case-insensitive comparison)
  const filtered = data.filter(
    (entry) => entry.INTAKE.toUpperCase() === intake.toUpperCase()
  );

  return filtered;
}
