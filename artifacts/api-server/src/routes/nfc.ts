import { Router } from "express";
import { db } from "@workspace/db";
import { nfcSessions, transactions, wallets } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { InitiateNfcSessionBody, ConfirmNfcPaymentBody } from "@workspace/api-zod";
import { randomBytes } from "crypto";

const router = Router();

function getWalletId(req: { headers: Record<string, string | string[] | undefined> }): number {
  const h = req.headers["x-wallet-id"];
  const v = Array.isArray(h) ? h[0] : h;
  const n = v ? parseInt(v, 10) : NaN;
  return !isNaN(n) && n > 0 ? n : 1;
}

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
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000);

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
      expiresAt:    session.expiresAt.toISOString(),
      merchantName: session.merchantName,
      amount:       Number(session.amount),
      asset:        session.asset,
      status:       session.status,
    });
  } catch (err: any) {
    if (err.name === "ZodError") return res.status(400).json({ error: err.message });
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/nfc/confirm", async (req, res) => {
  try {
    const walletId = getWalletId(req);
    const body = ConfirmNfcPaymentBody.parse(req.body);
    const [session] = await db.select().from(nfcSessions).where(eq(nfcSessions.sessionToken, body.sessionToken));
    if (!session)                   return res.status(404).json({ error: "Session not found" });
    if (session.status !== "pending") return res.status(400).json({ error: "Session already used" });
    if (new Date() > session.expiresAt) {
      await db.update(nfcSessions).set({ status: "expired" }).where(eq(nfcSessions.id, session.id));
      return res.status(400).json({ error: "Session expired" });
    }

    await db.update(nfcSessions).set({ status: "confirmed" }).where(eq(nfcSessions.id, session.id));

    const wallet = await db.query.wallets.findFirst({ where: eq(wallets.id, walletId) });
    if (!wallet) return res.status(400).json({ error: "Wallet not found" });

    const hash = "0x" + randomBytes(32).toString("hex");
    const [tx] = await db.insert(transactions).values({
      walletId:     wallet.id,
      type:         "nfc_pay",
      asset:        session.asset,
      amount:       String(session.amount),
      valueUsd:     String(session.amount),
      toAddress:    "NFC_TERMINAL_" + session.merchantName.replace(/\s+/g, "_").toUpperCase(),
      fromAddress:  "NEXA_WALLET_" + wallet.id,
      status:       "confirmed",
      hash,
      merchantName: session.merchantName,
      cardId:       session.cardId ?? null,
    }).returning();

    res.json(formatTx(tx));
  } catch (err: any) {
    if (err.name === "ZodError") return res.status(400).json({ error: err.message });
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/nfc/history", async (req, res) => {
  try {
    const walletId = getWalletId(req);
    const txs = await db.select().from(transactions)
      .where(eq(transactions.walletId, walletId))
      .then(rows => rows.filter(r => r.type === "nfc_pay"))
    const sorted = [...txs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 20);
    res.json(sorted.map(formatTx));
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
