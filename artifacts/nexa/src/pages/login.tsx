import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { loginWalletAccount, useAuth } from "@/hooks/useAuth";
import { useWeb3Auth } from "@/hooks/useWeb3Auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowRight, Eye, EyeOff, Lock, User, Loader2, Fingerprint,
  Shield, Zap, Wifi, TrendingUp, CreditCard, Globe,
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

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const { login } = useAuth();
  const { login: web3authLogin, isLoading: web3authLoading, error: web3authError } = useWeb3Auth();
  const [, navigate] = useLocation();
  const base = (import.meta.env.BASE_URL || "").replace(/\/$/, "");

  const handleLogin = async () => {
    setError("");
    if (!username.trim() || !password) {
      setError("Please enter both username and password");
      return;
    }

    setIsPending(true);
    try {
      const session = await loginWalletAccount(username.trim(), password);
      if (session) {
        login(session);
        window.location.href = base || "/";
      } else {
        setError("Invalid username or password");
      }
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(210, 60%, 98%) 0%, hsl(200, 50%, 96%) 50%, hsl(210, 55%, 97%) 100%)" }}>
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-[45%] relative flex-col p-12 overflow-hidden">
        <div className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full bg-sky-300/20 blur-3xl bg-orb-1 pointer-events-none" />
        <div className="absolute bottom-[-60px] right-[-60px] w-96 h-96 rounded-full bg-cyan-300/15 blur-3xl bg-orb-2 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-blue-300/10 blur-2xl bg-orb-3 pointer-events-none" />

        <div className="relative z-10">
          <img src={logoUrl} alt="NEXA" className="h-9 w-auto" style={{ filter: "brightness(0) invert(1)" }} />
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-sky-700/70 text-sm font-medium uppercase tracking-widest mb-4">Secure Access Portal</p>
            <h1 className="text-5xl font-bold leading-tight mb-6" style={{ fontFamily: "'Sora', sans-serif", color: "hsl(215, 35%, 12%)" }}>
              Welcome<br />back,<br /><span className="text-sky-500">champion.</span>
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed max-w-sm">
              Your wallet credentials are hashed with SHA-256 and stored locally. Sign in to manage your assets.
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

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-20 w-40 h-40 rounded-full bg-sky-200/20 blur-3xl" />
          <div className="absolute bottom-20 left-10 w-56 h-56 rounded-full bg-cyan-200/15 blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-md">
          <div className="lg:hidden mb-6">
            <img src={logoUrl} alt="NEXA" className="h-7 w-auto" />
          </div>

          <AnimatePresence mode="wait">
            <motion.form key="login" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}
              onSubmit={(e) => { e.preventDefault(); handleLogin(); }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: "'Sora', sans-serif", color: "hsl(215, 35%, 12%)" }}>
                Sign In
              </h2>
              <p className="text-slate-500 mb-6 md:mb-8 text-sm md:text-base">
                Enter your credentials to access your secure NEXA wallet.
              </p>

              {/* Social login */}
              <div className="space-y-3 mb-6">
                <button
                  type="button"
                  onClick={async () => {
                    const session = await web3authLogin();
                    if (session) {
                      login(session);
                      window.location.href = base || "/";
                    }
                  }}
                  disabled={web3authLoading}
                  className="w-full flex items-center justify-center gap-3 p-4 rounded-xl border-2 border-indigo-400/30 bg-gradient-to-r from-indigo-50 to-violet-50 hover:from-indigo-100 hover:to-violet-100 transition-all group card-lift disabled:opacity-50"
                >
                  <Fingerprint className="h-5 w-5 text-indigo-500 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-slate-800 text-base">Continue with Social</span>
                </button>

                {web3authError && (
                  <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{web3authError}</p>
                )}

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-xs text-slate-400 uppercase tracking-wider">or sign in with username</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <Label htmlFor="loginUsername" className="text-sm font-medium text-slate-700 mb-1.5 block flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-sky-500" /> Username
                  </Label>
                  <Input
                    id="loginUsername"
                    placeholder="Your username"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    className={`h-12 text-base bg-white/70 ${error ? "border-red-300 focus-visible:ring-red-200" : "border-sky-200/50 focus-visible:ring-sky-200"}`}
                    autoFocus
                  />
                </div>

                <div>
                  <Label htmlFor="loginPassword" className="text-sm font-medium text-slate-700 mb-1.5 block flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-sky-500" /> Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="loginPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Your password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(""); }}
                      onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                      className={`h-12 text-base bg-white/70 pr-10 ${error ? "border-red-300 focus-visible:ring-red-200" : "border-sky-200/50 focus-visible:ring-sky-200"}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {error}
                  </motion.p>
                )}

                <Button
                  onClick={handleLogin}
                  disabled={isPending}
                  className="w-full h-12 text-base bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl transition-all neon-glow"
                >
                  {isPending ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Verifying...</>
                  ) : (
                    <>Sign In Securely <ArrowRight className="h-4 w-4 ml-2" /></>
                  )}
                </Button>
              </div>

              <div className="mt-6 flex items-center justify-between text-sm">
                <button type="button" onClick={() => navigate("/onboarding")} className="text-sky-600 hover:text-sky-700 transition-colors font-medium">
                  Create new wallet
                </button>
                <span className="text-slate-400">|</span>
                <button type="button" className="text-slate-500 hover:text-slate-700 transition-colors">
                  Forgot password?
                </button>
              </div>

              <div className="mt-8 flex items-start gap-2.5 text-xs text-slate-400">
                <Shield className="h-4 w-4 text-sky-500 flex-shrink-0 mt-0.5" />
                <span>Your credentials are hashed with SHA-256 and encrypted locally. NEXA never stores or transmits your password.</span>
              </div>
            </motion.form>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
