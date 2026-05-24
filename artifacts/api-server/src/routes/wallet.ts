import { Router } from "express";
import { db } from "@workspace/db";
import { wallets, walletAddresses } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/wallet", async (req, res) => {
  try {
    const wallet = await db.query.wallets.findFirst();
    if (!wallet) return res.status(404).json({ error: "Wallet not found" });
    res.json({
      ...wallet,
      totalValueUsd: Number(wallet.totalValueUsd),
      totalValueChange24h: Number(wallet.totalValueChange24h),
      totalValueChangePct24h: Number(wallet.totalValueChangePct24h),
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/wallet/addresses", async (req, res) => {
  try {
    const wallet = await db.query.wallets.findFirst();
    if (!wallet) return res.json([]);
    const addresses = await db.select().from(walletAddresses).where(eq(walletAddresses.walletId, wallet.id));
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
