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
- Always include a "demo purposes" disclaimer when addresses/keys are deterministic or non-cryptographic.
