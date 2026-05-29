export interface DetectableGame {
  id: string;
  name: string;
  icon: string | null;
  executables: Array<{
    name: string;
    os: string;
  }>;
  publishers?: Array<{ name: string }>;
  genres?: Array<{ name: string }>;
  splash?: string;
}

export interface LogEntry {
  timestamp: number;
  level: 'info' | 'warn' | 'error';
  message: string;
  appId?: string;
}
