mod commands;
mod dummy_runner;
mod game_list;
mod rpc;
mod runner;
mod types;

use commands::*;
use dummy_runner::DummyRunner;
use once_cell::sync::OnceCell;
use std::sync::Mutex;
use tauri::{Emitter, Manager};

static DISCORD_CLIENT: OnceCell<Mutex<Option<rpc::Client>>> = OnceCell::new();

pub fn get_discord_client() -> &'static Mutex<Option<rpc::Client>> {
    DISCORD_CLIENT.get_or_init(|| Mutex::new(None))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .manage(DummyRunner::new())
        .invoke_handler(tauri::generate_handler![
            get_game_list_cmd,
            launch_game,
            stop_game,
            get_running_games,
            get_recents,
            get_favourites,
            toggle_favourite,
        ])
        .setup(|app| {
            let handle = app.handle().clone();
            std::thread::spawn(move || loop {
                std::thread::sleep(std::time::Duration::from_secs(3));
                let runner = handle.state::<DummyRunner>();
                let running = runner.get_running_games();
                let _ = handle.emit("process:update", running);
            });
            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { .. } = event {
                window.app_handle().state::<DummyRunner>().stop_all();
                // Drop Discord client → closes the IPC connection
                let _ = get_discord_client().lock().unwrap().take();
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
