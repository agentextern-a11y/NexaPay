import { Router } from "express";
import { db } from "@workspace/db";
import { transactions, wallets } from "@workspace/db";
import { eq, and, desc, sql } from "drizzle-orm";
import { CreateTransactionBody, ListTransactionsQueryParams } from "@workspace/api-zod";
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

router.get("/transactions", async (req, res) => {
  try {
    const parsed = ListTransactionsQueryParams.safeParse(req.query);
    const params = parsed.success ? parsed.data : {};
    const wallet = await db.query.wallets.findFirst();
    if (!wallet) return res.json([]);

    const conditions = [eq(transactions.walletId, wallet.id)];
    if (params.type) conditions.push(eq(transactions.type, params.type as any));
    if (params.asset) conditions.push(eq(transactions.asset, params.asset));

    const rows = await db
      .select()
      .from(transactions)
      .where(and(...conditions))
      .orderBy(desc(transactions.createdAt))
      .limit(params.limit ?? 20);

    res.json(rows.map(formatTx));
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/transactions", async (req, res) => {
  try {
    const body = CreateTransactionBody.parse(req.body);
    const wallet = await db.query.wallets.findFirst();
    if (!wallet) return res.status(400).json({ error: "No wallet found" });

    const hash = "0x" + randomBytes(32).toString("hex");
    const [tx] = await db.insert(transactions).values({
      walletId: wallet.id,
      type: "send",
      asset: body.asset,
      amount: String(body.amount),
      valueUsd: String(body.amount * 50000),
      toAddress: body.toAddress,
      fromAddress: "0xNEXAWallet",
      status: "pending",
      hash,
      note: body.note ?? null,
    }).returning();

    res.status(201).json(formatTx(tx));
  } catch (err: any) {
    if (err.name === "ZodError") return res.status(400).json({ error: err.message });
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/transactions/summary", async (req, res) => {
  try {
    const wallet = await db.query.wallets.findFirst();
    if (!wallet) return res.json({ totalSent: 0, totalReceived: 0, totalNfcPay: 0, totalSwap: 0, countSent: 0, countReceived: 0, countNfcPay: 0 });

    const rows = await db.select().from(transactions).where(eq(transactions.walletId, wallet.id));
    const summary = rows.reduce(
      (acc, tx) => {
        const v = Number(tx.valueUsd);
        if (tx.type === "send") { acc.totalSent += v; acc.countSent++; }
        if (tx.type === "receive") { acc.totalReceived += v; acc.countReceived++; }
        if (tx.type === "nfc_pay") { acc.totalNfcPay += v; acc.countNfcPay++; }
        if (tx.type === "swap") acc.totalSwap += v;
        return acc;
      },
      { totalSent: 0, totalReceived: 0, totalNfcPay: 0, totalSwap: 0, countSent: 0, countReceived: 0, countNfcPay: 0 }
    );
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/transactions/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [tx] = await db.select().from(transactions).where(eq(transactions.id, id));
    if (!tx) return res.status(404).json({ error: "Transaction not found" });
    res.json(formatTx(tx));
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
