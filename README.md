# TrustID

TrustID is a decentralized identity (DID) and reusable KYC credential platform built on Stellar Soroban. It enables users to maintain ownable DIDs and share verifiable credentials using Zero-Knowledge (ZK) proofs, ensuring privacy and compliance.

## Features

- **Decentralized Identity (DID)**: Self-sovereign identity storage on the Stellar network.
- **Verifiable Credentials (VC)**: Issue, store, and revoke credentials like Passport, Driver's License, or Accreditations.
- **ZK Proofs**: Prove attributes (e.g., "I am over 18") without revealing raw data (e.g., date of birth) using BLS12-381 elliptic curve.
- **On-chain Audit Log**: Transparent and immutable revocation status.
- **dApp SDK**: Easily integrate TrustID verification into any Stellar-based dApp.

## Technical Architecture

- **Smart Contract**: Written in Rust for the Soroban WASM runtime.
- **ZK Module**: Implemented in TypeScript using `@noble/curves` for BLS12-381.
- **Frontend**: React-based wallet interface.
- **SDK**: TypeScript SDK for credential verification.

## License

MIT License. See [LICENSE](./LICENSE) for details.
