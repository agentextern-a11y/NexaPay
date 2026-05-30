import { getTransactions } from '@/app/actions/nexa'
import { TransactionsContent } from '@/components/dashboard/transactions-content'

export default async function TransactionsPage() {
  const transactions = await getTransactions(50)
  return <TransactionsContent transactions={transactions} />
}
