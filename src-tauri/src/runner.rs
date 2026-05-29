use crate::rpc::{self, Client};

pub async fn set_activity(game_name: &str, app_id_str: &str) -> Result<Client, String> {
    let app_id: i64 = app_id_str
        .parse()
        .map_err(|_| format!("Invalid app_id: {}", app_id_str))?;

    let client = rpc::make_client(app_id, rpc::ds::Subscriptions::ACTIVITY).await?;

    let activity = rpc::ds::activity::ActivityBuilder::default()
        .details(game_name)
        .start_timestamp(std::time::SystemTime::now());

    client
        .discord
        .update_activity(activity)
        .await
        .map_err(|e| format!("Failed to update activity: {}", e))?;

    Ok(client)
}
