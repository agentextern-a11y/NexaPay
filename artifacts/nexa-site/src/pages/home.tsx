import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Zap, Shield, Globe, ArrowRight, ChevronDown,
  TrendingUp, Lock, Cpu, CheckCircle2, BarChart3,
  CreditCard, Wifi, Activity, Users
} from "lucide-react";
import nexaLogo from "@assets/3492540F-12E9-4FDB-83EF-D471EF90B334_1779651060145.png";
import { useGetPlatformStats, useGetMarketPrices } from "@workspace/api-client-react";
import appInterfaceImg from "@/assets/images/app-interface.png";

// ── Trust logos ────────────────────────────────────────────────────────────
const TRUST_LOGOS = [
  "Polygon", "Chainlink", "OpenZeppelin", "Alchemy", "Etherscan", "The Graph", "Gnosis Safe"
];

// ── Nav links ──────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Product", href: "#product" },
  { label: "Solutions", href: "#solutions", hasDropdown: true },
  { label: "Developers", href: "#developers", hasDropdown: true },
  { label: "Pricing", href: "#pricing", hasDropdown: true },
  { label: "Company", href: "#company", hasDropdown: true },
];

// ── Features ───────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Zap,
    title: "Lightning Fast",
    desc: "Finality in under 400ms. Cross-chain transfers processed at wire speed across 14 supported networks.",
    color: "from-amber-400/20 to-amber-400/5",
    iconColor: "text-amber-500",
    border: "border-amber-200/50",
  },
  {
    icon: Shield,
    title: "Bank-Grade Security",
    desc: "Ed25519 + secp256k1 cryptography. Anti-replay protection, multi-sig vaults, and MPC key shards.",
    color: "from-blue-500/20 to-blue-500/5",
    iconColor: "text-blue-600",
    border: "border-blue-200/50",
  },
  {
    icon: Globe,
    title: "Seamless Settlement",
    desc: "On-chain settlement with programmable finality. Unified liquidity across 142 countries and 14 blockchains.",
    color: "from-emerald-400/20 to-emerald-400/5",
    iconColor: "text-emerald-600",
    border: "border-emerald-200/50",
  },
];

const ENTERPRISE_FEATURES = [
  "SOC 2 Type II certified infrastructure",
  "99.98% guaranteed uptime SLA",
  "Dedicated compliance tooling",
  "Custom settlement windows",
  "White-label API access",
  "24/7 enterprise support",
];

const SECURITY_POINTS = [
  { icon: Lock,     title: "Ed25519 Cryptography",    desc: "Military-grade elliptic curve signatures on every transaction." },
  { icon: Cpu,      title: "MPC Key Management",      desc: "Private keys are never stored in full — split via threshold signatures." },
  { icon: Activity, title: "Real-Time Fraud Signals",  desc: "On-chain anomaly detection with sub-second blocking." },
  { icon: Users,    title: "Multi-Sig Vaults",         desc: "m-of-n approval flows for enterprise treasury management." },
];

