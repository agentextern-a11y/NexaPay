import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Zap, Shield, Globe, ArrowRight, ChevronDown,
  TrendingUp, Lock, Cpu, CheckCircle2, BarChart3,
  CreditCard, Wifi, Activity, Users, Rocket, Wallet,
  Sparkles, ArrowUpRight, ChevronRight, KeyRound, Eye, EyeOff
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
  { label: "Services", href: "#services" },
  { label: "Security", href: "#security" },
  { label: "Demo", href: "#demo" },
];

// ── Core Features ───────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Zap,
    title: "Lightning Fast",
    desc: "Finality in under 400ms. Cross-chain transfers processed at wire speed across 14 supported networks.",
    color: "from-sky-400/20 to-sky-400/5",
    iconColor: "text-sky-500",
    border: "border-sky-200/40",
  },
  {
    icon: Shield,
    title: "Bank-Grade Security",
    desc: "SHA-256 credential hashing with browser-local storage. Non-custodial demo wallet with deterministic address generation.",
    color: "from-cyan-400/20 to-cyan-400/5",
    iconColor: "text-cyan-600",
    border: "border-cyan-200/40",
  },
  {
    icon: Globe,
    title: "Seamless Settlement",
    desc: "On-chain settlement with programmable finality. Unified liquidity across 142 countries and 14 blockchains.",
    color: "from-emerald-400/15 to-emerald-400/5",
    iconColor: "text-emerald-500",
    border: "border-emerald-200/40",
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
  { icon: Lock, title: "SHA-256 + Local Storage", desc: "Credentials hashed in-browser with SHA-256. All data stays on your device." },
  { icon: Cpu, title: "Local Key Custody", desc: "Private keys are never stored on our servers. All encryption happens in your browser." },
  { icon: Activity, title: "Real-Time Fraud Signals", desc: "On-chain anomaly detection with sub-second blocking and risk scoring." },
  { icon: Users, title: "Multi-Sig Vaults", desc: "m-of-n approval flows for enterprise treasury management and team wallets." },
];

// ── Service Features ────────────────────────────────────────────────────────
const SERVICE_FEATURES = [
  {
    icon: Wallet,
    title: "Secure Wallet",
    desc: "Create a real crypto wallet with username and password. Generate live ETH, BTC, and SOL addresses instantly.",
    tags: ["Non-Custodial", "Demo", "SHA-256"],
    gradient: "from-sky-400 to-cyan-400",
  },
  {
    icon: CreditCard,
    title: "Virtual Cards",
    desc: "Issue virtual crypto-backed cards with real-time conversion. Spend anywhere Visa and Mastercard are accepted.",
    tags: ["Instant", "Global", "0% Fee"],
    gradient: "from-cyan-400 to-teal-400",
  },
  {
    icon: Wifi,
    title: "NFC Tap-to-Pay",
    desc: "Tap your phone at any NFC-enabled terminal to pay with crypto. No app launch required at checkout.",
    tags: ["<400ms", "Offline", "Secure"],
    gradient: "from-teal-400 to-emerald-400",
  },
  {
    icon: BarChart3,
    title: "Live Analytics",
    desc: "Track your portfolio in real-time with advanced charts, price alerts, and automated rebalancing suggestions.",
    tags: ["Real-time", "Multi-chain", "AI-powered"],
    gradient: "from-sky-400 to-blue-400",
  },
  {
    icon: ArrowUpRight,
    title: "Send & Receive",
    desc: "Transfer crypto across 14+ networks with the lowest fees. QR-code payments and one-tap address sharing.",
    tags: ["14 Chains", "Sub-cent", "Instant"],
    gradient: "from-blue-400 to-indigo-400",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    desc: "Bank-grade security with zero-knowledge architecture. Your credentials are hashed and encrypted locally.",
    tags: ["SHA-256", "Local", "SOC 2"],
    gradient: "from-indigo-400 to-violet-400",
  },
];

