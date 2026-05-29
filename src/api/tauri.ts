import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import type { DetectableGame, LogEntry } from '../types';

export const api = {
  getGameList: () => invoke<DetectableGame[]>('get_game_list_cmd'),
  launchGame: (appId: string) => invoke<void>('launch_game', { appId }),
  stopGame: (appId: string) => invoke<void>('stop_game', { appId }),
  getRunningGames: () => invoke<string[]>('get_running_games'),
  getRecents: () => invoke<string[]>('get_recents'),
  getFavourites: () => invoke<string[]>('get_favourites'),
  toggleFavourite: (appId: string) =>
    invoke<string[]>('toggle_favourite', { appId }),
  onProcessUpdate: (cb: (ids: string[]) => void) =>
    listen<string[]>('process:update', (e) => cb(e.payload)),
  onLogEntry: (cb: (entry: LogEntry) => void) =>
    listen<LogEntry>('log:entry', (e) => cb(e.payload)),
};
