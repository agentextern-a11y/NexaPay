import { useListCards, getListCardsQueryKey, useUpdateCard } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus, CreditCard, ShieldCheck, Zap, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import CryptoCard3D from "@/components/CryptoCard3D";
import { format } from "date-fns";
import { useState, useEffect } from "react";

export default function Cards() {
  const { data: cards, isLoading } = useListCards();
  const { ownerName } = useAuth();
  const card = cards?.[0];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 md:space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
            Your Card
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            One premium crypto card per wallet. Holographic design, NFC-ready.
          </p>
        </div>
        {!card && (
          <Link href="/cards/new">
            <Button size="sm" className="bg-sky-500 text-white hover:bg-sky-600 gap-2 shadow-lg shadow-sky-500/20" data-testid="button-new-card">
              <Plus className="h-4 w-4" /> Issue Card
            </Button>
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="max-w-md mx-auto">
          <Skeleton className="aspect-[1.586/1] w-full rounded-2xl" />
        </div>
      ) : card ? (
        <CardsPageContent card={card} />
      ) : (
        <EmptyCardsState ownerName={ownerName} />
      )}
    </motion.div>
  );
}

function CardsPageContent({ card }: { card: any }) {
  const updateCard = useUpdateCard();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [txs, setTxs] = useState<any[]>([]);
  const [txLoading, setTxLoading] = useState(false);

  const handleFreeze = () => {
    const newStatus = card.status === "active" ? "frozen" : "active";
    updateCard.mutate(
      { id: card.id, data: { status: newStatus } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListCardsQueryKey() });
          toast({ title: newStatus === "frozen" ? "Card frozen" : "Card activated" });
        },
      }
    );
  };

  const handleCancel = () => {
    updateCard.mutate(
      { id: card.id, data: { status: "cancelled" } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListCardsQueryKey() });
          toast({ title: "Card cancelled", description: "You can issue a new one." });
        },
      }
    );
  };

  // Fetch card transactions
  useEffect(() => {
    if (!card) return;
    setTxLoading(true);
    fetch(`/api/cards/${card.id}/transactions`)
      .then((r) => r.json())
      .then((data) => setTxs(data || []))
      .catch(() => setTxs([]))
      .finally(() => setTxLoading(false));
  }, [card?.id]);

  return (
    <div className="space-y-8">
      {/* Card centerpiece */}
      <div className="max-w-md mx-auto">
        <CryptoCard3D
          card={card}
          onFreeze={handleFreeze}
          onCancel={handleCancel}
          freezeLoading={updateCard.isPending}
        />
      </div>

      {/* Card details grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-2xl mx-auto">
        <DetailCard
          icon={<CreditCard className="h-4 w-4 text-sky-500" />}
          label="Card Type"
          value={card.cardType === "virtual" ? "Virtual" : "Physical"}
          color="sky"
        />
        <DetailCard
          icon={<ShieldCheck className="h-4 w-4 text-emerald-500" />}
          label="Status"
          value={card.status === "active" ? "Active" : card.status === "frozen" ? "Frozen" : "Cancelled"}
          color={card.status === "active" ? "emerald" : card.status === "frozen" ? "amber" : "slate"}
        />
        <DetailCard
          icon={<Zap className="h-4 w-4 text-cyan-500" />}
          label="NFC Pay"
          value={card.nfcEnabled ? "Enabled" : "Disabled"}
          color="cyan"
        />
        <DetailCard
          icon={<span className="text-xs font-bold text-amber-500">{card.asset}</span>}
          label="Linked Asset"
          value={card.asset}
          color="amber"
        />
      </div>

      {/* Spending summary */}
      <Card className="max-w-2xl mx-auto bg-card/50 border-border/50 backdrop-blur-xl">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-700">Monthly Spending</span>
            <span className="text-xs text-slate-400">
              ${Number(card.spentAmount).toLocaleString(undefined, { maximumFractionDigits: 0 })} / ${Number(card.spendingLimit).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="h-2 bg-slate-200/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((Number(card.spentAmount) / Number(card.spendingLimit)) * 100, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{
                background: "linear-gradient(90deg, #0ea5e9, #22d3ee)",
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Recent transactions */}
      <div className="max-w-2xl mx-auto">
        <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">Recent Card Activity</h3>
        {txLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full" />)}
          </div>
        ) : txs.length === 0 ? (
          <Card className="bg-card/50 border-border/50 border-dashed">
            <CardContent className="p-6 text-center text-sm text-slate-400">
              No transactions yet. Use NFC tap-to-pay to spend with your card.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {txs.slice(0, 5).map((tx) => (
              <Card key={tx.id} className="bg-card/50 border-border/50 hover:bg-card/70 transition-colors">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      tx.type === "nfc_pay" ? "bg-sky-500/10 text-sky-600" : "bg-slate-500/10 text-slate-600"
                    }`}>
                      {tx.type === "nfc_pay" ? "NFC" : tx.type.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-800">{tx.merchantName || "Transaction"}</div>
                      <div className="text-xs text-slate-400">{format(new Date(tx.createdAt), "MMM d, HH:mm")}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-800">{Number(tx.amount).toFixed(2)} {tx.asset}</div>
                    <div className="text-xs text-slate-400">${Number(tx.valueUsd).toFixed(2)}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DetailCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  const colorMap: Record<string, string> = {
    sky: "bg-sky-50 border-sky-200/50 text-sky-700",
    emerald: "bg-emerald-50 border-emerald-200/50 text-emerald-700",
    amber: "bg-amber-50 border-amber-200/50 text-amber-700",
    cyan: "bg-cyan-50 border-cyan-200/50 text-cyan-700",
    slate: "bg-slate-50 border-slate-200/50 text-slate-700",
  };
  return (
    <div className={`rounded-xl border p-3 ${colorMap[color] || colorMap.slate}`}>
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-[10px] uppercase tracking-wider font-medium opacity-70">{label}</span>
      </div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}

function EmptyCardsState({ ownerName }: { ownerName: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center py-12 md:py-20"
    >
      <div className="relative mb-8">
        {/* Glowing orb behind */}
        <div className="absolute inset-0 w-24 h-24 -m-4 rounded-full bg-sky-400/10 blur-xl" />
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-sky-500/20 relative">
          <CreditCard className="h-8 w-8 text-white" />
        </div>
      </div>
      <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>
        No card yet, {ownerName.split(" ")[0]}
      </h2>
      <p className="text-slate-500 text-sm max-w-sm mb-6 leading-relaxed">
        Issue your premium NEXA crypto card. One card per wallet with holographic design, NFC tap-to-pay, and Apple/Google Wallet support.
      </p>
      <Link href="/cards/new">
        <Button className="bg-sky-500 text-white hover:bg-sky-600 gap-2 px-6 py-2.5 rounded-xl shadow-lg shadow-sky-500/20" data-testid="button-issue-first-card">
          <Plus className="h-4 w-4" /> Issue Your Card <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
      <div className="mt-6 flex items-center gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> One card per wallet</span>
        <span className="flex items-center gap-1"><Zap className="h-3 w-3" /> Instant issuance</span>
      </div>
    </motion.div>
  );
}
