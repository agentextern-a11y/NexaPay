import { Router } from "express";
import { db } from "@workspace/db";
import { nfcSessions, transactions, wallets } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { InitiateNfcSessionBody, ConfirmNfcPaymentBody } from "@workspace/api-zod";
import { randomBytes } from "crypto";

const router = Router();

function formatTx(tx: any) {
  return {
    ...tx,
    amount: Number(tx.amount),
    valueUsd: Number(tx.valueUsd),
    createdAt: tx.createdAt instanceof Date ? tx.createdAt.toISOString() : tx.createdAt,
  };
}

router.post("/nfc/session", async (req, res) => {
  try {
    const body = InitiateNfcSessionBody.parse(req.body);
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000); // 3 mins

    const [session] = await db.insert(nfcSessions).values({
      sessionToken: token,
      merchantName: body.merchantName,
      amount: String(body.amount),
      asset: body.asset,
      status: "pending",
      cardId: body.cardId ?? null,
      expiresAt,
    }).returning();

    res.json({
      sessionToken: session.sessionToken,
      expiresAt: session.expiresAt.toISOString(),
      merchantName: session.merchantName,
      amount: Number(session.amount),
      asset: session.asset,
      status: session.status,
    });
  } catch (err: any) {
    if (err.name === "ZodError") return res.status(400).json({ error: err.message });
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/nfc/confirm", async (req, res) => {
  try {
    const body = ConfirmNfcPaymentBody.parse(req.body);
    const [session] = await db.select().from(nfcSessions).where(eq(nfcSessions.sessionToken, body.sessionToken));
    if (!session) return res.status(404).json({ error: "Session not found" });
    if (session.status !== "pending") return res.status(400).json({ error: "Session already used" });
    if (new Date() > session.expiresAt) {
      await db.update(nfcSessions).set({ status: "expired" }).where(eq(nfcSessions.id, session.id));
      return res.status(400).json({ error: "Session expired" });
    }

    await db.update(nfcSessions).set({ status: "confirmed" }).where(eq(nfcSessions.id, session.id));

    const wallet = await db.query.wallets.findFirst();
    if (!wallet) return res.status(400).json({ error: "No wallet found" });

    const hash = "0x" + randomBytes(32).toString("hex");
    const [tx] = await db.insert(transactions).values({
      walletId: wallet.id,
      type: "nfc_pay",
      asset: session.asset,
      amount: String(session.amount),
      valueUsd: String(session.amount),
      toAddress: "NFC_MERCHANT",
      fromAddress: "0xNEXAWallet",
      status: "confirmed",
      hash,
      merchantName: session.merchantName,
      cardId: session.cardId ?? null,
    }).returning();

    res.json(formatTx(tx));
  } catch (err: any) {
    if (err.name === "ZodError") return res.status(400).json({ error: err.message });
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/nfc/history", async (req, res) => {
  try {
    const wallet = await db.query.wallets.findFirst();
    if (!wallet) return res.json([]);
    const txs = await db.select().from(transactions)
      .where(eq(transactions.type, "nfc_pay"))
      .orderBy(desc(transactions.createdAt))
      .limit(20);
    res.json(txs.map(formatTx));
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
