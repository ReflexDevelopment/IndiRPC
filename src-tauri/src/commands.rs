use tauri::{AppHandle, State};
use tauri_plugin_store::StoreExt;

use crate::dummy_runner::DummyRunner;
use crate::game_list::{emit_log, get_game_list};
use crate::types::DetectableGame;
use crate::{get_discord_client, runner};

#[tauri::command]
pub async fn get_game_list_cmd(app: AppHandle) -> Result<Vec<DetectableGame>, String> {
    get_game_list(&app).await
}

#[tauri::command]
pub async fn launch_game(
    app: AppHandle,
    app_id: String,
    dummy: State<'_, DummyRunner>,
) -> Result<(), String> {
    let games = get_game_list(&app).await?;
    let game = games
        .iter()
        .find(|g| g.id == app_id)
        .ok_or_else(|| format!("Game not found: {}", app_id))?;

    let runner_path = DummyRunner::runner_path(&app);
    emit_log(
        &app,
        "info",
        &format!("runner path: {}", runner_path.display()),
        Some(&app_id),
    );

    if !runner_path.exists() {
        let msg = format!("runner not found at {}", runner_path.display());
        emit_log(&app, "error", &msg, Some(&app_id));
        return Err(msg);
    }

    dummy
        .launch(game, &runner_path)
        .map_err(|e| {
            emit_log(&app, "error", &e, Some(&app_id));
            e
        })?;

    let store = app.store("indirpc.json").map_err(|e| e.to_string())?;
    let mut recents: Vec<String> = store
        .get("recents")
        .and_then(|v| serde_json::from_value(v).ok())
        .unwrap_or_default();
    recents.retain(|id| id != &app_id);
    recents.insert(0, app_id.clone());
    recents.truncate(10);
    store.set("recents", serde_json::to_value(&recents).unwrap());
    let _ = store.save();

    let game_name = game.name.clone();
    emit_log(
        &app,
        "info",
        &format!("Now playing {}", game_name),
        Some(&app_id),
    );

    // Connect Discord RPC in background — non-blocking if Discord is closed
    {
        let app2 = app.clone();
        let id2 = app_id.clone();
        let name2 = game_name.clone();
        tauri::async_runtime::spawn(async move {
            match runner::set_activity(&name2, &id2).await {
                Ok(client) => {
                    *get_discord_client().lock().unwrap() = Some(client);
                    emit_log(&app2, "info", "Discord RPC connected", Some(&id2));
                }
                Err(e) => {
                    emit_log(&app2, "warn", &format!("Discord RPC: {}", e), Some(&id2));
                }
            }
        });
    }

    Ok(())
}

#[tauri::command]
pub async fn stop_game(
    app: AppHandle,
    app_id: String,
    dummy: State<'_, DummyRunner>,
) -> Result<(), String> {
    emit_log(&app, "info", &format!("Stopping {}", app_id), Some(&app_id));
    // Drop Discord client → closes the IPC connection
    let _ = get_discord_client().lock().unwrap().take();
    dummy.stop(&app_id)
}

#[tauri::command]
pub fn get_running_games(dummy: State<'_, DummyRunner>) -> Vec<String> {
    dummy.get_running_games()
}

#[tauri::command]
pub fn get_recents(app: AppHandle) -> Result<Vec<String>, String> {
    let store = app.store("indirpc.json").map_err(|e| e.to_string())?;
    Ok(store
        .get("recents")
        .and_then(|v| serde_json::from_value(v).ok())
        .unwrap_or_default())
}

#[tauri::command]
pub fn get_favourites(app: AppHandle) -> Result<Vec<String>, String> {
    let store = app.store("indirpc.json").map_err(|e| e.to_string())?;
    Ok(store
        .get("favourites")
        .and_then(|v| serde_json::from_value(v).ok())
        .unwrap_or_default())
}

#[tauri::command]
pub fn toggle_favourite(app: AppHandle, app_id: String) -> Result<Vec<String>, String> {
    let store = app.store("indirpc.json").map_err(|e| e.to_string())?;
    let mut favs: Vec<String> = store
        .get("favourites")
        .and_then(|v| serde_json::from_value(v).ok())
        .unwrap_or_default();

    if favs.contains(&app_id) {
        favs.retain(|id| id != &app_id);
    } else {
        favs.push(app_id);
    }

    store.set("favourites", serde_json::to_value(&favs).unwrap());
    let _ = store.save();
    Ok(favs)
}
