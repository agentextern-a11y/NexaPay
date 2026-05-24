import { Router } from "express";
import { db } from "@workspace/db";
import { marketPrices, priceHistory } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.get("/market/prices", async (req, res) => {
  try {
    const prices = await db.select().from(marketPrices).orderBy(desc(marketPrices.marketCapUsd));
    res.json(prices.map((p) => ({
      ...p,
      priceUsd: Number(p.priceUsd),
      change24h: Number(p.change24h),
      changePct24h: Number(p.changePct24h),
      marketCapUsd: Number(p.marketCapUsd),
      volume24hUsd: Number(p.volume24hUsd),
      updatedAt: undefined,
      id: undefined,
    })));
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/market/chart/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;
    const history = await db.select().from(priceHistory)
      .where(eq(priceHistory.symbol, symbol))
      .orderBy(priceHistory.timestamp)
      .limit(168); // 7 days hourly
    res.json(history.map((h) => ({
      timestamp: h.timestamp instanceof Date ? h.timestamp.toISOString() : h.timestamp,
      price: Number(h.price),
    })));
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
