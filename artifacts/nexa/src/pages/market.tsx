import { useGetMarketPrices, useGetMarketChart, getGetMarketChartQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { useState } from "react";

function SparkLine({ symbol, color }: { symbol: string; color: string }) {
  const { data } = useGetMarketChart(symbol, { query: { queryKey: getGetMarketChartQueryKey(symbol) } });
  if (!data || data.length < 2) return <div className="w-20 h-8 bg-border/30 rounded" />;
  const chartData = data.map((p) => ({ price: Number(p.price) }));
  const isUp = chartData[chartData.length - 1].price >= chartData[0].price;
  return (
    <ResponsiveContainer width={80} height={32}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id={`spark-${symbol}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={isUp ? "#34d399" : "#f87171"} stopOpacity={0.3} />
            <stop offset="95%" stopColor={isUp ? "#34d399" : "#f87171"} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="price" stroke={isUp ? "#34d399" : "#f87171"} strokeWidth={1.5} fill={`url(#spark-${symbol})`} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default function Market() {
  const { data: prices, isLoading } = useGetMarketPrices();
  const [sortKey, setSortKey] = useState<"marketCap" | "price" | "change">("marketCap");

  const sorted = [...(prices ?? [])].sort((a, b) => {
    if (sortKey === "price") return Number(b.priceUsd) - Number(a.priceUsd);
    if (sortKey === "change") return Number(b.changePct24h) - Number(a.changePct24h);
    return Number(b.marketCapUsd) - Number(a.marketCapUsd);
  });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Market</h1>
          <p className="text-muted-foreground mt-1">Live cryptocurrency prices</p>
        </div>
        <TrendingUp className="h-8 w-8 text-primary opacity-60" />
      </div>

      <div className="flex gap-2">
        {[["marketCap", "Market Cap"], ["price", "Price"], ["change", "24h Change"]].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSortKey(key as any)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${sortKey === key ? "bg-primary text-primary-foreground" : "bg-card/50 text-muted-foreground hover:text-foreground border border-border/50"}`}
            data-testid={`button-sort-${key}`}
          >
            {label}
          </button>
        ))}
      </div>

      <Card className="bg-card/50 border-border/50 backdrop-blur-xl">
        {isLoading ? (
          <CardContent className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-14 w-full" />)}
          </CardContent>
        ) : (
          <div className="overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-[2fr,1fr,1fr,1fr,80px] gap-4 px-6 py-3 border-b border-border/30 text-xs text-muted-foreground uppercase tracking-wider">
              <span>Asset</span>
              <span className="text-right">Price</span>
              <span className="text-right">24h</span>
              <span className="text-right hidden md:block">Market Cap</span>
              <span className="text-right">Chart</span>
            </div>
            {sorted.map((coin, i) => (
              <motion.div
                key={coin.symbol}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="grid grid-cols-[2fr,1fr,1fr,1fr,80px] gap-4 items-center px-6 py-4 border-b border-border/20 last:border-0 hover:bg-white/5 transition-colors"
                data-testid={`market-row-${coin.symbol}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-background" style={{ backgroundColor: coin.logoColor }}>
                    {coin.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{coin.symbol}</div>
                    <div className="text-xs text-muted-foreground">{coin.name}</div>
                  </div>
                </div>
                <div className="text-right font-mono font-semibold text-sm">
                  ${Number(coin.priceUsd).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className={`text-right text-sm flex items-center justify-end gap-0.5 ${Number(coin.changePct24h) >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {Number(coin.changePct24h) >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {Math.abs(Number(coin.changePct24h)).toFixed(2)}%
                </div>
                <div className="text-right text-xs text-muted-foreground hidden md:block">
                  ${(Number(coin.marketCapUsd) / 1e9).toFixed(2)}B
                </div>
                <div className="flex justify-end">
                  <SparkLine symbol={coin.symbol} color={coin.logoColor} />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </motion.div>
  );
}
