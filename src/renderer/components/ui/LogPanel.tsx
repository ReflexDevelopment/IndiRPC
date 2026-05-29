import { useEffect, useRef } from 'react';
import { useLogStore } from '../../../store/logStore';
import { formatTimestamp } from '../../utils/formatters';

const LEVEL_TEXT: Record<string, string> = {
  info: 'text-white/60',
  warn: 'text-amber-400',
  error: 'text-red-400',
};

const LEVEL_BADGE: Record<string, string> = {
  info: 'bg-white/10 text-white/40',
  warn: 'bg-amber-400/20 text-amber-400',
  error: 'bg-red-400/20 text-red-400',
};

export function LogPanel() {
  const entries = useLogStore((s) => s.entries);
  const clearEntries = useLogStore((s) => s.clearEntries);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-1.5 border-b border-white/5 flex-shrink-0">
        <span className="text-[10px] text-white/30 font-semibold uppercase tracking-wider">
          Log
        </span>
        <button
          onClick={clearEntries}
          className="text-xs text-white/30 hover:text-white/60 transition-colors"
        >
          Clear
        </button>
      </div>

      <div className="flex-1 overflow-y-auto font-mono text-xs py-1">
        {entries.length === 0 && (
          <div className="px-4 py-2 text-white/20">No log entries</div>
        )}
        {entries.map((entry, i) => (
          <div key={i} className="flex items-start gap-2 px-4 py-0.5 hover:bg-white/[0.03]">
            <span className="text-white/25 flex-shrink-0 mt-px">
              {formatTimestamp(entry.timestamp)}
            </span>
            <span
              className={`px-1 py-px rounded text-[10px] uppercase font-semibold flex-shrink-0 mt-px ${
                LEVEL_BADGE[entry.level] ?? LEVEL_BADGE.info
              }`}
            >
              {entry.level}
            </span>
            <span className={`${LEVEL_TEXT[entry.level] ?? LEVEL_TEXT.info} break-all leading-relaxed`}>
              {entry.message}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
