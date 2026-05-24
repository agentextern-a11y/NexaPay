import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCreateWallet } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Shield, Zap, Wifi, TrendingUp, CreditCard, Globe, CheckCircle2, Loader2 } from "lucide-react";
import logoUrl from "@assets/3492540F-12E9-4FDB-83EF-D471EF90B334_1779651060145.png";

const FEATURES = [
  { icon: Shield, text: "Ed25519 cryptographic security" },
  { icon: Zap, text: "Instant cross-chain transfers" },
  { icon: Wifi, text: "NFC tap-to-pay at any terminal" },
  { icon: CreditCard, text: "Virtual crypto cards" },
  { icon: TrendingUp, text: "Live market portfolio tracking" },
  { icon: Globe, text: "142 countries supported" },
];

export default function Onboarding() {
  const [step, setStep] = useState<"home" | "create" | "success">("home");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const { login } = useAuth();
  const { mutate: createWallet, isPending } = useCreateWallet();

  const handleCreate = () => {
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setNameError("Please enter at least 2 characters");
      return;
    }
    if (trimmed.length > 50) {
      setNameError("Name must be 50 characters or less");
      return;
    }
    setNameError("");
    createWallet(
      { data: { ownerName: trimmed } },
      {
        onSuccess: (result) => {
          login({
            walletId: result.walletId,
            ownerName: result.ownerName,
            totalValueUsd: result.totalValueUsd,
            createdAt: new Date().toISOString(),
          });
          setStep("success");
          setTimeout(() => {
            window.location.href = import.meta.env.BASE_URL || "/";
          }, 1600);
        },
        onError: () => {
          setNameError("Unable to create wallet. Please try again.");
        },
      }
    );
  };

  const handleDemoAccess = () => {
    login({
      walletId: 1,
      ownerName: "Alex Nexara",
      totalValueUsd: 247831.52,
      createdAt: new Date().toISOString(),
    });
    window.location.href = import.meta.env.BASE_URL || "/";
  };

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[hsl(186,100%,36%)] via-[hsl(200,100%,45%)] to-[hsl(220,90%,55%)] flex-col p-12 overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full bg-white/10 blur-3xl bg-orb-1 pointer-events-none" />
        <div className="absolute bottom-[-60px] right-[-60px] w-96 h-96 rounded-full bg-white/8 blur-3xl bg-orb-2 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-white/5 blur-2xl bg-orb-3 pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10">
          <img src={logoUrl} alt="NEXA" className="h-9 w-auto brightness-0 invert" />
        </div>

        {/* Headline */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-white/70 text-sm font-medium uppercase tracking-widest mb-4">Enterprise Crypto Protocol</p>
            <h1 className="text-5xl font-bold text-white leading-tight mb-6" style={{ fontFamily: "'Sora', sans-serif" }}>
              Your financial<br />future,<br /><span className="text-white/90">unlocked.</span>
            </h1>
            <p className="text-white/80 text-lg leading-relaxed max-w-sm">
              The most powerful crypto wallet ever built. Backed by the same infrastructure powering enterprise payments worldwide.
            </p>
          </motion.div>

          <motion.div
            className="mt-10 space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.text}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
              >
                <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                  <f.icon className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-white/85 text-sm">{f.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          className="relative z-10 grid grid-cols-3 gap-4 pt-8 border-t border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          {[
            { label: "Uptime", value: "99.98%" },
            { label: "Countries", value: "142" },
            { label: "Microservices", value: "14" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-white font-bold text-xl">{s.value}</div>
              <div className="text-white/60 text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white relative">
        {/* Subtle background grid */}
        <div
          className="absolute inset-0 bg-grid-pulse pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(hsl(214,32%,91%) 1px, transparent 1px), linear-gradient(90deg, hsl(214,32%,91%) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <img src={logoUrl} alt="NEXA" className="h-8 w-auto" />
          </div>

          <AnimatePresence mode="wait">
            {step === "home" && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>
                  Get started
                </h2>
                <p className="text-muted-foreground mb-8">
                  Create your secure NEXA wallet in seconds. No seed phrases. No complexity. Just power.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => setStep("create")}
                    className="w-full flex items-center justify-between p-5 rounded-xl border-2 border-primary bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 transition-all group"
                  >
                    <div className="text-left">
                      <div className="font-semibold text-foreground text-base">Create New Wallet</div>
                      <div className="text-sm text-muted-foreground mt-0.5">Set up your personal NEXA account</div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform flex-shrink-0" />
                  </button>

                  <button
                    onClick={handleDemoAccess}
                    className="w-full flex items-center justify-between p-5 rounded-xl border border-border bg-secondary/50 hover:bg-secondary transition-all group"
                  >
                    <div className="text-left">
                      <div className="font-semibold text-foreground text-base">Explore Live Platform</div>
                      <div className="text-sm text-muted-foreground mt-0.5">Access the fully-loaded live account</div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform flex-shrink-0" />
                  </button>
                </div>

                <div className="mt-8 flex items-start gap-2.5 text-xs text-muted-foreground">
                  <Shield className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Protected by Ed25519 cryptography. Transactions are verified by a distributed double-entry ledger with anti-replay protection and blockchain anchoring.</span>
                </div>
              </motion.div>
            )}

            {step === "create" && (
              <motion.div
                key="create"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <button
                  onClick={() => setStep("home")}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 flex items-center gap-1.5"
                >
                  ← Back
                </button>

                <h2 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>
                  Create your wallet
                </h2>
                <p className="text-muted-foreground mb-8">
                  Your wallet is created instantly and secured with enterprise-grade cryptography.
                </p>

                <div className="space-y-5">
                  <div>
                    <Label htmlFor="ownerName" className="text-sm font-medium text-foreground mb-1.5 block">
                      Your Name
                    </Label>
                    <Input
                      id="ownerName"
                      placeholder="e.g. Sarah Chen"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setNameError(""); }}
                      onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                      className={`h-12 text-base ${nameError ? "border-destructive focus-visible:ring-destructive/30" : "focus-visible:ring-primary/30"}`}
                      autoFocus
                    />
                    {nameError && (
                      <p className="text-xs text-destructive mt-1.5">{nameError}</p>
                    )}
                  </div>

                  <Button
                    onClick={handleCreate}
                    disabled={isPending}
                    className="w-full h-12 text-base bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl"
                  >
                    {isPending ? (
                      <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Creating wallet...</>
                    ) : (
                      <>Create My Wallet <ArrowRight className="h-4 w-4 ml-2" /></>
                    )}
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground mt-6 text-center">
                  By creating a wallet, you agree to use this platform responsibly. All transactions are recorded on an immutable ledger.
                </p>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle2 className="h-10 w-10 text-primary" />
                </motion.div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Wallet created!</h2>
                <p className="text-muted-foreground">Welcome to NEXA, {name.trim()}. Redirecting to your dashboard...</p>
                <div className="mt-6 flex justify-center">
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
