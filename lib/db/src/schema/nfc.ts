import { pgTable, serial, text, numeric, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const nfcStatusEnum = pgEnum("nfc_status", ["pending", "confirmed", "expired"]);

export const nfcSessions = pgTable("nfc_sessions", {
  id: serial("id").primaryKey(),
  sessionToken: text("session_token").notNull().unique(),
  merchantName: text("merchant_name").notNull(),
  amount: numeric("amount", { precision: 20, scale: 8 }).notNull(),
  asset: text("asset").notNull(),
  status: nfcStatusEnum("status").notNull().default("pending"),
  cardId: integer("card_id"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNfcSessionSchema = createInsertSchema(nfcSessions).omit({ id: true, createdAt: true });
export type InsertNfcSession = z.infer<typeof insertNfcSessionSchema>;
export type NfcSession = typeof nfcSessions.$inferSelect;
