import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setWalletIdGetter } from "@workspace/api-client-react";

setWalletIdGetter(() => {
  try {
    const s = localStorage.getItem("nexa_session");
    if (!s) return null;
    const parsed = JSON.parse(s);
    return parsed.walletId ?? null;
  } catch {
    return null;
  }
});

createRoot(document.getElementById("root")!).render(<App />);
