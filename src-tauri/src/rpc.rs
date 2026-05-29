pub use discord_sdk as ds;

pub struct Client {
    pub discord: ds::Discord,
    pub wheel: ds::wheel::Wheel,
    #[allow(dead_code)]
    pub user: ds::user::User,
}

pub async fn make_client(app_id: ds::AppId, subs: ds::Subscriptions) -> Result<Client, String> {
    let (wheel, handler) = ds::wheel::Wheel::new(Box::new(|err| {
        eprintln!("Discord IPC error: {:?}", err);
    }));

    let mut user = wheel.user();

    let discord = ds::Discord::new(ds::DiscordApp::PlainId(app_id), subs, Box::new(handler))
        .map_err(|e| format!("Failed to create Discord client: {}", e))?;

    tokio::time::timeout(std::time::Duration::from_secs(5), user.0.changed())
        .await
        .map_err(|_| "Discord connection timed out — is Discord running?".to_string())?
        .map_err(|e| format!("Discord watch error: {}", e))?;

    let user = match &*user.0.borrow() {
        ds::wheel::UserState::Connected(user) => user.clone(),
        ds::wheel::UserState::Disconnected(err) => {
            return Err(format!("Failed to connect to Discord: {}", err))
        }
    };

    Ok(Client { discord, wheel, user })
}
