import { pgTable, serial, text, numeric, timestamp, boolean, integer, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  ownerName: text("owner_name").notNull(),
  totalValueUsd: numeric("total_value_usd", { precision: 20, scale: 8 }).notNull().default("0"),
  totalValueChange24h: numeric("total_value_change_24h", { precision: 20, scale: 8 }).notNull().default("0"),
  totalValueChangePct24h: numeric("total_value_change_pct_24h", { precision: 10, scale: 4 }).notNull().default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const walletAddresses = pgTable("wallet_addresses", {
  id: serial("id").primaryKey(),
  walletId: integer("wallet_id").references(() => wallets.id).notNull(),
  symbol: text("symbol").notNull(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  network: text("network").notNull(),
  qrCode: text("qr_code"),
});

export const insertWalletSchema = createInsertSchema(wallets).omit({ id: true, createdAt: true });
export type InsertWallet = z.infer<typeof insertWalletSchema>;
export type Wallet = typeof wallets.$inferSelect;
export type WalletAddress = typeof walletAddresses.$inferSelect;
