import { NextResponse } from 'next/server';

/**
 * Weekly cron handler - triggered every Sunday at 8:00 AM UTC.
 * Placeholder for future weekly refresh logic (e.g., pre-fetching
 * next week's timetable, sending push notifications, etc.).
 */
export async function GET() {
  try {
    // TODO: Implement weekly refresh logic
    // - Pre-fetch next week's timetable for all active users
    // - Send weekly summary push notifications
    // - Clean up expired scheduled slots

    return NextResponse.json(
      { ok: true, message: 'Cron executed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Cron error:', error);
    return NextResponse.json(
      { ok: false, error: 'Cron execution failed' },
      { status: 500 }
    );
  }
}
