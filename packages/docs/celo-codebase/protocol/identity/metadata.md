# Metadata

Oftentimes, it is necessary to connect on-chain with off-chain identities.

Use cases include:

- Tools want to present public metadata supplied by a validator or validator group as part of a list of candidate groups, or a list of current elected validators.
- Governance Explorer UIs may want to present public metadata about the creators of governance proposals
- The Celo Foundation receives notice of a security vulnerability and wants to contact elected validators to facilitate them to make a decision on applying a patch.
- A DApp makes a request to the Celo Wallet for account information or to sign a transaction. The Celo Wallet should provide information about the DApp to allow the user to make a decision whether to accept the transaction or not.

Furthermore, we want to include user chosen information such as names or profile pictures that would be expensive to store on-chain. For this purpose, we have a mechanism we call `Metadata` to allow accounts to make both verifiable as well as non-verifiable claims (highly inspired by [Keybase](https://keybase.io)). Check out the [CIP3](https://github.com/celo-org/CIPs/pull/4)

On the `Accounts` smart contract, any account can register a URL under which their metadata file is available under. In that metadata file is the list of claims, signed by the account. We currently support the following claims:

**Name Claim**
An account can claim a human-readable name. This claim is not verifiable.

**Attestation Service URL Claim**
For the [lightweight identity layer](../), validators can make a claim under which their attestation service is reachable to provide attestations. This claim is not verifiable.

Future Claims we hope to support soon:

**Keybase User Claim**
Accounts can make claims on Keybase usernames. This claim is verifiable by signing a message with the account and hosting it on the publicly accessible path of the Keybase file system.

**Twitter User Claim**
Accounts can make claims on Keybase usernames. This claim is verifiable by siging a message with the account and posting it as a tweet. Any client can verify the claim with a reference to the tweet in the claim.

**Domain Claim**
Accounts can make claims on domain names. This claim is verifiable by signing a message with the account and embedding it in a TXT record.
