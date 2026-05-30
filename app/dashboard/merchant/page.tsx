import { getMerchantProfile } from '@/app/actions/nexa'
import { MerchantContent } from '@/components/dashboard/merchant-content'

export default async function MerchantPage() {
  const merchant = await getMerchantProfile()
  return <MerchantContent merchant={merchant} />
}
