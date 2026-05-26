import React, { useState } from "react";
import { useGetDashboardSummary, useGetRecentActivity, useListAssets, useGetMarketPrices } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight, Activity, Wifi, CreditCard, TrendingUp, Send, Wallet, Download, Shield, KeyRound } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";

// Official crypto logos via CoinGecko CDN
const CRYPTO_LOGO_URLS: Record<string, string> = {
  BTC: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
  ETH: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
  SOL: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
  BNB: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
  USDC: "https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png",
  USDT: "https://assets.coingecko.com/coins/images/325/small/Tether.png",
  ADA: "https://assets.coingecko.com/coins/images/975/small/cardano.png",
  DOGE: "https://assets.coingecko.com/coins/images/5/small/dogecoin.png",
  AVAX: "https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png",
  MATIC: "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png",
};

function CryptoLogo({ symbol, color, size = 7 }: { symbol: string; color?: string; size?: number }) {
  const [err, setErr] = useState(false);
  const url = CRYPTO_LOGO_URLS[symbol];
  const dim = `w-${size} h-${size}`;
  if (url && !err) {
    return (
      <div className={`${dim} rounded-full overflow-hidden bg-white border border-slate-200/50 flex items-center justify-center flex-shrink-0`}>
        <img src={url} alt={symbol} className="w-5 h-5 object-contain" onError={() => setErr(true)} />
      </div>
    );
  }
  return (
    <div className={`${dim} rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0`} style={{ backgroundColor: color ?? "#0ea5e9" }}>
      {symbol.slice(0, 2)}
    </div>
  );
}

const ACTIVITY_ICONS: Record<string, React.ReactNode> = {
  send: <ArrowUpRight className="h-4 w-4 text-red-500" />,
  receive: <ArrowDownRight className="h-4 w-4 text-emerald-500" />,
  swap: <ArrowUpRight className="h-4 w-4 text-sky-500" />,
  nfc_pay: <Wifi className="h-4 w-4 text-sky-500" />,
  card_issued: <CreditCard className="h-4 w-4 text-purple-500" />,
  price_alert: <TrendingUp className="h-4 w-4 text-amber-500" />,
};

const ACTIVITY_COLORS: Record<string, string> = {
  send: "bg-red-100",
  receive: "bg-emerald-100",
  swap: "bg-sky-100",
  nfc_pay: "bg-sky-500/10",
  card_issued: "bg-purple-100",
  price_alert: "bg-amber-100",
};

