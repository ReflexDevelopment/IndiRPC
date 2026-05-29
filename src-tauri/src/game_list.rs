use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Emitter};
use tauri_plugin_store::StoreExt;

use crate::types::{DetectableGame, LogEntry};

#[derive(Debug, Clone, Serialize, Deserialize)]
struct GameListCache {
    data: Vec<DetectableGame>,
    last_fetched: u64,
}

const DISCORD_API: &str = "https://discord.com/api/v9/applications/detectable";
const GH_MIRROR: &str =
    "https://markterence.github.io/discord-quest-completer/detectable.json";
const CACHE_TTL_MS: u64 = 24 * 60 * 60 * 1000;

fn now_ms() -> u64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap_or_default()
        .as_millis() as u64
}

fn filter_win32(mut games: Vec<DetectableGame>) -> Vec<DetectableGame> {
    games.retain(|g| g.executables.iter().any(|e| e.os == "win32"));
    for game in &mut games {
        game.executables.retain(|e| e.os == "win32");
        game.executables.truncate(1);
    }
    games
}

pub async fn get_game_list(app: &AppHandle) -> Result<Vec<DetectableGame>, String> {
    let store = app.store("indirpc.json").map_err(|e| e.to_string())?;
    let now = now_ms();

    if let Some(val) = store.get("gameListCache") {
        if let Ok(cache) = serde_json::from_value::<GameListCache>(val) {
            if now - cache.last_fetched < CACHE_TTL_MS {
                return Ok(cache.data);
            }
        }
    }

    emit_log(app, "info", "Fetching game list from Discord API...", None);

    if let Some(games) = try_fetch_list().await {
        let cache = GameListCache {
            data: games.clone(),
            last_fetched: now,
        };
        store.set("gameListCache", serde_json::to_value(&cache).unwrap());
        let _ = store.save();
        emit_log(
            app,
            "info",
            &format!("Cached {} win32 games", games.len()),
            None,
        );
        return Ok(games);
    }

    emit_log(
        app,
        "warn",
        "Discord API fetch failed, using cached/fallback data",
        None,
    );

    if let Some(val) = store.get("gameListCache") {
        if let Ok(cache) = serde_json::from_value::<GameListCache>(val) {
            return Ok(cache.data);
        }
    }

    load_fallback(app)
}

async fn try_fetch_list() -> Option<Vec<DetectableGame>> {
    for url in &[DISCORD_API, GH_MIRROR] {
        if let Ok(resp) = tauri_plugin_http::reqwest::get(*url).await {
            if resp.status().is_success() {
                if let Ok(text) = resp.text().await {
                    if let Ok(raw) = serde_json::from_str::<Vec<DetectableGame>>(&text) {
                        return Some(filter_win32(raw));
                    }
                }
            }
        }
    }
    None
}

fn load_fallback(app: &AppHandle) -> Result<Vec<DetectableGame>, String> {
    use tauri::Manager;

    let path = app
        .path()
        .resource_dir()
        .map(|d| d.join("gamelist.json"))
        .unwrap_or_else(|_| {
            std::path::PathBuf::from("src/renderer/assets/gamelist.json")
        });

    let content = std::fs::read_to_string(&path)
        .map_err(|e| format!("Failed to read fallback gamelist: {}", e))?;

    serde_json::from_str::<Vec<DetectableGame>>(&content)
        .map(filter_win32)
        .map_err(|e| format!("Failed to parse fallback gamelist: {}", e))
}

pub fn emit_log(app: &AppHandle, level: &str, message: &str, app_id: Option<&str>) {
    let entry = LogEntry {
        timestamp: now_ms(),
        level: level.to_string(),
        message: message.to_string(),
        app_id: app_id.map(str::to_string),
    };
    let _ = app.emit("log:entry", entry);
}
