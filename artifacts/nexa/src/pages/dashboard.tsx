import { useGetDashboardSummary, useGetRecentActivity, useListAssets, useGetMarketPrices } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight, Activity, Wifi, CreditCard, TrendingUp, Send, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { format } from "date-fns";

const ACTIVITY_ICONS: Record<string, React.ReactNode> = {
  send: <ArrowUpRight className="h-4 w-4 text-red-400" />,
  receive: <ArrowDownRight className="h-4 w-4 text-emerald-400" />,
  swap: <ArrowUpRight className="h-4 w-4 text-blue-400" />,
  nfc_pay: <Wifi className="h-4 w-4 text-primary" />,
  card_issued: <CreditCard className="h-4 w-4 text-purple-400" />,
  price_alert: <TrendingUp className="h-4 w-4 text-yellow-400" />,
};

const ACTIVITY_COLORS: Record<string, string> = {
  send: "bg-red-500/10",
  receive: "bg-emerald-500/10",
  swap: "bg-blue-500/10",
  nfc_pay: "bg-primary/10",
  card_issued: "bg-purple-500/10",
  price_alert: "bg-yellow-500/10",
};

export default function Dashboard() {
  const { data: summary, isLoading: summaryLoading } = useGetDashboardSummary();
  const { data: activity, isLoading: activityLoading } = useGetRecentActivity();
  const { data: assets, isLoading: assetsLoading } = useListAssets();
  const { data: prices } = useGetMarketPrices();

  const topMovers = (prices ?? [])
    .filter((p) => Math.abs(Number(p.changePct24h)) > 0.5)
    .sort((a, b) => Math.abs(Number(b.changePct24h)) - Math.abs(Number(a.changePct24h)))
    .slice(0, 4);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, Alex</p>
        </div>
        <div className="flex gap-2">
          <Link href="/send">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2" data-testid="button-quick-send">
              <Send className="h-4 w-4" /> Send
            </Button>
          </Link>
          <Link href="/nfc">
            <Button variant="outline" className="border-border/50 gap-2 hover:border-primary/50 hover:text-primary" data-testid="button-quick-nfc">
              <Wifi className="h-4 w-4" /> NFC Pay
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      {summaryLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28 w-full" />)}
        </div>
      ) : summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Balance */}
          <Card className="col-span-2 bg-gradient-to-br from-primary/10 via-card/80 to-card/50 border-primary/20 backdrop-blur-xl relative overflow-hidden group" data-testid="card-total-balance">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
            <CardContent className="p-6">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Total Portfolio</p>
              <div className="text-4xl font-black tracking-tighter text-foreground" data-testid="text-total-balance">
                ${Number(summary.totalValueUsd).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className={`mt-2 text-sm font-medium flex items-center gap-1 ${Number(summary.changePct24h) >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {Number(summary.changePct24h) >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                {Number(summary.changePct24h) >= 0 ? "+" : ""}{Number(summary.changePct24h).toFixed(2)}%
                {" "}(${Math.abs(Number(summary.change24h)).toLocaleString(undefined, { minimumFractionDigits: 2 })}) today
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50 backdrop-blur-xl relative overflow-hidden group" data-testid="card-active-assets">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Assets</p>
              <div className="text-3xl font-bold">{summary.totalAssets}</div>
              <div className="text-xs text-muted-foreground mt-1">holdings</div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50 backdrop-blur-xl relative overflow-hidden group" data-testid="card-nfc-payments">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">NFC This Month</p>
              <div className="text-3xl font-bold">{summary.nfcPaymentsThisMonth}</div>
              <div className="flex items-center gap-1 text-xs text-primary mt-1">
                <Wifi className="h-3 w-3" /> payments
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Holdings */}
        <Card className="bg-card/50 border-border/50 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Holdings</CardTitle>
              <Link href="/assets" className="text-xs text-primary hover:text-primary/80 transition-colors">View all</Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {assetsLoading ? (
              [1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full" />)
            ) : (assets ?? []).slice(0, 4).map((asset) => (
              <div key={asset.id} className="flex items-center justify-between" data-testid={`holding-row-${asset.id}`}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-background" style={{ backgroundColor: asset.logoColor }}>
                    {asset.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{asset.symbol}</div>
                    <div className="text-xs text-muted-foreground">{Number(asset.balance).toFixed(4)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">${Number(asset.valueUsd).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                  <div className={`text-xs ${Number(asset.changePct24h) >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {Number(asset.changePct24h) >= 0 ? "+" : ""}{Number(asset.changePct24h).toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Movers */}
        <Card className="bg-card/50 border-border/50 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Top Movers</CardTitle>
              <Link href="/market" className="text-xs text-primary hover:text-primary/80 transition-colors">Market</Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {topMovers.map((coin) => (
              <div key={coin.symbol} className="flex items-center justify-between" data-testid={`mover-${coin.symbol}`}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-background" style={{ backgroundColor: coin.logoColor }}>
                    {coin.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{coin.symbol}</div>
                    <div className="text-xs text-muted-foreground">${Number(coin.priceUsd).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                  </div>
                </div>
                <Badge variant="outline" className={`text-xs ${Number(coin.changePct24h) >= 0 ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" : "text-red-400 border-red-500/20 bg-red-500/5"}`}>
                  {Number(coin.changePct24h) >= 0 ? "+" : ""}{Number(coin.changePct24h).toFixed(2)}%
                </Badge>
              </div>
            ))}
            {topMovers.length === 0 && <p className="text-xs text-muted-foreground text-center py-2">Loading market data...</p>}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-card/50 border-border/50 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Recent Activity</CardTitle>
              <Link href="/transactions" className="text-xs text-primary hover:text-primary/80 transition-colors">View all</Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {activityLoading ? (
              [1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-10 w-full" />)
            ) : (activity ?? []).length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-2">No activity yet</p>
            ) : (activity ?? []).slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center gap-2" data-testid={`activity-item-${item.id}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${ACTIVITY_COLORS[item.type] ?? "bg-card"}`}>
                  {ACTIVITY_ICONS[item.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{item.title}</div>
                  <div className="text-xs text-muted-foreground">{format(new Date(item.timestamp), "MMM d, HH:mm")}</div>
                </div>
                {item.valueUsd != null && (
                  <div className="text-xs font-mono text-muted-foreground flex-shrink-0">${Number(item.valueUsd).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { href: "/wallet", icon: Wallet, label: "Deposit", sub: "View addresses" },
          { href: "/send", icon: Send, label: "Send", sub: "Transfer crypto" },
          { href: "/cards", icon: CreditCard, label: "Cards", sub: "Virtual cards" },
          { href: "/nfc", icon: Wifi, label: "Tap to Pay", sub: "NFC payment" },
        ].map((action) => (
          <Link key={action.href} href={action.href}>
            <Card className="bg-card/50 border-border/50 hover:border-primary/30 hover:bg-card/80 transition-all cursor-pointer group" data-testid={`quick-action-${action.label.toLowerCase().replace(" ", "-")}`}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <action.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{action.label}</div>
                  <div className="text-xs text-muted-foreground">{action.sub}</div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
