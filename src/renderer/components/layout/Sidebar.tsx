import { NavLink } from 'react-router-dom';
import { useGameStore } from '../../../store/gameStore';

function GridIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" d="M3 12a9 9 0 1 0 9-9 9.1 9.1 0 0 0-6.16 2.45L3 7" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v4h4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 8.5l6 3.5-6 3.5V8.5z" />
    </svg>
  );
}

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
    isActive
      ? 'bg-[#7257ff]/15 text-[#7257ff]'
      : 'text-white/40 hover:text-white/70 hover:bg-white/5'
  }`;

export function Sidebar() {
  const favCount = useGameStore((s) => s.favourites.length);
  const recentCount = useGameStore((s) => s.recents.length);
  const activeCount = useGameStore((s) => s.runningProcesses.length);

  return (
    <nav className="w-40 flex-shrink-0 border-r border-white/5 flex flex-col p-2 gap-0.5">
      <NavLink to="/" end className={linkClass}>
        <GridIcon />
        <span>All Games</span>
      </NavLink>

      <NavLink to="/active" className={linkClass}>
        <PlayIcon />
        <span className="flex-1">Active</span>
        {activeCount > 0 && (
          <span className="text-[10px] bg-[#23d05a]/20 text-[#23d05a] rounded-full px-1.5 py-0.5 leading-none font-semibold">
            {activeCount}
          </span>
        )}
      </NavLink>

      <NavLink to="/recents" className={linkClass}>
        <HistoryIcon />
        <span className="flex-1">Recents</span>
        {recentCount > 0 && (
          <span className="text-[10px] bg-white/10 text-white/40 rounded-full px-1.5 py-0.5 leading-none">
            {recentCount}
          </span>
        )}
      </NavLink>

      <NavLink to="/favourites" className={linkClass}>
        <StarIcon />
        <span className="flex-1">Favourites</span>
        {favCount > 0 && (
          <span className="text-[10px] bg-[#7257ff]/20 text-[#7257ff] rounded-full px-1.5 py-0.5 leading-none">
            {favCount}
          </span>
        )}
      </NavLink>
    </nav>
  );
}
