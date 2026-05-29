import { useState, useEffect } from 'react';
import { api } from '../../api/tauri';
import type { DetectableGame } from '../../types';

export function useGameList() {
  const [data, setData] = useState<DetectableGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .getGameList()
      .then(setData)
      .finally(() => setIsLoading(false));
  }, []);

  return { data, isLoading };
}
