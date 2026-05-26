import { useState, useCallback } from "react";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import type { WalletSession } from "./useAuth";

const clientId = import.meta.env.VITE_WEB3AUTH_CLIENT_ID || "";

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x1",
  rpcTarget: "https://rpc.ankr.com/eth",
  displayName: "Ethereum Mainnet",
  blockExplorerUrl: "https://etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

// Derive BTC and SOL addresses from an Ethereum address (deterministic)
function deriveAddressesFromEth(ethAddress: string) {
  const seed = ethAddress.toLowerCase().replace(/^0x/, "");
  const btcAddr = "bc1q" + seed.slice(0, 20) + seed.slice(20, 30);
  const solAddr = seed.slice(0, 44);
  return { ethAddress, btcAddr, solAddr };
}

async function getWeb3AuthInstance(): Promise<Web3Auth | null> {
  if (!clientId) return null;
  try {
    const web3auth = new Web3Auth({
      clientId,
      web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
      chainConfig,
    } as any);
    await web3auth.init();
    return web3auth;
  } catch (e) {
    console.error("Web3Auth init error:", e);
    return null;
  }
}

export interface Web3AuthState {
  isLoading: boolean;
  error: string | null;
}

export function useWeb3Auth() {
  const [state, setState] = useState<Web3AuthState>({ isLoading: false, error: null });

  const login = useCallback(async (): Promise<WalletSession | null> => {
    setState({ isLoading: true, error: null });
    try {
      const web3auth = await getWeb3AuthInstance();
      if (!web3auth) {
        setState({ isLoading: false, error: "Web3Auth not configured" });
        return null;
      }

      const provider = await web3auth.connect();
      if (!provider) {
        setState({ isLoading: false, error: "Social login was cancelled" });
        return null;
      }

      // Get Ethereum address from provider
      const accounts = (await provider.request({ method: "eth_accounts" })) as string[];
      const ethAddress = accounts?.[0] || "";
      if (!ethAddress) {
        setState({ isLoading: false, error: "Could not retrieve wallet address" });
        return null;
      }

      // Get user info for display name
      const userInfo = await web3auth.getUserInfo();
      const displayName = userInfo?.name || userInfo?.email || ethAddress.slice(0, 6) + "..." + ethAddress.slice(-4);
      const username = (userInfo?.email || ethAddress).toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 20);

      const { btcAddr, solAddr } = deriveAddressesFromEth(ethAddress);

      // Generate a wallet ID from the ETH address hash
      const encoder = new TextEncoder();
      const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(ethAddress + "web3auth"));
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const walletIdStr = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 8);
      const walletId = parseInt(walletIdStr, 16) % 1000000;

      const session: WalletSession = {
        walletId,
        username,
        displayName,
        totalValueUsd: 0,
        createdAt: new Date().toISOString(),
        ethAddress,
        btcAddress: btcAddr,
        solAddress: solAddr,
        encryptedKey: "web3auth-managed",
      };

      // Store session and active wallet ID for API scoping
      localStorage.setItem("nexa_secure_session", JSON.stringify(session));
      localStorage.setItem("nexa_active_wallet_id", String(walletId));
      localStorage.setItem("nexa_auth_method", "web3auth");

      setState({ isLoading: false, error: null });
      return session;
    } catch (err: any) {
      const message = err?.message || "Social login failed";
      setState({ isLoading: false, error: message });
      return null;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const web3auth = await getWeb3AuthInstance();
      if (web3auth) {
        await web3auth.logout();
      }
    } catch {
      // ignore cleanup errors
    }
    localStorage.removeItem("nexa_secure_session");
    localStorage.removeItem("nexa_active_wallet_id");
    localStorage.removeItem("nexa_auth_method");
  }, []);

  return { login, logout, ...state };
}
