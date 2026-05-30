import { getWallets } from '@/app/actions/nexa'
import { TapToPayContent } from '@/components/dashboard/tap-to-pay-content'

export default async function TapToPayPage() {
  const wallets = await getWallets()
  return <TapToPayContent wallets={wallets} />
}