// ── Navbar ─────────────────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false);
  const base = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
  const walletUrl = base.replace("/site", "") || "/";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/60">
      <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <img src={nexaLogo} alt="NEXA" className="h-8 w-auto" />
        </div>
        <nav className="hidden md:flex items-center gap-0">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="flex items-center gap-0.5 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              {l.label}
              {l.hasDropdown && <ChevronDown className="h-3.5 w-3.5 opacity-50" />}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a href={walletUrl} className="hidden md:inline-flex text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-2">
            Sign In
          </a>
          <a
            href={walletUrl}
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-md shadow-blue-600/20"
          >
            Launch App <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function Home() {
  const { data: stats } = useGetPlatformStats();
  const { data: prices } = useGetMarketPrices();

  const base = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
  const walletUrl = base.replace("/site", "") || "/";

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Gradient bg matching reference image */}
        <div className="absolute inset-0 -z-10" style={{
          background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(219,234,254,0.6) 0%, rgba(255,255,255,0) 70%), radial-gradient(ellipse 60% 50% at 90% 20%, rgba(196,221,255,0.4) 0%, transparent 60%)"
        }} />
        {/* Decorative circles */}
        <div className="absolute top-20 right-[5%] w-[420px] h-[420px] rounded-full border border-blue-100/60 -z-10" />
        <div className="absolute top-24 right-[7%] w-[320px] h-[320px] rounded-full border border-blue-100/40 -z-10" />

        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left content */}
            <div className="flex-1 max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-8 uppercase tracking-wider"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                Enterprise Crypto Protocol · Web3 Native
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.05] tracking-tight mb-6"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                Instant Payments.<br />
                <span className="text-blue-600">On-Chain</span> Settlement.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-xl text-slate-500 leading-relaxed mb-10 max-w-xl"
              >
                Military-grade security meets lightning-fast crypto payments. NEXA is the enterprise payment protocol trusted by Web3's leading teams.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-center gap-4"
              >
                <a
                  href={walletUrl}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/25 text-base"
                >
                  Get Started <ArrowRight className="h-4 w-4" />
                </a>
                <button className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold text-base px-2 py-3.5 transition-colors">
                  Watch Demo
                  <span className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center hover:border-blue-400 transition-colors">
                    <span className="w-0 h-0 border-y-4 border-y-transparent border-l-[7px] border-l-slate-600 ml-0.5" />
                  </span>
                </button>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                className="mt-10 flex items-center gap-6 text-sm text-slate-400"
              >
                {[
                  { value: stats?.totalTransactions ? `${(stats.totalTransactions / 1e6).toFixed(1)}M+` : "2.4M+", label: "Transactions" },
                  { value: stats?.activeWallets ? `${(stats.activeWallets / 1e3).toFixed(0)}K+` : "142K+", label: "Active wallets" },
                  { value: stats?.uptimePct ? `${stats.uptimePct}%` : "99.98%", label: "Uptime" },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-2">
                    <span className="font-bold text-slate-700 text-base">{s.value}</span>
                    <span>{s.label}</span>
                    <span className="text-slate-300">·</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — 3D Shield visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:flex flex-shrink-0 items-center justify-center relative"
            >
              <div className="relative w-80 h-80">
                {/* Shield SVG */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-72 relative">
                    <svg viewBox="0 0 200 220" className="w-full h-full drop-shadow-2xl">
                      <defs>
                        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{ stopColor: "#dbeafe" }} />
                          <stop offset="100%" style={{ stopColor: "#bfdbfe" }} />
                        </linearGradient>
                        <linearGradient id="shieldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{ stopColor: "#93c5fd" }} />
                          <stop offset="100%" style={{ stopColor: "#3b82f6" }} />
                        </linearGradient>
                      </defs>
                      <path
                        d="M100 10 L180 45 L180 110 C180 160 140 195 100 210 C60 195 20 160 20 110 L20 45 Z"
                        fill="url(#shieldGrad)"
                        stroke="url(#shieldBorder)"
                        strokeWidth="2"
                      />
                      <path
                        d="M80 110 L95 125 L125 95"
                        stroke="#2563eb"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </svg>
                  </div>
                </div>
                {/* Orbiting elements */}
                <div className="absolute top-4 right-4 bg-white rounded-xl shadow-lg p-3 border border-slate-100">
                  <div className="text-xs font-bold text-slate-800">BTC</div>
                  <div className="text-xs text-emerald-600">+2.4%</div>
                </div>
                <div className="absolute bottom-8 left-0 bg-white rounded-xl shadow-lg p-3 border border-slate-100">
                  <div className="text-xs font-bold text-slate-800">Block Confirmed</div>
                  <div className="text-xs text-blue-600">400ms</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className="py-12 border-y border-slate-100 bg-slate-50/50">
        <div className="container mx-auto px-6 max-w-7xl">
          <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">
            Trusted by the best
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {TRUST_LOGOS.map((name) => (
              <span key={name} className="text-slate-400 font-semibold text-sm md:text-base hover:text-slate-600 transition-colors cursor-default">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="product" className="py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
              Core Protocol
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4" style={{ fontFamily: "'Sora', sans-serif" }}>
              Built for the speed<br className="hidden md:block" /> of modern finance.
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-lg">
              Every component is engineered to enterprise specifications. No compromises.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl border bg-gradient-to-br ${f.color} ${f.border} p-8 hover:shadow-lg transition-all`}
              >
                <div className={`w-12 h-12 rounded-xl bg-white/80 border border-white shadow-sm flex items-center justify-center mb-5`}>
                  <f.icon className={`h-6 w-6 ${f.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCT DEMO + ENTERPRISE ── */}
      <section id="solutions" className="py-24 bg-slate-50/60">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* App screenshot */}
            <motion.div
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="rounded-2xl overflow-hidden border border-slate-200 shadow-2xl shadow-slate-200/50"
            >
              <div className="bg-slate-800 flex items-center gap-2 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 bg-slate-700 rounded-md mx-4 h-5 flex items-center px-3">
                  <span className="text-slate-400 text-xs">app.nexa.io/dashboard</span>
                </div>
              </div>
              <img src={appInterfaceImg} alt="NEXA Dashboard" className="w-full object-cover" />
            </motion.div>

            {/* Enterprise content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 uppercase tracking-wider">
                Contact Sales
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4" style={{ fontFamily: "'Sora', sans-serif" }}>
                Enterprise<br />Ready.
              </h2>
              <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                Built for businesses of all sizes. Whether you're a fintech startup or a global enterprise, NEXA's infrastructure scales to your volume without compromise.
              </p>
              <ul className="space-y-3 mb-10">
                {ENTERPRISE_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-slate-600">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <span className="text-sm font-medium">{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href={walletUrl}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/20"
              >
                Contact Sales <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── LIVE MARKET TICKER ── */}
      {prices && prices.length > 0 && (
        <section className="py-8 bg-slate-900 overflow-hidden">
          <div className="flex items-center gap-0 whitespace-nowrap">
            <div className="flex gap-10 animate-[marquee_30s_linear_infinite]">
              {[...prices, ...prices].map((p, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="text-slate-300 font-semibold">{p.symbol}</span>
                  <span className="text-white font-mono">${Number(p.priceUsd).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  <span className={`text-xs font-medium ${Number(p.changePct24h) >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {Number(p.changePct24h) >= 0 ? "+" : ""}{Number(p.changePct24h).toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── SECURITY ── */}
      <section id="developers" className="py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="inline-flex items-center gap-2 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-6 uppercase tracking-wider">
                Security Protocol
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4" style={{ fontFamily: "'Sora', sans-serif" }}>
                Zero-compromise<br />cryptography.
              </h2>
              <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                Every wallet is backed by real Ed25519 and secp256k1 keypairs. Deposit addresses are cryptographically derived — not simulated, not mocked. Real keys, real chains.
              </p>
              <div className="space-y-6">
                {SECURITY_POINTS.map((s, i) => (
                  <motion.div
                    key={s.title}
                    initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center flex-shrink-0">
                      <s.icon className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{s.title}</div>
                      <div className="text-sm text-slate-500 mt-0.5">{s.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              className="bg-slate-900 rounded-2xl p-8 font-mono text-sm"
            >
              <div className="text-slate-500 mb-4 text-xs uppercase tracking-wider">Real wallet creation · Live</div>
              <div className="space-y-3">
                {[
                  { label: "privKey", value: "secp256k1.utils.randomPrivateKey()", color: "text-blue-400" },
                  { label: "ethAddr", value: "keccak256(pubKey.slice(1)).slice(12)", color: "text-cyan-400" },
                  { label: "btcAddr", value: "base58(ripemd160(sha256(pubKey)))", color: "text-amber-400" },
                  { label: "solAddr", value: "base58(ed25519.getPublicKey(seed))", color: "text-purple-400" },
                ].map((line) => (
                  <div key={line.label} className="flex gap-3">
                    <span className="text-slate-500">const</span>
                    <span className="text-emerald-400">{line.label}</span>
                    <span className="text-slate-500">=</span>
                    <span className={line.color}>{line.value}</span>
                  </div>
                ))}
                <div className="border-t border-slate-700 pt-3 mt-3">
                  <span className="text-emerald-500 text-xs">✓ All addresses real · All keys on-chain · No mocks</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── LIVE STATS ── */}
      {stats && (
        <section id="pricing" className="py-20 bg-blue-600">
          <div className="container mx-auto px-6 max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3" style={{ fontFamily: "'Sora', sans-serif" }}>
                Platform by the numbers
              </h2>
              <p className="text-blue-200 text-lg">Live data from the NEXA network.</p>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: `${(stats.totalTransactions / 1e6).toFixed(1)}M+`, label: "Total Transactions" },
                { value: `$${(stats.totalVolumeUsd / 1e9).toFixed(1)}B+`, label: "Volume Processed" },
                { value: `${(stats.activeWallets / 1e3).toFixed(0)}K+`, label: "Active Wallets" },
                { value: `${stats.uptimePct}%`, label: "Network Uptime" },
              ].map((s) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-black text-white mb-2">{s.value}</div>
                  <div className="text-blue-200 text-sm font-medium">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section id="company" className="py-24">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6" style={{ fontFamily: "'Sora', sans-serif" }}>
              Start building on<br />
              <span className="text-blue-600">NEXA today.</span>
            </h2>
            <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto">
              Create your wallet in seconds. Your cryptographic keys are generated live — no demos, no placeholders.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={walletUrl}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all shadow-xl shadow-blue-600/25"
              >
                Create Your Wallet <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href="#developers"
                className="inline-flex items-center gap-2 border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold px-8 py-4 rounded-xl text-lg transition-all"
              >
                Read the Docs
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-200 py-12 bg-slate-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src={nexaLogo} alt="NEXA" className="h-7 w-auto" />
              <span className="text-slate-400 text-sm">© {new Date().getFullYear()} NEXA Protocol. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              {["Privacy", "Terms", "Security", "Docs", "Status"].map((l) => (
                <a key={l} href="#" className="hover:text-slate-800 transition-colors">{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
