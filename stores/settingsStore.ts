import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  intakeCode: string;
  fullName: string;
  sleepStart: number;
  sleepEnd: number;
  noWorkAfter: number;
  onboardingComplete: boolean;
  setIntakeCode: (code: string) => void;
  setFullName: (name: string) => void;
  setSleepSchedule: (start: number, end: number) => void;
  setNoWorkAfter: (hour: number) => void;
  setOnboardingComplete: (done: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // ── Defaults (pre-filled for Abdul) ─────────────────────────────────
      intakeCode: 'UCDF2505ICT(DI)',
      fullName: 'Abdul Wahid',
      sleepStart: 23,
      sleepEnd: 6,
      noWorkAfter: 22,
      onboardingComplete: false,

      // ── Actions ─────────────────────────────────────────────────────────
      setIntakeCode: (code) => set({ intakeCode: code }),
      setFullName: (name) => set({ fullName: name }),
      setSleepSchedule: (start, end) =>
        set({ sleepStart: start, sleepEnd: end }),
      setNoWorkAfter: (hour) => set({ noWorkAfter: hour }),
      setOnboardingComplete: (done) => set({ onboardingComplete: done }),
    }),
    {
      name: 'flowday-settings',
    },
  ),
);
