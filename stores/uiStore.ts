import { create } from 'zustand';
import { format } from 'date-fns';
import type { TimeBlock } from '@/types/schedule';

type ActiveTab = 'today' | 'calendar' | 'tasks' | 'settings';

interface UIState {
  activeTab: ActiveTab;
  selectedDate: string;
  sheetOpen: boolean;
  selectedBlock: TimeBlock | null;

  setActiveTab: (tab: ActiveTab) => void;
  setSelectedDate: (date: string) => void;
  setSheetOpen: (open: boolean) => void;
  setSelectedBlock: (block: TimeBlock | null) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  activeTab: 'today',
  selectedDate: format(new Date(), 'yyyy-MM-dd'),
  sheetOpen: false,
  selectedBlock: null,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setSheetOpen: (open) => set({ sheetOpen: open }),
  setSelectedBlock: (block) => set({ selectedBlock: block }),
}));
