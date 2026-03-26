import { NextRequest, NextResponse } from 'next/server';
import { fetchTimetable } from '@/lib/timetable/fetcher';
import { DEFAULT_INTAKE } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const intake = request.nextUrl.searchParams.get('intake') || DEFAULT_INTAKE;

    const entries = await fetchTimetable(intake);

    return NextResponse.json(entries, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800',
      },
    });
  } catch (error) {
    console.error('Timetable fetch error:', error);

    return NextResponse.json(
      { error: 'Failed to fetch timetable data' },
      { status: 500 }
    );
  }
}
