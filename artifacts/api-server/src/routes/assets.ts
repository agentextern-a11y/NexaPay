import { Router } from "express";
import { db } from "@workspace/db";
import { assets } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

function getWalletId(req: { headers: Record<string, string | string[] | undefined> }): number {
  const h = req.headers["x-wallet-id"];
  const v = Array.isArray(h) ? h[0] : h;
  const n = v ? parseInt(v, 10) : NaN;
  return !isNaN(n) && n > 0 ? n : 1;
}

router.get("/assets", async (req, res) => {
  try {
    const walletId = getWalletId(req);
    const rows = await db.select().from(assets).where(eq(assets.walletId, walletId));
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
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/assets/:symbol", async (req, res) => {
  try {
    const walletId = getWalletId(req);
    const { symbol } = req.params;
    const [asset] = await db.select().from(assets)
      .where(eq(assets.walletId, walletId))
      .then(rows => rows.filter(a => a.symbol === symbol.toUpperCase()));
    if (!asset) return res.status(404).json({ error: "Asset not found" });
    const total = asset.valueUsd ? Number(asset.valueUsd) : 0;
    res.json({
      ...asset,
      balance: Number(asset.balance),
      valueUsd: Number(asset.valueUsd),
      priceUsd: Number(asset.priceUsd),
      change24h: Number(asset.change24h),
      changePct24h: Number(asset.changePct24h),
      allocationPct: Number(asset.allocationPct ?? 0),
    });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
