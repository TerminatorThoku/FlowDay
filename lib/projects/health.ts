// ── Types ───────────────────────────────────────────────────────────────────

export interface ProjectHealth {
  projectId: string;
  projectName: string;
  score: number; // 0-100
  level: 'critical' | 'warning' | 'healthy' | 'thriving';
  breakdown: {
    tasksScore: number;    // 40% weight
    hoursScore: number;    // 30% weight
    commitsScore: number;  // 20% weight
    recencyScore: number;  // 10% weight
  };
}

// ── Weights ─────────────────────────────────────────────────────────────────

const WEIGHTS = {
  tasks: 0.4,
  hours: 0.3,
  commits: 0.2,
  recency: 0.1,
} as const;

// ── Level thresholds ────────────────────────────────────────────────────────

function getLevel(score: number): ProjectHealth['level'] {
  if (score < 30) return 'critical';
  if (score < 60) return 'warning';
  if (score < 85) return 'healthy';
  return 'thriving';
}

// ── Main Function ───────────────────────────────────────────────────────────

export function calculateProjectHealth(params: {
  projectId: string;
  projectName: string;
  tasksCompleted: number;
  tasksTotal: number;
  hoursWorked: number;
  hoursTarget: number;
  commitsThisWeek: number;
  daysSinceLastActivity: number;
}): ProjectHealth {
  const {
    projectId,
    projectName,
    tasksCompleted,
    tasksTotal,
    hoursWorked,
    hoursTarget,
    commitsThisWeek,
    daysSinceLastActivity,
  } = params;

  // ── Task Score (0-100) ─────────────────────────────────────────────────
  // Percentage of tasks completed
  const tasksScore = tasksTotal > 0
    ? Math.min(100, Math.round((tasksCompleted / tasksTotal) * 100))
    : 50; // No tasks = neutral

  // ── Hours Score (0-100) ────────────────────────────────────────────────
  // How close to the weekly hour target
  const hoursRatio = hoursTarget > 0 ? hoursWorked / hoursTarget : 0;
  const hoursScore = Math.min(100, Math.round(hoursRatio * 100));

  // ── Commits Score (0-100) ──────────────────────────────────────────────
  // 0 commits = 0, 1-2 = 40, 3-5 = 70, 6+ = 100
  let commitsScore: number;
  if (commitsThisWeek === 0) commitsScore = 0;
  else if (commitsThisWeek <= 2) commitsScore = 40;
  else if (commitsThisWeek <= 5) commitsScore = 70;
  else commitsScore = 100;

  // ── Recency Score (0-100) ──────────────────────────────────────────────
  // 0 days = 100, 1 day = 90, 3 days = 70, 7 days = 30, 14+ days = 0
  let recencyScore: number;
  if (daysSinceLastActivity === 0) recencyScore = 100;
  else if (daysSinceLastActivity <= 1) recencyScore = 90;
  else if (daysSinceLastActivity <= 3) recencyScore = 70;
  else if (daysSinceLastActivity <= 7) recencyScore = 30;
  else recencyScore = Math.max(0, 10 - (daysSinceLastActivity - 7));

  // ── Weighted Score ─────────────────────────────────────────────────────
  const score = Math.round(
    tasksScore * WEIGHTS.tasks +
    hoursScore * WEIGHTS.hours +
    commitsScore * WEIGHTS.commits +
    recencyScore * WEIGHTS.recency
  );

  return {
    projectId,
    projectName,
    score,
    level: getLevel(score),
    breakdown: {
      tasksScore,
      hoursScore,
      commitsScore,
      recencyScore,
    },
  };
}

// ── Level colors ────────────────────────────────────────────────────────────

export const HEALTH_COLORS: Record<ProjectHealth['level'], {
  dot: string;
  bg: string;
  text: string;
  label: string;
}> = {
  critical: {
    dot: '#EF4444',
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    label: 'Critical',
  },
  warning: {
    dot: '#EAB308',
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-400',
    label: 'Warning',
  },
  healthy: {
    dot: '#22C55E',
    bg: 'bg-green-500/10',
    text: 'text-green-400',
    label: 'Healthy',
  },
  thriving: {
    dot: '#3B82F6',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    label: 'Thriving',
  },
};
