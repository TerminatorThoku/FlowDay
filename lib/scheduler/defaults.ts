import type { FixedBlock, Project } from '@/types/schedule';

// ── Helper types ────────────────────────────────────────────────────────────
type FixedBlockSeed = Omit<FixedBlock, 'id' | 'user_id'>;
type ProjectSeed = Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

// ── Lifestyle Blocks ────────────────────────────────────────────────────────
// Ported from apu_autosync.py lines 46-61
// day_of_week: 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri, 5=Sat, 6=Sun

export const DEFAULT_LIFESTYLE_BLOCKS: FixedBlockSeed[] = [
  // ─── Gym (6x / week) ─────────────────────────────────────────────────────
  {
    name: 'Gym',
    category: 'gym',
    day_of_week: 0, // Mon
    start_hour: 7,
    start_minute: 0,
    duration_minutes: 90,
    location: '',
    color: '#22C55E',
    is_active: true,
  },
  {
    name: 'Gym',
    category: 'gym',
    day_of_week: 1, // Tue
    start_hour: 14,
    start_minute: 0,
    duration_minutes: 90,
    location: '',
    color: '#22C55E',
    is_active: true,
  },
  {
    name: 'Gym',
    category: 'gym',
    day_of_week: 2, // Wed
    start_hour: 13,
    start_minute: 0,
    duration_minutes: 90,
    location: '',
    color: '#22C55E',
    is_active: true,
  },
  {
    name: 'Gym',
    category: 'gym',
    day_of_week: 3, // Thu
    start_hour: 13,
    start_minute: 0,
    duration_minutes: 90,
    location: '',
    color: '#22C55E',
    is_active: true,
  },
  {
    name: 'Gym',
    category: 'gym',
    day_of_week: 4, // Fri
    start_hour: 13,
    start_minute: 0,
    duration_minutes: 60,
    location: '',
    color: '#22C55E',
    is_active: true,
  },
  {
    name: 'Gym',
    category: 'gym',
    day_of_week: 5, // Sat
    start_hour: 9,
    start_minute: 0,
    duration_minutes: 90,
    location: '',
    color: '#22C55E',
    is_active: true,
  },

  // ─── Swim (3x / week) ────────────────────────────────────────────────────
  {
    name: 'Swim',
    category: 'swim',
    day_of_week: 1, // Tue
    start_hour: 17,
    start_minute: 0,
    duration_minutes: 60,
    location: 'Pool',
    color: '#06B6D4',
    is_active: true,
  },
  {
    name: 'Swim',
    category: 'swim',
    day_of_week: 3, // Thu
    start_hour: 16,
    start_minute: 0,
    duration_minutes: 60,
    location: 'Pool',
    color: '#06B6D4',
    is_active: true,
  },
  {
    name: 'Swim',
    category: 'swim',
    day_of_week: 5, // Sat
    start_hour: 11,
    start_minute: 0,
    duration_minutes: 60,
    location: 'Pool',
    color: '#06B6D4',
    is_active: true,
  },
];

// ── Study Blocks ────────────────────────────────────────────────────────────
// Ported from apu_autosync.py lines 62-78

export const DEFAULT_STUDY_BLOCKS: FixedBlockSeed[] = [
  {
    name: 'Study: Algebra',
    category: 'study',
    day_of_week: 0, // Mon
    start_hour: 12,
    start_minute: 0,
    duration_minutes: 90,
    location: '',
    color: '#8B5CF6',
    is_active: true,
  },
  {
    name: 'Study: Algebra',
    category: 'study',
    day_of_week: 1, // Tue
    start_hour: 16,
    start_minute: 0,
    duration_minutes: 60,
    location: '',
    color: '#8B5CF6',
    is_active: true,
  },
  {
    name: 'Study: OOP Practice',
    category: 'study',
    day_of_week: 2, // Wed
    start_hour: 14,
    start_minute: 30,
    duration_minutes: 90,
    location: '',
    color: '#8B5CF6',
    is_active: true,
  },
  {
    name: 'Study: SA&D',
    category: 'study',
    day_of_week: 2, // Wed
    start_hour: 16,
    start_minute: 0,
    duration_minutes: 90,
    location: '',
    color: '#8B5CF6',
    is_active: true,
  },
  {
    name: 'Study: OOP Practice',
    category: 'study',
    day_of_week: 3, // Thu
    start_hour: 14,
    start_minute: 30,
    duration_minutes: 90,
    location: 'Library',
    color: '#8B5CF6',
    is_active: true,
  },
  {
    name: 'Study: OOP',
    category: 'study',
    day_of_week: 4, // Fri
    start_hour: 14,
    start_minute: 0,
    duration_minutes: 120,
    location: '',
    color: '#8B5CF6',
    is_active: true,
  },
  {
    name: 'Study: SA&D',
    category: 'study',
    day_of_week: 4, // Fri
    start_hour: 16,
    start_minute: 0,
    duration_minutes: 90,
    location: '',
    color: '#8B5CF6',
    is_active: true,
  },
  {
    name: 'Study: Weekly Revision',
    category: 'study',
    day_of_week: 6, // Sun
    start_hour: 10,
    start_minute: 0,
    duration_minutes: 120,
    location: '',
    color: '#8B5CF6',
    is_active: true,
  },
];

// ── Default Projects ────────────────────────────────────────────────────────
// Ported from apu_autosync.py lines 87-108

export const DEFAULT_PROJECTS: ProjectSeed[] = [
  {
    name: 'GameVault',
    short_name: 'GV',
    description:
      'Game account trading platform for buying and selling game accounts',
    priority: 1,
    color: '#EF4444',
    weekly_hours: 8,
    tech_stack: 'FastAPI, SQLite',
    status: 'active',
  },
  {
    name: 'Geointel',
    short_name: 'GI',
    description:
      'Geo-intelligence dashboard for real-time geospatial data visualization and analysis',
    priority: 2,
    color: '#3B82F6',
    weekly_hours: 6,
    tech_stack: 'Next.js, Supabase, Mapbox',
    status: 'active',
  },
  {
    name: 'Restaurant POS',
    short_name: 'POS',
    description:
      'Restaurant management system with point-of-sale and order tracking',
    priority: 3,
    color: '#22C55E',
    weekly_hours: 4,
    tech_stack: 'Docker, FastAPI, Remotion',
    status: 'active',
  },
  {
    name: 'T Trades',
    short_name: 'TT',
    description:
      'Autonomous trading intelligence platform for automated market analysis',
    priority: 4,
    color: '#8B5CF6',
    weekly_hours: 2,
    tech_stack: 'Electron, Node.js',
    status: 'active',
  },
  {
    name: 'TerrorFundingMonitor',
    short_name: 'TFM',
    description:
      'Financial intelligence platform for detecting suspicious transaction patterns',
    priority: 5,
    color: '#F97316',
    weekly_hours: 2,
    tech_stack: 'Express, Neo4j, ML',
    status: 'active',
  },
];
