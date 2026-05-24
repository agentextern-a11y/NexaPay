import { Router } from "express";
import { db } from "@workspace/db";
import { assets } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/assets", async (req, res) => {
  try {
    const rows = await db.select().from(assets);
    const total = rows.reduce((sum, a) => sum + Number(a.valueUsd), 0);
    const result = rows.map((a) => ({
      ...a,
      balance: Number(a.balance),
      valueUsd: Number(a.valueUsd),
      priceUsd: Number(a.priceUsd),
      change24h: Number(a.change24h),
      changePct24h: Number(a.changePct24h),
      allocationPct: total > 0 ? (Number(a.valueUsd) / total) * 100 : 0,
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/assets/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;
    const [asset] = await db.select().from(assets).where(eq(assets.symbol, symbol));
    if (!asset) return res.status(404).json({ error: "Asset not found" });
    res.json({
      ...asset,
      balance: Number(asset.balance),
      valueUsd: Number(asset.valueUsd),
      priceUsd: Number(asset.priceUsd),
      change24h: Number(asset.change24h),
      changePct24h: Number(asset.changePct24h),
      allocationPct: Number(asset.allocationPct ?? 0),
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
