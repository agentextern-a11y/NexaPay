import { getWallets, getTransactions } from '@/app/actions/nexa'
import { WalletsContent } from '@/components/dashboard/wallets-content'

export default async function WalletsPage() {
  const [wallets, transactions] = await Promise.all([
    getWallets(),
    getTransactions(10),
  ])
  
  return <WalletsContent wallets={wallets} transactions={transactions} />
}
