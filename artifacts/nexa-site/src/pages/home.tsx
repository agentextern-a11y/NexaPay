import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { ArrowRight, CreditCard, Shield, Zap, Globe, Smartphone, RefreshCw, Activity, ArrowUpRight, BarChart } from "lucide-react";
import nexaLogo from "@assets/3492540F-12E9-4FDB-83EF-D471EF90B334_1779651060145.png";
import { Link } from "wouter";

// These would normally be imported from @workspace/api-client-react
// But to ensure we don't hit import errors if not exported perfectly, we try-catch or use directly if we know.
// The prompt said: "Import from `@workspace/api-client-react`. Use these hooks: useGetPlatformStats, useGetMarketPrices"
import { useGetPlatformStats, useGetMarketPrices } from "@workspace/api-client-react";

import appInterfaceImg from "@/assets/images/app-interface.png";
import nfcPaymentImg from "@/assets/images/nfc-payment.png";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div className="relative min-h-screen bg-background w-full">
      <Navbar />
      
      <main>
        {/* HERO SECTION */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-accent/50 via-background to-background -z-10" />
          <motion.div style={{ y }} className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
          
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="max-w-4xl">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-8"
              >
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
                The Future of Crypto Payments
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.1] mb-6"
              >
                Hold the future <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">in your hands.</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed"
              >
                NEXA is the world's most advanced crypto payment protocol. 
                Beautiful digital wallets, virtual crypto cards, and real NFC tap-to-pay. 
                Powered by an enterprise-grade backend.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-center gap-4"
              >
                <Button size="lg" className="h-14 px-8 text-base bg-primary text-white hover:bg-primary/90 rounded-full shadow-lg shadow-primary/20" asChild>
                  <a href="/">Launch App <ArrowRight className="ml-2 h-5 w-5" /></a>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-full bg-white border-border hover:bg-secondary">
                  Watch Demo
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* LIVE STATS BAR */}
        <StatsBar />

        {/* FEATURES SECTION */}
        <section className="py-24 md:py-32 bg-white relative">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">Everything you need.<br/>Nothing you don't.</h2>
              <p className="text-muted-foreground text-lg">Six core capabilities designed to bridge the gap between digital assets and the real world.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Smartphone className="h-8 w-8 text-primary" />}
                title="Multi-Asset Wallet"
                desc="Store and manage Bitcoin, Ethereum, Solana, and stablecoins in one beautiful interface."
                delay={0.1}
              />
              <FeatureCard 
                icon={<Zap className="h-8 w-8 text-primary" />}
                title="NFC Tap-to-Pay"
                desc="Pay at millions of merchants worldwide instantly using your phone's NFC."
                delay={0.2}
              />
              <FeatureCard 
                icon={<CreditCard className="h-8 w-8 text-primary" />}
                title="Virtual Crypto Cards"
                desc="Generate instant virtual cards tied to your crypto balances for online shopping."
                delay={0.3}
              />
              <FeatureCard 
                icon={<Activity className="h-8 w-8 text-primary" />}
                title="Live Market Data"
                desc="Real-time price feeds, volume, and market cap data built directly into your wallet."
                delay={0.4}
              />
              <FeatureCard 
                icon={<RefreshCw className="h-8 w-8 text-primary" />}
                title="Instant Transfers"
                desc="Cross-chain transfers settled in milliseconds, not minutes. Free and global."
                delay={0.5}
              />
              <FeatureCard 
                icon={<Shield className="h-8 w-8 text-primary" />}
                title="Enterprise Security"
                desc="libsodium ed25519 signatures, idempotent transactions, and anti-replay protection."
                delay={0.6}
              />
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-24 bg-card border-y border-border overflow-hidden">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1 relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-[2rem] transform rotate-3" />
                <img 
                  src="https://images.unsplash.com/photo-1616077168079-7e09a6a71550?q=80&w=2000&auto=format&fit=crop" 
                  alt="NEXA App Interface" 
                  className="rounded-[2rem] shadow-2xl relative z-10 border border-white/50 object-cover h-[600px] w-full"
                />
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl md:text-5xl font-bold mb-12 text-foreground">Three steps to the future.</h2>
                <div className="space-y-12">
                  <Step number="01" title="Connect & Fund" desc="Deposit your crypto or buy directly with Apple Pay. We support 50+ assets across 8 chains." />
                  <Step number="02" title="Hold & Track" desc="Watch your portfolio grow with real-time market data and beautiful interactive charts." />
                  <Step number="03" title="Tap & Spend" desc="Hold your phone to any payment terminal. We handle the conversion to fiat instantly." />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LIVE MARKET TICKER */}
        <MarketTickerSection />

        {/* ARCHITECTURE SECTION */}
        <section className="py-24 md:py-32 bg-white">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="bg-foreground text-background rounded-3xl p-10 md:p-16 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(0,180,216,0.15),transparent_50%)]" />
              
              <div className="grid lg:grid-cols-2 gap-12 relative z-10">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">Engineered for absolute trust.</h2>
                  <p className="text-background/80 text-lg mb-8 leading-relaxed">
                    Underneath the beautiful interface lies a battle-tested financial engine. 
                    NEXA is built on 14 production microservices communicating via Kafka event bus.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-center text-background/90"><Shield className="h-5 w-5 text-primary mr-3" /> libsodium ed25519 signatures</li>
                    <li className="flex items-center text-background/90"><Shield className="h-5 w-5 text-primary mr-3" /> Double-entry ledger architecture</li>
                    <li className="flex items-center text-background/90"><Shield className="h-5 w-5 text-primary mr-3" /> Anti-replay & idempotent transactions</li>
                    <li className="flex items-center text-background/90"><Shield className="h-5 w-5 text-primary mr-3" /> Real-time blockchain anchoring</li>
                  </ul>
                </div>
                <div className="flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                    {['wallet-service', 'ledger-service', 'crypto-engine', 'nfc-service'].map((svc) => (
                      <div key={svc} className="bg-background/10 border border-background/20 rounded-xl p-4 text-center">
                        <div className="text-primary font-mono text-xs mb-1">active</div>
                        <div className="text-sm font-medium">{svc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NFC SPOTLIGHT */}
        <section className="py-24 md:py-32 bg-accent/30 text-center">
          <div className="container mx-auto px-6 max-w-4xl">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-8"
            >
              <Zap className="h-10 w-10" />
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 text-foreground">Pay with crypto.<br/>As easily as Apple Pay.</h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              No QR codes. No waiting for confirmations. No merchant integration required. 
              If they accept contactless payments, they accept your crypto.
            </p>
            <img 
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2000&auto=format&fit=crop" 
              alt="NFC Payment" 
              className="w-full max-w-3xl mx-auto rounded-3xl shadow-2xl border border-white"
            />
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-24 md:py-32 bg-white">
          <div className="container mx-auto px-6 max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center text-foreground">Trusted by those who know.</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Testimonial 
                quote="I've used every crypto wallet out there. NEXA is the only one that feels like a real financial institution. The NFC feature is basically magic."
                name="Sarah Jenkins"
                title="Proprietary Trader"
              />
              <Testimonial 
                quote="I travel 8 months out of the year. Being able to tap my phone to pay for a coffee in Tokyo using my USDC balance changed everything for me."
                name="David Chen"
                title="Digital Nomad"
              />
              <Testimonial 
                quote="The virtual cards take 2 seconds to generate. I use them for all my online subscriptions now, funded directly from my Ethereum holdings."
                name="Marcus Thorne"
                title="E-commerce Founder"
              />
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-24 bg-card border-t border-border">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-foreground">Ready to upgrade your money?</h2>
            <p className="text-xl text-muted-foreground mb-10">Join thousands of users experiencing the future of finance today.</p>
            <Button size="lg" className="h-16 px-10 text-lg bg-primary text-white hover:bg-primary/90 rounded-full shadow-xl shadow-primary/20" asChild>
              <a href="/">Create Your Wallet</a>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border transition-all duration-300">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between max-w-7xl">
        <Link href="/" className="flex items-center gap-2">
          <img src={nexaLogo} alt="NEXA" className="h-8 w-8" />
          <span className="font-display font-bold text-xl tracking-tight text-foreground">NEXA</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Features</a>
          <a href="#" className="hover:text-foreground transition-colors">Protocol</a>
          <a href="#" className="hover:text-foreground transition-colors">Security</a>
          <a href="#" className="hover:text-foreground transition-colors">Company</a>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hidden sm:inline-flex rounded-full">Sign In</Button>
          <Button className="rounded-full bg-primary text-white hover:bg-primary/90" asChild>
            <a href="/">Open Wallet</a>
          </Button>
        </div>
      </div>
    </header>
  );
}

