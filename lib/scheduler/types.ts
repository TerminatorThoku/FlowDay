export type { TimeBlock, Gap, FixedBlock, ScheduledSlot } from '@/types/schedule';

export interface ScheduleConfig {
  dayStartMinutes: number;
  dayEndMinutes: number;
  noWorkAfterMinutes: number;
  minSlotMinutes: number;
  breakBetweenMinutes: number;
}
