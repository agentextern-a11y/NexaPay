import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { randomBytes, createHash } from 'crypto'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(prefix: string = ''): string {
  const id = randomBytes(12).toString('hex')
  return prefix ? `${prefix}_${id}` : id
}

export function generateWalletAddress(): string {
  return '0x' + randomBytes(20).toString('hex')
}

export function generateApiKey(): string {
  return 'nexa_' + randomBytes(32).toString('hex')
}

export function generateApiSecret(): string {
  return randomBytes(32).toString('hex')
}

export function hashApiSecret(secret: string): string {
  return createHash('sha256').update(secret).digest('hex')
}

export function formatCurrency(amount: number | string, currency: string = 'USD'): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  if (currency === 'USD' || currency === 'USDC' || currency === 'USDT') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num)
  }
  return `${num.toFixed(8)} ${currency}`
}

export function formatCrypto(amount: number | string, currency: string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  if (currency === 'BTC') {
    return `${num.toFixed(8)} BTC`
  }
  if (currency === 'ETH') {
    return `${num.toFixed(6)} ETH`
  }
  return `${num.toFixed(2)} ${currency}`
}

export function shortenAddress(address: string, chars: number = 4): string {
  if (!address) return ''
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

export function calculateFee(amount: number, feePercent: number = 0.01): number {
  return amount * feePercent
}

export function generateNFCPayload(paymentId: string, merchantId: string, amount: string, currency: string): object {
  return {
    protocol: 'NEXA-NFC-1.0',
    version: '1',
    paymentId,
    merchantId,
    amount,
    currency,
    nonce: randomBytes(16).toString('hex'),
    timestamp: Date.now(),
    expiresAt: Date.now() + 60000, // 60 seconds
  }
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now.getTime() - past.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return past.toLocaleDateString()
}
