// src/pages/SuccessPage.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/globals.css";

export function SuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear cart from localStorage (or your app state)
    localStorage.removeItem("cartItems");
    localStorage.removeItem("cartTotal");

    // Optional: fetch Stripe session data or show order info if stored
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
