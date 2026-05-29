import { useState, useMemo, useRef, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useGameStore } from '../../store/gameStore';
import { useGameList } from '../hooks/useGameList';
import { GameRow } from '../components/ui/GameRow';
import { GameModal } from '../components/ui/GameModal';
import { SearchBar } from '../components/ui/SearchBar';
import type { DetectableGame } from '../../types';

const ITEM_HEIGHT = 52;

export function AllGames() {
  const { data: games, isLoading } = useGameList();
  const query = useGameStore((s) => s.searchQuery);
  const [selected, setSelected] = useState<DetectableGame | null>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () =>
      query
        ? games.filter((g) => g.name.toLowerCase().includes(query.toLowerCase()))
        : games,
    [games, query]
  );

  const virtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ITEM_HEIGHT,
    overscan: 8,
  });

  const handleSelect = useCallback(
    (game: DetectableGame) => setSelected(game),
    []
  );

  return (
    <div className="flex flex-col h-full bg-[#1a1a1f]">
      <div className="px-4 py-3 border-b border-white/5">
        <SearchBar />
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <span className="text-sm text-white/30">Loading games...</span>
        </div>
      ) : (
        <div ref={parentRef} className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-sm text-white/30">
              No games found
            </div>
          ) : (
            <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
              {virtualizer.getVirtualItems().map((vItem) => {
                const game = filtered[vItem.index];
                return (
                  <div
                    key={vItem.key}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      transform: `translateY(${vItem.start}px)`,
                    }}
                  >
                    <GameRow game={game} onClick={handleSelect} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {selected && <GameModal game={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
