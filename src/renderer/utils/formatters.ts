export function formatTimestamp(ts: number): string {
  return new Date(ts).toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function getGameIconUrl(id: string, hash: string | null): string {
  if (!hash) return '';
  return `https://cdn.discordapp.com/app-icons/${id}/${hash}.png?size=64`;
}
