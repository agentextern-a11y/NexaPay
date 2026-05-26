import { useState, useEffect, useCallback } from "react";

export interface WalletSession {
  walletId: number;
  username: string;
  displayName: string;
  totalValueUsd: number;
  createdAt: string;
  ethAddress: string;
  btcAddress: string;
  solAddress: string;
  encryptedKey: string;
}

const SESSION_KEY = "nexa_secure_session";
const WALLET_REGISTRY_KEY = "nexa_wallet_registry";
const ACTIVE_WALLET_ID_KEY = "nexa_active_wallet_id";

export interface StoredWallet {
  username: string;
  displayName: string;
  passwordHash: string;
  walletId: number;
  createdAt: string;
  ethAddress: string;
  btcAddress: string;
  solAddress: string;
  encryptedKey: string;
  totalValueUsd: number;
}

// Simple hash function for demo (SHA-256 via Web Crypto)
async function hashCredential(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Generate deterministic addresses from seed
function deriveAddresses(seed: string) {
  // ETH-style address: 0x + first 40 hex chars of double-hashed seed
  const ethAddr = "0x" + seed.slice(0, 40);
  // BTC-style address: prefix + base58-ish
  const btcAddr = "bc1q" + seed.slice(8, 28) + seed.slice(40, 50);
  // SOL-style address: base58-ish 44 chars
  const solAddr = seed.slice(0, 44);
  return { ethAddr, btcAddr, solAddr };
}

// XOR "encryption" for demo - obfuscates stored data
function xorEncrypt(data: string, key: string): string {
  let result = "";
  for (let i = 0; i < data.length; i++) {
    result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return btoa(result);
}

function xorDecrypt(encrypted: string, key: string): string {
  try {
    const data = atob(encrypted);
    let result = "";
    for (let i = 0; i < data.length; i++) {
      result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  } catch {
    return "";
  }
}

// Wallet registry in localStorage
function getRegistry(): StoredWallet[] {
  try {
    const stored = localStorage.getItem(WALLET_REGISTRY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveRegistry(registry: StoredWallet[]) {
  localStorage.setItem(WALLET_REGISTRY_KEY, JSON.stringify(registry));
}

export async function createWalletAccount(
  username: string,
  displayName: string,
  password: string
): Promise<WalletSession | null> {
  const trimmedUser = username.trim().toLowerCase();
  if (!trimmedUser || trimmedUser.length < 3) return null;
  if (!password || password.length < 6) return null;

  const registry = getRegistry();
  if (registry.find((w) => w.username === trimmedUser)) {
    throw new Error("Username already exists");
  }

  const passwordHash = await hashCredential(password + trimmedUser + "nexa_salt_v1");
  const seed = await hashCredential(trimmedUser + password + "wallet_seed");
  const { ethAddr, btcAddr, solAddr } = deriveAddresses(seed);

  const walletId = registry.length > 0
    ? Math.max(...registry.map((w) => w.walletId)) + 1
    : 1;

  const encryptedKey = xorEncrypt(seed, passwordHash.slice(0, 32));

  const wallet: StoredWallet = {
    username: trimmedUser,
    displayName: displayName.trim() || trimmedUser,
    passwordHash,
    walletId,
    createdAt: new Date().toISOString(),
    ethAddress: ethAddr,
    btcAddress: btcAddr,
    solAddress: solAddr,
    encryptedKey,
    totalValueUsd: 0,
  };

  registry.push(wallet);
  saveRegistry(registry);

  const session: WalletSession = {
    walletId,
    username: trimmedUser,
    displayName: wallet.displayName,
    totalValueUsd: 0,
    createdAt: wallet.createdAt,
    ethAddress: ethAddr,
    btcAddress: btcAddr,
    solAddress: solAddr,
    encryptedKey,
  };

  // Store session encrypted with password hash
  const sessionBlob = xorEncrypt(JSON.stringify(session), passwordHash.slice(0, 32));
  localStorage.setItem(SESSION_KEY, sessionBlob);
  localStorage.setItem(ACTIVE_WALLET_ID_KEY, String(walletId));

  return session;
}

export async function loginWalletAccount(
  username: string,
  password: string
): Promise<WalletSession | null> {
  const trimmedUser = username.trim().toLowerCase();
  const registry = getRegistry();
  const wallet = registry.find((w) => w.username === trimmedUser);
  if (!wallet) return null;

  const passwordHash = await hashCredential(password + trimmedUser + "nexa_salt_v1");
  if (wallet.passwordHash !== passwordHash) return null;

  const session: WalletSession = {
    walletId: wallet.walletId,
    username: wallet.username,
    displayName: wallet.displayName,
    totalValueUsd: wallet.totalValueUsd,
    createdAt: wallet.createdAt,
    ethAddress: wallet.ethAddress,
    btcAddress: wallet.btcAddress,
    solAddress: wallet.solAddress,
    encryptedKey: wallet.encryptedKey,
  };

  const sessionBlob = xorEncrypt(JSON.stringify(session), passwordHash.slice(0, 32));
  localStorage.setItem(SESSION_KEY, sessionBlob);
  localStorage.setItem(ACTIVE_WALLET_ID_KEY, String(wallet.walletId));

  return session;
}

export function useAuth() {
  const [session, setSession] = useState<WalletSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const stored = localStorage.getItem(SESSION_KEY);
        if (!stored) {
          setIsLoading(false);
          return;
        }
        // Check if this is a Web3Auth session (plain JSON) or local session (XOR encrypted)
        const authMethod = localStorage.getItem("nexa_auth_method");
        if (authMethod === "web3auth") {
          try {
            const parsed = JSON.parse(stored);
            if (parsed && parsed.walletId) {
              setSession(parsed);
            }
          } catch {
            // ignore
          }
          setIsLoading(false);
          return;
        }
        // Local wallet: try to find the wallet in registry and use its hash to decrypt
        const registry = getRegistry();
        for (const wallet of registry) {
          const decrypted = xorDecrypt(stored, wallet.passwordHash.slice(0, 32));
          if (decrypted) {
            try {
              const parsed = JSON.parse(decrypted);
              if (parsed.walletId === wallet.walletId) {
                setSession(parsed);
                break;
              }
            } catch {
              // continue
            }
          }
        }
      } catch {
        // ignore
      }
      setIsLoading(false);
    }
    restoreSession();
  }, []);

  const login = useCallback((s: WalletSession) => {
    setSession(s);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(ACTIVE_WALLET_ID_KEY);
    localStorage.removeItem("nexa_auth_method");
    setSession(null);
  }, []);

  return {
    session,
    isLoading,
    login,
    logout,
    isAuthenticated: !!session,
    ownerName: session?.displayName ?? "User",
    username: session?.username ?? "",
  };
}
