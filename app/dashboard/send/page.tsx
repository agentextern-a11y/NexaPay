import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import SendPaymentContent from '@/components/dashboard/send-payment-content'

export default async function SendPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')

  return <SendPaymentContent />
}
