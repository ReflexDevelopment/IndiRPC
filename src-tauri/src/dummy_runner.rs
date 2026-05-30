use std::collections::HashMap;
use std::env;
use std::os::windows::process::CommandExt;
use std::path::{Path, PathBuf};
use std::sync::Mutex;

use crate::types::DetectableGame;

const CREATE_NO_WINDOW: u32 = 0x08000000;

pub struct DummyRunner {
    // app_id → exe_name (for taskkill)
    running: Mutex<HashMap<String, String>>,
}

impl DummyRunner {
    pub fn new() -> Self {
        Self {
            running: Mutex::new(HashMap::new()),
        }
    }

    pub fn launch(&self, game: &DetectableGame, runner_path: &Path) -> Result<(), String> {
        let raw_exe = game
            .executables
            .first()
            .map(|e| e.name.as_str())
            .ok_or("No executable defined for this game")?;

        let exe_name = Path::new(raw_exe)
            .file_name()
            .and_then(|n| n.to_str())
            .ok_or_else(|| format!("Cannot extract filename from: {}", raw_exe))?
            .to_string();

        let exe_dir = env::current_exe().unwrap_or_default();
        let exe_dir = exe_dir.parent().unwrap_or(Path::new("")).to_path_buf();

        let game_dir = exe_dir.join("games").join(&game.id);
        std::fs::create_dir_all(&game_dir)
            .map_err(|e| format!("Failed to create game dir: {}", e))?;

        let dest = game_dir.join(&exe_name);
        std::fs::copy(runner_path, &dest)
            .map_err(|e| format!("Failed to copy runner: {}", e))?;

        std::process::Command::new(&dest)
            .args(["--title", &game.name])
            .current_dir(&game_dir)
            .spawn()
            .map_err(|e| format!("Failed to spawn process: {}", e))?;

        self.running.lock().unwrap().insert(game.id.clone(), exe_name);
        Ok(())
    }

    pub fn stop(&self, app_id: &str) -> Result<(), String> {
        let exe_name = self.running.lock().unwrap().remove(app_id);
        if let Some(name) = exe_name {
            std::process::Command::new("taskkill")
                .args(["/F", "/IM", &name])
                .creation_flags(CREATE_NO_WINDOW)
                .output()
                .map_err(|e| format!("taskkill failed: {}", e))?;
        }
        Ok(())
    }

    pub fn get_running_games(&self) -> Vec<String> {
        let mut map = self.running.lock().unwrap();
        map.retain(|_, exe| is_process_running(exe));
        map.keys().cloned().collect()
    }

    pub fn stop_all(&self) {
        let map = self.running.lock().unwrap();
        for (_, exe) in map.iter() {
            let _ = std::process::Command::new("taskkill")
                .args(["/F", "/IM", exe])
                .creation_flags(CREATE_NO_WINDOW)
                .output();
        }
    }

    pub fn runner_path(app: &tauri::AppHandle) -> PathBuf {
        use tauri::{path::BaseDirectory, Manager};

        // Packaged build: resource dir contains data/src-win.exe
        if let Ok(p) = app.path().resolve("data/src-win.exe", BaseDirectory::Resource) {
            if p.exists() {
                return p;
            }
        }

        // Dev mode: walk up from the current exe to find project root resources/
        if let Ok(exe) = std::env::current_exe() {
            for ancestor in exe.ancestors().skip(1) {
                let candidate = ancestor.join("resources").join("src-win.exe");
                if candidate.exists() {
                    return candidate;
                }
            }
        }

        PathBuf::from("resources/src-win.exe")
    }
}

fn is_process_running(exe_name: &str) -> bool {
    std::process::Command::new("tasklist")
        .args([
            "/FI",
            &format!("IMAGENAME eq {}", exe_name),
            "/FO",
            "CSV",
            "/NH",
        ])
        .creation_flags(CREATE_NO_WINDOW)
        .output()
        .map(|o| String::from_utf8_lossy(&o.stdout).contains(exe_name))
        .unwrap_or(false)
}
