-- ============================================================
-- FlowDay Database Schema
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- ==================== TABLES ====================

-- Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  intake_code text NOT NULL DEFAULT 'UCDF2505ICT(DI)',
  timezone text NOT NULL DEFAULT 'Asia/Kuala_Lumpur',
  sleep_start integer NOT NULL DEFAULT 23,
  sleep_end integer NOT NULL DEFAULT 6,
  no_work_after integer NOT NULL DEFAULT 22,
  notify_before_class integer NOT NULL DEFAULT 15,
  notify_before_task integer NOT NULL DEFAULT 10,
  onboarding_complete boolean NOT NULL DEFAULT false,
  spotify_study_playlist text DEFAULT '',
  spotify_gym_playlist text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Classes (cached APU timetable)
CREATE TABLE IF NOT EXISTS classes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_name text NOT NULL,
  module_id text NOT NULL DEFAULT '',
  class_code text NOT NULL DEFAULT '',
  lecturer text NOT NULL DEFAULT 'TBA',
  room text NOT NULL DEFAULT 'TBA',
  color text NOT NULL DEFAULT 'blue',
  time_from timestamptz NOT NULL,
  time_to timestamptz NOT NULL,
  datestamp date NOT NULL,
  intake text NOT NULL,
  fetched_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, class_code, time_from)
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  short_name text NOT NULL,
  description text NOT NULL DEFAULT '',
  priority integer NOT NULL DEFAULT 5,
  color text NOT NULL DEFAULT '#F97316',
  weekly_hours numeric(4,1) NOT NULL DEFAULT 2.0,
  tech_stack text NOT NULL DEFAULT '',
  repo_name text DEFAULT '',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'parked', 'done')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Tasks
CREATE TABLE IF NOT EXISTS tasks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  status text NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done', 'blocked')),
  estimated_minutes integer NOT NULL DEFAULT 60,
  actual_minutes integer,
  due_date date,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Fixed blocks (gym/swim/study/sleep)
CREATE TABLE IF NOT EXISTS fixed_blocks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('gym', 'swim', 'study', 'sleep', 'meal', 'custom')),
  day_of_week integer NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_hour integer NOT NULL,
  start_minute integer NOT NULL DEFAULT 0,
  duration_minutes integer NOT NULL,
  location text NOT NULL DEFAULT '',
  color text NOT NULL DEFAULT '#22C55E',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Scheduled slots (auto-generated)
CREATE TABLE IF NOT EXISTS scheduled_slots (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  title text NOT NULL,
  slot_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  slot_type text NOT NULL DEFAULT 'auto' CHECK (slot_type IN ('auto', 'manual', 'project_block')),
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'skipped')),
  generated_at timestamptz NOT NULL DEFAULT now()
);

-- Streaks
CREATE TABLE IF NOT EXISTS streaks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  streak_type text NOT NULL,
  date date NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  UNIQUE(user_id, streak_type, date)
);

-- Pomodoro sessions
CREATE TABLE IF NOT EXISTS pomodoro_sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id uuid REFERENCES tasks(id) ON DELETE SET NULL,
  subject text,
  started_at timestamptz NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 25,
  completed boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Gym logs
CREATE TABLE IF NOT EXISTS gym_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL,
  exercise text NOT NULL,
  sets integer,
  reps integer,
  weight_kg numeric(6,2),
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Swim logs
CREATE TABLE IF NOT EXISTS swim_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL,
  laps integer,
  duration_minutes integer,
  stroke_type text DEFAULT 'freestyle',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Sleep logs
CREATE TABLE IF NOT EXISTS sleep_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL,
  quality integer CHECK (quality BETWEEN 1 AND 5),
  hours numeric(3,1),
  notes text DEFAULT '',
  UNIQUE(user_id, date)
);

-- Grades (for GPA calculator)
CREATE TABLE IF NOT EXISTS grades (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject text NOT NULL,
  assessment text NOT NULL,
  grade numeric(5,2),
  weight numeric(5,2) DEFAULT 100,
  semester text,
  created_at timestamptz DEFAULT now()
);

-- Weekly reports
CREATE TABLE IF NOT EXISTS weekly_reports (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start date NOT NULL,
  report_data jsonb NOT NULL,
  generated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, week_start)
);

-- GitHub activity cache
CREATE TABLE IF NOT EXISTS github_activity (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  repo_name text NOT NULL,
  commit_count integer DEFAULT 0,
  date date NOT NULL,
  last_commit_message text,
  fetched_at timestamptz DEFAULT now(),
  UNIQUE(user_id, repo_name, date)
);


-- ==================== ROW LEVEL SECURITY ====================

-- Profiles (uses id instead of user_id)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own profile" ON profiles FOR ALL
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Classes
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own classes" ON classes FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own projects" ON projects FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Tasks
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own tasks" ON tasks FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Fixed blocks
ALTER TABLE fixed_blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own fixed_blocks" ON fixed_blocks FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Scheduled slots
ALTER TABLE scheduled_slots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own scheduled_slots" ON scheduled_slots FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Streaks
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own streaks" ON streaks FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Pomodoro sessions
ALTER TABLE pomodoro_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own pomodoro_sessions" ON pomodoro_sessions FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Gym logs
ALTER TABLE gym_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own gym_logs" ON gym_logs FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Swim logs
ALTER TABLE swim_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own swim_logs" ON swim_logs FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Sleep logs
ALTER TABLE sleep_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own sleep_logs" ON sleep_logs FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Grades
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own grades" ON grades FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Weekly reports
ALTER TABLE weekly_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own weekly_reports" ON weekly_reports FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- GitHub activity
ALTER TABLE github_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own github_activity" ON github_activity FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- ==================== TRIGGERS ====================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS projects_updated_at ON projects;
CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS tasks_updated_at ON tasks;
CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
