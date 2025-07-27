export function CheckoutPage() {
  const { state } = useLocation(); // items & total from cart
  const { items, total } = state || { items: [], total: 0 };

  const handlePlaceOrder = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }), // no shipping needed anymore
      });

      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (err) {
      console.error("Checkout session failed:", err);
    }
  };

  return (
    <div className="checkout-confirmation">
      <h2>Ready to Checkout</h2>
      <ul>
        {items.map((item, i) => (
          <li key={i}>{item.name} × {item.quantity}</li>
        ))}
      </ul>
      <h3>Total: ${total.toFixed(2)}</h3>
      <button onClick={handlePlaceOrder}>Go to Stripe Checkout</button>
    </div>
  );
}
