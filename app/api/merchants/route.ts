import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { merchants } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userMerchants = await db.query.merchants.findMany({
    where: eq(merchants.userId, session.user.id),
  })

  return NextResponse.json({ merchants: userMerchants })
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { businessName, email } = await req.json()

  const merchantId = 'M-' + crypto.randomBytes(6).toString('hex').toUpperCase()
  const apiKey = 'nexa_' + crypto.randomBytes(32).toString('hex')
  const apiSecret = crypto.randomBytes(32).toString('hex')

  const newMerchant = await db
    .insert(merchants)
    .values({
      id: merchantId,
      userId: session.user.id,
      businessName,
      apiKey,
      apiSecret,
      email,
      isVerified: false,
    })
    .returning()

  return NextResponse.json(
    {
      merchant: {
        ...newMerchant[0],
        apiSecret: undefined, // Don't return secret in response
      },
      apiKey,
      apiSecret, // Only return once on creation
    },
    { status: 201 }
  )
}
