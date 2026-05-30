import { getCards, getWallets } from '@/app/actions/nexa'
import { CardsContent } from '@/components/dashboard/cards-content'

export default async function CardsPage() {
  const [cards, wallets] = await Promise.all([
    getCards(),
    getWallets(),
  ])
  return <CardsContent cards={cards} wallets={wallets} />
}
