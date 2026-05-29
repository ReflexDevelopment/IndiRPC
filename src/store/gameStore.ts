import { create } from 'zustand';

interface GameStore {
  runningProcesses: string[];
  recents: string[];
  favourites: string[];
  searchQuery: string;
  setRunningProcesses: (ids: string[]) => void;
  setRecents: (ids: string[]) => void;
  setFavourites: (ids: string[]) => void;
  setSearchQuery: (q: string) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  runningProcesses: [],
  recents: [],
  favourites: [],
  searchQuery: '',
  setRunningProcesses: (runningProcesses) => set({ runningProcesses }),
  setRecents: (recents) => set({ recents }),
  setFavourites: (favourites) => set({ favourites }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));
