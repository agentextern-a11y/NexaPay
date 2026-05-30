import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { paymentIntents } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { merchantId, amount, currency = 'USDC' } = await req.json()

  const paymentId = 'PAY-' + crypto.randomBytes(6).toString('hex').toUpperCase()
  const nonce = crypto.randomBytes(16).toString('hex')
  const expiresAt = new Date(Date.now() + 60 * 1000) // 60 seconds

  const newIntent = await db
    .insert(paymentIntents)
    .values({
      id: paymentId,
      merchantId,
      amount: parseFloat(amount),
      currency,
      status: 'pending',
      nfcPayload: {
        protocol: 'NEXA-NFC-1.0',
        paymentId,
        merchantId,
        amount: amount.toString(),
        currency,
        nonce,
        expiresAt: Math.floor(expiresAt.getTime() / 1000),
      },
      expiresAt,
    })
    .returning()

  return NextResponse.json(
    {
      paymentIntent: newIntent[0],
    },
    { status: 201 }
  )
}

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const paymentId = searchParams.get('paymentId')

  if (!paymentId) {
    return NextResponse.json({ error: 'Payment ID required' }, { status: 400 })
  }

  const intent = await db.query.paymentIntents.findFirst({
    where: eq(paymentIntents.id, paymentId),
  })

  if (!intent) {
    return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
  }

  return NextResponse.json({ paymentIntent: intent })
}
