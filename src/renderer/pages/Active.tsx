import { useState, useMemo } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useGameList } from '../hooks/useGameList';
import { GameModal } from '../components/ui/GameModal';
import { api } from '../../api/tauri';
import { getGameIconUrl } from '../utils/formatters';
import type { DetectableGame } from '../../types';

export function Active() {
  const { data: games } = useGameList();
  const runningProcesses = useGameStore((s) => s.runningProcesses);
  const setRunningProcesses = useGameStore((s) => s.setRunningProcesses);
  const [selected, setSelected] = useState<DetectableGame | null>(null);
  const [stopping, setStopping] = useState<string | null>(null);

  const activeGames = useMemo(
    () =>
      runningProcesses
        .map((id) => games.find((g) => g.id === id))
        .filter((g): g is DetectableGame => g !== undefined),
    [runningProcesses, games]
  );

  async function handleStop(appId: string) {
    setStopping(appId);
    try {
      await api.stopGame(appId);
      setRunningProcesses(runningProcesses.filter((id) => id !== appId));
    } finally {
      setStopping(null);
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#1a1a1f]">
      <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
        {activeGames.length > 0 && (
          <span className="w-1.5 h-1.5 rounded-full bg-[#23d05a] animate-pulse flex-shrink-0" />
        )}
        <h2 className="text-sm font-medium text-white/50">Active Simulations</h2>
        {activeGames.length > 0 && (
          <span className="ml-auto text-[10px] bg-[#23d05a]/20 text-[#23d05a] rounded-full px-1.5 py-0.5 font-semibold">
            {activeGames.length}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeGames.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 select-none">
            <svg className="w-10 h-10 text-white/10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2}>
              <circle cx="12" cy="12" r="9" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 8.5l6 3.5-6 3.5V8.5z" />
            </svg>
            <span className="text-sm text-white/25">No active simulations</span>
          </div>
        ) : (
          activeGames.map((game) => {
            const iconUrl = getGameIconUrl(game.id, game.icon);
            const exeName = game.executables[0]?.name ?? '—';
            return (
              <div key={game.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.03]">
                <button
                  onClick={() => setSelected(game)}
                  className="flex items-center gap-3 flex-1 min-w-0 text-left"
                >
                  <div className="relative w-8 h-8 flex-shrink-0">
                    <div className="w-8 h-8 rounded-md overflow-hidden bg-white/10">
                      {iconUrl ? (
                        <img
                          src={iconUrl}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20 text-xs font-medium">
                          {game.name[0]}
                        </div>
                      )}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#23d05a] rounded-full border-2 border-[#1a1a1f]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white/85 truncate">{game.name}</div>
                    <div className="text-[11px] text-white/30 font-mono truncate">{exeName}</div>
                  </div>
                </button>

                <button
                  onClick={() => handleStop(game.id)}
                  disabled={stopping === game.id}
                  className="flex-shrink-0 px-2.5 py-1 rounded-md text-xs font-medium bg-red-500/15 text-red-400 border border-red-500/20 hover:bg-red-500/25 transition-colors disabled:opacity-40"
                >
                  {stopping === game.id ? '…' : 'Stop'}
                </button>
              </div>
            );
          })
        )}
      </div>

      {selected && <GameModal game={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
