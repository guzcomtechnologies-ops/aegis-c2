use sha2::{Sha256, Digest};
use std::fs;

pub struct VisualIntegrity {
    ledger_hash: [u8;32],
}

impl VisualIntegrity {
    pub fn new(hash: [u8;32]) -> Self { Self { ledger_hash: hash } }
    pub fn verify(&self, img_path: &str) -> anyhow::Result<f64> {
        let bytes = fs::read(img_path)?;
        let pixels_hash = Sha256::digest(&bytes).into();
        Ok(self.similarity(&pixels_hash))
    }
    fn similarity(&self, pixels: &[u8;32]) -> f64 {
        self.ledger_hash.iter().zip(pixels.iter())
            .map(|(a,b)| if a==b {1.0} else {0.0}).sum::<f64>() / 32.0
    }
}
