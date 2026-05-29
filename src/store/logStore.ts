import { create } from 'zustand';
import type { LogEntry } from '../types';

interface LogStore {
  entries: LogEntry[];
  visible: boolean;
  addEntry: (entry: LogEntry) => void;
  clearEntries: () => void;
  toggleVisible: () => void;
}

export const useLogStore = create<LogStore>((set) => ({
  entries: [],
  visible: false,
  addEntry: (entry) =>
    set((s) => ({
      entries:
        s.entries.length >= 500
          ? [...s.entries.slice(-499), entry]
          : [...s.entries, entry],
    })),
  clearEntries: () => set({ entries: [] }),
  toggleVisible: () => set((s) => ({ visible: !s.visible })),
}));
