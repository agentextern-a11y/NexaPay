'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatRelativeTime, shortenAddress } from '@/lib/utils'
import { 
  Wallet, 
  TrendingUp, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft,
  Zap,
  Plus,
  Radio
} from 'lucide-react'
import Link from 'next/link'
import type { Wallet as WalletType, Transaction } from '@/lib/db/schema'

interface DashboardContentProps {
  stats: {
    totalBalance: number
    walletCount: number
    transactionCount: number
    cardCount: number
    avgSettlementMs: number
  }
  wallets: WalletType[]
  transactions: Transaction[]
}

export function DashboardContent({ stats, wallets, transactions }: DashboardContentProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your NEXA Pay dashboard</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/wallets">
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="w-4 h-4" /> Add Wallet
            </Button>
          </Link>
          <Link href="/dashboard/tap-to-pay">
            <Button size="sm" className="gap-2">
              <Radio className="w-4 h-4" /> Tap to Pay
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl gradient-bg flex items-center justify-center">
                <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Total Balance</p>
                <p className="text-lg sm:text-2xl font-bold text-foreground">
                  {formatCurrency(stats.totalBalance)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-success/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-success" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Transactions</p>
                <p className="text-lg sm:text-2xl font-bold text-foreground">{stats.transactionCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Active Cards</p>
                <p className="text-lg sm:text-2xl font-bold text-foreground">{stats.cardCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-warning/20 flex items-center justify-center">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-warning" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Avg Settlement</p>
                <p className="text-lg sm:text-2xl font-bold text-foreground">{stats.avgSettlementMs}ms</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Wallets */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Your Wallets</CardTitle>
            <Link href="/dashboard/wallets">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {wallets.length === 0 ? (
              <div className="text-center py-8">
                <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No wallets yet</p>
                <Link href="/dashboard/wallets">
                  <Button size="sm">Create Wallet</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {wallets.slice(0, 4).map((wallet) => (
                  <div
                    key={wallet.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {wallet.currency.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{wallet.currency} Wallet</p>
                        <p className="text-xs text-muted-foreground">
                          {shortenAddress(wallet.address)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        {parseFloat(wallet.balance || '0').toFixed(2)} {wallet.currency}
                      </p>
                      {wallet.isDefault && (
                        <span className="text-xs text-primary">Default</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
            <Link href="/dashboard/transactions">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-secondary/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.type === 'receive' || tx.type === 'top_up'
                          ? 'bg-success/20'
                          : 'bg-primary/20'
                      }`}>
                        {tx.type === 'receive' || tx.type === 'top_up' ? (
                          <ArrowDownLeft className="w-5 h-5 text-success" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground capitalize">
                          {tx.type.replace('_', ' ')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatRelativeTime(tx.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        tx.type === 'receive' || tx.type === 'top_up'
                          ? 'text-success'
                          : 'text-foreground'
                      }`}>
                        {tx.type === 'receive' || tx.type === 'top_up' ? '+' : '-'}
                        {parseFloat(tx.amount).toFixed(2)} {tx.currency}
                      </p>
                      <p className={`text-xs ${
                        tx.status === 'settled' ? 'text-success' : 'text-warning'
                      }`}>
                        {tx.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link href="/dashboard/wallets?action=topup">
              <div className="p-4 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors text-center cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                  <ArrowDownLeft className="w-6 h-6 text-primary" />
                </div>
                <p className="font-medium text-foreground">Top Up</p>
              </div>
            </Link>
            <Link href="/dashboard/wallets?action=send">
              <div className="p-4 rounded-xl bg-accent/10 hover:bg-accent/20 transition-colors text-center cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-2">
                  <ArrowUpRight className="w-6 h-6 text-accent" />
                </div>
                <p className="font-medium text-foreground">Send</p>
              </div>
            </Link>
            <Link href="/dashboard/tap-to-pay">
              <div className="p-4 rounded-xl bg-success/10 hover:bg-success/20 transition-colors text-center cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-2">
                  <Radio className="w-6 h-6 text-success" />
                </div>
                <p className="font-medium text-foreground">Tap to Pay</p>
              </div>
            </Link>
            <Link href="/dashboard/cards">
              <div className="p-4 rounded-xl bg-warning/10 hover:bg-warning/20 transition-colors text-center cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center mx-auto mb-2">
                  <CreditCard className="w-6 h-6 text-warning" />
                </div>
                <p className="font-medium text-foreground">Cards</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
