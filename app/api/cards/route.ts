import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { cards } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userCards = await db.query.cards.findMany({
    where: eq(cards.userId, session.user.id),
  })

  return NextResponse.json({ cards: userCards })
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { walletId, type = 'virtual', spendingLimit } = await req.json()

  // Generate card details
  const cardNumber = crypto.randomBytes(8).toString('hex').toUpperCase()
  const lastFour = cardNumber.slice(-4)
  const expiryMonth = new Date().getMonth() + 1
  const expiryYear = new Date().getFullYear() + 3

  const newCard = await db
    .insert(cards)
    .values({
      id: 'CARD-' + crypto.randomUUID(),
      userId: session.user.id,
      walletId,
      type,
      status: 'active',
      lastFour,
      expiryMonth,
      expiryYear,
      spendingLimit: spendingLimit ? parseFloat(spendingLimit) : null,
      currentSpend: 0,
    })
    .returning()

  return NextResponse.json({ card: newCard[0] }, { status: 201 })
}
