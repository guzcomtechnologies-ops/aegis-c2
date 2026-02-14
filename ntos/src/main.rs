use sha2::{Sha256, Digest};
use image::io::Reader as ImageReader;
use anyhow::Result;
use std::io::Cursor;

#[tokio::main]
async fn main() -> Result<()> {
    let ledger = [42u8; 32];
    let img_bytes = b"Serene NTOS ledger test image data";  // Simulate serene.jpg
    let img = ImageReader::new(Cursor::new(img_bytes)).with_guessed_format()?.decode()?;
    let pixels_hash: [u8; 32] = Sha256::digest(&img.to_bytes()).into();
    let score = pixels_hash.iter().zip(&ledger).map(|(&a, &b)| if a == b { 1.0 } else { 0.0 }).sum::<f64>() / 32.0;
    println!("Covenant: {:.1}% serene", score * 100.0);
    Ok(())
}

mod mesh {
    pub async fn gossip() { println!("Mesh Breaker 5 LIVE!"); }
}
mesh::gossip().await;
