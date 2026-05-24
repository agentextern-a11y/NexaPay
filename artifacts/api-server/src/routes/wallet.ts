import { Router } from "express";
import { db } from "@workspace/db";
import { wallets, walletAddresses } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/wallet", async (_req, res) => {
  try {
    const wallet = await db.query.wallets.findFirst();
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
      return res.status(400).json({ error: "Owner name must be at least 2 characters" });
    }

    const existing = await db.query.wallets.findFirst();
    if (!existing) return res.status(500).json({ error: "No base wallet found" });

    const [wallet] = await db
      .insert(wallets)
      .values({
        ownerName: ownerName.trim(),
        totalValueUsd: existing.totalValueUsd,
        totalValueChange24h: existing.totalValueChange24h,
        totalValueChangePct24h: existing.totalValueChangePct24h,
      })
      .returning();

    return res.status(201).json({
      walletId: 1,
      ownerName: ownerName.trim(),
      isNew: true,
      totalValueUsd: Number(existing.totalValueUsd),
    });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/wallet/addresses", async (_req, res) => {
  try {
    const wallet = await db.query.wallets.findFirst();
    if (!wallet) return res.json([]);
    const addresses = await db.select().from(walletAddresses).where(eq(walletAddresses.walletId, wallet.id));
    res.json(addresses);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
