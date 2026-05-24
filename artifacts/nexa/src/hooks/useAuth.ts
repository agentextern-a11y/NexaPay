import { useState, useEffect, useCallback } from "react";

export interface WalletSession {
  walletId: number;
  ownerName: string;
  totalValueUsd: number;
  createdAt: string;
}

const SESSION_KEY = "nexa_session";

export function useAuth() {
  const [session, setSession] = useState<WalletSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) setSession(JSON.parse(stored));
    } catch {}
    setIsLoading(false);
  }, []);

  const login = useCallback((s: WalletSession) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    setSession(s);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
  }, []);

  return {
    session,
    isLoading,
    login,
    logout,
    isAuthenticated: !!session,
    ownerName: session?.ownerName ?? "User",
  };
}
