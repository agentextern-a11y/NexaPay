import { Router } from "express";
import { db } from "@workspace/db";
import { transactions, assets, cryptoCards, nfcSessions, wallets } from "@workspace/db";
import { count, sum, sql } from "drizzle-orm";

const router = Router();

router.get("/platform/stats", async (_req, res) => {
  const [txCount] = await db.select({ count: count() }).from(transactions);
  const [txVolume] = await db.select({ total: sum(transactions.valueUsd) }).from(transactions);
  const [walletCount] = await db.select({ count: count() }).from(wallets);
  const [assetCount] = await db.select({ count: count() }).from(assets);
  const [cardCount] = await db.select({ count: count() }).from(cryptoCards);
  const [nfcCount] = await db
    .select({ count: count() })
    .from(transactions)
    .where(sql`${transactions.type} = 'nfc_pay'`);

  res.json({
    totalTransactions: Number(txCount?.count ?? 0),
    totalVolumeUsd: Number(txVolume?.total ?? 0),
    activeWallets: Number(walletCount?.count ?? 0),
    nfcPayments: Number(nfcCount?.count ?? 0),
    supportedAssets: Number(assetCount?.count ?? 0),
    avgConfirmationMs: 480,
    uptimePct: 99.98,
    countriesSupported: 142,
  });
});

export default router;
