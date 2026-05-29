import { useEffect } from 'react';
import { api } from '../../api/tauri';
import { useGameStore } from '../../store/gameStore';
import { useLogStore } from '../../store/logStore';

export function useProcessMonitor() {
  const { setRunningProcesses, setRecents, setFavourites } = useGameStore();
  const addEntry = useLogStore((s) => s.addEntry);

  useEffect(() => {
    let unlistenProcess: (() => void) | undefined;
    let unlistenLog: (() => void) | undefined;

    async function setup() {
      const [unsubProcess, unsubLog] = await Promise.all([
        api.onProcessUpdate(setRunningProcesses),
        api.onLogEntry(addEntry),
      ]);
      unlistenProcess = unsubProcess;
      unlistenLog = unsubLog;

      const [running, recents, favourites] = await Promise.all([
        api.getRunningGames(),
        api.getRecents(),
        api.getFavourites(),
      ]);
      setRunningProcesses(running);
      setRecents(recents);
      setFavourites(favourites);
    }

    setup();

    return () => {
      unlistenProcess?.();
      unlistenLog?.();
    };
  }, []);
}
