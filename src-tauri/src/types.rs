use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DetectableGame {
    pub id: String,
    pub name: String,
    pub icon: Option<String>,
    pub executables: Vec<Executable>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub publishers: Option<Vec<Publisher>>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub genres: Option<Vec<Genre>>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub splash: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Executable {
    pub name: String,
    pub os: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Publisher {
    pub name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Genre {
    pub name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LogEntry {
    pub timestamp: u64,
    pub level: String,
    pub message: String,
    #[serde(rename = "appId", skip_serializing_if = "Option::is_none")]
    pub app_id: Option<String>,
}
