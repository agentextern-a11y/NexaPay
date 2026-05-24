import { pgTable, serial, text, numeric, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { wallets } from "./wallet";

export const transactionTypeEnum = pgEnum("transaction_type", ["send", "receive", "swap", "nfc_pay"]);
export const transactionStatusEnum = pgEnum("transaction_status", ["pending", "confirmed", "failed"]);

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  walletId: integer("wallet_id").references(() => wallets.id).notNull(),
  type: transactionTypeEnum("type").notNull(),
  asset: text("asset").notNull(),
  amount: numeric("amount", { precision: 30, scale: 10 }).notNull(),
  valueUsd: numeric("value_usd", { precision: 20, scale: 8 }).notNull(),
  toAddress: text("to_address").notNull(),
  fromAddress: text("from_address").notNull(),
  status: transactionStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  hash: text("hash").notNull(),
  note: text("note"),
  merchantName: text("merchant_name"),
  cardId: integer("card_id"),
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({ id: true, createdAt: true });
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
