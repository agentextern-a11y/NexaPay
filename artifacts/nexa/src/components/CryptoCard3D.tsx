import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, Lock, Eye, EyeOff, CreditCard, QrCode, Copy, CheckCircle2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CryptoCard3DProps {
  card: {
    id: number;
    cardNumber: string;
    cardholderName: string;
    expiryMonth: number;
    expiryYear: number;
    cvv: string;
    asset: string;
    status: string;
    cardType: string;
    nfcEnabled: boolean;
    spendingLimit: number;
    spentAmount: number;
    applePassUrl?: string;
    googlePassUrl?: string;
    passToken?: string;
  };
  onFreeze: () => void;
  onCancel: () => void;
  freezeLoading?: boolean;
}

function ChipIcon() {
  return (
    <svg width="40" height="30" viewBox="0 0 40 30" fill="none" className="opacity-80">
      <rect x="2" y="2" width="36" height="26" rx="4" stroke="url(#chipGrad)" strokeWidth="1.5" fill="none" />
      <line x1="20" y1="2" x2="20" y2="28" stroke="url(#chipGrad)" strokeWidth="1" />
      <line x1="2" y1="15" x2="38" y2="15" stroke="url(#chipGrad)" strokeWidth="1" />
      <rect x="12" y="8" width="16" height="14" rx="2" stroke="url(#chipGrad)" strokeWidth="1" fill="none" />
      <defs>
        <linearGradient id="chipGrad" x1="0" y1="0" x2="40" y2="30">
          <stop offset="0%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#f0e68c" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function WifiWave() {
  return (
    <svg width="28" height="20" viewBox="0 0 28 20" fill="none" className="opacity-70">
      <path d="M2 12c4-4 16-4 20 0" stroke="url(#wifiGrad)" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 8c3-3 11-3 14 0" stroke="url(#wifiGrad)" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 4c2-2 6-2 8 0" stroke="url(#wifiGrad)" strokeWidth="2" strokeLinecap="round" />
      <defs>
        <linearGradient id="wifiGrad" x1="0" y1="0" x2="28" y2="20">
          <stop offset="0%" stopColor="#a0aec0" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function CryptoCard3D({ card, onFreeze, onCancel, freezeLoading }: CryptoCard3DProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showCvv, setShowCvv] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [shine, setShine] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isFlipped) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const tiltX = (y - 0.5) * 20;
    const tiltY = (x - 0.5) * -20;
    setTilt({ x: tiltX, y: tiltY });
    setShine({ x: x * 100, y: y * 100 });
  }, [isFlipped]);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setShine({ x: 50, y: 50 });
    setIsHovered(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleClick = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const maskedNumber = card.cardNumber.slice(0, 4) + " \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 " + card.cardNumber.slice(-4);
  const fullNumber = card.cardNumber.replace(/(.{4})/g, "$1 ").trim();
  const expiry = String(card.expiryMonth).padStart(2, "0") + "/" + String(card.expiryYear).slice(-2);
  const spentPct = Math.min((card.spentAmount / card.spendingLimit) * 100, 100);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const cardFace = (
    <div
      className="absolute inset-0 rounded-2xl overflow-hidden"
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Deep base gradient */}
      <div className="absolute inset-0" style={{
        background: `linear-gradient(160deg, #0f172a 0%, #1e293b 40%, #0f172a 100%)`,
      }} />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
        backgroundSize: "24px 24px",
      }} />

      {/* Holographic conic shimmer */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: `conic-gradient(from ${shine.x * 3.6}deg at ${shine.x}% ${shine.y}%, transparent 0deg, rgba(0,212,255,0.15) 30deg, rgba(138,43,226,0.1) 60deg, rgba(255,215,0,0.12) 90deg, rgba(0,255,136,0.08) 120deg, transparent 150deg)`,
          mixBlendMode: "screen",
          transition: "background 0.1s ease-out",
        }}
      />

      {/* UV phosphor glow layer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(0,212,255,0.12) 0%, transparent 50%)`,
          transition: "background 0.15s ease-out",
        }}
      />

      {/* Edge metallic rim light */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          boxShadow: isHovered
            ? `inset 0 0 60px -20px rgba(0,212,255,0.15), inset 0 0 20px -5px rgba(255,255,255,0.05)`
            : "inset 0 0 40px -20px rgba(0,0,0,0.3)",
          transition: "box-shadow 0.3s ease",
        }}
      />

      {/* Top-left branding */}
      <div className="absolute top-5 left-6">
        <div className="text-[10px] text-slate-400 uppercase tracking-[0.3em] font-semibold">NEXA</div>
        <div className="text-[9px] text-slate-500 uppercase tracking-wider mt-0.5">{card.asset} Crypto Card</div>
      </div>

      {/* Top-right indicators */}
      <div className="absolute top-5 right-5 flex items-center gap-2">
        {card.nfcEnabled && (
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
            <WifiWave />
          </div>
        )}
        <Badge variant="outline" className="text-[9px] border-slate-600 text-slate-400 uppercase tracking-wider">
          {card.cardType}
        </Badge>
      </div>

      {/* Chip */}
      <div className="absolute top-[52px] left-6">
        <ChipIcon />
      </div>

      {/* Card number */}
      <div className="absolute bottom-[72px] left-6 right-6">
        <code className="text-lg font-mono text-slate-200 tracking-[0.15em]" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>
          {maskedNumber}
        </code>
      </div>

      {/* Bottom row */}
      <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between">
        <div>
          <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-0.5">Cardholder</div>
          <div className="text-xs font-semibold text-slate-300 tracking-wider uppercase" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>
            {card.cardholderName}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-0.5">Expires</div>
          <div className="text-xs font-mono text-slate-300" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>
            {expiry}
          </div>
        </div>
      </div>

      {/* Corner decorative arcs */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.06]" style={{
        background: "radial-gradient(circle at top right, rgba(0,212,255,0.5) 0%, transparent 70%)",
      }} />
      <div className="absolute bottom-0 left-0 w-24 h-24 opacity-[0.04]" style={{
        background: "radial-gradient(circle at bottom left, rgba(138,43,226,0.5) 0%, transparent 70%)",
      }} />
    </div>
  );

  const cardBack = (
    <div
      className="absolute inset-0 rounded-2xl overflow-hidden"
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transformStyle: "preserve-3d",
        transform: "rotateY(180deg)",
      }}
    >
      {/* Dark base */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)" }} />

      {/* Subtle noise texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />

      {/* Top stripe */}
      <div className="absolute top-8 left-0 right-0 h-10 bg-slate-950/80" />

      {/* CVV area */}
      <div className="absolute top-20 left-6 right-6">
        <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-1">Security Code (CVV)</div>
        <div className="flex items-center gap-2">
          <div className="bg-white/90 rounded px-3 py-1.5">
            <span className="text-sm font-mono font-bold text-slate-800 tracking-wider">
              {showCvv ? card.cvv : "\u2022\u2022\u2022"}
            </span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setShowCvv(!showCvv); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-colors"
          >
            {showCvv ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Full card number */}
      <div className="absolute top-36 left-6 right-6">
        <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-1">Card Number</div>
        <div className="flex items-center gap-2">
          <code className="text-sm font-mono text-slate-300 tracking-wider">{fullNumber}</code>
          <button
            onClick={(e) => { e.stopPropagation(); handleCopy(card.cardNumber.replace(/\s/g, "")); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
          >
            {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* QR Code placeholder */}
      <div className="absolute top-52 left-6">
        <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-1">Scan to Pay</div>
        <div className="w-16 h-16 rounded-lg bg-white p-1 flex items-center justify-center">
          <QrCode className="h-12 w-12 text-slate-900" />
        </div>
      </div>

      {/* Spending bar */}
      <div className="absolute top-52 right-6 left-28">
        <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-1">Monthly Spending</div>
        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
          <span>${card.spentAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          <span>${card.spendingLimit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
        <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${spentPct}%`,
              background: spentPct > 80 ? "linear-gradient(90deg, #ef4444, #f87171)" : "linear-gradient(90deg, #0ea5e9, #22d3ee)",
            }}
          />
        </div>
      </div>

      {/* Wallet pass buttons */}
      <div className="absolute bottom-5 left-6 right-6 space-y-2">
        <div className="flex gap-2">
          {card.applePassUrl && (
            <a
              href={card.applePassUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600/50 text-xs text-white transition-all"
            >
              <Wallet className="h-3.5 w-3.5" /> Apple Wallet
            </a>
          )}
          {card.googlePassUrl && (
            <a
              href={card.googlePassUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600/50 text-xs text-white transition-all"
            >
              <CreditCard className="h-3.5 w-3.5" /> Google Wallet
            </a>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => { e.stopPropagation(); onFreeze(); }}
            disabled={freezeLoading}
            className="flex-1 text-[10px] border-slate-600 text-slate-400 hover:text-yellow-400 hover:border-yellow-500/30"
          >
            <Lock className="h-3 w-3 mr-1" />
            {card.status === "frozen" ? "Unfreeze" : "Freeze"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => { e.stopPropagation(); onCancel(); }}
            className="flex-1 text-[10px] border-slate-600 text-slate-400 hover:text-red-400 hover:border-red-500/30"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="relative w-full"
      style={{ perspective: "1200px" }}
    >
      <div
        ref={cardRef}
        className="relative w-full aspect-[1.586/1] rounded-2xl cursor-pointer select-none"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y + (isFlipped ? 180 : 0)}deg)`,
          transition: isHovered ? "transform 0.1s ease-out" : "transform 0.5s ease-out",
          boxShadow: isHovered
            ? `0 25px 50px -12px rgba(0,0,0,0.5), 0 0 40px -10px rgba(0,212,255,0.15), 0 0 80px -20px rgba(138,43,226,0.08)`
            : `0 10px 30px -10px rgba(0,0,0,0.4), 0 0 20px -5px rgba(0,212,255,0.08)`,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        onClick={handleClick}
      >
        <AnimatePresence initial={false}>
          {!isFlipped ? cardFace : null}
        </AnimatePresence>
        <AnimatePresence initial={false}>
          {isFlipped ? cardBack : null}
        </AnimatePresence>
      </div>

      {/* Flip hint */}
      <motion.p
        className="text-center text-[10px] text-slate-400 mt-2 tracking-wider uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {isFlipped ? "Click to flip back" : "Click to flip \u00b7 Hover to tilt"}
      </motion.p>
    </div>
  );
}
