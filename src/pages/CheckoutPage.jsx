import { useLocation } from "react-router-dom";
import { useState } from "react";
import Select from "react-select";
import "flag-icons/css/flag-icons.min.css";
import "../styles/CheckoutPage.css";

const countryOptions = [
  { value: "AF", label: <>🇦🇫 Afghanistan</> },
  { value: "AL", label: <>🇦🇱 Albania</> },
  { value: "DZ", label: <>🇩🇿 Algeria</> },
  { value: "AS", label: <>🇦🇸 American Samoa</> },
  { value: "AD", label: <>🇦🇩 Andorra</> },
  { value: "AO", label: <>🇦🇴 Angola</> },
  { value: "AR", label: <>🇦🇷 Argentina</> },
  { value: "AM", label: <>🇦🇲 Armenia</> },
  { value: "AU", label: <>🇦🇺 Australia</> },
  { value: "AT", label: <>🇦🇹 Austria</> },
  { value: "AZ", label: <>🇦🇿 Azerbaijan</> },
  { value: "BE", label: <>🇧🇪 Belgium</> },
  { value: "BR", label: <>🇧🇷 Brazil</> },
  { value: "CA", label: <>🇨🇦 Canada</> },
  { value: "CN", label: <>🇨🇳 China</> },
  { value: "FR", label: <>🇫🇷 France</> },
  { value: "DE", label: <>🇩🇪 Germany</> },
  { value: "IN", label: <>🇮🇳 India</> },
  { value: "JP", label: <>🇯🇵 Japan</> },
  { value: "US", label: <>🇺🇸 United States</> },
  // Add more as needed
];

export function CheckoutPage() {
  const { state } = useLocation();
  const { items, total } = state || { items: [], total: 0 };
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    country: countryOptions.find((c) => c.value === "FR"),
    zip: "",
    city: "",
    street: "",
    apt: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCountryChange = (selected) => {
    setForm({ ...form, country: selected });
  };

  const handlePlaceOrder = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          shipping: form,
        }),
      });

      const { url } = await res.json();
      if (url) {
        window.location.href = url; // Redirect to Stripe Checkout
      }
    } catch (err) {
      console.error("Failed to create checkout session", err);
    }
  };

  return (
    <div className="checkout-container">
      <div className="checkout-form">
        <h2>Shipping Details</h2>

        <div className="form-group">
          <input
            name="firstName"
            placeholder="First name"
            onChange={handleChange}
          />
          <input
            name="lastName"
            placeholder="Last name"
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input name="phone" placeholder="Phone" onChange={handleChange} />
        </div>
        <div className="form-group">
          <Select
            options={countryOptions}
            value={form.country}
            onChange={handleCountryChange}
            className="country-select"
          />
        </div>
        <div className="form-group">
          <input name="zip" placeholder="ZIP code" onChange={handleChange} />
          <input name="city" placeholder="City" onChange={handleChange} />
        </div>
        <div className="form-group">
          <input
            name="street"
            placeholder="Street address"
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            name="apt"
            placeholder="Apartment (optional)"
            onChange={handleChange}
          />
        </div>

        <button className="place-order-btn" onClick={handlePlaceOrder}>
          Confirm & Pay
        </button>
      </div>

      <div className="checkout-summary">
        <h3>Order Summary</h3>
        <div className="summary-list">
          {items.map((item, i) => (
            <div key={i} className="summary-item">
              <img
                src={item.images?.[0]}
                alt={item.name}
                className="summary-img"
              />
              <div className="summary-info">
                <div className="summary-title">{item.name}</div>
                <div className="summary-meta">
                  Quantity: <strong>{item.quantity}</strong>
                  <br />
                  Price: <strong>${item.price.toFixed(2)}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="summary-total">
          <span>Total:</span>
          <strong>${total.toFixed(2)}</strong>
        </div>
      </div>
    </div>
  );
}
