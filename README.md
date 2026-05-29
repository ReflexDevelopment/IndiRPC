# IndiRPC

Simulate Discord game detection without installing the actual games.

IndiRPC creates small dummy processes named after Discord-verified games. Discord's process scanner picks them up and shows them as "Now Playing" in your status.

## How it works

1. Browse the full list of Discord-detected games
2. Click a game → IndiRPC copies a lightweight runner exe and spawns it under the game's expected process name
3. Discord detects the process and updates your Rich Presence
4. Click Stop → process is killed, RPC cleared

## Stack

| Layer | Tech |
|---|---|
| Shell | Tauri v2 (Rust) |
| Frontend | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS v3 |
| State | Zustand |
| Persistence | tauri-plugin-store |
| Runner | `src-win` — lightweight Win32 process (hidden, no window) |

## Building

**Prerequisites:** Rust toolchain, Node.js 20+, pnpm

```sh
pnpm install
pnpm tauri dev
```

**Build the runner** (required before packaging):

```sh
cd old/src-win
cargo build --release
copy target\release\src-win.exe ..\..\resources\src-win.exe
```

**Package:**

```sh
pnpm tauri build
```

## Runner flags

The `src-win.exe` runner accepts:

| Flag | Effect |
|---|---|
| `--title <name>` | Sets the process title (unused in hidden mode) |
| `--hidden` | Runs with no window, no tray icon — pure background process |
| `--tray` | Hides to system tray instead of showing a window |

## Security

- `contextIsolation: true`, `nodeIntegration: false`
- All IPC inputs validated before use
- No `shell: true` in any spawn calls
- Game exe names sanitized before use as filenames
