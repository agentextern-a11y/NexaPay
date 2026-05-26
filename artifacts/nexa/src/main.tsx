import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setWalletIdGetter } from "@workspace/api-client-react";

setWalletIdGetter(() => {
  try {
    const id = localStorage.getItem("nexa_active_wallet_id");
    if (!id) return null;
    const n = parseInt(id, 10);
    return isNaN(n) || n <= 0 ? null : n;
  } catch {
    return null;
  }
});

createRoot(document.getElementById("root")!).render(<App />);
