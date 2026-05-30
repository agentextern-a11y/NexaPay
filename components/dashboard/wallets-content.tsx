'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { formatCurrency, shortenAddress } from '@/lib/utils'
import { createWallet, sendPayment, topUpWallet } from '@/app/actions/nexa'
import { 
  Wallet, 
  Plus, 
  Send, 
  ArrowDownLeft,
  Copy,
  Check,
  X
} from 'lucide-react'
import type { Wallet as WalletType, Transaction } from '@/lib/db/schema'

interface WalletsContentProps {
  wallets: WalletType[]
  transactions: Transaction[]
}

export function WalletsContent({ wallets, transactions }: WalletsContentProps) {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showSendModal, setShowSendModal] = useState(false)
  const [showTopUpModal, setShowTopUpModal] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null)
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)
  
  // Form states
  const [currency, setCurrency] = useState('USDC')
  const [sendAddress, setSendAddress] = useState('')
  const [sendAmount, setSendAmount] = useState('')
  const [topUpAmount, setTopUpAmount] = useState('')

  const handleCreateWallet = () => {
    startTransition(async () => {
      try {
        await createWallet(currency)
        toast({ title: 'Wallet created successfully', variant: 'success' })
        setShowCreateModal(false)
        setCurrency('USDC')
      } catch (error) {
        toast({ title: 'Failed to create wallet', variant: 'destructive' })
      }
    })
  }

  const handleSend = () => {
    if (!selectedWallet) return
    startTransition(async () => {
      try {
        await sendPayment(selectedWallet.id, sendAddress, parseFloat(sendAmount), selectedWallet.currency)
        toast({ title: 'Payment sent successfully', variant: 'success' })
        setShowSendModal(false)
        setSendAddress('')
        setSendAmount('')
      } catch (error: any) {
        toast({ title: error.message || 'Failed to send payment', variant: 'destructive' })
      }
    })
  }

  const handleTopUp = () => {
    if (!selectedWallet) return
    startTransition(async () => {
      try {
        await topUpWallet(selectedWallet.id, parseFloat(topUpAmount))
        toast({ title: 'Wallet topped up successfully', variant: 'success' })
        setShowTopUpModal(false)
        setTopUpAmount('')
      } catch (error: any) {
        toast({ title: error.message || 'Failed to top up', variant: 'destructive' })
      }
    })
  }

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    setCopiedAddress(address)
    setTimeout(() => setCopiedAddress(null), 2000)
  }

  const totalBalance = wallets.reduce((acc, w) => acc + parseFloat(w.balance || '0'), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Wallets</h1>
          <p className="text-muted-foreground">Manage your cryptocurrency wallets</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Create Wallet
        </Button>
      </div>

      {/* Total Balance Card */}
      <Card className="gradient-bg border-0">
        <CardContent className="p-6">
          <p className="text-white/70 text-sm">Total Balance</p>
          <p className="text-3xl sm:text-4xl font-bold text-white mt-1">
            {formatCurrency(totalBalance)}
          </p>
          <p className="text-white/60 text-sm mt-2">{wallets.length} wallet(s)</p>
        </CardContent>
      </Card>

      {/* Wallets Grid */}
      {wallets.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Wallet className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No wallets yet</h3>
            <p className="text-muted-foreground mb-6">Create your first wallet to start using NEXA Pay</p>
            <Button onClick={() => setShowCreateModal(true)}>Create Wallet</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wallets.map((wallet) => (
            <Card key={wallet.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
                      <span className="text-white font-bold">{wallet.currency.charAt(0)}</span>
                    </div>
                    <div>
                      <CardTitle className="text-base">{wallet.currency} Wallet</CardTitle>
                      {wallet.isDefault && (
                        <span className="text-xs text-primary">Default</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {parseFloat(wallet.balance || '0').toFixed(2)} {wallet.currency}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-muted-foreground font-mono">
                      {shortenAddress(wallet.address, 6)}
                    </p>
                    <button
                      onClick={() => copyAddress(wallet.address)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {copiedAddress === wallet.address ? (
                        <Check className="w-3 h-3 text-success" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 gap-1"
                    onClick={() => {
                      setSelectedWallet(wallet)
                      setShowTopUpModal(true)
                    }}
                  >
                    <ArrowDownLeft className="w-4 h-4" /> Top Up
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 gap-1"
                    onClick={() => {
                      setSelectedWallet(wallet)
                      setShowSendModal(true)
                    }}
                  >
                    <Send className="w-4 h-4" /> Send
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Wallet Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Create New Wallet</CardTitle>
              <button onClick={() => setShowCreateModal(false)}>
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Currency</Label>
                <div className="grid grid-cols-3 gap-2">
                  {['USDC', 'USDT', 'ETH', 'BTC', 'NEXA'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setCurrency(c)}
                      className={`p-3 rounded-lg border text-center transition-colors ${
                        currency === c
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <Button onClick={handleCreateWallet} disabled={isPending} className="w-full">
                {isPending ? 'Creating...' : 'Create Wallet'}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Send Modal */}
      {showSendModal && selectedWallet && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Send {selectedWallet.currency}</CardTitle>
              <button onClick={() => setShowSendModal(false)}>
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-lg bg-secondary/50">
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="text-xl font-bold">
                  {parseFloat(selectedWallet.balance || '0').toFixed(2)} {selectedWallet.currency}
                </p>
              </div>
              <div className="space-y-2">
                <Label>Recipient Address</Label>
                <Input
                  placeholder="0x..."
                  value={sendAddress}
                  onChange={(e) => setSendAddress(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                />
              </div>
              <div className="p-3 rounded-lg bg-secondary/50 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Network Fee</span>
                  <span>{(parseFloat(sendAmount || '0') * 0.01).toFixed(4)} {selectedWallet.currency}</span>
                </div>
              </div>
              <Button onClick={handleSend} disabled={isPending || !sendAddress || !sendAmount} className="w-full">
                {isPending ? 'Sending...' : 'Send Payment'}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top Up Modal */}
      {showTopUpModal && selectedWallet && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Top Up {selectedWallet.currency}</CardTitle>
              <button onClick={() => setShowTopUpModal(false)}>
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-lg bg-secondary/50">
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p className="text-xl font-bold">
                  {parseFloat(selectedWallet.balance || '0').toFixed(2)} {selectedWallet.currency}
                </p>
              </div>
              <div className="space-y-2">
                <Label>Amount to Add</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {['10', '50', '100', '500'].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setTopUpAmount(amt)}
                    className="p-2 rounded-lg border border-border hover:border-primary text-center text-sm"
                  >
                    ${amt}
                  </button>
                ))}
              </div>
              <Button onClick={handleTopUp} disabled={isPending || !topUpAmount} className="w-full">
                {isPending ? 'Processing...' : 'Top Up Wallet'}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
