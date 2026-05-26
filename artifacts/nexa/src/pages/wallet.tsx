import { useGetWallet, useGetWalletAddresses } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Copy, CheckCircle, ArrowUpRight, ArrowDownRight, QrCode, Wallet as WalletIcon, Send, Download } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "wouter";

const CHAIN_COLORS: Record<string, { bg: string; text: string; border: string; iconBg: string }> = {
  BTC: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200/50", iconBg: "bg-amber-500/15" },
  ETH: { bg: "bg-sky-50", text: "text-sky-600", border: "border-sky-200/50", iconBg: "bg-sky-500/15" },
  SOL: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200/50", iconBg: "bg-purple-500/15" },
  USDC: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200/50", iconBg: "bg-emerald-500/15" },
  BNB: { bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-200/50", iconBg: "bg-yellow-500/15" },
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95"
      style={{
        background: copied ? "rgba(16,185,129,0.1)" : "rgba(0,0,0,0.04)",
        color: copied ? "#059669" : "#64748b",
      }}
      data-testid="button-copy-address"
    >
      {copied ? <CheckCircle className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function QrPlaceholder({ symbol }: { symbol: string }) {
  const color = CHAIN_COLORS[symbol]?.text ?? "#0ea5e9";
  return (
    <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center flex-shrink-0">
      <QrCode className="h-8 w-8 md:h-10 md:w-10" style={{ color, opacity: 0.3 }} />
    </div>
  );
}

export default function Wallet() {
  const { data: wallet, isLoading: walletLoading } = useGetWallet();
  const { data: addresses, isLoading: addrLoading } = useGetWalletAddresses();

  if (walletLoading || addrLoading || !wallet) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
        </div>
      </div>
    );
  }

  const isUp = Number(wallet.totalValueChangePct24h) >= 0;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Wallet</h1>
          <p className="text-muted-foreground mt-1 text-sm">{wallet.ownerName}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-600 border-emerald-200/50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 inline-block" />
            Connected
          </Badge>
        </div>
      </div>

      {/* Portfolio Card */}
      <Card className="relative overflow-hidden rounded-2xl border-0 shadow-lg">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 35%, #10b981 100%)",
          }}
        />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white 0%, transparent 50%)" }} />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 80%, white 0%, transparent 50%)" }} />

        <CardContent className="relative z-10 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-white/70 text-xs md:text-sm uppercase tracking-widest mb-1 md:mb-2 font-medium">Total Balance</p>
              <div className="text-3xl md:text-5xl font-black tracking-tighter text-white">
                ${Number(wallet.totalValueUsd).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className={`mt-1 md:mt-2 text-sm font-semibold flex items-center gap-1 ${isUp ? "text-emerald-200" : "text-red-200"}`}>
                {isUp ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                {isUp ? "+" : ""}{Number(wallet.totalValueChangePct24h).toFixed(2)}%
                <span className="text-white/60 font-normal">({isUp ? "+" : "-"}${Math.abs(Number(wallet.totalValueChange24h)).toLocaleString(undefined, { minimumFractionDigits: 2 })}) today</span>
              </div>
            </div>

            {/* Quick actions */}
            <div className="flex gap-2 md:gap-3">
              <Link href="/send">
                <button className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs md:text-sm font-semibold transition-all backdrop-blur-sm active:scale-95">
                  <Send className="h-3.5 w-3.5 md:h-4 md:w-4" /> Send
                </button>
              </Link>
              <Link href="/wallet">
                <button className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-xl bg-white hover:bg-white/90 text-sky-600 text-xs md:text-sm font-semibold transition-all shadow-sm active:scale-95">
                  <Download className="h-3.5 w-3.5 md:h-4 md:w-4" /> Receive
                </button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deposit Addresses */}
      <div>
        <h2 className="text-base md:text-lg font-bold mb-3 md:mb-4 flex items-center gap-2">
          <WalletIcon className="h-4 w-4 md:h-5 md:w-5 text-slate-400" />
          Your Addresses
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {(addresses ?? []).map((addr, i) => {
            const colors = CHAIN_COLORS[addr.symbol] ?? CHAIN_COLORS.ETH;
            return (
              <motion.div
                key={addr.symbol}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                data-testid={`card-address-${addr.symbol}`}
              >
                <Card className={`${colors.bg} border ${colors.border} rounded-xl overflow-hidden`}>
                  <CardContent className="p-4 md:p-5">
                    <div className="flex items-start gap-3 md:gap-4">
                      {/* QR placeholder */}
                      <QrPlaceholder symbol={addr.symbol} />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className={`w-6 h-6 rounded-full ${colors.iconBg} flex items-center justify-center`}>
                            <span className={`text-[10px] font-bold ${colors.text}`}>{addr.symbol.slice(0, 2)}</span>
                          </div>
                          <span className="text-sm md:text-base font-bold text-slate-800">{addr.name}</span>
                          <Badge variant="outline" className="text-[10px] md:text-xs ml-auto border-slate-200/60 text-slate-500">
                            {addr.network}
                          </Badge>
                        </div>

                        <div className="bg-white/70 border border-slate-200/40 rounded-lg px-3 py-2 md:py-2.5 mb-2 md:mb-3">
                          <code
                            className="text-xs md:text-sm text-slate-600 block truncate font-mono"
                            data-testid={`text-address-${addr.symbol}`}
                          >
                            {addr.address}
                          </code>
                        </div>

                        <CopyButton text={addr.address} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Transparency note */}
      <div className="flex items-start gap-2.5 text-xs text-slate-400 bg-slate-50/60 rounded-xl px-4 py-3 border border-slate-200/30">
        <WalletIcon className="h-4 w-4 text-sky-400 flex-shrink-0 mt-0.5" />
        <p>
          These addresses are deterministically derived from your credentials for display and app consistency.
          They are not verified on-chain. Do not send real funds to them until you confirm the addresses with a proper wallet provider.
        </p>
      </div>
    </motion.div>
  );
}
