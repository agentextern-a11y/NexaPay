import { pgTable, serial, text, numeric, timestamp, boolean, integer, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { wallets } from "./wallet";

export const cardStatusEnum = pgEnum("card_status", ["active", "frozen", "cancelled"]);
export const cardTypeEnum = pgEnum("card_type", ["virtual", "physical"]);

export const cryptoCards = pgTable("crypto_cards", {
  id: serial("id").primaryKey(),
  walletId: integer("wallet_id").references(() => wallets.id).notNull(),
  cardNumber: text("card_number").notNull(),
  cardholderName: text("cardholder_name").notNull(),
  expiryMonth: integer("expiry_month").notNull(),
  expiryYear: integer("expiry_year").notNull(),
  cvv: text("cvv").notNull(),
  asset: text("asset").notNull(),
  spendingLimit: numeric("spending_limit", { precision: 20, scale: 8 }).notNull().default("0"),
  spentAmount: numeric("spent_amount", { precision: 20, scale: 8 }).notNull().default("0"),
  status: cardStatusEnum("status").notNull().default("active"),
  cardType: cardTypeEnum("card_type").notNull().default("virtual"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  nfcEnabled: boolean("nfc_enabled").notNull().default(true),
  applePassUrl: text("apple_pass_url"),
  googlePassUrl: text("google_pass_url"),
  passToken: text("pass_token"),
});

export const insertCardSchema = createInsertSchema(cryptoCards).omit({ id: true, createdAt: true });
export type InsertCard = z.infer<typeof insertCardSchema>;
export type CryptoCard = typeof cryptoCards.$inferSelect;
