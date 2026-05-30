'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { wallets, transactions, cards, merchants, paymentIntents } from '@/lib/db/schema'
import { eq, desc, and, sql } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { generateId, generateWalletAddress, generateApiKey, generateApiSecret, hashApiSecret, generateNFCPayload, calculateFee } from '@/lib/utils'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

// ==================== WALLET ACTIONS ====================

export async function getWallets() {
  const userId = await getUserId()
  return db.select().from(wallets).where(eq(wallets.userId, userId)).orderBy(desc(wallets.createdAt))
}

export async function getWalletById(walletId: string) {
  const userId = await getUserId()
  const result = await db.select().from(wallets).where(and(eq(wallets.id, walletId), eq(wallets.userId, userId)))
  return result[0] || null
}

export async function createWallet(currency: string = 'USDC') {
  const userId = await getUserId()
  const existingWallets = await db.select().from(wallets).where(eq(wallets.userId, userId))
  
  const wallet = {
    id: generateId('wal'),
    userId,
    address: generateWalletAddress(),
    currency,
    balance: '0',
    isDefault: existingWallets.length === 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  
  await db.insert(wallets).values(wallet)
  revalidatePath('/dashboard')
  return wallet
}

export async function getTotalBalance() {
  const userId = await getUserId()
  const userWallets = await db.select().from(wallets).where(eq(wallets.userId, userId))
  
  let totalUsd = 0
  for (const w of userWallets) {
    const balance = parseFloat(w.balance || '0')
    // For stablecoins, 1:1 with USD
    if (['USDC', 'USDT'].includes(w.currency)) {
      totalUsd += balance
    } else if (w.currency === 'BTC') {
      totalUsd += balance * 45000 // Example rate
    } else if (w.currency === 'ETH') {
      totalUsd += balance * 2500 // Example rate
    } else if (w.currency === 'NEXA') {
      totalUsd += balance * 0.25 // Example rate
    } else {
      totalUsd += balance
    }
  }
  
  return totalUsd
}

// ==================== TRANSACTION ACTIONS ====================

export async function getTransactions(limit: number = 20) {
  const userId = await getUserId()
  return db
    .select()
    .from(transactions)
    .where(eq(transactions.userId, userId))
    .orderBy(desc(transactions.createdAt))
    .limit(limit)
}

export async function getTransactionsByWallet(walletId: string, limit: number = 20) {
  const userId = await getUserId()
  return db
    .select()
    .from(transactions)
    .where(and(eq(transactions.walletId, walletId), eq(transactions.userId, userId)))
    .orderBy(desc(transactions.createdAt))
    .limit(limit)
}

export async function sendPayment(fromWalletId: string, toAddress: string, amount: number, currency: string) {
  const userId = await getUserId()
  const startTime = Date.now()
  
  // Get source wallet
  const sourceWallet = await db.select().from(wallets).where(and(eq(wallets.id, fromWalletId), eq(wallets.userId, userId)))
  if (!sourceWallet[0]) throw new Error('Wallet not found')
  
  const walletBalance = parseFloat(sourceWallet[0].balance || '0')
  const fee = calculateFee(amount)
  const totalAmount = amount + fee
  
  if (walletBalance < totalAmount) throw new Error('Insufficient balance')
  
  // Create transaction record
  const txId = generateId('tx')
  const txHash = '0x' + Buffer.from(txId).toString('hex').padEnd(64, '0')
  
  const transaction = {
    id: txId,
    userId,
    walletId: fromWalletId,
    type: 'send' as const,
    status: 'settled' as const,
    amount: amount.toString(),
    currency,
    fee: fee.toString(),
    fromAddress: sourceWallet[0].address,
    toAddress,
    txHash,
    settlementTimeMs: Date.now() - startTime + 450, // Simulate network latency
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  
  // Update wallet balance
  await db.update(wallets)
    .set({ 
      balance: (walletBalance - totalAmount).toFixed(8),
      updatedAt: new Date()
    })
    .where(eq(wallets.id, fromWalletId))
  
  await db.insert(transactions).values(transaction)
  revalidatePath('/dashboard')
  
  return transaction
}

export async function topUpWallet(walletId: string, amount: number) {
  const userId = await getUserId()
  const startTime = Date.now()
  
  const wallet = await db.select().from(wallets).where(and(eq(wallets.id, walletId), eq(wallets.userId, userId)))
  if (!wallet[0]) throw new Error('Wallet not found')
  
  const currentBalance = parseFloat(wallet[0].balance || '0')
  const newBalance = currentBalance + amount
  
  const txId = generateId('tx')
  const transaction = {
    id: txId,
    userId,
    walletId,
    type: 'top_up' as const,
    status: 'settled' as const,
    amount: amount.toString(),
    currency: wallet[0].currency,
    fee: '0',
    toAddress: wallet[0].address,
    txHash: '0x' + Buffer.from(txId).toString('hex').padEnd(64, '0'),
    settlementTimeMs: Date.now() - startTime + 320,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  
  await db.update(wallets)
    .set({ balance: newBalance.toFixed(8), updatedAt: new Date() })
    .where(eq(wallets.id, walletId))
  
  await db.insert(transactions).values(transaction)
  revalidatePath('/dashboard')
  
  return transaction
}

// ==================== CARD ACTIONS ====================

export async function getCards() {
  const userId = await getUserId()
  return db.select().from(cards).where(eq(cards.userId, userId)).orderBy(desc(cards.createdAt))
}

export async function createCard(walletId: string, type: 'virtual' | 'physical', spendingLimit?: number) {
  const userId = await getUserId()
  
  // Verify wallet ownership
  const wallet = await db.select().from(wallets).where(and(eq(wallets.id, walletId), eq(wallets.userId, userId)))
  if (!wallet[0]) throw new Error('Wallet not found')
  
  const card = {
    id: generateId('card'),
    userId,
    walletId,
    type,
    status: type === 'physical' ? 'pending' : 'active',
    lastFour: Math.floor(1000 + Math.random() * 9000).toString(),
    expiryMonth: new Date().getMonth() + 1,
    expiryYear: new Date().getFullYear() + 3,
    spendingLimit: spendingLimit?.toString(),
    currentSpend: '0',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  
  await db.insert(cards).values(card)
  revalidatePath('/dashboard')
  
  return card
}

export async function updateCardStatus(cardId: string, status: 'active' | 'frozen' | 'cancelled') {
  const userId = await getUserId()
  await db.update(cards)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(cards.id, cardId), eq(cards.userId, userId)))
  revalidatePath('/dashboard')
}

// ==================== MERCHANT ACTIONS ====================

export async function getMerchantProfile() {
  const userId = await getUserId()
  const result = await db.select().from(merchants).where(eq(merchants.userId, userId))
  return result[0] || null
}

export async function registerMerchant(businessName: string, email: string) {
  const userId = await getUserId()
  
  // Check if already registered
  const existing = await db.select().from(merchants).where(eq(merchants.userId, userId))
  if (existing[0]) throw new Error('Merchant already registered')
  
  const apiSecret = generateApiSecret()
  
  const merchant = {
    id: generateId('mer'),
    userId,
    businessName,
    apiKey: generateApiKey(),
    apiSecret: hashApiSecret(apiSecret),
    email,
    isVerified: false,
    totalVolume: '0',
    transactionCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  
  await db.insert(merchants).values(merchant)
  revalidatePath('/dashboard')
  
  // Return with plain text secret (only shown once)
  return { ...merchant, apiSecretPlaintext: apiSecret }
}

// ==================== NFC PAYMENT ACTIONS ====================

export async function createPaymentIntent(amount: number, currency: string = 'USDC') {
  const userId = await getUserId()
  
  // Get merchant profile
  const merchant = await db.select().from(merchants).where(eq(merchants.userId, userId))
  if (!merchant[0]) throw new Error('Merchant not registered')
  
  const paymentId = generateId('pay')
  const expiresAt = new Date(Date.now() + 60000) // 60 seconds
  
  const intent = {
    id: paymentId,
    merchantId: merchant[0].id,
    amount: amount.toString(),
    currency,
    status: 'pending' as const,
    nfcPayload: generateNFCPayload(paymentId, merchant[0].id, amount.toString(), currency),
    expiresAt,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  
  await db.insert(paymentIntents).values(intent)
  
  return intent
}

export async function processNFCPayment(paymentIntentId: string, customerWalletId: string) {
  const userId = await getUserId()
  const startTime = Date.now()
  
  // Get payment intent
  const intentResult = await db.select().from(paymentIntents).where(eq(paymentIntents.id, paymentIntentId))
  const intent = intentResult[0]
  if (!intent) throw new Error('Payment intent not found')
  if (intent.status !== 'pending') throw new Error('Payment already processed')
  if (new Date(intent.expiresAt) < new Date()) throw new Error('Payment expired')
  
  // Get customer wallet
  const wallet = await db.select().from(wallets).where(and(eq(wallets.id, customerWalletId), eq(wallets.userId, userId)))
  if (!wallet[0]) throw new Error('Wallet not found')
  
  const amount = parseFloat(intent.amount)
  const fee = calculateFee(amount)
  const walletBalance = parseFloat(wallet[0].balance || '0')
  
  if (walletBalance < amount + fee) throw new Error('Insufficient balance')
  
  // Process payment
  const txId = generateId('tx')
  const txHash = '0x' + Buffer.from(txId).toString('hex').padEnd(64, '0')
  const settlementTime = Date.now() - startTime + 450
  
  // Create transaction
  const transaction = {
    id: txId,
    userId,
    walletId: customerWalletId,
    type: 'tap_pay' as const,
    status: 'settled' as const,
    amount: intent.amount,
    currency: intent.currency,
    fee: fee.toString(),
    fromAddress: wallet[0].address,
    merchantId: intent.merchantId,
    paymentIntentId,
    txHash,
    settlementTimeMs: settlementTime,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  
  // Update wallet balance
  await db.update(wallets)
    .set({ 
      balance: (walletBalance - amount - fee).toFixed(8),
      updatedAt: new Date()
    })
    .where(eq(wallets.id, customerWalletId))
  
  // Update payment intent
  await db.update(paymentIntents)
    .set({ 
      status: 'settled',
      customerWalletId,
      txHash,
      settledAt: new Date(),
      updatedAt: new Date()
    })
    .where(eq(paymentIntents.id, paymentIntentId))
  
  // Update merchant stats
  const merchantResult = await db.select().from(merchants).where(eq(merchants.id, intent.merchantId))
  if (merchantResult[0]) {
    const currentVolume = parseFloat(merchantResult[0].totalVolume || '0')
    await db.update(merchants)
      .set({
        totalVolume: (currentVolume + amount).toFixed(8),
        transactionCount: merchantResult[0].transactionCount + 1,
        updatedAt: new Date()
      })
      .where(eq(merchants.id, intent.merchantId))
  }
  
  await db.insert(transactions).values(transaction)
  revalidatePath('/dashboard')
  
  return { transaction, settlementTimeMs: settlementTime }
}

export async function getPaymentIntentStatus(paymentIntentId: string) {
  const result = await db.select().from(paymentIntents).where(eq(paymentIntents.id, paymentIntentId))
  return result[0] || null
}

// ==================== DASHBOARD STATS ====================

export async function getDashboardStats() {
  const userId = await getUserId()
  
  const userWallets = await db.select().from(wallets).where(eq(wallets.userId, userId))
  const userTransactions = await db.select().from(transactions).where(eq(transactions.userId, userId))
  const userCards = await db.select().from(cards).where(eq(cards.userId, userId))
  
  const totalBalance = await getTotalBalance()
  const settledTxs = userTransactions.filter(tx => tx.status === 'settled')
  const avgSettlement = settledTxs.length > 0
    ? settledTxs.reduce((acc, tx) => acc + (tx.settlementTimeMs || 0), 0) / settledTxs.length
    : 0
  
  return {
    totalBalance,
    walletCount: userWallets.length,
    transactionCount: userTransactions.length,
    cardCount: userCards.length,
    avgSettlementMs: Math.round(avgSettlement),
  }
}
