import { pgTable, serial, text, numeric, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { wallets } from "./wallet";

export const assets = pgTable("assets", {
  id: serial("id").primaryKey(),
  walletId: integer("wallet_id").references(() => wallets.id).notNull(),
  symbol: text("symbol").notNull(),
  name: text("name").notNull(),
  balance: numeric("balance", { precision: 30, scale: 10 }).notNull().default("0"),
  valueUsd: numeric("value_usd", { precision: 20, scale: 8 }).notNull().default("0"),
  priceUsd: numeric("price_usd", { precision: 20, scale: 8 }).notNull().default("0"),
  change24h: numeric("change_24h", { precision: 20, scale: 8 }).notNull().default("0"),
  changePct24h: numeric("change_pct_24h", { precision: 10, scale: 4 }).notNull().default("0"),
  logoColor: text("logo_color").notNull().default("#0080ff"),
  allocationPct: numeric("allocation_pct", { precision: 10, scale: 4 }),
});

export const insertAssetSchema = createInsertSchema(assets).omit({ id: true });
export type InsertAsset = z.infer<typeof insertAssetSchema>;
export type Asset = typeof assets.$inferSelect;
