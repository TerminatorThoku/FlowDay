export interface TimeBlock {
  id: string;
  type: 'class' | 'gym' | 'swim' | 'study' | 'sleep' | 'project' | 'task' | 'meal' | 'free';
  title: string;
  date: string; // YYYY-MM-DD
  startMinutes: number; // minutes from midnight
  endMinutes: number;
  color: string;
  location?: string;
  meta?: Record<string, unknown>;
}

export interface Gap {
  date: string;
  startMinutes: number;
  endMinutes: number;
  durationMinutes: number;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  short_name: string;
  description: string;
  priority: number;
  color: string;
  weekly_hours: number;
  tech_stack: string;
  status: 'active' | 'parked' | 'done';
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  project_id: string | null;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'todo' | 'in_progress' | 'done' | 'blocked';
  estimated_minutes: number;
  actual_minutes: number | null;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface FixedBlock {
  id: string;
  user_id: string;
  name: string;
  category: 'gym' | 'swim' | 'study' | 'sleep' | 'meal' | 'custom';
  day_of_week: number; // 0=Mon, 6=Sun
  start_hour: number;
  start_minute: number;
  duration_minutes: number;
  location: string;
  color: string;
  is_active: boolean;
}

export interface ScheduledSlot {
  id: string;
  user_id: string;
  task_id: string | null;
  project_id: string | null;
  title: string;
  slot_date: string;
  start_time: string;
  end_time: string;
  slot_type: 'auto' | 'manual' | 'project_block';
  status: 'scheduled' | 'completed' | 'skipped';
}

export interface APUClassEntry {
  INTAKE: string;
  MODULE_NAME: string;
  ROOM: string;
  NAME: string;
  MODID: string;
  CLASS_CODE: string;
  COLOR: string;
  TIME_FROM_ISO: string;
  TIME_TO_ISO: string;
  DATESTAMP_ISO: string;
}

export interface PomodoroSession {
  id: string;
  task_id: string | null;
  subject: string | null;
  started_at: string;
  duration_minutes: number;
  completed: boolean;
}

export interface UserProfile {
  id: string;
  full_name: string;
  intake_code: string;
  timezone: string;
  sleep_start: number;
  sleep_end: number;
  no_work_after: number;
  notify_before_class: number;
  notify_before_task: number;
  onboarding_complete: boolean;
}
