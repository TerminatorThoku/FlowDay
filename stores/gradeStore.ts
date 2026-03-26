import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Grade {
  id: string;
  subject: string;
  assessment: string;
  grade: number;
  weight: number;
}

interface GradeState {
  grades: Grade[];
  addGrade: (grade: Omit<Grade, 'id'>) => void;
  updateGrade: (id: string, updates: Partial<Grade>) => void;
  deleteGrade: (id: string) => void;
  getSubjectAverage: (subject: string) => number;
  getSubjectGPA: (subject: string) => number;
  getOverallGPA: () => number;
  getSubjects: () => string[];
}

function percentageToGPA(pct: number): number {
  if (pct >= 90) return 4.0;
  if (pct >= 80) return 3.7;
  if (pct >= 75) return 3.3;
  if (pct >= 70) return 3.0;
  if (pct >= 65) return 2.7;
  if (pct >= 60) return 2.3;
  if (pct >= 55) return 2.0;
  if (pct >= 50) return 1.7;
  if (pct >= 45) return 1.3;
  if (pct >= 40) return 1.0;
  return 0.0;
}

export const SUBJECTS = [
  'OOP',
  'Algebra & Discrete Math',
  'System Analysis & Design',
  'Intro to Data Analytics',
] as const;

export { percentageToGPA };

export const useGradeStore = create<GradeState>()(
  persist(
    (set, get) => ({
      grades: [],

      addGrade: (grade) =>
        set((state) => ({
          grades: [
            ...state.grades,
            { ...grade, id: crypto.randomUUID() },
          ],
        })),

      updateGrade: (id, updates) =>
        set((state) => ({
          grades: state.grades.map((g) =>
            g.id === id ? { ...g, ...updates } : g,
          ),
        })),

      deleteGrade: (id) =>
        set((state) => ({
          grades: state.grades.filter((g) => g.id !== id),
        })),

      getSubjectAverage: (subject) => {
        const subjectGrades = get().grades.filter((g) => g.subject === subject);
        if (subjectGrades.length === 0) return 0;
        const totalWeight = subjectGrades.reduce((sum, g) => sum + g.weight, 0);
        if (totalWeight === 0) return 0;
        const weightedSum = subjectGrades.reduce(
          (sum, g) => sum + g.grade * g.weight,
          0,
        );
        return weightedSum / totalWeight;
      },

      getSubjectGPA: (subject) => {
        const avg = get().getSubjectAverage(subject);
        return percentageToGPA(avg);
      },

      getSubjects: () => {
        const subjects = new Set(get().grades.map((g) => g.subject));
        return Array.from(subjects);
      },

      getOverallGPA: () => {
        const subjects = get().getSubjects();
        if (subjects.length === 0) return 0;
        const totalGPA = subjects.reduce(
          (sum, subject) => sum + get().getSubjectGPA(subject),
          0,
        );
        return totalGPA / subjects.length;
      },
    }),
    {
      name: 'flowday-grades',
    },
  ),
);