function StatsBar() {
  const { data: stats, isLoading, isError } = useGetPlatformStats();

  if (isError) return null;

  return (
    <div className="border-y border-border bg-card">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
          <StatItem 
            label="Total Volume" 
            value={stats ? `$${(stats.totalVolumeUsd / 1000000).toFixed(1)}M+` : null} 
            isLoading={isLoading} 
          />
          <StatItem 
            label="Active Wallets" 
            value={stats ? stats.activeWallets.toLocaleString() : null} 
            isLoading={isLoading} 
          />
          <StatItem 
            label="NFC Payments" 
            value={stats ? stats.nfcPayments.toLocaleString() : null} 
            isLoading={isLoading} 
          />
          <StatItem 
            label="Uptime" 
            value={stats ? `${stats.uptimePct}%` : null} 
            isLoading={isLoading} 
          />
        </div>
      </div>
    </div>
  );
}

function StatItem({ label, value, isLoading }: { label: string, value: string | null, isLoading: boolean }) {
  return (
    <div className="py-8 px-4 text-center">
      <div className="text-sm font-medium text-muted-foreground mb-2">{label}</div>
      {isLoading || !value ? (
        <Skeleton className="h-8 w-24 mx-auto" />
      ) : (
        <div className="text-2xl md:text-3xl font-bold text-foreground">{value}</div>
      )}
    </div>
  );
}

