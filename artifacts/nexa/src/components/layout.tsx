import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Wallet, 
  PieChart, 
  ArrowRightLeft, 
  CreditCard, 
  Wifi, 
  TrendingUp, 
  Send
} from "lucide-react";
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

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="flex h-screen bg-background overflow-hidden dark text-foreground">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-border">
          <img src={logoUrl} alt="NEXA" className="h-8 w-auto object-contain" />
        </div>
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                isActive 
                  ? "bg-primary/10 text-primary font-medium" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              }`}>
                <item.icon className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
        <div className="flex-1 overflow-y-auto p-8 relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
