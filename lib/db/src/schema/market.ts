import { pgTable, serial, text, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const marketPrices = pgTable("market_prices", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull().unique(),
  name: text("name").notNull(),
  priceUsd: numeric("price_usd", { precision: 20, scale: 8 }).notNull(),
  change24h: numeric("change_24h", { precision: 20, scale: 8 }).notNull().default("0"),
  changePct24h: numeric("change_pct_24h", { precision: 10, scale: 4 }).notNull().default("0"),
  marketCapUsd: numeric("market_cap_usd", { precision: 30, scale: 2 }).notNull().default("0"),
  volume24hUsd: numeric("volume_24h_usd", { precision: 30, scale: 2 }).notNull().default("0"),
  logoColor: text("logo_color").notNull().default("#0080ff"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const priceHistory = pgTable("price_history", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull(),
  price: numeric("price", { precision: 20, scale: 8 }).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertMarketPriceSchema = createInsertSchema(marketPrices).omit({ id: true, updatedAt: true });
export type InsertMarketPrice = z.infer<typeof insertMarketPriceSchema>;
export type MarketPrice = typeof marketPrices.$inferSelect;
