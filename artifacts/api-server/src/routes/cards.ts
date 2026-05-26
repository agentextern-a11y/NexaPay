import { Router } from "express";
import { db } from "@workspace/db";
import { cryptoCards, transactions, wallets } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { CreateCardBody, UpdateCardBody } from "@workspace/api-zod";
import { randomInt } from "crypto";

const router = Router();

function getWalletId(req: { headers: Record<string, string | string[] | undefined> }): number {
  const h = req.headers["x-wallet-id"];
  const v = Array.isArray(h) ? h[0] : h;
  const n = v ? parseInt(v, 10) : NaN;
  return !isNaN(n) && n > 0 ? n : 1;
}

function genCardNumber() {
  return Array.from({ length: 4 }, () => String(randomInt(1000, 9999))).join(" ");
}
function genCvv() {
  return String(randomInt(100, 999));
}
function genPassToken() {
  return Array.from({ length: 32 }, () => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"[randomInt(0, 61)]).join("");
}
function generateApplePassUrl(card: any) {
  const base = process.env.APPLE_WALLET_BASE_URL || "https://wallet.apple.com/nexa";
  return `${base}/v1/passes/nexa.card/${card.passToken}`;
}
function generateGooglePassUrl(card: any) {
  const base = process.env.GOOGLE_WALLET_BASE_URL || "https://pay.google.com/gp/v/save";
  const payload = btoa(JSON.stringify({
    id: `nexa.card.${card.passToken}`,
    issuer: "NEXA Crypto",
    cardNumber: card.cardNumber,
    cardholder: card.cardholderName,
    expiry: `${String(card.expiryMonth).padStart(2, "0")}/${String(card.expiryYear).slice(-2)}`,
  }));
  return `${base}/${payload}`;
}
function formatCard(card: any) {
  return {
    ...card,
    spendingLimit: Number(card.spendingLimit),
    spentAmount: Number(card.spentAmount),
    createdAt: card.createdAt instanceof Date ? card.createdAt.toISOString() : card.createdAt,
  };
}

router.get("/cards", async (req, res) => {
  try {
    const walletId = getWalletId(req);
    const cards = await db.select().from(cryptoCards)
      .where(eq(cryptoCards.walletId, walletId))
      .orderBy(desc(cryptoCards.createdAt));
    res.json(cards.map(formatCard));
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/cards", async (req, res) => {
  try {
    const walletId = getWalletId(req);
    const body = CreateCardBody.parse(req.body);
    const wallet = await db.query.wallets.findFirst({ where: eq(wallets.id, walletId) });
    if (!wallet) return res.status(400).json({ error: "Wallet not found" });

    // Enforce one card per wallet
    const existing = await db.select().from(cryptoCards).where(eq(cryptoCards.walletId, walletId));
    if (existing.length > 0) {
      return res.status(409).json({ error: "Only one card is allowed per wallet. Cancel your existing card to issue a new one." });
    }

    const now = new Date();
    const passToken = genPassToken();
    const [card] = await db.insert(cryptoCards).values({
      walletId: wallet.id,
      cardNumber: genCardNumber(),
      cardholderName: body.cardholderName.toUpperCase(),
      expiryMonth: now.getMonth() + 1,
      expiryYear: now.getFullYear() + 3,
      cvv: genCvv(),
      asset: body.asset,
      spendingLimit: String(body.spendingLimit),
      spentAmount: "0",
      status: "active",
      cardType: body.cardType as any,
      nfcEnabled: body.nfcEnabled ?? true,
      passToken,
    }).returning();

    const formatted = formatCard(card);
    // Generate wallet pass URLs
    formatted.applePassUrl = generateApplePassUrl(formatted);
    formatted.googlePassUrl = generateGooglePassUrl(formatted);
    res.status(201).json(formatted);
  } catch (err: any) {
    if (err.name === "ZodError") return res.status(400).json({ error: err.message });
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/cards/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [card] = await db.select().from(cryptoCards).where(eq(cryptoCards.id, id));
    if (!card) return res.status(404).json({ error: "Card not found" });
    res.json(formatCard(card));
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/cards/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const body = UpdateCardBody.parse(req.body);
    const updates: any = {};
    if (body.status)                     updates.status        = body.status;
    if (body.spendingLimit !== undefined) updates.spendingLimit = String(body.spendingLimit);
    if (body.nfcEnabled !== undefined)    updates.nfcEnabled    = body.nfcEnabled;

    const [card] = await db.update(cryptoCards).set(updates).where(eq(cryptoCards.id, id)).returning();
    if (!card) return res.status(404).json({ error: "Card not found" });
    res.json(formatCard(card));
  } catch (err: any) {
    if (err.name === "ZodError") return res.status(400).json({ error: err.message });
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/cards/:id/transactions", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const txs = await db.select().from(transactions)
      .where(eq(transactions.cardId, id))
      .orderBy(desc(transactions.createdAt));
    res.json(txs.map((tx) => ({
      ...tx,
      amount: Number(tx.amount),
      valueUsd: Number(tx.valueUsd),
      createdAt: tx.createdAt instanceof Date ? tx.createdAt.toISOString() : tx.createdAt,
    })));
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
