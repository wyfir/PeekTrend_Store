import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/globals.css";
import { API_BASE_URL } from "../config";
export function SuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clean cart state
    localStorage.removeItem("cartItems");
    localStorage.removeItem("cartTotal");

    // Send referrer (only if they completed purchase)
    const referrer = localStorage.getItem("pendingReferrer");

    if (referrer) {
      fetch(`${API_BASE_URL}/api/save-referrer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          referrer,
          timestamp: Date.now(), // optional
        }),
      }).catch(console.error);

      localStorage.removeItem("pendingReferrer");
    }
  }, []);

  return (
    <div className="success-page">
      <h1>🎉 Thank you for your purchase!</h1>
      <p>Your order has been successfully placed. You will receive a confirmation email shortly.</p>
      <button onClick={() => navigate("/profile")} className="success-btn">
        Track My Order
      </button>
    </div>
  );
}
