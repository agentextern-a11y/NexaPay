'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatRelativeTime, shortenAddress } from '@/lib/utils'
import { 
  ArrowUpRight, 
  ArrowDownLeft,
  Radio,
  Clock,
  CheckCircle,
  XCircle,
  History
} from 'lucide-react'
import type { Transaction } from '@/lib/db/schema'

interface TransactionsContentProps {
  transactions: Transaction[]
}

export function TransactionsContent({ transactions }: TransactionsContentProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'receive':
      case 'top_up':
        return <ArrowDownLeft className="w-5 h-5 text-success" />
      case 'tap_pay':
        return <Radio className="w-5 h-5 text-accent" />
      default:
        return <ArrowUpRight className="w-5 h-5 text-primary" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'settled':
        return <CheckCircle className="w-4 h-4 text-success" />
      case 'pending':
      case 'processing':
        return <Clock className="w-4 h-4 text-warning" />
      default:
        return <XCircle className="w-4 h-4 text-destructive" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Transactions</h1>
        <p className="text-muted-foreground">View your transaction history</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Transactions</p>
            <p className="text-2xl font-bold text-foreground">{transactions.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Settled</p>
            <p className="text-2xl font-bold text-success">
              {transactions.filter(t => t.status === 'settled').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold text-warning">
              {transactions.filter(t => t.status === 'pending').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Avg Settlement</p>
            <p className="text-2xl font-bold text-foreground">
              {transactions.length > 0
                ? Math.round(transactions.reduce((acc, t) => acc + (t.settlementTimeMs || 0), 0) / transactions.length)
                : 0}ms
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No transactions yet</h3>
              <p className="text-muted-foreground">Your transactions will appear here</p>
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.type === 'receive' || tx.type === 'top_up'
                        ? 'bg-success/20'
                        : tx.type === 'tap_pay'
                        ? 'bg-accent/20'
                        : 'bg-primary/20'
                    }`}>
                      {getTypeIcon(tx.type)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground capitalize">
                        {tx.type.replace('_', ' ')}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{formatRelativeTime(tx.createdAt)}</span>
                        {tx.txHash && (
                          <>
                            <span>|</span>
                            <span className="font-mono">{shortenAddress(tx.txHash, 4)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end gap-4 pl-13 sm:pl-0">
                    <div className="text-left sm:text-right">
                      <p className={`font-semibold ${
                        tx.type === 'receive' || tx.type === 'top_up'
                          ? 'text-success'
                          : 'text-foreground'
                      }`}>
                        {tx.type === 'receive' || tx.type === 'top_up' ? '+' : '-'}
                        {parseFloat(tx.amount).toFixed(2)} {tx.currency}
                      </p>
                      {parseFloat(tx.fee || '0') > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Fee: {parseFloat(tx.fee || '0').toFixed(4)}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {getStatusIcon(tx.status)}
                      <span className={`text-xs capitalize ${
                        tx.status === 'settled' ? 'text-success' : 
                        tx.status === 'pending' ? 'text-warning' : 'text-destructive'
                      }`}>
                        {tx.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
