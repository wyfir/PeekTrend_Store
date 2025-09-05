import { useState, useCallback } from "react";
import { API_BASE_URL } from "../config";

export function useFondyCheckout({ getUserMeta }) {
  const [fondyUrl, setFondyUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const openFondy = useCallback(async (items) => {
    setLoading(true);
    setError("");
    try {
      const meta = (typeof getUserMeta === "function" && getUserMeta()) || {};
      const res = await fetch(`${API_BASE_URL}/api/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          clerkId: meta.clerkId,
          clerkEmail: meta.clerkEmail,
          referrer: localStorage.getItem("pendingReferrer") || "direct",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to create session");
      if (!data.checkout_url) throw new Error("No checkout_url returned");

      setFondyUrl(data.checkout_url);
    } catch (e) {
      console.error("Fondy checkout error:", e);
      setError(e.message || "Checkout error");
    } finally {
      setLoading(false);
    }
  }, [getUserMeta]);

  const closeFondy = useCallback(() => setFondyUrl(null), []);

  return { fondyUrl, openFondy, closeFondy, loading, error };
}
