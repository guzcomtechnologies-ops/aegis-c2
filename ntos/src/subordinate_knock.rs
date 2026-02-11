use crate::attestor::{Attestor, CovenantBus};

#[derive(Debug)]
pub struct SubKnock {
    pub nonce: [u8; 32],
    pub manifest_hash: [u8; 32],
}

impl SubKnock {
    pub fn new(nonce: [u8; 32], manifest_hash: [u8; 32]) -> Self {
        Self { nonce, manifest_hash }
    }
    pub fn knock(&self, superior: &dyn Attestor) -> Result<String, &'static str> {
        let challenge = superior.challenge(&self.manifest_hash).map_err(|_| "Challenge fail")?;
        let proof = self.prove(&challenge).map_err(|_| "Proof fail")?;
        superior.validate(&proof, &CovenantBus::global().map_err(|_| "Bus fail")? ).map(|t| t.to_string())
    }
    fn prove(&self, challenge: &[u8]) -> Result<Vec<u8>, &'static str> { Ok(challenge.to_vec()) } // Stub: TPM sign
}
