import { useState, useMemo } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useGameList } from '../hooks/useGameList';
import { GameRow } from '../components/ui/GameRow';
import { GameModal } from '../components/ui/GameModal';
import type { DetectableGame } from '../../types';

export function Recents() {
  const { data: games } = useGameList();
  const recents = useGameStore((s) => s.recents);
  const [selected, setSelected] = useState<DetectableGame | null>(null);

  const recentGames = useMemo(
    () =>
      recents
        .map((id) => games.find((g) => g.id === id))
        .filter((g): g is DetectableGame => g !== undefined),
    [recents, games]
  );

  return (
    <div className="flex flex-col h-full bg-[#1a1a1f]">
      <div className="px-4 py-3 border-b border-white/5">
        <h2 className="text-sm font-medium text-white/50">Recent Games</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {recentGames.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-sm text-white/30">
            No recent games
          </div>
        ) : (
          recentGames.map((game) => (
            <GameRow key={game.id} game={game} onClick={setSelected} />
          ))
        )}
      </div>

      {selected && <GameModal game={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
