import { useGetAsset, getGetAssetQueryKey, useGetMarketChart, getGetMarketChartQueryKey, useListTransactions, getListTransactionsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useParams } from "wouter";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { format } from "date-fns";

const TX_ICONS: Record<string, string> = { send: "↑", receive: "↓", swap: "⇄", nfc_pay: "◎" };
const TX_COLORS: Record<string, string> = { send: "text-red-400", receive: "text-emerald-400", swap: "text-blue-400", nfc_pay: "text-primary" };

export default function AssetDetail() {
  const params = useParams<{ symbol: string }>();
  const symbol = params.symbol;

  const { data: asset, isLoading: assetLoading } = useGetAsset(symbol, { query: { enabled: !!symbol, queryKey: getGetAssetQueryKey(symbol) } });
  const { data: chartData, isLoading: chartLoading } = useGetMarketChart(symbol, { query: { enabled: !!symbol, queryKey: getGetMarketChartQueryKey(symbol) } });
  const { data: transactions, isLoading: txLoading } = useListTransactions({ asset: symbol, limit: 20 }, { query: { enabled: !!symbol, queryKey: getListTransactionsQueryKey({ asset: symbol, limit: 20 }) } });

  if (assetLoading || !asset) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const formattedChart = (chartData ?? []).map((p) => ({
    time: format(new Date(p.timestamp), "MMM d"),
    price: Number(p.price),
  }));

  const minPrice = formattedChart.length ? Math.min(...formattedChart.map((p) => p.price)) * 0.998 : 0;
  const maxPrice = formattedChart.length ? Math.max(...formattedChart.map((p) => p.price)) * 1.002 : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <Link href="/assets" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
        <ArrowLeft className="h-4 w-4" /> Back to Portfolio
      </Link>

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold text-background" style={{ backgroundColor: asset.logoColor }}>
          {asset.symbol.slice(0, 2)}
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{asset.name}</h1>
          <div className={`flex items-center gap-1 text-sm ${Number(asset.changePct24h) >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {Number(asset.changePct24h) >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
            {Math.abs(Number(asset.changePct24h)).toFixed(2)}% (24h)
          </div>
        </div>
        <div className="ml-auto text-right">
          <div className="text-3xl font-bold">${Number(asset.priceUsd).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          <div className="text-muted-foreground text-sm">{Number(asset.balance).toFixed(6)} {asset.symbol}</div>
        </div>
      </div>

      {/* Chart */}
      <Card className="bg-card/50 border-border/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">7-Day Price</CardTitle>
        </CardHeader>
        <CardContent>
          {chartLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={formattedChart}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(186 100% 50%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(186 100% 50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(223 42% 17%)" />
                <XAxis dataKey="time" tick={{ fill: "hsl(215 20.2% 65.1%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={[minPrice, maxPrice]} tick={{ fill: "hsl(215 20.2% 65.1%)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v.toLocaleString()}`} />
                <Tooltip
                  contentStyle={{ background: "hsl(223 46% 10%)", border: "1px solid hsl(223 42% 17%)", borderRadius: "8px" }}
                  labelStyle={{ color: "hsl(210 40% 98%)" }}
                  formatter={(value: number) => [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, "Price"]}
                />
                <Area type="monotone" dataKey="price" stroke="hsl(186 100% 50%)" strokeWidth={2} fill="url(#priceGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Transaction history */}
      <Card className="bg-card/50 border-border/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Transaction History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {txLoading ? (
            [1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)
          ) : (transactions ?? []).length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-4">No transactions yet</p>
          ) : (
            (transactions ?? []).map((tx) => (
              <div key={tx.id} data-testid={`tx-row-${tx.id}`} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-bold ${TX_COLORS[tx.type]}`}>{TX_ICONS[tx.type]}</span>
                  <div>
                    <div className="font-medium capitalize text-sm">{tx.type.replace("_", " ")}</div>
                    <div className="text-xs text-muted-foreground">{format(new Date(tx.createdAt), "MMM d, yyyy HH:mm")}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-semibold text-sm ${tx.type === "receive" ? "text-emerald-400" : "text-foreground"}`}>
                    {tx.type === "receive" ? "+" : "-"}{Number(tx.amount).toFixed(6)} {tx.asset}
                  </div>
                  <div className="text-xs text-muted-foreground">${Number(tx.valueUsd).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
