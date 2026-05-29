import { useGameStore } from '../../../store/gameStore';

export function SearchBar() {
  const query = useGameStore((s) => s.searchQuery);
  const setSearchQuery = useGameStore((s) => s.setSearchQuery);

  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <circle cx="11" cy="11" r="6" />
        <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
      </svg>
      <input
        type="text"
        value={query}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search games..."
        className="w-full bg-white/5 border border-white/[0.08] rounded-lg pl-9 pr-4 py-2 text-sm text-white/80 placeholder-white/30 focus:outline-none focus:border-[#7257ff]/60 focus:bg-white/[0.08] transition-colors"
        style={{ WebkitUserSelect: 'text', userSelect: 'text' }}
      />
    </div>
  );
}
