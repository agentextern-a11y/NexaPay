import { useGetWallet, useGetWalletAddresses } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Copy, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="ml-2 text-muted-foreground hover:text-primary transition-colors" data-testid="button-copy-address">
      {copied ? <CheckCircle className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}

export default function Wallet() {
  const { data: wallet, isLoading: walletLoading } = useGetWallet();
  const { data: addresses, isLoading: addrLoading } = useGetWalletAddresses();

  if (walletLoading || addrLoading || !wallet) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-36 w-full" />)}
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
        <p className="text-muted-foreground mt-1">{wallet.ownerName}</p>
      </div>

      {/* Wallet Overview */}
      <Card className="bg-gradient-to-br from-primary/10 via-card/80 to-card/50 border-primary/20 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        <CardContent className="p-8">
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Total Portfolio Value</p>
          <div className="text-5xl font-black tracking-tighter text-foreground">
            ${Number(wallet.totalValueUsd).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`mt-2 text-base font-medium ${Number(wallet.totalValueChangePct24h) >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {Number(wallet.totalValueChangePct24h) >= 0 ? "+" : ""}{Number(wallet.totalValueChangePct24h).toFixed(2)}%
            {" "}(${Math.abs(Number(wallet.totalValueChange24h)).toLocaleString(undefined, { minimumFractionDigits: 2 })}) today
          </div>
        </CardContent>
      </Card>

      {/* Deposit Addresses */}
      <div>
        <h2 className="text-xl font-bold mb-4">Deposit Addresses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(addresses ?? []).map((addr, i) => (
            <motion.div key={addr.symbol} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="bg-card/50 border-border/50 backdrop-blur-xl hover:border-primary/30 transition-all" data-testid={`card-address-${addr.symbol}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-bold">{addr.name}</CardTitle>
                    <Badge variant="outline" className="text-primary border-primary/30 text-xs">{addr.network}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 bg-background/30 rounded-md px-3 py-2">
                    <code className="text-xs text-muted-foreground flex-1 break-all font-mono" data-testid={`text-address-${addr.symbol}`}>{addr.address}</code>
                    <CopyButton text={addr.address} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
