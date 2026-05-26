import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, Wallet, PieChart, ArrowRightLeft,
  CreditCard, Wifi, TrendingUp, Send, LogOut, ChevronRight, Shield,
  Menu, X, User
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { MeshGradientBackground } from "@/components/AnimatedBackground";
import logoUrl from "@assets/3492540F-12E9-4FDB-83EF-D471EF90B334_1779651060145.png";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, short: "Home" },
  { href: "/wallet", label: "Wallet", icon: Wallet, short: "Wallet" },
  { href: "/assets", label: "Assets", icon: PieChart, short: "Assets" },
  { href: "/transactions", label: "History", icon: ArrowRightLeft, short: "History" },
  { href: "/cards", label: "Cards", icon: CreditCard, short: "Cards" },
  { href: "/nfc", label: "NFC Pay", icon: Wifi, short: "NFC" },
  { href: "/market", label: "Market", icon: TrendingUp, short: "Market" },
  { href: "/send", label: "Send", icon: Send, short: "Send" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { ownerName, logout, session } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
    window.location.href = base + "/login";
  };

  const isActive = (href: string) =>
    location === href || (href !== "/" && location.startsWith(href));

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "hsl(210, 60%, 98%)" }}>
      {/* Premium animated background */}
      <MeshGradientBackground />

      {/* Desktop / Tablet Sidebar */}
      <aside className="hidden md:flex relative z-10 w-64 border-r border-sky-200/30 glass-strong flex-col shadow-sm flex-shrink-0">
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-sky-200/30">
          <img src={logoUrl} alt="NEXA" className="h-7 w-auto object-contain" />
          <span className="ml-2 text-xs font-semibold text-slate-500 tracking-widest uppercase">Wallet</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm group ${
                  active
                    ? "bg-sky-500/10 text-sky-600 font-semibold"
                    : "text-slate-500 hover:bg-sky-50 hover:text-slate-800"
                }`}
              >
                <item.icon
                  className={`h-4 w-4 flex-shrink-0 ${active ? "text-sky-500" : "text-slate-400 group-hover:text-slate-600"}`}
                />
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight className="h-3.5 w-3.5 text-sky-400" />}
              </Link>
            );
          })}
        </nav>

        {/* Security badge */}
        <div className="px-4 py-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-sky-50/50 border border-sky-200/30">
            <Shield className="h-3.5 w-3.5 text-sky-500" />
            <span className="text-xs text-sky-700 font-medium">SHA-256 + localStorage</span>
          </div>
        </div>

        {/* User footer */}
        <div className="p-3 border-t border-sky-200/30">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center flex-shrink-0 neon-glow">
              <span className="text-white text-xs font-bold">{getInitials(ownerName)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-800 truncate">{ownerName}</div>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-xs text-slate-400">{session?.username ?? "user"}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
            {localStorage.getItem("nexa_auth_method") === "web3auth" && (
              <span className="text-[10px] text-indigo-400 bg-indigo-50 px-1.5 py-0.5 rounded font-medium">Web3Auth</span>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 h-14 glass-strong border-b border-sky-200/30 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <img src={logoUrl} alt="NEXA" className="h-6 w-auto object-contain" />
          <span className="text-xs font-semibold text-slate-500 tracking-widest uppercase">Wallet</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-slate-600 hover:bg-sky-50"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/30" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="absolute top-14 left-0 right-0 glass-strong border-b border-sky-200/30 max-h-[70vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="p-3 space-y-1">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all text-sm ${
                      active
                        ? "bg-sky-500/10 text-sky-600 font-semibold"
                        : "text-slate-500 hover:bg-sky-50 hover:text-slate-800"
                    }`}
                  >
                    <item.icon className={`h-5 w-5 flex-shrink-0 ${active ? "text-sky-500" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <div className="border-t border-sky-200/30 mt-2 pt-2">
                <button
                  onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-red-500 hover:bg-red-50 w-full text-sm"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col overflow-hidden">
        {/* Mobile top padding to clear header */}
        <div className="h-14 md:hidden flex-shrink-0" />
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 glass-strong border-t border-sky-200/30 flex justify-around items-center h-16">
        {NAV_ITEMS.slice(0, 5).map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 w-full h-full transition-colors ${
                active ? "text-sky-600" : "text-slate-400"
              }`}
            >
              <item.icon className={`h-5 w-5 ${active ? "text-sky-500" : ""}`} />
              <span className="text-[10px] font-medium">{item.short}</span>
            </Link>
          );
        })}
        <Link
          href="/send"
          className={`flex flex-col items-center justify-center gap-0.5 w-full h-full transition-colors ${
            isActive("/send") ? "text-sky-600" : "text-slate-400"
          }`}
        >
          <Send className={`h-5 w-5 ${isActive("/send") ? "text-sky-500" : ""}`} />
          <span className="text-[10px] font-medium">Send</span>
        </Link>
      </nav>
    </div>
  );
}
