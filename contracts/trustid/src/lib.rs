#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, String, Symbol, Vec, Map};

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Did(Address),
    Credential(String), // credential_id
    AuditLog(Address),  // user -> transcript
}

#[derive(Clone, Debug, PartialEq)]
#[contracttype]
pub struct DidDocument {
    pub id: Address,
    pub controller: Address,
    pub created: u64,
    pub updated: u64,
}

#[derive(Clone, Debug, PartialEq)]
#[contracttype]
pub struct CredentialStatus {
    pub issuer: Address,
    pub revoked: bool,
    pub timestamp: u64,
}

#[contract]
pub struct TrustIDContract;

#[contractimpl]
impl TrustIDContract {
    pub fn create_did(env: Env, user: Address) -> DidDocument {
        user.require_auth();
        let doc = DidDocument {
            id: user.clone(),
            controller: user.clone(),
            created: env.ledger().timestamp(),
            updated: env.ledger().timestamp(),
        };
        env.storage().persistent().set(&DataKey::Did(user.clone()), &doc);
        doc
    }

    pub fn get_did(env: Env, user: Address) -> Option<DidDocument> {
        env.storage().persistent().get(&DataKey::Did(user))
    }

    pub fn issue_credential(env: Env, issuer: Address, user: Address, credential_id: String) {
        issuer.require_auth();
        let status = CredentialStatus {
            issuer,
            revoked: false,
            timestamp: env.ledger().timestamp(),
        };
        env.storage().persistent().set(&DataKey::Credential(credential_id), &status);
    }

    pub fn revoke_credential(env: Env, issuer: Address, credential_id: String) {
        issuer.require_auth();
        let mut status: CredentialStatus = env.storage().persistent()
            .get(&DataKey::Credential(credential_id.clone()))
            .expect("Credential not found");
        
        assert_eq!(status.issuer, issuer, "Only issuer can revoke");
        
        status.revoked = true;
        status.timestamp = env.ledger().timestamp();
        
        env.storage().persistent().set(&DataKey::Credential(credential_id), &status);
    }

    pub fn is_revoked(env: Env, credential_id: String) -> bool {
        let status: Option<CredentialStatus> = env.storage().persistent().get(&DataKey::Credential(credential_id));
        match status {
            Some(s) => s.revoked,
            None => true, // Assume revoked if not found for safety
        }
    }
}
