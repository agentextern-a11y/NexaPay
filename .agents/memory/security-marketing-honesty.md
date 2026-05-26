---
name: Security Marketing Honesty
description: Rules for keeping security marketing copy aligned with actual implementation.
---

## Rule
Never claim AES-256 or Ed25519 unless the code in question actually uses those primitives. Using SHA-256 + localStorage is fine — just label it accurately.

## Why
Misleading crypto claims create liability, erode user trust, and trigger code-review rejections.

## How to apply
- After any auth/security refactor, grep for "AES-256", "Ed25519", "military-grade", "hybrid" in both code and marketing text.
- Replace mismatched claims with the actual primitives in use.
- Always include a transparency disclaimer when addresses/keys are deterministic or non-cryptographic.

### Crypto address claims (NEXA specific)
The `deriveAddresses()` function in `useAuth.ts` creates pseudo-addresses from SHA-256 hash slices — NOT valid chain addresses generated via secp256k1/ed25519. Never call them "live", "real", or "on-chain". Use "deterministically derived" or "display addresses" and always warn users to verify with a proper wallet provider before sending funds.

### Vulnerability overrides that cannot be applied
When a CVE affects a dependency but no patched version exists on npm (e.g., `elliptic@6.6.1` as of 2026-05-26), document the situation in `pnpm-workspace.yaml` comments rather than applying a broken override. Track upstream for releases.
