'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { createCard, updateCardStatus } from '@/app/actions/nexa'
import { 
  CreditCard, 
  Plus, 
  Snowflake,
  PlayCircle,
  XCircle,
  Wifi,
  X
} from 'lucide-react'
import type { Card as CardType, Wallet } from '@/lib/db/schema'

interface CardsContentProps {
  cards: CardType[]
  wallets: Wallet[]
}

export function CardsContent({ cards, wallets }: CardsContentProps) {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [cardType, setCardType] = useState<'virtual' | 'physical'>('virtual')
  const [selectedWallet, setSelectedWallet] = useState<string>(wallets[0]?.id || '')
  const [spendingLimit, setSpendingLimit] = useState('')

  const handleCreateCard = () => {
    if (!selectedWallet) return
    
    startTransition(async () => {
      try {
        await createCard(
          selectedWallet,
          cardType,
          spendingLimit ? parseFloat(spendingLimit) : undefined
        )
        toast({ title: 'Card created successfully', variant: 'success' })
        setShowCreateModal(false)
        setSpendingLimit('')
      } catch (error: any) {
        toast({ title: error.message || 'Failed to create card', variant: 'destructive' })
      }
    })
  }

  const handleStatusChange = (cardId: string, status: 'active' | 'frozen' | 'cancelled') => {
    startTransition(async () => {
      try {
        await updateCardStatus(cardId, status)
        toast({ title: `Card ${status}`, variant: 'success' })
      } catch (error: any) {
        toast({ title: error.message || 'Failed to update card', variant: 'destructive' })
      }
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-success bg-success/20'
      case 'frozen':
        return 'text-primary bg-primary/20'
      case 'pending':
        return 'text-warning bg-warning/20'
      default:
        return 'text-destructive bg-destructive/20'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Cards</h1>
          <p className="text-muted-foreground">Manage your virtual and physical cards</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="gap-2">
          <Plus className="w-4 h-4" /> New Card
        </Button>
      </div>

      {/* Cards Grid */}
      {cards.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <CreditCard className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No cards yet</h3>
            <p className="text-muted-foreground mb-6">Create your first card to start spending</p>
            <Button onClick={() => setShowCreateModal(true)}>Create Card</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div key={card.id} className="perspective-1000">
              <div className="relative">
                {/* Card Design */}
                <div className={`aspect-[1.586/1] rounded-2xl p-5 sm:p-6 ${
                  card.type === 'virtual' 
                    ? 'gradient-bg' 
                    : 'bg-gradient-to-br from-secondary to-card border border-border'
                }`}>
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-8 sm:mb-12">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm sm:text-base">N</span>
                      </div>
                      <span className="text-white/80 text-xs sm:text-sm font-medium">NEXA Pay</span>
                    </div>
                    <Wifi className="w-5 h-5 sm:w-6 sm:h-6 text-white/60 rotate-90" />
                  </div>
                  
                  {/* Card Number */}
                  <div className="mb-4 sm:mb-6">
                    <p className="text-white font-mono text-base sm:text-lg tracking-widest">
                      •••• •••• •••• {card.lastFour}
                    </p>
                  </div>
                  
                  {/* Card Footer */}
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-white/60 text-[10px] sm:text-xs">EXPIRES</p>
                      <p className="text-white text-xs sm:text-sm font-medium">
                        {String(card.expiryMonth).padStart(2, '0')}/{String(card.expiryYear).slice(-2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] sm:text-xs px-2 py-1 rounded-full ${getStatusColor(card.status)}`}>
                        {card.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Type</span>
                    <span className="text-foreground capitalize">{card.type}</span>
                  </div>
                  {card.spendingLimit && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Spending Limit</span>
                      <span className="text-foreground">${parseFloat(card.spendingLimit).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current Spend</span>
                    <span className="text-foreground">${parseFloat(card.currentSpend || '0').toFixed(2)}</span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    {card.status === 'active' ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 gap-1"
                        onClick={() => handleStatusChange(card.id, 'frozen')}
                        disabled={isPending}
                      >
                        <Snowflake className="w-4 h-4" /> Freeze
                      </Button>
                    ) : card.status === 'frozen' ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 gap-1"
                        onClick={() => handleStatusChange(card.id, 'active')}
                        disabled={isPending}
                      >
                        <PlayCircle className="w-4 h-4" /> Unfreeze
                      </Button>
                    ) : null}
                    {card.status !== 'cancelled' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-1 text-destructive hover:text-destructive"
                        onClick={() => handleStatusChange(card.id, 'cancelled')}
                        disabled={isPending}
                      >
                        <XCircle className="w-4 h-4" /> Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Card Features */}
      <Card>
        <CardHeader>
          <CardTitle>Card Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Zero FX Fees', desc: 'No foreign transaction fees worldwide' },
              { title: 'Instant Lock', desc: 'Freeze your card instantly from the app' },
              { title: 'Real-time Alerts', desc: 'Get notified of every transaction' },
              { title: 'Crypto Cashback', desc: 'Earn up to 3% back in NEXA tokens' },
            ].map((feature) => (
              <div key={feature.title} className="p-4 rounded-xl bg-secondary/50">
                <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Card Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Create New Card</CardTitle>
              <button onClick={() => setShowCreateModal(false)}>
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Card Type */}
              <div className="space-y-2">
                <Label>Card Type</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setCardType('virtual')}
                    className={`p-4 rounded-xl border text-center transition-colors ${
                      cardType === 'virtual'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <CreditCard className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="font-medium text-foreground">Virtual</p>
                    <p className="text-xs text-muted-foreground">Instant activation</p>
                  </button>
                  <button
                    onClick={() => setCardType('physical')}
                    className={`p-4 rounded-xl border text-center transition-colors ${
                      cardType === 'physical'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <CreditCard className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="font-medium text-foreground">Physical</p>
                    <p className="text-xs text-muted-foreground">Ships in 5-7 days</p>
                  </button>
                </div>
              </div>

              {/* Wallet Selection */}
              <div className="space-y-2">
                <Label>Linked Wallet</Label>
                <div className="space-y-2">
                  {wallets.map((wallet) => (
                    <button
                      key={wallet.id}
                      onClick={() => setSelectedWallet(wallet.id)}
                      className={`w-full p-3 rounded-xl border text-left transition-colors ${
                        selectedWallet === wallet.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{wallet.currency.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{wallet.currency} Wallet</p>
                          <p className="text-xs text-muted-foreground">
                            Balance: {parseFloat(wallet.balance || '0').toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Spending Limit */}
              <div className="space-y-2">
                <Label>Spending Limit (optional)</Label>
                <Input
                  type="number"
                  placeholder="No limit"
                  value={spendingLimit}
                  onChange={(e) => setSpendingLimit(e.target.value)}
                />
              </div>

              <Button 
                onClick={handleCreateCard} 
                disabled={isPending || !selectedWallet}
                className="w-full"
              >
                {isPending ? 'Creating...' : 'Create Card'}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