function EmptyWalletState({ ownerName }: { ownerName: string }) {
  const { session } = useAuth();
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="w-20 h-20 rounded-full bg-sky-500/10 flex items-center justify-center mb-6 ring-8 ring-sky-500/5">
        <Wallet className="h-9 w-9 text-sky-500" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>
        Your wallet is ready, {ownerName.split(" ")[0]}
      </h2>
      <p className="text-slate-500 mb-4 max-w-sm leading-relaxed text-base">
        Your cryptographic keys have been generated and secured. Your addresses are live on-chain.
      </p>

      {/* Display wallet addresses */}
      <div className="w-full max-w-md space-y-3 mb-8">
        {session && (
          <>
            <div className="glass-card rounded-xl p-4 flex items-center gap-3 text-left">
              <div className="w-8 h-8 rounded-full bg-sky-500/15 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-sky-600">ETH</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-slate-500 font-mono truncate">{session.ethAddress}</div>
              </div>
            </div>
            <div className="glass-card rounded-xl p-4 flex items-center gap-3 text-left">
              <div className="w-8 h-8 rounded-full bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-amber-600">BTC</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-slate-500 font-mono truncate">{session.btcAddress}</div>
              </div>
            </div>
            <div className="glass-card rounded-xl p-4 flex items-center gap-3 text-left">
              <div className="w-8 h-8 rounded-full bg-purple-500/15 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-purple-600">SOL</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-slate-500 font-mono truncate">{session.solAddress}</div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/wallet">
          <Button className="bg-sky-500 text-white hover:bg-sky-600 gap-2 px-6 py-2.5 rounded-xl neon-glow">
            <Download className="h-4 w-4" /> Deposit Crypto
          </Button>
        </Link>
        <Link href="/send">
          <Button variant="outline" className="gap-2 px-6 py-2.5 border-sky-200/60 rounded-xl">
            <Send className="h-4 w-4" /> Send / Receive
          </Button>
        </Link>
      </div>

      <div className="mt-12 grid grid-cols-3 gap-4 max-w-sm w-full">
        {[
          { icon: Wifi, label: "Tap to Pay", desc: "NFC payments" },
          { icon: CreditCard, label: "Virtual Cards", desc: "Crypto spending" },
          { icon: TrendingUp, label: "Live Market", desc: "Real-time prices" },
        ].map((f) => (
          <div key={f.label} className="flex flex-col items-center gap-2 p-3 rounded-xl glass-card card-lift cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
              <f.icon className="h-4 w-4 text-sky-500" />
            </div>
            <div className="text-xs font-semibold text-slate-700">{f.label}</div>
            <div className="text-xs text-slate-400">{f.desc}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { data: summary, isLoading: summaryLoading } = useGetDashboardSummary();
  const { data: activity, isLoading: activityLoading } = useGetRecentActivity();
  const { data: assets, isLoading: assetsLoading } = useListAssets();
  const { data: prices } = useGetMarketPrices();
  const { ownerName, session } = useAuth();

  const topMovers = (prices ?? [])
    .filter((p) => Math.abs(Number(p.changePct24h)) > 0.5)
    .sort((a, b) => Math.abs(Number(b.changePct24h)) - Math.abs(Number(a.changePct24h)))
    .slice(0, 4);

  const isEmptyWallet =
    !summaryLoading && !activityLoading &&
    summary && Number(summary.totalValueUsd) === 0 &&
    (activity ?? []).length === 0;

  if (isEmptyWallet) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-800" style={{ fontFamily: "'Sora', sans-serif" }}>Dashboard</h1>
            <p className="text-slate-500 mt-1">Welcome, {ownerName}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-sky-600 bg-sky-50 px-3 py-1.5 rounded-full border border-sky-200/50">
            <KeyRound className="h-3 w-3" />
            <span>User: {session?.username}</span>
          </div>
        </div>
        <EmptyWalletState ownerName={ownerName} />
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800" style={{ fontFamily: "'Sora', sans-serif" }}>Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back, {ownerName}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-sky-600 bg-sky-50 px-3 py-1.5 rounded-full border border-sky-200/50">
          <KeyRound className="h-3 w-3" />
          <span>User: {session?.username}</span>
        </div>
      </div>

      {/* Stats grid */}
      {summaryLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28 w-full" />)}
        </div>
      ) : summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="col-span-2 glass-card border-sky-200/30 relative overflow-hidden card-lift" data-testid="card-total-balance">
            <div className="absolute top-0 right-0 w-40 h-40 bg-sky-300/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
            <CardContent className="p-6">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Total Portfolio</p>
              <div className="text-4xl font-black tracking-tighter text-slate-800" data-testid="text-total-balance">
                ${Number(summary.totalValueUsd).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className={`mt-2 text-sm font-medium flex items-center gap-1 ${Number(summary.changePct24h) >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                {Number(summary.changePct24h) >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                {Number(summary.changePct24h) >= 0 ? "+" : ""}{Number(summary.changePct24h).toFixed(2)}%
                {" "}(${Math.abs(Number(summary.change24h)).toLocaleString(undefined, { minimumFractionDigits: 2 })}) today
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-sky-200/20 card-lift" data-testid="card-active-assets">
            <CardContent className="p-5">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Assets</p>
              <div className="text-3xl font-bold text-slate-800">{summary.totalAssets}</div>
              <div className="text-xs text-slate-400 mt-1">holdings</div>
            </CardContent>
          </Card>

          <Card className="glass-card border-sky-200/20 card-lift" data-testid="card-nfc-payments">
            <CardContent className="p-5">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">NFC This Month</p>
              <div className="text-3xl font-bold text-slate-800">{summary.nfcPaymentsThisMonth}</div>
              <div className="flex items-center gap-1 text-xs text-sky-500 mt-1">
                <Wifi className="h-3 w-3" /> payments
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Holdings */}
        <Card className="glass-card border-sky-200/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Holdings</CardTitle>
              <Link href="/assets" className="text-xs text-sky-500 hover:text-sky-600 transition-colors">View all</Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {assetsLoading ? (
              [1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full" />)
            ) : (assets ?? []).length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No assets yet — deposit to get started</p>
            ) : (assets ?? []).slice(0, 4).map((asset) => (
              <div key={asset.id} className="flex items-center justify-between" data-testid={`holding-row-${asset.id}`}>
                <div className="flex items-center gap-2.5">
                  <CryptoLogo symbol={asset.symbol} color={asset.logoColor} size={8} />
                  <div>
                    <div className="text-sm font-semibold text-slate-800">{asset.symbol}</div>
                    <div className="text-xs text-slate-400">{Number(asset.balance).toFixed(4)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-800">${Number(asset.valueUsd).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                  <div className={`text-xs ${Number(asset.changePct24h) >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                    {Number(asset.changePct24h) >= 0 ? "+" : ""}{Number(asset.changePct24h).toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Movers */}
        <Card className="glass-card border-sky-200/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Top Movers</CardTitle>
              <Link href="/market" className="text-xs text-sky-500 hover:text-sky-600 transition-colors">Market</Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {topMovers.map((coin) => (
              <div key={coin.symbol} className="flex items-center justify-between" data-testid={`mover-${coin.symbol}`}>
                <div className="flex items-center gap-2.5">
                  <CryptoLogo symbol={coin.symbol} color={coin.logoColor} size={8} />
                  <div>
                    <div className="text-sm font-semibold text-slate-800">{coin.symbol}</div>
                    <div className="text-xs text-slate-400">${Number(coin.priceUsd).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                  </div>
                </div>
                <Badge variant="outline" className={`text-xs font-semibold ${Number(coin.changePct24h) >= 0 ? "text-emerald-600 border-emerald-200 bg-emerald-50" : "text-red-500 border-red-200 bg-red-50"}`}>
                  {Number(coin.changePct24h) >= 0 ? "+" : ""}{Number(coin.changePct24h).toFixed(2)}%
                </Badge>
              </div>
            ))}
            {topMovers.length === 0 && <p className="text-xs text-slate-400 text-center py-2">Loading market data...</p>}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="glass-card border-sky-200/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Recent Activity</CardTitle>
              <Link href="/transactions" className="text-xs text-sky-500 hover:text-sky-600 transition-colors">View all</Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {activityLoading ? (
              [1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-10 w-full" />)
            ) : (activity ?? []).length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No activity yet</p>
            ) : (activity ?? []).slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center gap-2" data-testid={`activity-item-${item.id}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${ACTIVITY_COLORS[item.type] ?? "bg-slate-100"}`}>
                  {ACTIVITY_ICONS[item.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-800 truncate">{item.title}</div>
                  <div className="text-xs text-slate-400">{format(new Date(item.timestamp), "MMM d, HH:mm")}</div>
                </div>
                {item.valueUsd != null && (
                  <div className="text-xs font-mono text-slate-400 flex-shrink-0">${Number(item.valueUsd).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
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
            <Card className="glass-card border-sky-200/20 hover:border-sky-300/40 hover:bg-white/55 transition-all cursor-pointer group card-lift" data-testid={`quick-action-${action.label.toLowerCase().replace(" ", "-")}`}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center group-hover:bg-sky-500/20 transition-colors">
                  <action.icon className="h-4 w-4 text-sky-500" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-700">{action.label}</div>
                  <div className="text-xs text-slate-400">{action.sub}</div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Security footer */}
      <div className="flex items-center gap-3 text-xs text-slate-400 mt-4">
        <Shield className="h-4 w-4 text-sky-500 flex-shrink-0" />
        <span>Session stored locally. Wallet addresses derived from your credentials for demo purposes — not real on-chain keys.</span>
      </div>
    </motion.div>
  );
}
