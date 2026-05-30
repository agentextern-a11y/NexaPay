import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { transactions } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')

  const userTransactions = await db.query.transactions.findMany({
    where: eq(transactions.userId, session.user.id),
    orderBy: desc(transactions.createdAt),
    limit,
    offset,
  })

  return NextResponse.json({ transactions: userTransactions })
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const {
    walletId,
    type,
    toAddress,
    amount,
    currency,
    fee = 0,
  } = await req.json()

  const startTime = Date.now()

  const newTransaction = await db
    .insert(transactions)
    .values({
      id: 'TX-' + crypto.randomBytes(6).toString('hex').toUpperCase(),
      userId: session.user.id,
      walletId,
      type,
      status: 'settled',
      amount: parseFloat(amount),
      currency,
      fee: parseFloat(fee),
      toAddress,
      txHash: '0x' + crypto.randomBytes(32).toString('hex'),
      settlementTimeMs: Date.now() - startTime,
    })
    .returning()

  return NextResponse.json({ transaction: newTransaction[0] }, { status: 201 })
}
