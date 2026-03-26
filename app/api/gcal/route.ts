import { NextRequest, NextResponse } from 'next/server';
import { fetchTimetable } from '@/lib/timetable/fetcher';
import { DEFAULT_INTAKE, TIMEZONE } from '@/lib/constants';
import {
  DEFAULT_LIFESTYLE_BLOCKS,
  DEFAULT_STUDY_BLOCKS,
  DEFAULT_PROJECTS,
} from '@/lib/scheduler/defaults';

export const dynamic = 'force-dynamic';

// ── ICS Helpers ─────────────────────────────────────────────────────────────

const UTC_OFFSET = '+0800';
const STUDENT_NAME = 'Abdul Wahid';

function formatICSDatetime(date: Date): string {
  const y = date.getFullYear();
  const mo = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const mi = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${y}${mo}${d}T${h}${mi}${s}`;
}

function nowUTC(): string {
  const now = new Date();
  return now.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
}

function hashUID(seed: string): string {
  // Simple deterministic hash for UID generation
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
}

function escapeICS(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

// ── VEVENT Generators ───────────────────────────────────────────────────────

function generateClassEvents(classes: Array<{
  TIME_FROM_ISO: string;
  TIME_TO_ISO: string;
  MODULE_NAME?: string;
  ROOM?: string;
  NAME?: string;
  MODID?: string;
  CLASS_CODE?: string;
  COLOR?: string;
  INTAKE: string;
}>): string[] {
  const events: string[] = [];
  const stamp = nowUTC();

  for (const c of classes) {
    try {
      const dtStart = new Date(c.TIME_FROM_ISO);
      const dtEnd = new Date(c.TIME_TO_ISO);
      const module = c.MODULE_NAME || 'Class';
      const room = c.ROOM || 'TBA';
      const lecturer = (c.NAME || 'TBA').trim();
      const modid = c.MODID || '';
      const classCode = c.CLASS_CODE || '';
      const uid = hashUID(`${classCode}_${c.TIME_FROM_ISO}`);

      events.push(
        [
          'BEGIN:VEVENT',
          `UID:${uid}@flowday-class`,
          `DTSTAMP:${stamp}`,
          `DTSTART;TZID=${TIMEZONE}:${formatICSDatetime(dtStart)}`,
          `DTEND;TZID=${TIMEZONE}:${formatICSDatetime(dtEnd)}`,
          `SUMMARY:${escapeICS(module)}`,
          `LOCATION:${escapeICS(room)}`,
          `DESCRIPTION:Lecturer: ${escapeICS(lecturer)}\\nModule: ${escapeICS(modid)}\\nRoom: ${escapeICS(room)}`,
          'CATEGORIES:APU Class',
          'STATUS:CONFIRMED',
          'BEGIN:VALARM',
          'TRIGGER:-PT15M',
          'ACTION:DISPLAY',
          `DESCRIPTION:Class in 15 min: ${escapeICS(module)} at ${escapeICS(room)}`,
          'END:VALARM',
          'END:VEVENT',
        ].join('\r\n')
      );
    } catch {
      // Skip malformed entries
    }
  }

  return events;
}

function generateRecurringEvents(
  blocks: Array<{
    name: string;
    category: string;
    day_of_week: number;
    start_hour: number;
    start_minute: number;
    duration_minutes: number;
    location: string;
    color: string;
    is_active: boolean;
  }>,
  startDate: Date,
  endDate: Date,
  uidSuffix: string,
  categoryLabel: string
): string[] {
  const events: string[] = [];
  const stamp = nowUTC();

  // Align to Monday
  const current = new Date(startDate);
  current.setDate(current.getDate() - current.getDay() + (current.getDay() === 0 ? -6 : 1));
  current.setHours(0, 0, 0, 0);

  const endTime = new Date(endDate);
  endTime.setDate(endTime.getDate() + 7);

  while (current <= endTime) {
    for (const block of blocks) {
      if (!block.is_active) continue;

      const eventDate = new Date(current);
      eventDate.setDate(eventDate.getDate() + block.day_of_week);

      if (eventDate < startDate || eventDate > endTime) continue;

      const evStart = new Date(eventDate);
      evStart.setHours(block.start_hour, block.start_minute, 0, 0);

      const evEnd = new Date(evStart);
      evEnd.setMinutes(evEnd.getMinutes() + block.duration_minutes);

      const uid = hashUID(
        `${block.name}_${eventDate.toISOString().slice(0, 10)}_${block.start_hour}${block.start_minute}`
      );

      events.push(
        [
          'BEGIN:VEVENT',
          `UID:${uid}@flowday-${uidSuffix}`,
          `DTSTAMP:${stamp}`,
          `DTSTART;TZID=${TIMEZONE}:${formatICSDatetime(evStart)}`,
          `DTEND;TZID=${TIMEZONE}:${formatICSDatetime(evEnd)}`,
          `SUMMARY:${escapeICS(block.name)}`,
          `LOCATION:${escapeICS(block.location)}`,
          `DESCRIPTION:${escapeICS(block.name)}`,
          `CATEGORIES:${categoryLabel}`,
          'TRANSP:OPAQUE',
          'STATUS:CONFIRMED',
          'BEGIN:VALARM',
          'TRIGGER:-PT10M',
          'ACTION:DISPLAY',
          `DESCRIPTION:Starting soon: ${escapeICS(block.name)}`,
          'END:VALARM',
          'END:VEVENT',
        ].join('\r\n')
      );
    }

    current.setDate(current.getDate() + 7);
  }

  return events;
}

function generateSleepEvents(startDate: Date, endDate: Date): string[] {
  const events: string[] = [];
  const stamp = nowUTC();
  const current = new Date(startDate);
  current.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setDate(end.getDate() + 1);

  while (current <= end) {
    const sleepStart = new Date(current);
    sleepStart.setHours(23, 0, 0, 0);

    const sleepEnd = new Date(current);
    sleepEnd.setDate(sleepEnd.getDate() + 1);
    sleepEnd.setHours(6, 0, 0, 0);

    const uid = hashUID(`sleep_${current.toISOString().slice(0, 10)}`);

    events.push(
      [
        'BEGIN:VEVENT',
        `UID:${uid}@flowday-sleep`,
        `DTSTAMP:${stamp}`,
        `DTSTART;TZID=${TIMEZONE}:${formatICSDatetime(sleepStart)}`,
        `DTEND;TZID=${TIMEZONE}:${formatICSDatetime(sleepEnd)}`,
        'SUMMARY:Sleep',
        'DESCRIPTION:7 hours sleep - non-negotiable',
        'CATEGORIES:Sleep',
        'TRANSP:OPAQUE',
        'STATUS:CONFIRMED',
        'END:VEVENT',
      ].join('\r\n')
    );

    current.setDate(current.getDate() + 1);
  }

  return events;
}

function generateProjectBlockEvents(startDate: Date, endDate: Date): string[] {
  // Convert project definitions from apu_autosync.py into recurring blocks
  const projectBlocks = [
    // GameVault [P1] - 8 hrs/week
    { name: 'GameVault [P1]', category: 'project', day_of_week: 0, start_hour: 14, start_minute: 0, duration_minutes: 120, location: '', color: '#EF4444', is_active: true },
    { name: 'GameVault [P1]', category: 'project', day_of_week: 0, start_hour: 16, start_minute: 0, duration_minutes: 120, location: '', color: '#EF4444', is_active: true },
    { name: 'GameVault [P1]', category: 'project', day_of_week: 5, start_hour: 13, start_minute: 0, duration_minutes: 120, location: '', color: '#EF4444', is_active: true },
    { name: 'GameVault [P1]', category: 'project', day_of_week: 5, start_hour: 15, start_minute: 0, duration_minutes: 120, location: '', color: '#EF4444', is_active: true },
    // Geointel [P2] - 6 hrs/week
    { name: 'Geointel [P2]', category: 'project', day_of_week: 4, start_hour: 18, start_minute: 0, duration_minutes: 120, location: '', color: '#3B82F6', is_active: true },
    { name: 'Geointel [P2]', category: 'project', day_of_week: 6, start_hour: 13, start_minute: 0, duration_minutes: 120, location: '', color: '#3B82F6', is_active: true },
    { name: 'Geointel [P2]', category: 'project', day_of_week: 6, start_hour: 15, start_minute: 0, duration_minutes: 120, location: '', color: '#3B82F6', is_active: true },
    // Restaurant POS [P3] - 4 hrs/week
    { name: 'Restaurant POS [P3]', category: 'project', day_of_week: 5, start_hour: 17, start_minute: 0, duration_minutes: 120, location: '', color: '#22C55E', is_active: true },
    { name: 'Restaurant POS [P3]', category: 'project', day_of_week: 6, start_hour: 17, start_minute: 0, duration_minutes: 120, location: '', color: '#22C55E', is_active: true },
    // T Trades [P4] - 2 hrs/week
    { name: 'T Trades [P4]', category: 'project', day_of_week: 1, start_hour: 18, start_minute: 0, duration_minutes: 120, location: '', color: '#8B5CF6', is_active: true },
    // TerrorFundingMonitor [P5] - 2 hrs/week
    { name: 'TerrorFundingMonitor [P5]', category: 'project', day_of_week: 2, start_hour: 18, start_minute: 0, duration_minutes: 120, location: '', color: '#F97316', is_active: true },
  ];

  return generateRecurringEvents(projectBlocks, startDate, endDate, 'project', 'Project');
}

// ── ICS Assembly ────────────────────────────────────────────────────────────

function buildICS(allEvents: string[]): string {
  const header = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//FlowDay//${STUDENT_NAME}//EN`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:FlowDay - ${STUDENT_NAME}`,
    `X-WR-TIMEZONE:${TIMEZONE}`,
    'BEGIN:VTIMEZONE',
    `TZID:${TIMEZONE}`,
    'BEGIN:STANDARD',
    'DTSTART:19700101T000000',
    `TZOFFSETFROM:${UTC_OFFSET}`,
    `TZOFFSETTO:${UTC_OFFSET}`,
    'END:STANDARD',
    'END:VTIMEZONE',
  ];

  const footer = ['END:VCALENDAR'];

  let content = header.join('\r\n') + '\r\n';
  content += allEvents.join('\r\n') + '\r\n';
  content += footer.join('\r\n');

  return content;
}

// ── Route Handler ───────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const intake = request.nextUrl.searchParams.get('intake') || DEFAULT_INTAKE;

    // Fetch classes from APU API
    const classes = await fetchTimetable(intake);

    // Determine date range from classes
    let startDate = new Date();
    let endDate = new Date();
    endDate.setDate(endDate.getDate() + 21);

    if (classes.length > 0) {
      const dates = classes
        .map((c) => c.DATESTAMP_ISO)
        .filter(Boolean)
        .map((d) => new Date(d));

      if (dates.length > 0) {
        startDate = new Date(Math.min(...dates.map((d) => d.getTime())));
        endDate = new Date(Math.max(...dates.map((d) => d.getTime())));
      }
    }

    // Generate all events
    const classEvents = generateClassEvents(classes);

    const lifestyleEvents = generateRecurringEvents(
      DEFAULT_LIFESTYLE_BLOCKS,
      startDate,
      endDate,
      'lifestyle',
      'Lifestyle'
    );

    const studyEvents = generateRecurringEvents(
      DEFAULT_STUDY_BLOCKS,
      startDate,
      endDate,
      'study',
      'Study'
    );

    const sleepEvents = generateSleepEvents(startDate, endDate);
    const projectEvents = generateProjectBlockEvents(startDate, endDate);

    // Build full ICS
    const allEvents = [
      ...classEvents,
      ...lifestyleEvents,
      ...studyEvents,
      ...sleepEvents,
      ...projectEvents,
    ];

    const icsContent = buildICS(allEvents);

    return new NextResponse(icsContent, {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="flowday-${intake}.ics"`,
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800',
      },
    });
  } catch (error) {
    console.error('ICS generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate calendar feed' },
      { status: 500 }
    );
  }
}
