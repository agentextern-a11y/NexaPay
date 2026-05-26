import { useCreateCard, getListCardsQueryKey, useListCards } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, CreditCard, ShieldCheck, Zap, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Link, useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

const schema = z.object({
  cardholderName: z.string().min(2, "Name too short").max(26, "Max 26 characters"),
  asset: z.string().min(1, "Select an asset"),
  spendingLimit: z.coerce.number().positive("Must be positive").max(100000, "Max $100,000"),
  cardType: z.enum(["virtual", "physical"]),
  nfcEnabled: z.boolean(),
});

export default function NewCard() {
  const createCard = useCreateCard();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { data: existingCards } = useListCards();
  const [previewName, setPreviewName] = useState("");

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { cardholderName: "", asset: "BTC", spendingLimit: 5000, cardType: "virtual", nfcEnabled: true },
  });

  const watchedName = form.watch("cardholderName");
  const watchedAsset = form.watch("asset");

  useEffect(() => {
    setPreviewName(watchedName.toUpperCase() || "YOUR NAME");
  }, [watchedName]);

  const onSubmit = (values: z.infer<typeof schema>) => {
    createCard.mutate(
      { data: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListCardsQueryKey() });
          toast({ title: "Card issued successfully!" });
          setLocation("/cards");
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.error || "Failed to issue card";
          toast({ title: msg, variant: "destructive" });
        },
      }
    );
  };

  // One-card limit check
  if (existingCards && existingCards.length > 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto space-y-6 text-center py-12">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center mx-auto shadow-lg shadow-sky-500/20">
          <CreditCard className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800" style={{ fontFamily: "'Sora', sans-serif" }}>One Card Per Wallet</h2>
        <p className="text-slate-500 text-sm">
          You already have an active card. Cancel it first to issue a new one with different settings.
        </p>
        <Link href="/cards">
          <Button className="bg-sky-500 text-white hover:bg-sky-600 gap-2">View Your Card</Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto space-y-6 md:space-y-8">
      <Link href="/cards" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm">
        <ArrowLeft className="h-4 w-4" /> Back to Cards
      </Link>

      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
          Issue Your Card
        </h1>
        <p className="text-slate-500 mt-1 text-sm">One premium card per wallet. Holographic design included.</p>
      </div>

      {/* Live card preview */}
      <div className="flex justify-center">
        <div
          className="relative w-full max-w-xs aspect-[1.586/1] rounded-2xl overflow-hidden select-none"
          style={{
            background: "linear-gradient(160deg, #0f172a 0%, #1e293b 40%, #0f172a 100%)",
            boxShadow: "0 20px 40px -10px rgba(0,0,0,0.4), 0 0 40px -10px rgba(0,212,255,0.15)",
          }}
        >
          {/* Holographic shimmer */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: "conic-gradient(from 45deg at 30% 40%, transparent 0deg, rgba(0,212,255,0.15) 30deg, rgba(138,43,226,0.1) 60deg, rgba(255,215,0,0.12) 90deg, transparent 150deg)",
              mixBlendMode: "screen",
              animation: "shimmer 4s ease-in-out infinite",
            }}
          />
          <style>{`@keyframes shimmer { 0%,100% { filter: hue-rotate(0deg); } 50% { filter: hue-rotate(30deg); } }`}</style>

          {/* Top branding */}
          <div className="absolute top-4 left-5">
            <div className="text-[9px] text-slate-400 uppercase tracking-[0.3em] font-semibold">NEXA</div>
            <div className="text-[8px] text-slate-500 uppercase tracking-wider mt-0.5">{watchedAsset || "BTC"} Crypto Card</div>
          </div>

          {/* Chip placeholder */}
          <div className="absolute top-10 left-5 w-8 h-6 rounded bg-gradient-to-br from-yellow-600/40 to-yellow-400/20 border border-yellow-500/30" />

          {/* NFC */}
          <div className="absolute top-4 right-4">
            <span className="text-[8px] text-slate-500 uppercase tracking-wider border border-slate-600/40 px-1.5 py-0.5 rounded">Virtual</span>
          </div>

          {/* Card number placeholder */}
          <div className="absolute bottom-12 left-5 right-5">
            <code className="text-sm font-mono text-slate-300 tracking-[0.15em]">#### #### #### ####</code>
          </div>

          {/* Bottom */}
          <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
            <div>
              <div className="text-[8px] text-slate-500 uppercase tracking-wider">Cardholder</div>
              <div className="text-xs font-semibold text-slate-300 tracking-wider uppercase">{previewName}</div>
            </div>
            <div className="text-right">
              <div className="text-[8px] text-slate-500 uppercase tracking-wider">Expires</div>
              <div className="text-xs font-mono text-slate-300">{String(new Date().getMonth() + 1).padStart(2, "0")}/{String(new Date().getFullYear() + 3).slice(-2)}</div>
            </div>
          </div>
        </div>
      </div>

      <Card className="bg-white/60 border-sky-200/30 backdrop-blur-xl shadow-sm">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField control={form.control} name="cardholderName" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-700">Cardholder Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="JOHN DOE" maxLength={26} className="bg-white/70 border-sky-200/50 uppercase tracking-wider" data-testid="input-cardholder-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="asset" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-700">Linked Asset</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white/70 border-sky-200/50" data-testid="select-asset">
                        <SelectValue placeholder="Select asset" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                      <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                      <SelectItem value="USDT">Tether (USDT)</SelectItem>
                      <SelectItem value="SOL">Solana (SOL)</SelectItem>
                      <SelectItem value="BNB">BNB</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="spendingLimit" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-700">Monthly Limit (USD)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" placeholder="5000" className="bg-white/70 border-sky-200/50" data-testid="input-spending-limit" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="cardType" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-700">Card Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white/70 border-sky-200/50" data-testid="select-card-type">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="virtual">Virtual Card</SelectItem>
                      <SelectItem value="physical">Physical Card</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="nfcEnabled" render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-xl border border-sky-200/40 p-4 bg-sky-50/30">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
                      <Zap className="h-4 w-4 text-sky-500" />
                    </div>
                    <div>
                      <FormLabel className="text-sm font-medium text-slate-700">NFC Tap-to-Pay</FormLabel>
                      <p className="text-xs text-slate-400 mt-0.5">Enable contactless payments at terminals</p>
                    </div>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-nfc-enabled" />
                  </FormControl>
                </FormItem>
              )} />

              <div className="flex items-start gap-2 text-xs text-slate-400 bg-slate-50/60 rounded-xl px-4 py-3 border border-slate-200/30">
                <ShieldCheck className="h-4 w-4 text-sky-400 flex-shrink-0 mt-0.5" />
                <p>One card per wallet. Your card will have a holographic design with Apple Wallet and Google Wallet support.</p>
              </div>

              <Button
                type="submit"
                disabled={createCard.isPending}
                className="w-full bg-sky-500 text-white hover:bg-sky-600 h-12 text-base font-semibold gap-2 shadow-lg shadow-sky-500/20"
                data-testid="button-submit-card"
              >
                <Sparkles className="h-4 w-4" />
                {createCard.isPending ? "Issuing..." : "Issue Premium Card"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