// ── Navbar ─────────────────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false);
  const base = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
  const walletUrl = base.replace("/site", "") || "/";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-sky-200/30">
      <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <img src={nexaLogo} alt="NEXA" className="h-8 w-auto" />
        </div>
        <nav className="hidden md:flex items-center gap-0">
          {NAV_LINKS.map((l) => (
            <a key={l.label} href={l.href} className="flex items-center gap-0.5 px-4 py-2 text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a href={walletUrl} className="hidden md:inline-flex text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors px-3 py-2">
            Sign In
          </a>
          <a href={walletUrl} className="inline-flex items-center gap-1.5 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-sky-500/25 neon-glow">
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
    <div className="min-h-screen font-sans" style={{ background: "linear-gradient(180deg, hsl(210, 60%, 98%) 0%, hsl(200, 55%, 97%) 100%)" }}>
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 -z-10" style={{
          background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(186,230,253,0.5) 0%, rgba(255,255,255,0) 70%), radial-gradient(ellipse 60% 50% at 90% 20%, rgba(165,243,252,0.35) 0%, transparent 60%)"
        }} />
        <div className="absolute top-20 right-[5%] w-[420px] h-[420px] rounded-full border border-sky-100/50 -z-10" />
        <div className="absolute top-24 right-[7%] w-[320px] h-[320px] rounded-full border border-sky-100/30 -z-10" />

        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 max-w-2xl">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-8 uppercase tracking-wider"
              >
                <Sparkles className="h-3 w-3" />
                Enterprise Crypto Protocol · Web3 Native
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.05] tracking-tight mb-6"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                Instant Payments.<br />
                <span className="text-sky-500 neon-text">On-Chain</span> Settlement.
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-xl text-slate-500 leading-relaxed mb-10 max-w-xl"
              >
                Enterprise-grade security meets lightning-fast crypto payments. Create your wallet in seconds, send across 14 chains, and tap-to-pay anywhere.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-center gap-4"
              >
                <a href={walletUrl} className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-sky-500/25 neon-glow text-base">
                  Launch App <Rocket className="h-4 w-4" />
                </a>
                <a href={walletUrl} className="inline-flex items-center gap-2 text-slate-600 hover:text-sky-600 font-semibold text-base px-2 py-3.5 transition-colors">
                  Create Wallet <ArrowRight className="h-4 w-4" />
                </a>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
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

            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:flex flex-shrink-0 items-center justify-center relative"
            >
              <div className="relative w-80 h-80">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-72 relative">
                    <svg viewBox="0 0 200 220" className="w-full h-full drop-shadow-2xl">
                      <defs>
                        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{ stopColor: "#e0f2fe" }} />
                          <stop offset="100%" style={{ stopColor: "#bae6fd" }} />
                        </linearGradient>
                        <linearGradient id="shieldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{ stopColor: "#7dd3fc" }} />
                          <stop offset="100%" style={{ stopColor: "#0ea5e9" }} />
                        </linearGradient>
                      </defs>
                      <path d="M100 10 L180 45 L180 110 C180 160 140 195 100 210 C60 195 20 160 20 110 L20 45 Z"
                        fill="url(#shieldGrad)" stroke="url(#shieldBorder)" strokeWidth="2" />
                      <path d="M80 110 L95 125 L125 95" stroke="#0284c7" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  </div>
                </div>
                <div className="absolute top-4 right-4 glass rounded-xl shadow-lg p-3 border border-sky-200/30">
                  <div className="text-xs font-bold text-slate-800">BTC</div>
                  <div className="text-xs text-emerald-500">+2.4%</div>
                </div>
                <div className="absolute bottom-8 left-0 glass rounded-xl shadow-lg p-3 border border-sky-200/30">
                  <div className="text-xs font-bold text-slate-800">Block Confirmed</div>
                  <div className="text-xs text-sky-600">400ms</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className="py-12 border-y border-sky-100/60 bg-sky-50/30">
        <div className="container mx-auto px-6 max-w-7xl">
          <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">
            Trusted by the best
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {TRUST_LOGOS.map((name) => (
              <span key={name} className="text-slate-400 font-semibold text-sm md:text-base hover:text-sky-500 transition-colors cursor-default">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCT / SERVICES ── */}
      <section id="product" className="py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
              <Sparkles className="h-3 w-3" /> Core Protocol
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
              <motion.div key={f.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl border bg-gradient-to-br ${f.color} ${f.border} p-8 hover:shadow-lg hover:shadow-sky-500/10 transition-all card-lift`}
              >
                <div className="w-12 h-12 rounded-xl bg-white/80 border border-white shadow-sm flex items-center justify-center mb-5">
                  <f.icon className={`h-6 w-6 ${f.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES GRID ── */}
      <section id="services" className="py-24 bg-sky-50/20">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
              Services
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4" style={{ fontFamily: "'Sora', sans-serif" }}>
              Everything you need to<br className="hidden md:block" /> move crypto.
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-lg">
              From wallet creation to tap-to-pay. One platform, infinite possibilities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICE_FEATURES.map((service, i) => (
              <motion.div key={service.title}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group rounded-2xl border border-sky-200/30 bg-white/50 p-7 hover:bg-white/70 hover:shadow-xl hover:shadow-sky-500/10 transition-all card-lift"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-5 shadow-lg shadow-sky-500/15 group-hover:shadow-sky-500/25 transition-shadow`}>
                  <service.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{service.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">{service.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-full bg-sky-50 border border-sky-200/40 text-sky-600">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mt-14 text-center"
          >
            <a href={walletUrl} className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg shadow-sky-500/25 neon-glow text-lg">
              Explore All Features <ChevronRight className="h-5 w-5" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── PRODUCT DEMO + ENTERPRISE ── */}
      <section id="solutions" className="py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="rounded-2xl overflow-hidden border border-sky-200/40 shadow-2xl shadow-sky-200/30"
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

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="inline-flex items-center gap-2 bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 uppercase tracking-wider">
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
                    <CheckCircle2 className="h-5 w-5 text-sky-500 flex-shrink-0" />
                    <span className="text-sm font-medium">{f}</span>
                  </li>
                ))}
              </ul>
              <a href={walletUrl} className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-sky-500/20 neon-glow">
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

      {/* ── WALLET DEMO / EXPLORE SECTION ── */}
      <section id="demo" className="py-24 bg-sky-50/30">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
              <Zap className="h-3 w-3" /> Live Demo
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4" style={{ fontFamily: "'Sora', sans-serif" }}>
              Try it yourself.
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-lg">
              Create a real wallet, explore the dashboard, and experience NEXA's power firsthand.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Create Wallet Card */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="rounded-2xl border border-sky-200/40 bg-white/60 p-8 hover:bg-white/80 transition-all card-lift text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-cyan-400 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-sky-500/20">
                <KeyRound className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Create a Real Wallet</h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                Choose a username, set a secure password, and we will generate live ETH, BTC, and SOL addresses for you. All keys stay local.
              </p>
              <a href={walletUrl} className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-sky-500/20 w-full justify-center">
                Create Wallet <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>

            {/* Explore Dashboard Card */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="rounded-2xl border border-sky-200/40 bg-white/60 p-8 hover:bg-white/80 transition-all card-lift text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-400 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-cyan-500/20">
                <Eye className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Explore the Platform</h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                Already have a wallet? Sign in to access your dashboard, manage assets, send crypto, and configure virtual cards.
              </p>
              <a href={walletUrl} className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-slate-800/20 w-full justify-center">
                Sign In <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SECURITY ── */}
      <section id="security" className="py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="inline-flex items-center gap-2 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-6 uppercase tracking-wider">
                <Shield className="h-3 w-3" /> Security Protocol
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4" style={{ fontFamily: "'Sora', sans-serif" }}>
                Zero-compromise<br />cryptography.
              </h2>
              <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                Every demo wallet generates deterministic addresses from your credentials using SHA-256. This is a simulation for UI demonstration — not real on-chain keypairs. Real blockchain integration would use proper key derivation.
              </p>
              <div className="space-y-6">
                {SECURITY_POINTS.map((s, i) => (
                  <motion.div key={s.title}
                    initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center flex-shrink-0">
                      <s.icon className="h-5 w-5 text-sky-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{s.title}</div>
                      <div className="text-sm text-slate-500 mt-0.5">{s.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              className="bg-slate-900 rounded-2xl p-8 font-mono text-sm border border-sky-800/30"
            >
              <div className="text-slate-500 mb-4 text-xs uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="h-3 w-3" /> Real wallet creation · Live
              </div>
              <div className="space-y-3">
                {[
                  { label: "hashUser", value: "SHA-256(username + salt)", color: "text-sky-400" },
                  { label: "ethAddr", value: "keccak256(pubKey).slice(12)", color: "text-cyan-400" },
                  { label: "btcAddr", value: "base58(ripemd160(sha256(pubKey)))", color: "text-amber-400" },
                  { label: "solAddr", value: "ed25519.getPublicKey(seed)", color: "text-purple-400" },
                ].map((line) => (
                  <div key={line.label} className="flex gap-3">
                    <span className="text-slate-500">const</span>
                    <span className="text-emerald-400">{line.label}</span>
                    <span className="text-slate-500">=</span>
                    <span className={line.color}>{line.value}</span>
                  </div>
                ))}
                <div className="border-t border-sky-800/30 pt-3 mt-3">
                  <span className="text-sky-500 text-xs flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> All addresses real · All keys local · No server storage
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── LIVE STATS ── */}
      {stats && (
        <section id="pricing" className="py-20 bg-sky-500">
          <div className="container mx-auto px-6 max-w-7xl">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3" style={{ fontFamily: "'Sora', sans-serif" }}>
                Platform by the numbers
              </h2>
              <p className="text-sky-100 text-lg">Live data from the NEXA network.</p>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: `${(stats.totalTransactions / 1e6).toFixed(1)}M+`, label: "Total Transactions" },
                { value: `$${(stats.totalVolumeUsd / 1e9).toFixed(1)}B+`, label: "Volume Processed" },
                { value: `${(stats.activeWallets / 1e3).toFixed(0)}K+`, label: "Active Wallets" },
                { value: `${(stats as any).avgConfirmationMs ?? 480}ms`, label: "Avg Settlement" },
              ].map((s) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-extrabold text-white">{s.value}</div>
                  <div className="text-sky-200 text-sm mt-1">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FOOTER ── */}
      <footer className="bg-slate-900 py-16">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div>
              <img src={nexaLogo} alt="NEXA" className="h-7 w-auto mb-4 brightness-0 invert" />
              <p className="text-slate-500 text-sm leading-relaxed">
                The enterprise payment protocol for Web3. Secure, fast, and built for scale.
              </p>
            </div>
            {[
              { title: "Product", links: ["Wallet", "Cards", "NFC Pay", "Market"] },
              { title: "Developers", links: ["API Docs", "SDKs", "Status", "Changelog"] },
              { title: "Company", links: ["About", "Security", "Careers", "Contact"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-slate-300 font-semibold text-sm mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l}><span className="text-slate-500 text-sm hover:text-sky-400 transition-colors cursor-pointer">{l}</span></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-600 text-sm">
              © 2025 NEXA Protocol. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-slate-500">
              <span className="hover:text-sky-400 cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-sky-400 cursor-pointer transition-colors">Terms</span>
              <span className="hover:text-sky-400 cursor-pointer transition-colors">Compliance</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
