import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { wallets } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userWallets = await db.query.wallets.findMany({
    where: eq(wallets.userId, session.user.id),
  })

  return NextResponse.json({ wallets: userWallets })
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { currency = 'USDC' } = await req.json()

  // Generate unique wallet address
  const address = '0x' + crypto.randomBytes(20).toString('hex')

  const newWallet = await db
    .insert(wallets)
    .values({
      id: crypto.randomUUID(),
      userId: session.user.id,
      address,
      currency,
      balance: 0,
      isDefault: false,
    })
    .returning()

  return NextResponse.json({ wallet: newWallet[0] }, { status: 201 })
}