function FeatureCard({ icon, title, desc, delay }: { icon: React.ReactNode, title: string, desc: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="p-8 rounded-3xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
    >
      <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white shadow-sm border border-border">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function Step({ number, title, desc }: { number: string, title: string, desc: string }) {
  return (
    <div className="flex gap-6">
      <div className="text-4xl font-display font-bold text-primary/20">{number}</div>
      <div>
        <h3 className="text-2xl font-bold mb-2 text-foreground">{title}</h3>
        <p className="text-muted-foreground text-lg leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function MarketTickerSection() {
  const { data: prices, isLoading } = useGetMarketPrices();

  return (
    <section className="py-20 bg-background border-b border-border overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl mb-10 text-center">
        <h2 className="text-3xl font-bold text-foreground">Live Market Data</h2>
        <p className="text-muted-foreground mt-2">Real-time prices powered by our crypto-engine.</p>
      </div>
      
      <div className="relative flex overflow-x-hidden group">
        <div className="flex animate-marquee whitespace-nowrap gap-6 px-4">
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <Card key={i} className="w-64 p-4 shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div>
                    <Skeleton className="w-12 h-4 mb-2" />
                    <Skeleton className="w-20 h-5" />
                  </div>
                </div>
              </Card>
            ))
          ) : (
            [...(prices || []), ...(prices || [])].map((coin, i) => (
              <Card key={`${coin.symbol}-${i}`} className="w-64 p-4 shrink-0 bg-card hover:bg-white transition-colors cursor-default">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: coin.logoColor || '#ccc' }}>
                      {coin.symbol[0]}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">{coin.name}</div>
                      <div className="font-bold text-foreground">${coin.priceUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</div>
                    </div>
                  </div>
                  <div className={`text-xs font-medium px-2 py-1 rounded-md ${coin.changePct24h >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {coin.changePct24h >= 0 ? '+' : ''}{coin.changePct24h.toFixed(2)}%
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
      
      {/* Marquee CSS is added globally or inline */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .group:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}} />
    </section>
  );
}

function Testimonial({ quote, name, title }: { quote: string, name: string, title: string }) {
  return (
    <Card className="p-8 bg-card border-border relative">
      <div className="text-primary text-6xl absolute top-4 left-6 opacity-10 font-serif">"</div>
      <p className="text-foreground relative z-10 mb-8 italic">"{quote}"</p>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
          {name[0]}
        </div>
        <div>
          <div className="font-bold text-sm text-foreground">{name}</div>
          <div className="text-xs text-muted-foreground">{title}</div>
        </div>
      </div>
    </Card>
  );
}

function Footer() {
  return (
    <footer className="bg-background py-12 border-t border-border">
      <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <img src={nexaLogo} alt="NEXA" className="h-6 w-6 grayscale" />
          <span className="font-display font-bold text-lg text-muted-foreground">NEXA</span>
        </div>
        <div className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} NEXA Protocol. All rights reserved.
        </div>
        <div className="flex gap-6 text-sm font-medium text-muted-foreground">
          <a href="#" className="hover:text-foreground">Terms</a>
          <a href="#" className="hover:text-foreground">Privacy</a>
          <a href="#" className="hover:text-foreground">Status</a>
        </div>
      </div>
    </footer>
  );
}
