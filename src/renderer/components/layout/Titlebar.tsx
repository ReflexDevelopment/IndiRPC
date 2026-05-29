import { useMemo } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { useNavigate } from 'react-router-dom';
import { useLogStore } from '../../../store/logStore';
import { useGameStore } from '../../../store/gameStore';

export function Titlebar() {
  const toggleVisible = useLogStore((s) => s.toggleVisible);
  const logVisible = useLogStore((s) => s.visible);
  const runningCount = useGameStore((s) => s.runningProcesses.length);

  const win = useMemo(() => getCurrentWindow(), []);
  const navigate = useNavigate();

  return (
    <div className="app-drag flex items-center justify-between h-9 px-3 border-b border-white/5 flex-shrink-0">
      <div className="app-no-drag flex items-center gap-2">
        <span className="text-sm font-semibold text-white/80">IndiRPC</span>
        {runningCount > 0 && (
          <button
            onClick={() => navigate('/active')}
            className="bg-[#23d05a]/20 text-[#23d05a] text-[10px] font-semibold px-1.5 py-0.5 rounded-full hover:bg-[#23d05a]/35 transition-colors"
          >
            {runningCount}
          </button>
        )}
      </div>

      <div className="app-no-drag flex items-center gap-0.5">
        <button
          onClick={toggleVisible}
          className={`p-1.5 rounded transition-colors ${
            logVisible ? 'text-[#7257ff]' : 'text-white/30 hover:text-white/60'
          }`}
          title="Toggle log"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </button>

        <button
          onClick={() => win.minimize()}
          className="p-1.5 rounded text-white/30 hover:text-white/60 transition-colors"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" d="M5 12h14" />
          </svg>
        </button>

        <button
          onClick={() => win.close()}
          className="p-1.5 rounded text-white/30 hover:text-red-400 transition-colors"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
