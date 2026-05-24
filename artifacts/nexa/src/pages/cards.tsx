import { useListCards, getListCardsQueryKey, useUpdateCard } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Wifi, Lock, Eye, EyeOff, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

function CryptoCardDisplay({ card }: { card: any }) {
  const [showDetails, setShowDetails] = useState(false);
  const updateCard = useUpdateCard();
  const queryClient = useQueryClient();
  const { toast } = useToast();

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

  const spentPct = Math.min((Number(card.spentAmount) / Number(card.spendingLimit)) * 100, 100);
  const maskedNumber = showDetails
    ? card.cardNumber.replace(/(.{4})/g, "$1 ").trim()
    : card.cardNumber.slice(0, 4) + " •••• •••• " + card.cardNumber.slice(-4);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
      {/* Card visual */}
      <div
        className={`relative w-full aspect-[1.586/1] rounded-2xl p-6 overflow-hidden cursor-pointer select-none transition-all duration-300 ${
          card.status === "frozen" ? "grayscale opacity-60" : ""
        }`}
        style={{
          background: `linear-gradient(135deg, hsl(223 47% 14%), hsl(223 42% 20%))`,
          boxShadow: card.status === "active" ? "0 0 40px -10px hsl(186 100% 50% / 0.3)" : "none",
        }}
        data-testid={`card-display-${card.id}`}
      >
        {/* Circuit pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-8 w-16 h-16 border border-primary rounded-full" />
          <div className="absolute top-8 right-16 w-8 h-8 border border-primary rounded-full" />
        </div>
        <div className="absolute top-4 right-4 flex items-center gap-1">
          {card.nfcEnabled && <Wifi className="h-4 w-4 text-primary" />}
          <span className="text-xs text-primary/70 uppercase font-mono">{card.cardType}</span>
        </div>
        <div className="absolute top-4 left-6">
          <div className="text-xs text-white/40 uppercase tracking-widest">NEXA</div>
          <div className="text-xs text-primary/70 font-mono mt-0.5">{card.asset}</div>
        </div>
        <div className="absolute bottom-12 left-6">
          <code className="text-sm font-mono text-white/80 tracking-widest">{maskedNumber}</code>
        </div>
        <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
          <div>
            <div className="text-xs text-white/40 uppercase tracking-widest">Cardholder</div>
            <div className="text-sm font-medium text-white/90 uppercase">{card.cardholderName}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-white/40 uppercase tracking-widest">Expires</div>
            <div className="text-sm font-mono text-white/90">{String(card.expiryMonth).padStart(2, "0")}/{String(card.expiryYear).slice(-2)}</div>
          </div>
        </div>
      </div>

      {/* Card controls */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => setShowDetails(!showDetails)} className="gap-2 border-border/50 text-muted-foreground hover:text-foreground" data-testid={`button-toggle-details-${card.id}`}>
          {showDetails ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          {showDetails ? "Hide" : "Reveal"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleFreeze}
          disabled={updateCard.isPending}
          className={`gap-2 border-border/50 ${card.status === "frozen" ? "text-emerald-400 hover:text-emerald-300" : "text-yellow-400 hover:text-yellow-300"}`}
          data-testid={`button-freeze-${card.id}`}
        >
          <Lock className="h-3 w-3" />
          {card.status === "frozen" ? "Unfreeze" : "Freeze"}
        </Button>
        <Badge variant="outline" className={`ml-auto text-xs ${card.status === "active" ? "text-emerald-400 border-emerald-500/20" : "text-yellow-400 border-yellow-500/20"}`}>
          {card.status}
        </Badge>
      </div>

      {/* Spending limit */}
      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Spending</span>
          <span>${Number(card.spentAmount).toLocaleString(undefined, { maximumFractionDigits: 2 })} / ${Number(card.spendingLimit).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
        </div>
        <Progress value={spentPct} className="h-1.5" />
      </div>
    </motion.div>
  );
}

export default function Cards() {
  const { data: cards, isLoading } = useListCards();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Digital Cards</h1>
          <p className="text-muted-foreground mt-1">Virtual crypto cards with NFC tap-to-pay</p>
        </div>
        <Link href="/cards/new">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2" data-testid="button-new-card">
            <Plus className="h-4 w-4" /> New Card
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map((i) => <Skeleton key={i} className="h-64 w-full" />)}
        </div>
      ) : (cards ?? []).length === 0 ? (
        <Card className="bg-card/50 border-border/50 border-dashed">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No cards yet. Issue your first crypto card.</p>
            <Link href="/cards/new">
              <Button className="mt-4 bg-primary text-primary-foreground" data-testid="button-issue-first-card">Issue Card</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {(cards ?? []).map((card) => (
            <Card key={card.id} className="bg-card/50 border-border/50 backdrop-blur-xl p-6" data-testid={`card-item-${card.id}`}>
              <CryptoCardDisplay card={card} />
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}
