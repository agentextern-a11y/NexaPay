import { pgTable, text, timestamp, boolean, decimal, integer, jsonb } from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// --- NEXA Pay Application Tables -------------------------------------------

export const wallets = pgTable('wallets', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  address: text('address').notNull().unique(),
  currency: text('currency').notNull().default('USDC'),
  balance: decimal('balance', { precision: 20, scale: 8 }).notNull().default('0'),
  isDefault: boolean('isDefault').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const transactions = pgTable('transactions', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  walletId: text('walletId').notNull(),
  type: text('type').notNull(), // 'send', 'receive', 'tap_pay', 'top_up', 'withdrawal'
  status: text('status').notNull().default('pending'), // 'pending', 'processing', 'settled', 'failed', 'cancelled'
  amount: decimal('amount', { precision: 20, scale: 8 }).notNull(),
  currency: text('currency').notNull(),
  fee: decimal('fee', { precision: 20, scale: 8 }).notNull().default('0'),
  fromAddress: text('fromAddress'),
  toAddress: text('toAddress'),
  txHash: text('txHash'),
  merchantId: text('merchantId'),
  paymentIntentId: text('paymentIntentId'),
  settlementTimeMs: integer('settlementTimeMs'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const merchants = pgTable('merchants', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  businessName: text('businessName').notNull(),
  apiKey: text('apiKey').notNull().unique(),
  apiSecret: text('apiSecret').notNull(),
  email: text('email').notNull(),
  isVerified: boolean('isVerified').notNull().default(false),
  totalVolume: decimal('totalVolume', { precision: 20, scale: 8 }).notNull().default('0'),
  transactionCount: integer('transactionCount').notNull().default(0),
  metadata: jsonb('metadata'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const paymentIntents = pgTable('payment_intents', {
  id: text('id').primaryKey(),
  merchantId: text('merchantId').notNull(),
  amount: decimal('amount', { precision: 20, scale: 8 }).notNull(),
  currency: text('currency').notNull().default('USDC'),
  status: text('status').notNull().default('pending'), // 'pending', 'processing', 'settled', 'failed', 'expired', 'cancelled'
  nfcPayload: jsonb('nfcPayload').notNull(),
  customerWalletId: text('customerWalletId'),
  txHash: text('txHash'),
  expiresAt: timestamp('expiresAt').notNull(),
  settledAt: timestamp('settledAt'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const cards = pgTable('cards', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  walletId: text('walletId').notNull(),
  type: text('type').notNull(), // 'virtual', 'physical'
  status: text('status').notNull().default('active'), // 'active', 'frozen', 'cancelled', 'pending'
  lastFour: text('lastFour').notNull(),
  expiryMonth: integer('expiryMonth').notNull(),
  expiryYear: integer('expiryYear').notNull(),
  spendingLimit: decimal('spendingLimit', { precision: 20, scale: 8 }),
  currentSpend: decimal('currentSpend', { precision: 20, scale: 8 }).notNull().default('0'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// Type exports
export type User = typeof user.$inferSelect
export type Wallet = typeof wallets.$inferSelect
export type Transaction = typeof transactions.$inferSelect
export type Merchant = typeof merchants.$inferSelect
export type PaymentIntent = typeof paymentIntents.$inferSelect
export type Card = typeof cards.$inferSelect
