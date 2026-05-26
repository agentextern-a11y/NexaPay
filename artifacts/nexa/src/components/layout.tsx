import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, Wallet, PieChart, ArrowRightLeft,
  CreditCard, Wifi, TrendingUp, Send, LogOut, ChevronRight, Shield,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import logoUrl from "@assets/3492540F-12E9-4FDB-83EF-D471EF90B334_1779651060145.png";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/wallet", label: "Wallet", icon: Wallet },
  { href: "/assets", label: "Assets", icon: PieChart },
  { href: "/transactions", label: "Transactions", icon: ArrowRightLeft },
  { href: "/cards", label: "Cards", icon: CreditCard },
  { href: "/nfc", label: "NFC Pay", icon: Wifi },
  { href: "/market", label: "Market", icon: TrendingUp },
  { href: "/send", label: "Send", icon: Send },
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

  const handleLogout = () => {
    logout();
    const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
    window.location.href = base + "/login";
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "hsl(210, 60%, 98%)" }}>
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-120px] right-[-120px] w-[500px] h-[500px] rounded-full bg-sky-300/6 blur-3xl bg-orb-1" />
        <div className="absolute bottom-[-100px] left-[200px] w-[400px] h-[400px] rounded-full bg-cyan-300/5 blur-3xl bg-orb-2" />
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-sky-400/4 blur-3xl bg-orb-3" />
        <div
          className="absolute inset-0 bg-grid-pulse"
          style={{
            backgroundImage:
              "linear-gradient(hsl(200, 40%, 92%) 1px, transparent 1px), linear-gradient(90deg, hsl(200, 40%, 92%) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Sidebar */}
      <aside className="relative z-10 w-64 border-r border-sky-200/30 glass-strong flex flex-col shadow-sm">
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-sky-200/30">
          <img src={logoUrl} alt="NEXA" className="h-7 w-auto object-contain" />
          <span className="ml-2 text-xs font-semibold text-slate-500 tracking-widest uppercase">Wallet</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive =
              location === item.href ||
              (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm group ${
                  isActive
                    ? "bg-sky-500/10 text-sky-600 font-semibold"
                    : "text-slate-500 hover:bg-sky-50 hover:text-slate-800"
                }`}
              >
                <item.icon
                  className={`h-4 w-4 flex-shrink-0 ${isActive ? "text-sky-500" : "text-slate-400 group-hover:text-slate-600"}`}
                />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight className="h-3.5 w-3.5 text-sky-400" />}
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

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
