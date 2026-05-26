import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import Dashboard from "@/pages/dashboard";
import Wallet from "@/pages/wallet";
import Assets from "@/pages/assets";
import AssetDetail from "@/pages/asset-detail";
import Transactions from "@/pages/transactions";
import Cards from "@/pages/cards";
import NewCard from "@/pages/new-card";
import Nfc from "@/pages/nfc";
import Market from "@/pages/market";
import SendPage from "@/pages/send";
import Onboarding from "@/pages/onboarding";
import Login from "@/pages/login";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/hooks/useAuth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30000 },
  },
});

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [location] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(210, 60%, 98%) 0%, hsl(200, 50%, 96%) 100%)" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading NEXA...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && location !== "/onboarding" && location !== "/login") {
    const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
    window.location.replace(base + "/login");
    return null;
  }

  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/login" component={Login} />
      <Route>
        <AuthGuard>
          <Layout>
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/wallet" component={Wallet} />
              <Route path="/assets" component={Assets} />
              <Route path="/assets/:symbol" component={AssetDetail} />
              <Route path="/transactions" component={Transactions} />
              <Route path="/cards" component={Cards} />
              <Route path="/cards/new" component={NewCard} />
              <Route path="/nfc" component={Nfc} />
              <Route path="/market" component={Market} />
              <Route path="/send" component={SendPage} />
              <Route component={NotFound} />
            </Switch>
          </Layout>
        </AuthGuard>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
