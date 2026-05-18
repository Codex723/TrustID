import { TrustZK, AttributeProof } from '../zk';

export interface CredentialRequest {
  requestor: string;
  requiredAttributes: string[];
  callbackUrl?: string;
}

export class TrustVerifier {
  private rpcUrl: string;

  constructor(rpcUrl: string = 'https://soroban-testnet.stellar.org') {
    this.rpcUrl = rpcUrl;
  }

  /**
   * Verifies a set of credentials and their ZK proofs.
   */
  async verifyCredentials(
    proofs: AttributeProof[],
    did: string
  ): Promise<{ valid: boolean; results: any[] }> {
    const results = proofs.map(proof => ({
      attribute: proof.attribute,
      valid: TrustZK.verifyProof(proof)
    }));

    const allValid = results.every(r => r.valid);

    // TODO: Cross-reference with on-chain DID and revocation status
    console.log(`Verifying DID ${did} at ${this.rpcUrl}`);

    return {
      valid: allValid,
      results
    };
  }

  /**
   * Generate a request for specific attributes.
   */
  createRequest(attributes: string[]): CredentialRequest {
    return {
      requestor: 'TrustID-Verifier-SDK',
      requiredAttributes: attributes
    };
  }
}
