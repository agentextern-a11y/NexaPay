import { getDashboardStats, getWallets, getTransactions } from '@/app/actions/nexa'
import { DashboardContent } from '@/components/dashboard/dashboard-content'

export default async function DashboardPage() {
  const [stats, wallets, transactions] = await Promise.all([
    getDashboardStats(),
    getWallets(),
    getTransactions(5),
  ])
  
  return (
    <DashboardContent 
      stats={stats} 
      wallets={wallets} 
      transactions={transactions} 
    />
  )
}
