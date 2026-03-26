export const BLOCK_COLORS = {
  class: { bg: '#3B82F6', text: '#fff', label: 'Classes', tailwind: 'bg-blue-500' },
  gym: { bg: '#22C55E', text: '#fff', label: 'Gym', tailwind: 'bg-green-500' },
  swim: { bg: '#06B6D4', text: '#fff', label: 'Swimming', tailwind: 'bg-cyan-500' },
  sleep: { bg: '#52525b', text: '#a1a1aa', label: 'Sleep', tailwind: 'bg-zinc-600' },
  study: { bg: '#8B5CF6', text: '#fff', label: 'Study', tailwind: 'bg-violet-500' },
  project: { bg: '#F97316', text: '#fff', label: 'Project', tailwind: 'bg-orange-500' },
  task: { bg: '#EAB308', text: '#000', label: 'Task', tailwind: 'bg-yellow-500' },
  meal: { bg: '#EC4899', text: '#fff', label: 'Meal', tailwind: 'bg-pink-500' },
  free: { bg: '#18181b', text: '#71717a', label: 'Free', tailwind: 'bg-zinc-900' },
} as const;

export type BlockCategory = keyof typeof BLOCK_COLORS;

export const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
export const FULL_DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

export const SCHEDULE_CONFIG = {
  dayStartMinutes: 360,    // 6:00 AM
  dayEndMinutes: 1380,     // 11:00 PM
  noWorkAfterMinutes: 1320, // 10:00 PM
  minSlotMinutes: 30,
  breakBetweenMinutes: 15,
  sleepStartHour: 23,
  sleepEndHour: 6,
} as const;

export const APU_API_URL = 'https://s3-ap-southeast-1.amazonaws.com/open-ws/weektimetable';
export const DEFAULT_INTAKE = 'UCDF2505ICT(DI)';
export const TIMEZONE = 'Asia/Kuala_Lumpur';
