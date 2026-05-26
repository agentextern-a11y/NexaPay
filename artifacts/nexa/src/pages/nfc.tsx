import { useInitiateNfcSession, useConfirmNfcPayment, useGetNfcHistory, getGetNfcHistoryQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Wifi, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function Nfc() {
  const [step, setStep] = useState<"idle" | "initiated" | "confirmed">("idle");
  const [session, setSession] = useState<any>(null);
  const [merchantName, setMerchantName] = useState("");
  const [amount, setAmount] = useState("");
  const [asset, setAsset] = useState("USDT");
  const [timeLeft, setTimeLeft] = useState(0);

  const initiateSession = useInitiateNfcSession();
  const confirmPayment = useConfirmNfcPayment();
  const { data: history, isLoading: historyLoading } = useGetNfcHistory();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (step === "initiated" && session) {
      const expiry = new Date(session.expiresAt).getTime();
      const interval = setInterval(() => {
        const left = Math.max(0, Math.floor((expiry - Date.now()) / 1000));
        setTimeLeft(left);
        if (left === 0) {
          setStep("idle");
          setSession(null);
          toast({ title: "Session expired", variant: "destructive" });
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [step, session]);

  const handleInitiate = () => {
    initiateSession.mutate(
      { data: { amount: Number(amount), asset, merchantName } },
      {
        onSuccess: (s) => {
          setSession(s);
          setStep("initiated");
          setTimeLeft(Math.floor((new Date(s.expiresAt).getTime() - Date.now()) / 1000));
        },
        onError: () => toast({ title: "Failed to initiate session", variant: "destructive" }),
      }
    );
  };

  const handleConfirm = () => {
    if (!session) return;
    confirmPayment.mutate(
      { data: { sessionToken: session.sessionToken } },
      {
        onSuccess: () => {
          setStep("confirmed");
          queryClient.invalidateQueries({ queryKey: getGetNfcHistoryQueryKey() });
          toast({ title: "Payment confirmed!" });
        },
        onError: () => toast({ title: "Payment failed", variant: "destructive" }),
      }
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">NFC Tap-to-Pay</h1>
        <p className="text-muted-foreground mt-1">Instant contactless crypto payments</p>
      </div>

      {/* NFC Interface */}
      <Card className="bg-card/50 border-border/50 backdrop-blur-xl overflow-hidden">
        <CardContent className="p-8">
          <AnimatePresence mode="wait">
            {step === "idle" && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center w-24 h-24 mb-4">
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-primary/30"
                      animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-primary/50"
                      animate={{ scale: [1, 1.2], opacity: [0.7, 0] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeOut", delay: 0.5 }}
                    />
                    <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                      <Wifi className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Configure payment details below</p>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Merchant Name</label>
                    <Input value={merchantName} onChange={(e) => setMerchantName(e.target.value)} placeholder="Coffee Shop" className="bg-background/30 border-border/50" data-testid="input-merchant-name" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Amount</label>
                      <Input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" placeholder="25.00" className="bg-background/30 border-border/50" data-testid="input-nfc-amount" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Asset</label>
                      <Select value={asset} onValueChange={setAsset}>
                        <SelectTrigger className="bg-background/30 border-border/50" data-testid="select-nfc-asset">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USDT">USDT</SelectItem>
                          <SelectItem value="BTC">BTC</SelectItem>
                          <SelectItem value="ETH">ETH</SelectItem>
                          <SelectItem value="SOL">SOL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleInitiate}
                  disabled={!merchantName || !amount || initiateSession.isPending}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-semibold gap-2"
                  data-testid="button-initiate-nfc"
                >
                  <Wifi className="h-5 w-5" />
                  {initiateSession.isPending ? "Initiating..." : "Initiate NFC Payment"}
                </Button>
              </motion.div>
            )}

            {step === "initiated" && session && (
              <motion.div key="initiated" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center space-y-6">
                <div className="relative inline-flex items-center justify-center w-32 h-32">
                  {[1, 2, 3].map((ring) => (
                    <motion.div
                      key={ring}
                      className="absolute inset-0 rounded-full border-2 border-primary"
                      animate={{ scale: [1, 1 + ring * 0.3], opacity: [0.8, 0] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeOut", delay: ring * 0.4 }}
                    />
                  ))}
                  <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                    <Wifi className="h-10 w-10 text-primary" />
                  </div>
                </div>
                <div>
                  <p className="text-xl font-bold">{session.merchantName}</p>
                  <p className="text-3xl font-black text-primary mt-1">{Number(session.amount).toFixed(2)} {session.asset}</p>
                  <div className="flex items-center justify-center gap-2 mt-2 text-muted-foreground text-sm">
                    <Clock className="h-4 w-4" />
                    <span>Expires in <span className="text-foreground font-mono font-bold">{timeLeft}s</span></span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => { setStep("idle"); setSession(null); }} className="flex-1 border-border/50" data-testid="button-cancel-nfc">Cancel</Button>
                  <Button onClick={handleConfirm} disabled={confirmPayment.isPending} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-confirm-nfc">
                    {confirmPayment.isPending ? "Processing..." : "Confirm Pay"}
                  </Button>
                </div>
              </motion.div>
            )}

            {step === "confirmed" && (
              <motion.div key="confirmed" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4 py-4">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
                  <CheckCircle className="h-20 w-20 text-emerald-400 mx-auto" />
                </motion.div>
                <h2 className="text-2xl font-bold">Payment Complete</h2>
                <p className="text-muted-foreground">Your NFC payment was successful</p>
                <Button onClick={() => { setStep("idle"); setSession(null); setMerchantName(""); setAmount(""); }} className="bg-primary text-primary-foreground" data-testid="button-nfc-done">
                  New Payment
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* History */}
      <div>
        <h2 className="text-lg font-bold mb-4">Recent NFC Payments</h2>
        {historyLoading ? (
          <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
        ) : (history ?? []).length === 0 ? (
          <Card className="bg-card/50 border-border/50 border-dashed">
            <CardContent className="p-8 text-center text-muted-foreground text-sm">No NFC payments yet</CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {(history ?? []).map((tx) => (
              <Card key={tx.id} className="bg-card/50 border-border/50" data-testid={`nfc-history-${tx.id}`}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Wifi className="h-4 w-4 text-primary" />
                    <div>
                      <div className="font-medium text-sm">{tx.merchantName ?? "Merchant"}</div>
                      <div className="text-xs text-muted-foreground">{format(new Date(tx.createdAt), "MMM d, HH:mm")}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm">{Number(tx.amount).toFixed(4)} {tx.asset}</div>
                    <div className="text-xs text-muted-foreground">${Number(tx.valueUsd).toFixed(2)}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
