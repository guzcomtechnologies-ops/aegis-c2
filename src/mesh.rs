use wireguard_rs::{PeerConfig, Interface};
use subordinate_knock::SubKnock;

pub async fn mesh_gossip(knock: SubKnock) -> Result<(), Box<dyn std::error::Error>> {
    let token = knock.knock(b"mesh_admit");
    let iface = Interface::new("ntos0", "10.0.0.1/24".parse()?);
    let peer = PeerConfig::new("10.0.0.2/32".parse()?, hex::decode(token)?);
    // Gossip loop: peers via token proofs
    tokio::spawn(async move {
        loop { /* WireGuard UDP heartbeat */ tokio::time::sleep(tokio::time::Duration::from_secs(30)).await; }
    });
    Ok(())
}
