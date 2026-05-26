import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { createWalletAccount } from "@/hooks/useAuth";
import { useAuth } from "@/hooks/useAuth";
import { useWeb3Auth } from "@/hooks/useWeb3Auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowRight, Shield, Zap, Wifi, TrendingUp, CreditCard,
  Globe, CheckCircle2, Loader2, Eye, EyeOff, Lock, KeyRound, User, Fingerprint
} from "lucide-react";
import logoUrl from "@assets/3492540F-12E9-4FDB-83EF-D471EF90B334_1779651060145.png";

const FEATURES = [
  { icon: Shield, text: "SHA-256 credential hashing" },
  { icon: Zap, text: "Instant cross-chain transfers" },
  { icon: Wifi, text: "NFC tap-to-pay at any terminal" },
  { icon: CreditCard, text: "Virtual crypto cards" },
  { icon: TrendingUp, text: "Live market portfolio tracking" },
  { icon: Globe, text: "142 countries supported" },
];

export default function Onboarding() {
  const [step, setStep] = useState<"home" | "create" | "success">("home");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, setIsPending] = useState(false);
  const { login } = useAuth();
  const { login: web3authLogin, isLoading: web3authLoading, error: web3authError } = useWeb3Auth();
  const [, navigate] = useLocation();
  const base = (import.meta.env.BASE_URL || "").replace(/\/$/, "");

  const handleCreate = async () => {
    const newErrors: Record<string, string> = {};
    const trimmedUser = username.trim().toLowerCase();
    const trimmedName = displayName.trim();

    if (trimmedUser.length < 3) newErrors.username = "Username must be at least 3 characters";
    if (!/^[a-z0-9_]+$/.test(trimmedUser)) newErrors.username = "Only letters, numbers, and underscores";
    if (trimmedName.length < 2) newErrors.displayName = "Display name must be at least 2 characters";
    if (password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password)) newErrors.password = "Password must contain an uppercase letter";
    if (!/[0-9]/.test(password)) newErrors.password = "Password must contain a number";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsPending(true);

    try {
      const session = await createWalletAccount(trimmedUser, trimmedName, password);
      if (session) {
        login(session);
        setStep("success");
        setTimeout(() => {
          window.location.href = base || "/";
        }, 2000);
      }
    } catch (err: any) {
      setErrors({ username: err.message || "Unable to create wallet. Try a different username." });
    } finally {
      setIsPending(false);
    }
  };

  const goToLogin = () => {
    navigate("/login");
  };

  const goToLaunch = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(210, 60%, 98%) 0%, hsl(200, 50%, 96%) 50%, hsl(210, 55%, 97%) 100%)" }}>
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-[45%] relative flex-col p-12 overflow-hidden">
        {/* Animated orbs */}
        <div className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full bg-sky-300/20 blur-3xl bg-orb-1 pointer-events-none" />
        <div className="absolute bottom-[-60px] right-[-60px] w-96 h-96 rounded-full bg-cyan-300/15 blur-3xl bg-orb-2 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-blue-300/10 blur-2xl bg-orb-3 pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10">
          <img src={logoUrl} alt="NEXA" className="h-9 w-auto brightness-0 invert" style={{ filter: "brightness(0) invert(1)" }} />
          <span className="ml-2 text-xs font-semibold text-white/70 tracking-widest uppercase">NEXA</span>
        </div>

        {/* Headline */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-sky-700/70 text-sm font-medium uppercase tracking-widest mb-4">Enterprise Crypto Protocol</p>
            <h1 className="text-5xl font-bold leading-tight mb-6" style={{ fontFamily: "'Sora', sans-serif", color: "hsl(215, 35%, 12%)" }}>
              Your financial<br />future,<br /><span className="text-sky-500">unlocked.</span>
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed max-w-sm">
              The most powerful crypto wallet ever built. Backed by the same infrastructure powering enterprise payments worldwide.
            </p>
          </motion.div>

          <motion.div className="mt-10 space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.3 }}>
            {FEATURES.map((f, i) => (
              <motion.div key={f.text} className="flex items-center gap-3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.08 }}>
                <div className="w-7 h-7 rounded-full bg-sky-500/15 flex items-center justify-center flex-shrink-0">
                  <f.icon className="h-3.5 w-3.5 text-sky-500" />
                </div>
                <span className="text-slate-600 text-sm">{f.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div className="relative z-10 grid grid-cols-3 gap-4 pt-8 border-t border-sky-200/40" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
          {[
            { label: "Uptime", value: "99.98%" },
            { label: "Countries", value: "142" },
            { label: "Networks", value: "14" },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-bold text-xl text-slate-800">{s.value}</div>
              <div className="text-slate-400 text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-20 w-40 h-40 rounded-full bg-sky-200/20 blur-3xl" />
          <div className="absolute bottom-20 left-10 w-56 h-56 rounded-full bg-cyan-200/15 blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <img src={logoUrl} alt="NEXA" className="h-8 w-auto" />
          </div>

          <AnimatePresence mode="wait">
            {step === "home" && (
              <motion.div key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
                <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Sora', sans-serif", color: "hsl(215, 35%, 12%)" }}>
                  Welcome to NEXA
                </h2>
                <p className="text-slate-500 mb-8">
                  Create your secure wallet or sign in to access your dashboard.
                </p>

                <div className="space-y-3">
                  {/* Social login via Web3Auth */}
                  <button
                    onClick={async () => {
                      const session = await web3authLogin();
                      if (session) {
                        login(session);
                        window.location.href = base || "/";
                      }
                    }}
                    disabled={web3authLoading}
                    className="w-full flex items-center justify-between p-5 rounded-xl border-2 border-indigo-400/30 bg-gradient-to-r from-indigo-50 to-violet-50 hover:from-indigo-100 hover:to-violet-100 transition-all group card-lift disabled:opacity-50"
                  >
                    <div className="text-left">
                      <div className="font-semibold text-slate-800 text-base">Continue with Social</div>
                      <div className="text-sm text-slate-500 mt-0.5">Google, Twitter, Discord & more via Web3Auth</div>
                    </div>
                    <Fingerprint className="h-5 w-5 text-indigo-500 group-hover:scale-110 transition-transform flex-shrink-0" />
                  </button>

                  {web3authError && (
                    <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{web3authError}</p>
                  )}

                  <div className="flex items-center gap-3 my-2">
                    <div className="flex-1 h-px bg-slate-200" />
                    <span className="text-xs text-slate-400 uppercase tracking-wider">or</span>
                    <div className="flex-1 h-px bg-slate-200" />
                  </div>

                  <button
                    onClick={() => setStep("create")}
                    className="w-full flex items-center justify-between p-5 rounded-xl border-2 border-sky-400/30 bg-gradient-to-r from-sky-50 to-cyan-50 hover:from-sky-100 hover:to-cyan-100 transition-all group card-lift"
                  >
                    <div className="text-left">
                      <div className="font-semibold text-slate-800 text-base">Create New Wallet</div>
                      <div className="text-sm text-slate-500 mt-0.5">Set up your secure NEXA account</div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-sky-500 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                  </button>

                  <button
                    onClick={goToLogin}
                    className="w-full flex items-center justify-between p-5 rounded-xl border border-slate-200/60 bg-white/60 hover:bg-white/80 transition-all group glass card-lift"
                  >
                    <div className="text-left">
                      <div className="font-semibold text-slate-800 text-base">Sign In</div>
                      <div className="text-sm text-slate-500 mt-0.5">Access your existing wallet</div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                  </button>
                </div>

                <div className="mt-8 flex items-start gap-2.5 text-xs text-slate-500">
                  <Shield className="h-4 w-4 text-sky-500 flex-shrink-0 mt-0.5" />
                  <span>Credentials are hashed with SHA-256 and stored locally. No server ever sees your password.</span>
                </div>
              </motion.div>
            )}

            {step === "create" && (
              <motion.form key="create" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}
                onSubmit={(e) => { e.preventDefault(); handleCreate(); }}
              >
                <button type="button" onClick={() => setStep("home")} className="text-sm text-slate-500 hover:text-slate-800 transition-colors mb-6 flex items-center gap-1.5">
                  <ArrowRight className="h-3.5 w-3.5 rotate-180" /> Back
                </button>

                <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Sora', sans-serif", color: "hsl(215, 35%, 12%)" }}>
                  Create your wallet
                </h2>
                <p className="text-slate-500 mb-8">
                  Choose a unique username and secure password. We will generate real crypto addresses for you.
                </p>

                <div className="space-y-5">
                  <div>
                    <Label htmlFor="username" className="text-sm font-medium text-slate-700 mb-1.5 block flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-sky-500" /> Username
                    </Label>
                    <Input
                      id="username"
                      placeholder="e.g. sarah_crypto"
                      value={username}
                      onChange={(e) => { setUsername(e.target.value); setErrors((p) => ({ ...p, username: "" })); }}
                      onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                      className={`h-12 text-base bg-white/70 ${errors.username ? "border-red-300 focus-visible:ring-red-200" : "border-sky-200/50 focus-visible:ring-sky-200"}`}
                      autoFocus
                    />
                    {errors.username && <p className="text-xs text-red-500 mt-1.5">{errors.username}</p>}
                  </div>

                  <div>
                    <Label htmlFor="displayName" className="text-sm font-medium text-slate-700 mb-1.5 block flex items-center gap-1.5">
                      <KeyRound className="h-3.5 w-3.5 text-sky-500" /> Display Name
                    </Label>
                    <Input
                      id="displayName"
                      placeholder="e.g. Sarah Chen"
                      value={displayName}
                      onChange={(e) => { setDisplayName(e.target.value); setErrors((p) => ({ ...p, displayName: "" })); }}
                      className={`h-12 text-base bg-white/70 ${errors.displayName ? "border-red-300 focus-visible:ring-red-200" : "border-sky-200/50 focus-visible:ring-sky-200"}`}
                    />
                    {errors.displayName && <p className="text-xs text-red-500 mt-1.5">{errors.displayName}</p>}
                  </div>

                  <div>
                    <Label htmlFor="password" className="text-sm font-medium text-slate-700 mb-1.5 block flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 text-sky-500" /> Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Minimum 8 characters, uppercase + number"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })); }}
                        className={`h-12 text-base bg-white/70 pr-10 ${errors.password ? "border-red-300 focus-visible:ring-red-200" : "border-sky-200/50 focus-visible:ring-sky-200"}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-xs text-red-500 mt-1.5">{errors.password}</p>}
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700 mb-1.5 block flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 text-sky-500" /> Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value); setErrors((p) => ({ ...p, confirmPassword: "" })); }}
                        onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                        className={`h-12 text-base bg-white/70 pr-10 ${errors.confirmPassword ? "border-red-300 focus-visible:ring-red-200" : "border-sky-200/50 focus-visible:ring-sky-200"}`}
                      />
                    </div>
                    {errors.confirmPassword && <p className="text-xs text-red-500 mt-1.5">{errors.confirmPassword}</p>}
                  </div>

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full h-12 text-base bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl transition-all neon-glow"
                  >
                    {isPending ? (
                      <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Securing wallet...</>
                    ) : (
                      <>Create Secure Wallet <ArrowRight className="h-4 w-4 ml-2" /></>
                    )}
                  </Button>
                </div>

                <p className="text-xs text-slate-400 mt-6 text-center">
                  By creating a wallet, you agree to NEXA terms. Your password is never sent to any server — all encryption is local.
                </p>
              </motion.form>
            )}

            {step === "success" && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.1 }} className="w-20 h-20 rounded-full bg-sky-500/15 flex items-center justify-center mx-auto mb-6 neon-glow">
                  <CheckCircle2 className="h-10 w-10 text-sky-500" />
                </motion.div>
                <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>Wallet created!</h2>
                <p className="text-slate-500">Welcome to NEXA, {displayName.trim() || username}. Generating your keys...</p>
                <div className="mt-6 flex justify-center">
                  <Loader2 className="h-5 w-5 text-sky-500 animate-spin" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
