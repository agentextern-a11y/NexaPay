'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { registerMerchant } from '@/app/actions/nexa'
import { formatCurrency } from '@/lib/utils'
import { 
  Store,
  Key,
  Copy,
  Check,
  Shield,
  TrendingUp,
  Hash,
  AlertTriangle
} from 'lucide-react'
import type { Merchant } from '@/lib/db/schema'

interface MerchantContentProps {
  merchant: Merchant | null
}

export function MerchantContent({ merchant }: MerchantContentProps) {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [businessName, setBusinessName] = useState('')
  const [email, setEmail] = useState('')
  const [apiSecret, setApiSecret] = useState<string | null>(null)
  const [copiedKey, setCopiedKey] = useState(false)
  const [copiedSecret, setCopiedSecret] = useState(false)

  const handleRegister = () => {
    if (!businessName || !email) return
    
    startTransition(async () => {
      try {
        const result = await registerMerchant(businessName, email)
        setApiSecret(result.apiSecretPlaintext)
        toast({ title: 'Merchant account created', variant: 'success' })
      } catch (error: any) {
        toast({ title: error.message || 'Failed to register', variant: 'destructive' })
      }
    })
  }

  const copyToClipboard = (text: string, type: 'key' | 'secret') => {
    navigator.clipboard.writeText(text)
    if (type === 'key') {
      setCopiedKey(true)
      setTimeout(() => setCopiedKey(false), 2000)
    } else {
      setCopiedSecret(true)
      setTimeout(() => setCopiedSecret(false), 2000)
    }
    toast({ title: 'Copied to clipboard' })
  }

  if (!merchant && !apiSecret) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Merchant Portal</h1>
          <p className="text-muted-foreground">Accept crypto payments for your business</p>
        </div>

        {/* Registration Card */}
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="w-5 h-5" />
              Register as Merchant
            </CardTitle>
            <CardDescription>
              Set up your merchant account to start accepting NEXA payments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Business Name</Label>
              <Input
                placeholder="Your Business Name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Business Email</Label>
              <Input
                type="email"
                placeholder="business@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleRegister} 
              disabled={isPending || !businessName || !email}
              className="w-full"
            >
              {isPending ? 'Registering...' : 'Register Merchant Account'}
            </Button>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: Shield, title: '0.5% Fees', desc: 'Industry-lowest transaction fees' },
            { icon: TrendingUp, title: 'Instant Settlement', desc: 'Receive funds in seconds' },
            { icon: Key, title: 'Simple API', desc: 'Easy integration for developers' },
          ].map((feature) => (
            <Card key={feature.title}>
              <CardContent className="p-6 text-center">
                <feature.icon className="w-10 h-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Show API keys after registration or existing merchant
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Merchant Portal</h1>
        <p className="text-muted-foreground">Manage your merchant account and API keys</p>
      </div>

      {/* Show secret warning if just registered */}
      {apiSecret && (
        <Card className="border-warning">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-warning flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground">Save Your API Secret</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  This is the only time your API secret will be shown. Store it securely.
                </p>
                <div className="p-3 rounded-lg bg-secondary font-mono text-sm break-all">
                  {apiSecret}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3 gap-2"
                  onClick={() => copyToClipboard(apiSecret, 'secret')}
                >
                  {copiedSecret ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedSecret ? 'Copied!' : 'Copy Secret'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Volume</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(parseFloat(merchant?.totalVolume || '0'))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                <Hash className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Transactions</p>
                <p className="text-2xl font-bold text-foreground">
                  {merchant?.transactionCount || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className={`text-lg font-bold ${
                  merchant?.isVerified ? 'text-success' : 'text-warning'
                }`}>
                  {merchant?.isVerified ? 'Verified' : 'Pending'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Keys */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            API Credentials
          </CardTitle>
          <CardDescription>
            Use these credentials to integrate NEXA payments into your application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>API Key</Label>
            <div className="flex gap-2">
              <Input
                value={merchant?.apiKey || ''}
                readOnly
                className="font-mono"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(merchant?.apiKey || '', 'key')}
              >
                {copiedKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Business Name</Label>
            <Input value={merchant?.businessName || ''} readOnly />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={merchant?.email || ''} readOnly />
          </div>
        </CardContent>
      </Card>

      {/* Integration Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-lg bg-secondary font-mono text-sm overflow-x-auto">
            <pre className="text-muted-foreground">{`// Create a payment intent
const response = await fetch('https://api.nexapay.com/v1/payments', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ${merchant?.apiKey || 'your_api_key'}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    amount: 10.00,
    currency: 'USDC'
  })
});

const { paymentId, nfcPayload } = await response.json();
// Display QR code or NFC payload to customer`}</pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
