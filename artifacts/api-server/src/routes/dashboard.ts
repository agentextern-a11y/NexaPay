import { Router } from "express";
import { db } from "@workspace/db";
import { wallets, assets, cryptoCards, transactions, marketPrices } from "@workspace/db";
import { eq, desc, and, gte } from "drizzle-orm";

const router = Router();

router.get("/dashboard/summary", async (req, res) => {
  try {
    const wallet = await db.query.wallets.findFirst();
    if (!wallet) {
      return res.json({
        totalValueUsd: 0, change24h: 0, changePct24h: 0,
        totalAssets: 0, activeCards: 0, nfcPaymentsThisMonth: 0,
        topGainer: "BTC", topLoser: "ETH",
      });
    }

    const allAssets = await db.select().from(assets).where(eq(assets.walletId, wallet.id));
    const allCards = await db.select().from(cryptoCards).where(
      and(eq(cryptoCards.walletId, wallet.id), eq(cryptoCards.status, "active"))
    );

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const nfcTxs = await db.select().from(transactions).where(
      and(eq(transactions.walletId, wallet.id), eq(transactions.type, "nfc_pay"), gte(transactions.createdAt, startOfMonth))
    );

    const prices = await db.select().from(marketPrices);
    const sorted = [...prices].sort((a, b) => Number(b.changePct24h) - Number(a.changePct24h));
    const topGainer = sorted[0]?.symbol ?? "BTC";
    const topLoser = sorted[sorted.length - 1]?.symbol ?? "ETH";

    res.json({
      totalValueUsd: Number(wallet.totalValueUsd),
      change24h: Number(wallet.totalValueChange24h),
      changePct24h: Number(wallet.totalValueChangePct24h),
      totalAssets: allAssets.length,
      activeCards: allCards.length,
      nfcPaymentsThisMonth: nfcTxs.length,
      topGainer,
      topLoser,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/dashboard/activity", async (req, res) => {
  try {
    const wallet = await db.query.wallets.findFirst();
    if (!wallet) return res.json([]);

    const txs = await db.select().from(transactions)
      .where(eq(transactions.walletId, wallet.id))
      .orderBy(desc(transactions.createdAt))
      .limit(10);

    const activity = txs.map((tx) => ({
      id: tx.id,
      type: tx.type,
      title: tx.type === "nfc_pay"
        ? `Paid ${tx.merchantName ?? "Merchant"}`
        : tx.type === "receive"
        ? `Received ${tx.asset}`
        : tx.type === "swap"
        ? `Swapped ${tx.asset}`
        : `Sent ${tx.asset}`,
      subtitle: `${Number(tx.amount).toFixed(4)} ${tx.asset}`,
      valueUsd: Number(tx.valueUsd),
      timestamp: tx.createdAt instanceof Date ? tx.createdAt.toISOString() : tx.createdAt,
      icon: tx.type,
    }));

    res.json(activity);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
