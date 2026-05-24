import { useListTransactions, getListTransactionsQueryKey, useGetTransactionSummary } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ArrowUpRight, ArrowDownRight, Wifi, RefreshCw, Hash } from "lucide-react";
import { useState } from "react";

const TYPE_ICONS: Record<string, React.ReactNode> = {
  send: <ArrowUpRight className="h-4 w-4 text-red-400" />,
  receive: <ArrowDownRight className="h-4 w-4 text-emerald-400" />,
  swap: <RefreshCw className="h-4 w-4 text-blue-400" />,
  nfc_pay: <Wifi className="h-4 w-4 text-primary" />,
};

const STATUS_COLORS: Record<string, string> = {
  confirmed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  failed: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function Transactions() {
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filterParam = typeFilter !== "all" ? (typeFilter as "send" | "receive" | "swap" | "nfc_pay") : undefined;
  const { data: transactions, isLoading } = useListTransactions(
    { type: filterParam, limit: 50 },
    { query: { queryKey: getListTransactionsQueryKey({ type: filterParam, limit: 50 }) } }
  );
  const { data: summary } = useGetTransactionSummary();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <Select value={typeFilter} onValueChange={setTypeFilter} data-testid="select-tx-filter">
          <SelectTrigger className="w-40 bg-card/50 border-border/50">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="send">Send</SelectItem>
            <SelectItem value="receive">Receive</SelectItem>
            <SelectItem value="swap">Swap</SelectItem>
            <SelectItem value="nfc_pay">NFC Pay</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary stats */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Sent", value: `$${Number(summary.totalSent).toLocaleString(undefined, { maximumFractionDigits: 2 })}`, count: summary.countSent },
            { label: "Received", value: `$${Number(summary.totalReceived).toLocaleString(undefined, { maximumFractionDigits: 2 })}`, count: summary.countReceived },
            { label: "NFC Payments", value: `$${Number(summary.totalNfcPay).toLocaleString(undefined, { maximumFractionDigits: 2 })}`, count: summary.countNfcPay },
            { label: "Swapped", value: `$${Number(summary.totalSwap).toLocaleString(undefined, { maximumFractionDigits: 2 })}`, count: null },
          ].map((s) => (
            <Card key={s.label} className="bg-card/50 border-border/50">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</p>
                <p className="text-lg font-bold mt-1">{s.value}</p>
                {s.count !== null && <p className="text-xs text-muted-foreground">{s.count} txns</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="bg-card/50 border-border/50 backdrop-blur-xl">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : (transactions ?? []).length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">No transactions found</div>
          ) : (
            <div className="divide-y divide-border/30">
              {(transactions ?? []).map((tx, i) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors"
                  data-testid={`tx-row-${tx.id}`}
                >
                  <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center border border-border/50 flex-shrink-0">
                    {TYPE_ICONS[tx.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium capitalize text-sm">{tx.type.replace("_", " ")}</span>
                      {tx.merchantName && <span className="text-xs text-muted-foreground">@ {tx.merchantName}</span>}
                      <Badge variant="outline" className={`text-xs ${STATUS_COLORS[tx.status]}`}>{tx.status}</Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Hash className="h-3 w-3 text-muted-foreground/50" />
                      <code className="text-xs text-muted-foreground/60 truncate max-w-xs">{tx.hash.slice(0, 20)}...</code>
                      <span className="text-xs text-muted-foreground">{format(new Date(tx.createdAt), "MMM d, HH:mm")}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`font-bold text-sm ${tx.type === "receive" ? "text-emerald-400" : "text-foreground"}`}>
                      {tx.type === "receive" ? "+" : "-"}{Number(tx.amount).toFixed(4)} {tx.asset}
                    </div>
                    <div className="text-xs text-muted-foreground">${Number(tx.valueUsd).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
