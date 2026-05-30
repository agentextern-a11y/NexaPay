'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import useSWR from 'swr'
import { ArrowRight, Loader2, AlertCircle } from 'lucide-react'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface Wallet {
  id: string
  address: string
  currency: string
  balance: number
}

export default function SendPaymentContent() {
  const { toast } = useToast()
  const { data: walletsData, isLoading } = useSWR('/api/wallets', fetcher)
  const wallets: Wallet[] = walletsData?.wallets || []

  const [selectedWallet, setSelectedWallet] = useState<string>('')
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [isSending, setIsSending] = useState(false)

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedWallet || !recipient || !amount) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      })
      return
    }

    if (!recipient.startsWith('0x') || recipient.length !== 42) {
      toast({
        title: 'Error',
        description: 'Invalid wallet address',
        variant: 'destructive',
      })
      return
    }

    setIsSending(true)

    try {
      const wallet = wallets.find((w) => w.id === selectedWallet)
      if (!wallet) throw new Error('Wallet not found')

      const fee = 0.25
      const total = parseFloat(amount) + fee

      if (wallet.balance < total) {
        toast({
          title: 'Insufficient Balance',
          description: `You need ${total} ${wallet.currency} but have ${wallet.balance}`,
          variant: 'destructive',
        })
        return
      }

      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletId: selectedWallet,
          type: 'send',
          toAddress: recipient,
          amount,
          currency: wallet.currency,
          fee,
        }),
      })

      if (!response.ok) throw new Error('Failed to send payment')

      const data = await response.json()

      toast({
        title: 'Payment Sent',
        description: `Successfully sent ${amount} ${wallet.currency} to ${recipient.slice(0, 6)}...${recipient.slice(-4)}`,
      })

      setRecipient('')
      setAmount('')
      setSelectedWallet('')
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send payment',
        variant: 'destructive',
      })
    } finally {
      setIsSending(false)
    }
  }

  const selectedWalletData = wallets.find((w) => w.id === selectedWallet)
  const fee = 0.25
  const total = selectedWalletData ? parseFloat(amount || '0') + fee : fee

  return (
    <div className="container mx-auto py-6 px-4 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Send Payment</h1>
        <p className="text-gray-400">Transfer crypto to any wallet address</p>
      </div>

      <form onSubmit={handleSend}>
        <div className="space-y-6">
          {/* From Wallet */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">From Wallet</CardTitle>
              <CardDescription>Select the wallet to send from</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                </div>
              ) : wallets.length > 0 ? (
                <div className="space-y-2">
                  {wallets.map((wallet) => (
                    <label
                      key={wallet.id}
                      className="flex items-center p-4 border border-gray-800 rounded-lg cursor-pointer hover:bg-gray-800 transition"
                    >
                      <input
                        type="radio"
                        name="wallet"
                        value={wallet.id}
                        checked={selectedWallet === wallet.id}
                        onChange={(e) => setSelectedWallet(e.target.value)}
                        className="w-4 h-4"
                      />
                      <div className="ml-4 flex-1">
                        <p className="text-white font-medium">{wallet.currency} Wallet</p>
                        <p className="text-sm text-gray-400">{wallet.address.slice(0, 10)}...{wallet.address.slice(-8)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">{wallet.balance}</p>
                        <p className="text-sm text-gray-400">{wallet.currency}</p>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-blue-400" />
                  <p className="text-sm text-blue-400">No wallets yet. Create one first.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {selectedWallet && (
            <>
              {/* Recipient */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Recipient</CardTitle>
                  <CardDescription>Enter the recipient wallet address</CardDescription>
                </CardHeader>
                <CardContent>
                  <Input
                    placeholder="0x..."
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  />
                </CardContent>
              </Card>

              {/* Amount */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Amount</CardTitle>
                  <CardDescription>How much would you like to send?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 pr-20"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      {selectedWalletData?.currency}
                    </span>
                  </div>

                  {/* Fee Summary */}
                  <div className="space-y-2 p-4 bg-gray-800 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Amount</span>
                      <span className="text-white">
                        {amount || '0'} {selectedWalletData?.currency}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Network Fee</span>
                      <span className="text-white">{fee} USDC</span>
                    </div>
                    <div className="border-t border-gray-700 pt-2 flex justify-between">
                      <span className="text-white font-medium">Total</span>
                      <span className="text-indigo-400 font-bold">
                        {total.toFixed(2)} {selectedWalletData?.currency}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Button */}
              <Button
                type="submit"
                disabled={isSending || !amount || !recipient}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white py-6 text-lg"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Send Payment
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </form>
    </div>
  )
}
