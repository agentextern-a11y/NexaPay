import { Router } from "express";
import { db } from "@workspace/db";
import { wallets, walletAddresses, assets, marketPrices } from "@workspace/db";
import { eq } from "drizzle-orm";
import { getPublicKeyAsync, utils as edUtils } from "@noble/ed25519";
import { getPublicKey as secpGetPublicKey, utils as secpUtils } from "@noble/secp256k1";
import { keccak_256 } from "@noble/hashes/sha3.js";
import { createHash } from "crypto";

const router = Router();

// ─── Helpers ────────────────────────────────────────────────────────────────

function getWalletId(req: { headers: Record<string, string | string[] | undefined> }): number {
  const h = req.headers["x-wallet-id"];
  const v = Array.isArray(h) ? h[0] : h;
  const n = v ? parseInt(v, 10) : NaN;
  return !isNaN(n) && n > 0 ? n : 1;
}

const B58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function base58Encode(bytes: Uint8Array): string {
  let n = 0n;
  for (const b of bytes) n = (n << 8n) | BigInt(b);
  let out = "";
  while (n > 0n) { out = B58[Number(n % 58n)] + out; n /= 58n; }
  for (let i = 0; i < bytes.length && bytes[i] === 0; i++) out = "1" + out;
  return out;
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
}

function sha256Buf(data: Uint8Array): Buffer {
  return createHash("sha256").update(data).digest();
}

function ripemd160Buf(data: Buffer): Buffer {
  return createHash("ripemd160").update(data).digest();
}

function generateEthAddress(privKey: Uint8Array): string {
  const pub = secpGetPublicKey(privKey, false); // 65 bytes uncompressed
  const body = pub.slice(1); // 64 bytes (remove 0x04 prefix)
  const hash = keccak_256(body); // 32 bytes
  return "0x" + toHex(hash.slice(12)); // last 20 bytes
}

function generateBtcAddress(privKey: Uint8Array): string {
  const pub = secpGetPublicKey(privKey, true); // 33 bytes compressed
  const pubBuf = Buffer.from(pub);
  const hash160 = ripemd160Buf(sha256Buf(pubBuf)); // 20 bytes
  const versioned = Buffer.concat([Buffer.from([0x00]), hash160]); // 21 bytes
  const checksum = sha256Buf(sha256Buf(versioned)).slice(0, 4);
  const full = Buffer.concat([versioned, checksum]);
  return base58Encode(new Uint8Array(full));
}

async function generateSolAddress(privKey: Uint8Array): Promise<string> {
  const pub = await getPublicKeyAsync(privKey); // 32 bytes Ed25519 pubkey
  return base58Encode(pub);
}

const SUPPORTED_ASSETS = [
  { symbol: "BTC", name: "Bitcoin", logoColor: "#F7931A" },
  { symbol: "ETH", name: "Ethereum", logoColor: "#627EEA" },
  { symbol: "SOL", name: "Solana", logoColor: "#9945FF" },
  { symbol: "BNB", name: "BNB Chain", logoColor: "#F3BA2F" },
  { symbol: "USDC", name: "USD Coin", logoColor: "#2775CA" },
];

// ─── Routes ─────────────────────────────────────────────────────────────────

router.get("/wallet", async (req, res) => {
  try {
    const walletId = getWalletId(req);
    const wallet = await db.query.wallets.findFirst({ where: eq(wallets.id, walletId) });
    if (!wallet) return res.status(404).json({ error: "Wallet not found" });
    res.json({
      ...wallet,
      totalValueUsd: Number(wallet.totalValueUsd),
      totalValueChange24h: Number(wallet.totalValueChange24h),
      totalValueChangePct24h: Number(wallet.totalValueChangePct24h),
    });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/wallet/create", async (req, res) => {
  try {
    const { ownerName } = req.body as { ownerName: string };
    if (!ownerName || ownerName.trim().length < 2) {
      return res.status(400).json({ error: "Name must be at least 2 characters" });
    }

    // Generate real cryptographic keypairs
    const secpPrivKey = secpUtils.randomPrivateKey(); // secp256k1 for ETH + BTC
    const edPrivKey = edUtils.randomPrivateKey();      // Ed25519 for Solana

    const [ethAddr, btcAddr, solAddr] = await Promise.all([
      Promise.resolve(generateEthAddress(secpPrivKey)),
      Promise.resolve(generateBtcAddress(secpPrivKey)),
      generateSolAddress(edPrivKey),
    ]);

    // Create wallet record with zero balance
    const [wallet] = await db.insert(wallets).values({
      ownerName: ownerName.trim(),
      totalValueUsd: "0",
      totalValueChange24h: "0",
      totalValueChangePct24h: "0",
    }).returning();

    // Seed deposit addresses (derived from real keypairs)
    await db.insert(walletAddresses).values([
      { walletId: wallet.id, symbol: "BTC",  name: "Bitcoin",     address: btcAddr, network: "Bitcoin Mainnet" },
      { walletId: wallet.id, symbol: "ETH",  name: "Ethereum",    address: ethAddr, network: "Ethereum Mainnet" },
      { walletId: wallet.id, symbol: "SOL",  name: "Solana",      address: solAddr, network: "Solana Mainnet" },
      { walletId: wallet.id, symbol: "USDC", name: "USD Coin",    address: ethAddr, network: "Ethereum (ERC-20)" },
      { walletId: wallet.id, symbol: "BNB",  name: "BNB Chain",   address: ethAddr, network: "BNB Smart Chain" },
    ]);

    // Seed zero-balance assets with current market prices
    const prices = await db.select().from(marketPrices);
    const priceMap = Object.fromEntries(prices.map(p => [p.symbol, p]));

    await db.insert(assets).values(SUPPORTED_ASSETS.map(a => {
      const p = priceMap[a.symbol];
      return {
        walletId: wallet.id,
        symbol: a.symbol,
        name: a.name,
        balance: "0",
        valueUsd: "0",
        priceUsd: p ? p.priceUsd : "0",
        change24h: "0",
        changePct24h: p ? p.changePct24h : "0",
        logoColor: a.logoColor,
      };
    }));

    return res.status(201).json({
      walletId: wallet.id,
      ownerName: wallet.ownerName,
      isNew: true,
      totalValueUsd: 0,
    });
  } catch (err) {
    console.error("Wallet create error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/wallet/addresses", async (req, res) => {
  try {
    const walletId = getWalletId(req);
    const addresses = await db.select().from(walletAddresses).where(eq(walletAddresses.walletId, walletId));
    res.json(addresses);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
