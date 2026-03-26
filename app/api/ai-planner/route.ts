import { NextRequest, NextResponse } from 'next/server';
import { optimizeSchedule, generateOptimizationSummary } from '@/lib/scheduler/optimizer';
import type { TimeBlock, Task } from '@/types/schedule';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, blocks, tasks } = body as {
      date: string;
      blocks: TimeBlock[];
      tasks: Task[];
    };

    if (!date || !blocks) {
      return NextResponse.json(
        { error: 'Missing required fields: date, blocks' },
        { status: 400 }
      );
    }

    // Separate fixed (classes) from flexible blocks
    const fixedBlocks = blocks.filter((b) => b.type === 'class' || b.type === 'sleep' || b.type === 'meal');
    const flexibleBlocks = blocks.filter(
      (b) => b.type !== 'class' && b.type !== 'sleep' && b.type !== 'meal' && b.type !== 'free'
    );

    // Run the heuristic optimizer
    const optimizedFlexible = optimizeSchedule(
      fixedBlocks,
      flexibleBlocks,
      tasks || []
    );

    // Merge fixed + optimized flexible blocks
    const optimizedSchedule = [...fixedBlocks, ...optimizedFlexible].sort(
      (a, b) => a.startMinutes - b.startMinutes
    );

    // Generate a summary of changes
    const allOriginal = [...fixedBlocks, ...flexibleBlocks];
    const summary = generateOptimizationSummary(allOriginal, optimizedFlexible);

    return NextResponse.json({
      blocks: optimizedSchedule,
      summary,
      optimizedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('AI planner error:', error);
    return NextResponse.json(
      { error: 'Failed to optimize schedule' },
      { status: 500 }
    );
  }
}
