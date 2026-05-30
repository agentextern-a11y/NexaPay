'use client'

import { useState, useTransition, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createPaymentIntent, processNFCPayment, getPaymentIntentStatus } from '@/app/actions/nexa'
import { formatCurrency } from '@/lib/utils'
import { QRCodeSVG } from 'qrcode.react'
import { 
  Radio, 
  Smartphone, 
  Wallet,
  CheckCircle,
  Clock,
  Zap,
  ScanLine,
  X
} from 'lucide-react'
import type { Wallet as WalletType } from '@/lib/db/schema'

interface TapToPayContentProps {
  wallets: WalletType[]
}

export function TapToPayContent({ wallets }: TapToPayContentProps) {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [mode, setMode] = useState<'pay' | 'receive'>('pay')
  
  // Pay mode state
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null)
  const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(wallets[0] || null)
  const [showPayModal, setShowPayModal] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'ready' | 'scanning' | 'processing' | 'success'>('ready')
  const [settlementTime, setSettlementTime] = useState<number | null>(null)
  
  // Receive mode state
  const [receiveAmount, setReceiveAmount] = useState('')
  const [paymentIntent, setPaymentIntent] = useState<any>(null)
  const [intentStatus, setIntentStatus] = useState<string>('pending')

  // Simulate NFC payment process
  const handlePayment = () => {
    if (!selectedWallet || !paymentIntentId) return
    
    setPaymentStatus('scanning')
    
    // Simulate NFC scanning
    setTimeout(() => {
      setPaymentStatus('processing')
      
      startTransition(async () => {
        try {
          const result = await processNFCPayment(paymentIntentId, selectedWallet.id)
          setSettlementTime(result.settlementTimeMs)
          setPaymentStatus('success')
          toast({ title: 'Payment successful!', variant: 'success' })
        } catch (error: any) {
          toast({ title: error.message || 'Payment failed', variant: 'destructive' })
          setPaymentStatus('ready')
        }
      })
    }, 1500)
  }

  // Create payment intent for receiving
  const handleCreateIntent = () => {
    if (!receiveAmount) return
    
    startTransition(async () => {
      try {
        const intent = await createPaymentIntent(parseFloat(receiveAmount))
        setPaymentIntent(intent)
        setIntentStatus('pending')
        toast({ title: 'Payment request created', variant: 'success' })
      } catch (error: any) {
        toast({ title: error.message || 'Failed to create request', variant: 'destructive' })
      }
    })
  }

  // Poll for payment intent status
  useEffect(() => {
    if (!paymentIntent || intentStatus !== 'pending') return
    
    const interval = setInterval(async () => {
      const status = await getPaymentIntentStatus(paymentIntent.id)
      if (status && status.status !== 'pending') {
        setIntentStatus(status.status)
        if (status.status === 'settled') {
          toast({ title: 'Payment received!', variant: 'success' })
        }
        clearInterval(interval)
      }
    }, 2000)
    
    return () => clearInterval(interval)
  }, [paymentIntent, intentStatus, toast])

  const resetPayment = () => {
    setPaymentStatus('ready')
    setShowPayModal(false)
    setSettlementTime(null)
    setPaymentIntentId(null)
  }

  const resetReceive = () => {
    setPaymentIntent(null)
    setIntentStatus('pending')
    setReceiveAmount('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Tap to Pay</h1>
        <p className="text-muted-foreground">Pay or receive payments instantly with NFC</p>
      </div>

      {/* Tabs */}
      <Tabs value={mode} onValueChange={(v) => setMode(v as 'pay' | 'receive')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pay" className="gap-2">
            <Smartphone className="w-4 h-4" /> Pay
          </TabsTrigger>
          <TabsTrigger value="receive" className="gap-2">
            <Radio className="w-4 h-4" /> Receive
          </TabsTrigger>
        </TabsList>

        {/* Pay Tab */}
        <TabsContent value="pay" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Pay with NFC
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Wallet Selection */}
              <div className="space-y-2">
                <Label>Select Wallet</Label>
                <div className="grid sm:grid-cols-2 gap-3">
                  {wallets.map((wallet) => (
                    <button
                      key={wallet.id}
                      onClick={() => setSelectedWallet(wallet)}
                      className={`p-4 rounded-xl border text-left transition-colors ${
                        selectedWallet?.id === wallet.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
                          <span className="text-white font-bold">{wallet.currency.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{wallet.currency}</p>
                          <p className="text-sm text-muted-foreground">
                            {parseFloat(wallet.balance || '0').toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* NFC Animation */}
              <div className="flex flex-col items-center py-8">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full gradient-bg flex items-center justify-center">
                    <Radio className="w-16 h-16 text-white" />
                  </div>
                  <div className="absolute inset-0 rounded-full gradient-bg opacity-50 animate-pulse-ring" />
                </div>
                <p className="text-center text-muted-foreground mt-6">
                  Ready to pay. Hold your phone near the payment terminal.
                </p>
              </div>

              {/* Demo: Enter payment intent ID */}
              <div className="space-y-2">
                <Label>Payment Intent ID (from merchant)</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="pay_..."
                    value={paymentIntentId || ''}
                    onChange={(e) => setPaymentIntentId(e.target.value)}
                  />
                  <Button 
                    onClick={() => setShowPayModal(true)}
                    disabled={!paymentIntentId || !selectedWallet}
                  >
                    Pay Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Receive Tab */}
        <TabsContent value="receive" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Radio className="w-5 h-5" />
                Receive Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!paymentIntent ? (
                <>
                  <div className="space-y-2">
                    <Label>Amount to Receive</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={receiveAmount}
                        onChange={(e) => setReceiveAmount(e.target.value)}
                        className="pl-8 text-2xl h-14"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {['5', '10', '25', '50'].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setReceiveAmount(amt)}
                        className="p-3 rounded-lg border border-border hover:border-primary text-center"
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>
                  <Button 
                    onClick={handleCreateIntent} 
                    disabled={isPending || !receiveAmount}
                    className="w-full"
                    size="lg"
                  >
                    {isPending ? 'Creating...' : 'Generate Payment Request'}
                  </Button>
                </>
              ) : (
                <div className="space-y-6">
                  {/* QR Code */}
                  <div className="flex flex-col items-center">
                    <div className="p-4 bg-white rounded-2xl">
                      <QRCodeSVG
                        value={JSON.stringify(paymentIntent.nfcPayload)}
                        size={200}
                        level="H"
                      />
                    </div>
                    <p className="text-center text-muted-foreground mt-4">
                      Scan QR or tap NFC to pay
                    </p>
                  </div>

                  {/* Payment Details */}
                  <div className="p-4 rounded-xl bg-secondary/50 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="font-semibold text-foreground">
                        {formatCurrency(parseFloat(paymentIntent.amount))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment ID</span>
                      <span className="font-mono text-sm text-foreground">{paymentIntent.id}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Status</span>
                      <div className="flex items-center gap-2">
                        {intentStatus === 'settled' ? (
                          <CheckCircle className="w-4 h-4 text-success" />
                        ) : (
                          <Clock className="w-4 h-4 text-warning animate-pulse" />
                        )}
                        <span className={`capitalize ${
                          intentStatus === 'settled' ? 'text-success' : 'text-warning'
                        }`}>
                          {intentStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  {intentStatus === 'settled' ? (
                    <div className="text-center py-4">
                      <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-foreground">Payment Received!</h3>
                      <p className="text-muted-foreground">
                        {formatCurrency(parseFloat(paymentIntent.amount))} has been added to your account
                      </p>
                      <Button onClick={resetReceive} className="mt-4">
                        Create New Request
                      </Button>
                    </div>
                  ) : (
                    <Button variant="outline" onClick={resetReceive} className="w-full">
                      Cancel Request
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* How it works */}
      <Card>
        <CardHeader>
          <CardTitle>How Tap to Pay Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: Wallet, title: 'Select Wallet', desc: 'Choose which wallet to pay from' },
              { icon: ScanLine, title: 'Tap Device', desc: 'Hold your phone near the terminal' },
              { icon: Zap, title: 'Instant Settlement', desc: 'Payment confirms in under 500ms' },
            ].map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-3 relative">
                  <step.icon className="w-7 h-7 text-primary" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-foreground text-background rounded-full text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{step.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-sm">
            <CardContent className="p-6">
              {paymentStatus === 'ready' && (
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center mx-auto">
                    <Radio className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Ready to Pay</h3>
                  <p className="text-muted-foreground">
                    Confirm payment from your {selectedWallet?.currency} wallet
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={resetPayment} className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={handlePayment} className="flex-1">
                      Confirm
                    </Button>
                  </div>
                </div>
              )}

              {paymentStatus === 'scanning' && (
                <div className="text-center space-y-4 py-8">
                  <div className="relative inline-block">
                    <div className="w-20 h-20 rounded-full bg-warning/20 flex items-center justify-center">
                      <ScanLine className="w-10 h-10 text-warning animate-pulse" />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-warning/20 animate-pulse-ring" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Scanning...</h3>
                  <p className="text-muted-foreground">Detecting payment terminal</p>
                </div>
              )}

              {paymentStatus === 'processing' && (
                <div className="text-center space-y-4 py-8">
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                    <Zap className="w-10 h-10 text-primary animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Processing...</h3>
                  <p className="text-muted-foreground">Confirming on blockchain</p>
                </div>
              )}

              {paymentStatus === 'success' && (
                <div className="text-center space-y-4 py-4">
                  <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10 text-success" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Payment Complete!</h3>
                  {settlementTime && (
                    <div className="p-3 rounded-lg bg-success/10 inline-block">
                      <p className="text-success font-semibold">
                        Settled in {settlementTime}ms
                      </p>
                    </div>
                  )}
                  <Button onClick={resetPayment} className="w-full mt-4">
                    Done
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
