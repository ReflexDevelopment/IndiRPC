import { useState } from 'react';
import { useGameStore } from '../../../store/gameStore';
import type { DetectableGame } from '../../../types';
import { StatusDot } from './StatusDot';
import { useToast } from '../../context/ToastContext';
import { api } from '../../../api/tauri';
import { getGameIconUrl } from '../../utils/formatters';

interface GameModalProps {
  game: DetectableGame;
  onClose: () => void;
}

export function GameModal({ game, onClose }: GameModalProps) {
  const { setRunningProcesses, setFavourites } = useGameStore();
  const isRunning = useGameStore((s) => s.runningProcesses.includes(game.id));
  const isFav = useGameStore((s) => s.favourites.includes(game.id));
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const iconUrl = getGameIconUrl(game.id, game.icon);
  const exeName = game.executables[0]?.name ?? '—';
  const publisher = game.publishers?.[0]?.name;

  const runningProcesses = useGameStore((s) => s.runningProcesses);

  async function handleLaunch() {
    setLoading(true);
    setError(null);
    try {
      await api.launchGame(game.id);
      setRunningProcesses([...runningProcesses, game.id]);
      showToast(`Now playing ${game.name}`, iconUrl || undefined);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  async function handleStop() {
    setLoading(true);
    setError(null);
    try {
      await api.stopGame(game.id);
      setRunningProcesses(runningProcesses.filter((id) => id !== game.id));
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleFav() {
    const favs = await api.toggleFavourite(game.id);
    setFavourites(favs);
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#222228] border border-white/[0.08] rounded-xl p-6 w-[400px] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4 mb-5">
          <div className="w-[72px] h-[72px] rounded-xl overflow-hidden flex-shrink-0 bg-white/10">
            {iconUrl ? (
              <img src={iconUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl text-white/20 font-semibold">
                {game.name[0]}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-white/90 truncate">{game.name}</h2>
            {publisher && (
              <p className="text-sm text-white/40 mt-0.5 truncate">{publisher}</p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <StatusDot active={isRunning} />
              <span className="text-xs text-white/40">
                {isRunning ? 'Running' : 'Inactive'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/30 hover:text-white/60 transition-colors mt-0.5 flex-shrink-0"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-2 mb-5">
          <div className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
            <span className="text-xs text-white/40">App ID</span>
            <div className="flex items-center gap-2">
              <code className="text-xs text-white/70 font-mono">{game.id}</code>
              <button
                onClick={() => navigator.clipboard.writeText(game.id)}
                className="text-white/30 hover:text-white/60 transition-colors"
                title="Copy App ID"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
            <span className="text-xs text-white/40">Executable</span>
            <code className="text-xs text-white/70 font-mono">{exeName}</code>
          </div>
        </div>

        {error && (
          <div className="mb-3 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-mono break-all">
            {error}
          </div>
        )}

        <div className="flex items-center gap-2">
          {isRunning ? (
            <button
              onClick={handleStop}
              disabled={loading}
              className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
            >
              Stop
            </button>
          ) : (
            <button
              onClick={handleLaunch}
              disabled={loading}
              className="flex-1 bg-[#7257ff] hover:bg-[#6246f0] text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Launching...' : 'Launch'}
            </button>
          )}

          <button
            onClick={handleToggleFav}
            className={`p-2 rounded-lg border transition-colors ${
              isFav
                ? 'bg-[#7257ff]/20 border-[#7257ff]/40 text-[#7257ff]'
                : 'bg-white/5 border-white/10 text-white/40 hover:text-white/70'
            }`}
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill={isFav ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
