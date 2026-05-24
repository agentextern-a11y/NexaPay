import { Switch, Route, Router as WouterRouter } from "wouter";
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
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30000 },
  },
});

function Router() {
  return (
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
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

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
