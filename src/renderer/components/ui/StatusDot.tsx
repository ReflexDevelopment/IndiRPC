interface StatusDotProps {
  active: boolean;
}

export function StatusDot({ active }: StatusDotProps) {
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full flex-shrink-0 transition-colors ${
        active ? 'bg-[#23d05a]' : 'bg-white/20'
      }`}
    />
  );
}
