import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { API_BASE_URL } from "../config";
import FondyModal from "../components/FondyModal";

export default function CheckoutPage({ cartItems = [], clearCart }) {
  const { user } = useUser();
  const [form, setForm] = useState({
    fullName: "",
    email: user?.emailAddresses?.[0]?.emailAddress || "",
    phone: "",
    country: "US",
    line1: "",
    line2: "",
    city: "",
    region: "",
    postalCode: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [fondyUrl, setFondyUrl] = useState(null);

  const total = useMemo(
    () => cartItems.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0),
    [cartItems]
  );

  useEffect(() => {
    // Prefill name and email
    if (user?.fullName && !form.fullName) setForm(f => ({ ...f, fullName: user.fullName }));
    const email = user?.emailAddresses?.[0]?.emailAddress;
    if (email && !form.email) setForm(f => ({ ...f, email }));

    // Auto-detect country/region by IP if not already set
    if (!form.country || form.country === "US") {
      fetch("https://ipapi.co/json/")
        .then(res => res.json())
        .then(data => {
          if (data?.country) setForm(f => ({ ...f, country: data.country }));
          if (data?.region_code) setForm(f => ({ ...f, region: data.region_code }));
        })
        .catch(() => {
          // fail silently if API fails
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const update = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const e = {};
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.fullName.trim()) e.fullName = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!emailRe.test(form.email.trim())) e.email = "Enter a valid email";
    if (!form.country.trim()) e.country = "Required";
    if (!form.line1.trim()) e.line1 = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.postalCode.trim()) e.postalCode = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePay = async (ev) => {
    ev.preventDefault();
    if (!cartItems.length) return alert("Your cart is empty.");
    if (!validate()) return;

    setSubmitting(true);
    try {
      const createRes = await fetch(`${API_BASE_URL}/api/orders/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems,
          shipping: form,
          clerkId: user?.id,
          clerkEmail: form.email,
          referrer: localStorage.getItem("pendingReferrer") || "direct",
        }),
      });
      if (!createRes.ok) throw new Error("Create order failed");
      const { orderId } = await createRes.json();
      setOrderId(orderId);

      const sessRes = await fetch(`${API_BASE_URL}/api/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      if (!sessRes.ok) throw new Error("Fondy session failed");
      const { checkout_url } = await sessRes.json();

      setFondyUrl(checkout_url);
    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = async () => {
    setFondyUrl(null);
    if (orderId) {
      try {
        await fetch(`${API_BASE_URL}/api/orders/${orderId}/abandon`, { method: "POST" });
      } catch {}
    }
  };

  if (!cartItems.length) {
    return (
      <div className="co-wrap">
        <style>{CSS}</style>
        <div className="co-empty">
          <h2>Your cart is empty</h2>
          <a className="co-btn co-btn-primary" href="/products">Browse products</a>
        </div>
      </div>
    );
  }

  return (
    <div className="co-wrap">
      <style>{CSS}</style>

      <header className="co-header" aria-label="Secure checkout">
        <div className="co-header-left">
          <h1 className="co-title">Checkout</h1>
          <div className="co-secure">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
              <path d="M6 10V8a6 6 0 1112 0v2h1a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1v-9a1 1 0 011-1h1zm2 0h8V8a4 4 0 10-8 0v2z" fill="currentColor"/>
            </svg>
            <span>Secure checkout</span>
          </div>
        </div>
        <div className="co-accept">
          <span>Accepted: VISA • Mastercard • Apple&nbsp;Pay • Google&nbsp;Pay</span>
        </div>
      </header>

      <main className="co-grid">
        {/* Form */}
        <section className="co-card co-form">
          <nav className="co-steps" aria-label="Steps">
            <span className="active">Shipping</span>
            <span>Payment</span>
          </nav>

          <form onSubmit={handlePay} noValidate>
            <h2 className="co-h2">Contact</h2>
            <div className="co-group">
              <div className={`co-field ${errors.fullName ? "has-error" : ""}`}>
                <label htmlFor="fullName">Full name</label>
                <input
                  id="fullName"
                  name="fullName"
                  autoComplete="name"
                  value={form.fullName}
                  onChange={update}
                  disabled={submitting}
                  aria-invalid={!!errors.fullName}
                  className="co-input"
                  placeholder="John Appleseed"
                />
                {errors.fullName && <small className="co-err">{errors.fullName}</small>}
              </div>

              <div className={`co-field ${errors.email ? "has-error" : ""}`}>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={update}
                  disabled={submitting}
                  aria-invalid={!!errors.email}
                  className="co-input"
                  placeholder="you@example.com"
                />
                {errors.email ? (
                  <small className="co-err">{errors.email}</small>
                ) : (
                  <p className="co-fineprint">
                    A receipt and order updates will be sent to this email address.
                  </p>
                )}
              </div>

              <div className="co-field">
                <label htmlFor="phone">Phone <span className="co-optional">(optional)</span></label>
                <input
                  id="phone"
                  name="phone"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={update}
                  disabled={submitting}
                  className="co-input"
                  placeholder="+1 555 555 5555"
                />
              </div>
            </div>

            <h2 className="co-h2">Shipping address</h2>
            <div className="co-group">
              <div className={`co-field ${errors.country ? "has-error" : ""}`}>
                <label htmlFor="country">Country/Region</label>
                <select
                  id="country"
                  name="country"
                  value={form.country}
                  onChange={update}
                  disabled={submitting}
                  aria-invalid={!!errors.country}
                  className="co-input"
                >
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="IT">Italy</option>
                  <option value="ES">Spain</option>
                  <option value="NL">Netherlands</option>
                  <option value="PL">Poland</option>
                  <option value="UA">Ukraine</option>
                  <option value="AT">Austria</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                </select>
                {errors.country && <small className="co-err">{errors.country}</small>}
              </div>

              <div className={`co-field ${errors.line1 ? "has-error" : ""}`}>
                <label htmlFor="line1">Address line 1</label>
                <input
                  id="line1"
                  name="line1"
                  autoComplete="address-line1"
                  value={form.line1}
                  onChange={update}
                  disabled={submitting}
                  aria-invalid={!!errors.line1}
                  className="co-input"
                  placeholder="123 Market St"
                />
                {errors.line1 && <small className="co-err">{errors.line1}</small>}
              </div>

              <div className="co-field">
                <label htmlFor="line2">Address line 2 <span className="co-optional">(optional)</span></label>
                <input
                  id="line2"
                  name="line2"
                  autoComplete="address-line2"
                  value={form.line2}
                  onChange={update}
                  disabled={submitting}
                  className="co-input"
                  placeholder="Apt, suite, etc."
                />
              </div>

              <div className="co-row">
                <div className={`co-field ${errors.city ? "has-error" : ""}`}>
                  <label htmlFor="city">City</label>
                  <input
                    id="city"
                    name="city"
                    autoComplete="address-level2"
                    value={form.city}
                    onChange={update}
                    disabled={submitting}
                    aria-invalid={!!errors.city}
                    className="co-input"
                    placeholder="San Francisco"
                  />
                  {errors.city && <small className="co-err">{errors.city}</small>}
                </div>

                <div className="co-field">
                  <label htmlFor="region">State/Region</label>
                  <input
                    id="region"
                    name="region"
                    autoComplete="address-level1"
                    value={form.region}
                    onChange={update}
                    disabled={submitting}
                    className="co-input"
                    placeholder="CA"
                  />
                </div>

                <div className={`co-field ${errors.postalCode ? "has-error" : ""}`}>
                  <label htmlFor="postalCode">ZIP / Postal code</label>
                  <input
                    id="postalCode"
                    name="postalCode"
                    autoComplete="postal-code"
                    value={form.postalCode}
                    onChange={update}
                    disabled={submitting}
                    aria-invalid={!!errors.postalCode}
                    className="co-input"
                    placeholder="94103"
                  />
                  {errors.postalCode && <small className="co-err">{errors.postalCode}</small>}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="co-btn co-btn-primary co-btn-block"
              disabled={submitting}
              aria-busy={submitting}
            >
              {submitting ? <span className="co-spinner" aria-hidden /> : null}
              {submitting ? "Starting checkout…" : "Pay securely"}
            </button>

            <p className="co-fineprint">
              Payments are processed securely by Fondy. Your information is protected by TLS encryption.
            </p>
          </form>
        </section>

        {/* Summary */}
        <aside className="co-card co-summary" aria-label="Order summary">
          <h2 className="co-h2">Order summary</h2>
          <div className="co-items">
            {cartItems.map((i, idx) => (
              <div key={idx} className="co-item">
                <div className="co-thumb">
                  {i.image || i.images?.[0] ? (
                    <img src={i.image || i.images?.[0]} alt="" />
                  ) : (
                    <div className="co-thumb-ph" aria-hidden />
                  )}
                  <span className="co-qty">×{i.quantity}</span>
                </div>
                <div className="co-item-main">
                  <div className="co-item-name">{i.name}</div>
                  <div className="co-item-meta">
                    {(i.selectedColor ? `${i.selectedColor} • ` : "")}
                    {(i.selectedSize || "")}
                  </div>
                </div>
                <div className="co-price">${(i.price * i.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div className="co-totals">
            <div className="co-row-line">
              <span>Subtotal</span><b>${total.toFixed(2)}</b>
            </div>
            <div className="co-row-line">
              <span>Shipping</span><b>Calculated at payment</b>
            </div>
            <div className="co-row-line co-total">
              <span>Total</span><b>${total.toFixed(2)}</b>
            </div>
          </div>

          <div className="co-note">Powered by Fondy</div>
        </aside>
      </main>

      <FondyModal url={fondyUrl} onClose={handleCloseModal} />
    </div>
  );
}

/* ---------- restrained, professional, mobile-first styles ---------- */
const CSS = `
:root { --ink:#111; --muted:#6b7280; --line:#d9d9d9; --bg:#fff; --focus:#111; }
.co-wrap { max-width: 980px; margin: 0 auto; padding: 16px; color: var(--ink); font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"; }
.co-header { display:flex; flex-wrap:wrap; justify-content:space-between; align-items:end; gap:8px; margin-bottom:12px; }
.co-title { font-size: 20px; font-weight: 700; margin:0; }
.co-secure { display:flex; margin-top: 10px; align-items:center; gap:6px; color:#2f2f2f; font-size: 13px; }
.co-accept { color: var(--muted); font-size: 13px; }
.co-grid { display:grid; grid-template-columns: 1fr; gap:16px; }
.co-card { background: var(--bg); border: 1px solid var(--line); border-radius: 4px; padding: 16px; }
.co-steps { display:flex; gap:12px; font-size:13px; color: var(--muted); border-bottom:1px solid var(--line); padding-bottom:8px; margin-bottom:12px; }
.co-steps .active { color: var(--ink); font-weight:600; }
.co-h2 { font-size:14px; font-weight:700; margin: 29px 0 15px; }
.co-group { display:grid; gap:12px; }
.co-row { display:grid; grid-template-columns: 1fr; gap:10px; }
.co-field label { display:block; font-size:13px; color:#2f2f2f; margin-bottom:4px; }
.co-optional { color: var(--muted); font-weight:400; }
.co-input { width: 90%; padding:10px 12px; border:1px solid var(--line); border-radius:4px; background:#fff; font-size:14px; outline:none; }
.co-input:focus { border-color: var(--focus); box-shadow: none; }
.has-error .co-input { border-color:#c81e1e; }
.co-err { color:#8b0000; font-size:12px; margin-top:4px; }
.co-btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:12px 14px; border:1px solid #1a1a1a; background:#1a1a1a; color:#fff; font-weight:700; font-size:14px; border-radius:4px; cursor:pointer; }
.co-btn[disabled] { opacity:.7; cursor:not-allowed; }
.co-btn-block { width:100%; margin-top:25px; }
.co-spinner { width:16px; height:16px; border:2px solid #fff; border-right-color:transparent; border-radius:50%; animation:co-spin .8s linear infinite; }
@keyframes co-spin { to { transform: rotate(360deg); } }
.co-fineprint { color: var(--muted); font-size:12px; margin-top:6px; }
.co-items { display:grid; gap:8px; margin-top:4px; }
.co-item { display:grid; grid-template-columns: auto 1fr auto; gap:12px; align-items:center; }
.co-thumb { position:relative; width:52px; height:52px; border-radius:4px; overflow:hidden; background:#f4f4f5; border:1px solid var(--line); }
.co-thumb img { width:100%; height:100%; object-fit:cover; display:block; }
.co-thumb-ph { width:100%; height:100%; background:#eee; }
.co-qty { position:absolute; bottom:-6px; right:-6px; background:#1a1a1a; color:#fff; font-size:11px; padding:2px 6px; border-radius:3px; border:1px solid #fff; }
.co-item-name { font-weight:600; font-size:10px; }
.co-item-meta { color: var(--muted); font-size:12px; }
.co-price { font-weight:700; font-size:14px; }
.co-totals { border-top:1px solid var(--line); margin-top:15px; padding-top:8px; display:grid; gap:6px; }
.co-row-line { display:flex; justify-content:space-between; align-items:center; }
.co-total b { font-size:15px; }
.co-note { color: var(--muted); font-size:12px; margin-top:8px; }
.co-empty { text-align:center; border:1px solid var(--line); border-radius:4px; padding:24px; }
@media (min-width: 900px) {
  .co-grid { grid-template-columns: 1.2fr .8fr; align-items:start; }
  .co-summary { position: sticky; top: 12px; }
  .co-row { grid-template-columns: 1.1fr .9fr .8fr; }
}
`;
