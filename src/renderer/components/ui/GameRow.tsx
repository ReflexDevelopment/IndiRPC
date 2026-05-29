import { memo } from 'react';
import { useGameStore } from '../../../store/gameStore';
import type { DetectableGame } from '../../../types';
import { StatusDot } from './StatusDot';
import { getGameIconUrl } from '../../utils/formatters';

interface GameRowProps {
  game: DetectableGame;
  onClick: (game: DetectableGame) => void;
}

export const GameRow = memo(function GameRow({ game, onClick }: GameRowProps) {
  const isRunning = useGameStore((s) => s.runningProcesses.includes(game.id));
  const isFav = useGameStore((s) => s.favourites.includes(game.id));
  const iconUrl = getGameIconUrl(game.id, game.icon);

  return (
    <button
      onClick={() => onClick(game)}
      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 active:bg-white/[0.08] transition-colors text-left"
    >
      <div className="w-8 h-8 rounded-md overflow-hidden flex-shrink-0 bg-white/10">
        {iconUrl ? (
          <img
            src={iconUrl}
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20 text-xs font-medium">
            {game.name[0]}
          </div>
        )}
      </div>

      <span className="flex-1 text-sm text-white/80 truncate">{game.name}</span>

      <div className="flex items-center gap-2 flex-shrink-0">
        {isFav && (
          <svg className="w-3 h-3 text-[#7257ff]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        )}
        <StatusDot active={isRunning} />
      </div>
    </button>
  );
});
