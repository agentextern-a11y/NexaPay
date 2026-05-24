import { useListAssets } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function Assets() {
  const { data: assets, isLoading } = useListAssets();

  if (isLoading || !assets) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Portfolio</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-card/50 border-border/50">
              <CardContent className="p-5">
                <Skeleton className="h-10 w-full mb-3" />
                <Skeleton className="h-6 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const pieData = assets.map((a) => ({
    name: a.symbol,
    value: Number(a.valueUsd),
    color: a.logoColor,
  }));

  const totalValue = assets.reduce((sum, a) => sum + Number(a.valueUsd), 0);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portfolio</h1>
          <p className="text-muted-foreground mt-1">
            Total value: <span className="text-primary font-bold text-lg">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </p>
        </div>
        <TrendingUp className="h-8 w-8 text-primary opacity-60" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pie chart */}
        <Card className="bg-card/50 border-border/50 backdrop-blur-xl">
          <CardContent className="p-6">
            <h2 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Allocation</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" strokeWidth={0}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "hsl(223 46% 10%)", border: "1px solid hsl(223 42% 17%)", borderRadius: "8px" }}
                  labelStyle={{ color: "hsl(210 40% 98%)" }}
                  formatter={(value: number) => [`$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`, ""]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {assets.map((a) => (
                <div key={a.symbol} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: a.logoColor }} />
                    <span className="text-foreground font-medium">{a.symbol}</span>
                  </div>
                  <span className="text-muted-foreground">{Number(a.allocationPct ?? 0).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Asset list */}
        <div className="lg:col-span-2 space-y-3">
          {assets.map((asset, i) => (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/assets/${asset.symbol}`} data-testid={`asset-row-${asset.id}`}>
                <Card className="bg-card/50 border-border/50 backdrop-blur-xl hover:border-primary/30 hover:bg-card/80 transition-all cursor-pointer group">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-background"
                          style={{ backgroundColor: asset.logoColor }}
                        >
                          {asset.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{asset.name}</div>
                          <div className="text-sm text-muted-foreground">{Number(asset.balance).toFixed(6)} {asset.symbol}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-foreground">${Number(asset.valueUsd).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        <div className={`text-sm flex items-center justify-end gap-1 ${Number(asset.changePct24h) >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                          {Number(asset.changePct24h) >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                          {Math.abs(Number(asset.changePct24h)).toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
