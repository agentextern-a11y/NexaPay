import { Router } from "express";
import { db } from "@workspace/db";
import { wallets, assets, cryptoCards, transactions, marketPrices } from "@workspace/db";
import { eq, desc, and, gte } from "drizzle-orm";

const router = Router();

function getWalletId(req: { headers: Record<string, string | string[] | undefined> }): number {
  const h = req.headers["x-wallet-id"];
  const v = Array.isArray(h) ? h[0] : h;
  const n = v ? parseInt(v, 10) : NaN;
  return !isNaN(n) && n > 0 ? n : 1;
}

router.get("/dashboard/summary", async (req, res) => {
  try {
    const walletId = getWalletId(req);
    const wallet = await db.query.wallets.findFirst({ where: eq(wallets.id, walletId) });
    if (!wallet) {
      return res.json({
        totalValueUsd: 0, change24h: 0, changePct24h: 0,
        totalAssets: 0, activeCards: 0, nfcPaymentsThisMonth: 0,
        topGainer: "BTC", topLoser: "ETH",
      });
    }

    const allAssets = await db.select().from(assets).where(eq(assets.walletId, wallet.id));
    const allCards  = await db.select().from(cryptoCards).where(
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
    const topLoser  = sorted[sorted.length - 1]?.symbol ?? "ETH";

    res.json({
      totalValueUsd:        Number(wallet.totalValueUsd),
      change24h:            Number(wallet.totalValueChange24h),
      changePct24h:         Number(wallet.totalValueChangePct24h),
      totalAssets:          allAssets.length,
      activeCards:          allCards.length,
      nfcPaymentsThisMonth: nfcTxs.length,
      topGainer,
      topLoser,
    });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/dashboard/activity", async (req, res) => {
  try {
    const walletId = getWalletId(req);
    const txs = await db.select().from(transactions)
      .where(eq(transactions.walletId, walletId))
      .orderBy(desc(transactions.createdAt))
      .limit(10);

    res.json(txs.map((tx) => ({
      id:        tx.id,
      type:      tx.type,
      title:     tx.type === "nfc_pay"  ? `Paid ${tx.merchantName ?? "Merchant"}`
               : tx.type === "receive"  ? `Received ${tx.asset}`
               : tx.type === "swap"     ? `Swapped ${tx.asset}`
               :                          `Sent ${tx.asset}`,
      subtitle:  `${Number(tx.amount).toFixed(4)} ${tx.asset}`,
      valueUsd:  Number(tx.valueUsd),
      timestamp: tx.createdAt instanceof Date ? tx.createdAt.toISOString() : tx.createdAt,
      icon:      tx.type,
    })));
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
