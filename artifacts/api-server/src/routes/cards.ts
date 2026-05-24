import { Router } from "express";
import { db } from "@workspace/db";
import { cryptoCards, transactions } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { CreateCardBody, UpdateCardBody } from "@workspace/api-zod";
import { randomInt } from "crypto";

const router = Router();

function genCardNumber() {
  return Array.from({ length: 4 }, () => String(randomInt(1000, 9999))).join("");
}
function genCvv() {
  return String(randomInt(100, 999));
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
    const wallet = await db.query.wallets.findFirst();
    if (!wallet) return res.json([]);
    const cards = await db.select().from(cryptoCards).where(eq(cryptoCards.walletId, wallet.id)).orderBy(desc(cryptoCards.createdAt));
    res.json(cards.map(formatCard));
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/cards", async (req, res) => {
  try {
    const body = CreateCardBody.parse(req.body);
    const wallet = await db.query.wallets.findFirst();
    if (!wallet) return res.status(400).json({ error: "No wallet found" });

    const now = new Date();
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
    }).returning();

    res.status(201).json(formatCard(card));
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
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/cards/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const body = UpdateCardBody.parse(req.body);
    const updates: any = {};
    if (body.status) updates.status = body.status;
    if (body.spendingLimit !== undefined) updates.spendingLimit = String(body.spendingLimit);
    if (body.nfcEnabled !== undefined) updates.nfcEnabled = body.nfcEnabled;

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
    const txs = await db.select().from(transactions).where(eq(transactions.cardId, id)).orderBy(desc(transactions.createdAt));
    res.json(txs.map((tx) => ({
      ...tx,
      amount: Number(tx.amount),
      valueUsd: Number(tx.valueUsd),
      createdAt: tx.createdAt instanceof Date ? tx.createdAt.toISOString() : tx.createdAt,
    })));
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
