import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { API_BASE_URL } from "../config";
import "../styles/styles-pure-components.css";

/* -------- ETA helpers (shared) -------- */
function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
function fmtShort(d) { return new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric" }); }
function fmtShortWithYear(d) { return new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }); }
function fmtRange(a, b) {
  const A = new Date(a), B = new Date(b);
  const sameYear = A.getFullYear() === B.getFullYear();
  const sameMonth = sameYear && A.getMonth() === B.getMonth();
  if (sameMonth) return `${fmtShort(A)}–${B.getDate()}`;
  const Atext = sameYear ? fmtShort(A) : fmtShortWithYear(A);
  const Btext = fmtShortWithYear(B);
  return `${Atext} – ${Btext}`;
}
/** Prefer etaWindowStart/End -> deliveryDate -> fallback (6–10d) */
function computeEtaWindow(order, minDays = 6, maxDays = 10) {
  // Explicit single date
  if (order?.deliveryDate) {
    const exact = new Date(order.deliveryDate);
    return { earliest: exact, latest: exact, rangeText: fmtShortWithYear(exact), helperText: "Estimated delivery date" };
  }
  // Saved window from backend
  if (order?.etaWindowStart || order?.etaWindowEnd) {
    const earliest = order.etaWindowStart ? new Date(order.etaWindowStart) : (order.etaWindowEnd ? new Date(order.etaWindowEnd) : null);
    const latest   = order.etaWindowEnd   ? new Date(order.etaWindowEnd)   : earliest;
    const rangeText = earliest && latest ? fmtRange(earliest, latest)
                    : earliest ? fmtShortWithYear(earliest)
                    : latest ? fmtShortWithYear(latest)
                    : "";
    return { earliest, latest, rangeText, helperText: `Usually ${minDays}–${maxDays} days` };
  }
  // Fallback from paidAt/createdAt
  const base = new Date(order?.paidAt || order?.createdAt || Date.now());
  const earliest = addDays(base, minDays);
  const latest = addDays(base, maxDays);
  return { earliest, latest, rangeText: fmtRange(earliest, latest), helperText: `Usually ${minDays}–${maxDays} days` };
}
/* ------------------------------------- */

export function SuccessPage() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const orderId = new URLSearchParams(window.location.search).get("order_id");

  const { user } = useUser();
  const { isSignedIn, getToken } = useAuth();

  // Escape Fondy iframe if needed
  useEffect(() => {
    if (window.top !== window.self) {
      try { window.top.location.href = window.location.href; } catch {}
    }
  }, []);

  // Load order + poll until it flips from awaiting_payment
  useEffect(() => {
    if (!orderId) return;
    let timer;
    const load = async () => {
      try {
        const r = await fetch(`${API_BASE_URL}/api/orders/id/${orderId}`);
        if (!r.ok) throw new Error("Order not found");
        const o = await r.json();
        setOrder(o);
        setLoading(false);

        if (o.status === "awaiting_payment") {
          timer = setTimeout(load, 2000);
        } else if (o.status === "approved") {
          // clear client cart caches
          localStorage.removeItem("cart");
          localStorage.removeItem("cartItems");
          localStorage.removeItem("cartTotal");
          const referrer = localStorage.getItem("pendingReferrer");
          if (referrer) {
            fetch(`${API_BASE_URL}/api/save-referrer`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ referrer, timestamp: Date.now() }),
            }).catch(() => {});
            localStorage.removeItem("pendingReferrer");
          }
        }
      } catch {
        setLoading(false);
      }
    };
    load();
    return () => clearTimeout(timer);
  }, [orderId]);

  // Link guest order to signed-in user when emails match
  useEffect(() => {
    if (!order || !isSignedIn || !user) return;
    if (order.clerkId) return;
    const email = user?.emailAddresses?.[0]?.emailAddress;
    if (!email || order.email !== email) return;
    (async () => {
      let bearer = null;
      try { bearer = await getToken(); } catch {}
      await fetch(`${API_BASE_URL}/api/orders/link-my-orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}) },
        body: JSON.stringify(bearer ? { email } : { userId: user.id, email }),
      }).catch(() => {});
    })();
  }, [order, isSignedIn, user, getToken]);

  const currency = order?.currency || "USD";
  const formatMoney = useMemo(
    () => (n) => new Intl.NumberFormat(undefined, { style: "currency", currency }).format(Number(n)),
    [currency]
  );

  const paid = order?.status === "approved";
  const failed = order?.status === "declined" || order?.status === "expired";
  const createdAt = useMemo(() => {
    const d = (order?.paidAt && new Date(order.paidAt)) || (order?.createdAt && new Date(order.createdAt)) || null;
    return d ? d.toLocaleString() : "-";
  }, [order]);

  const eta = useMemo(() => (order ? computeEtaWindow(order, 6, 10) : null), [order]);

  // NEW: Build a human-friendly payment label like "Apple Pay VISA **** 1111"
  const paymentLabel = useMemo(() => {
    if (!order) return "-";
    const parts = [];
    if (order.paymentMethod) parts.push(order.paymentMethod);   // Apple Pay / Google Pay / Card
    if (order.paymentMasked) parts.push(order.paymentMasked);   // VISA **** 1111
    return parts.join(" ") || (order.paymentSystem || "-");
  }, [order]);

  if (!orderId) {
    return (
      <div className="sp-wrap">
        <div className="sp-card">
          <div className="sp-header">
            <div className="sp-icon sp-icon-warn" aria-hidden>!</div>
            <h1 className="sp-title">We’re missing your order.</h1>
            <p className="sp-sub">No <b>order_id</b> found in the URL.</p>
          </div>
          <div className="sp-actions">
            <button className="sp-btn sp-btn-primary" onClick={() => navigate("/products")}>Continue shopping</button>
          </div>
        </div>
      </div>
    );
  }
  if (loading || !order) {
    return (
      <div className="sp-wrap">
        <div className="sp-card">
          <div className="sp-header">
            <div className="sp-loader" aria-hidden />
            <h1 className="sp-title">Finalizing your order…</h1>
            <p className="sp-sub">Please wait while we confirm your payment.</p>
          </div>
          <div className="sp-skeleton" />
        </div>
      </div>
    );
  }

  return (
    <div className="sp-wrap">
      <div className="sp-card">
        <div className="sp-header">
          <div className="sp-icon" aria-hidden>
            {paid ? (
              <img className="sp-icon-success" src="https://i.pinimg.com/originals/4a/10/e3/4a10e39ee8325a06daf00881ac321b2f.gif" alt="Payment successful" />
            ) : failed ? (
              <div className="sp-icon-error">!</div>
            ) : (
              <div className="sp-icon-warn">…</div>
            )}
          </div>

          <h1 className="sp-title">
            {paid ? "Payment successful" : failed ? "Payment not completed" : "Processing your payment…"}
          </h1>

          <div className={`sp-badge ${paid ? "sp-badge-ok" : failed ? "sp-badge-error" : "sp-badge-warn"}`}>
            {order.status}
          </div>
          <p className="sp-sub">Order <b>{order.id}</b> • {createdAt}</p>

          {/* ETA callout near the top */}
          {eta && (
            <div className="sp-eta">
              <div className="sp-eta-title">Estimated delivery</div>
              <div className="sp-eta-date">{eta.rangeText}</div>
              <div className="sp-eta-sub">
                {eta.helperText} • We’ll email a tracking link once it ships.
              </div>
            </div>
          )}
        </div>

        {/* Purchase summary */}
        <section className="sp-section">
          <h2 className="sp-h2">Purchase</h2>
          <div className="sp-grid">
            <div className="sp-kv"><span className="sp-k">Amount</span><span className="sp-v">{formatMoney(order.totals.total)}</span></div>
            <div className="sp-kv"><span className="sp-k">Currency</span><span className="sp-v">{currency}</span></div>
            <div className="sp-kv"><span className="sp-k">Email</span><span className="sp-v">{order.email || "-"}</span></div>
            {/* NEW: Payment method */}
            <div className="sp-kv"><span className="sp-k">Payment method</span><span className="sp-v">{paymentLabel}</span></div>
          </div>
        </section>

        {/* Delivery */}
        <section className="sp-section">
          <h2 className="sp-h2">Delivery</h2>
          <address className="sp-address">
            <div>{order.fullName || "-"}</div>
            <div>{order.line1}{order.line2 ? `, ${order.line2}` : ""}</div>
            <div>{order.city}{order.region ? `, ${order.region}` : ""} {order.postalCode}</div>
            <div>{order.country}</div>
            {order.phone ? <div>{order.phone}</div> : null}
          </address>
        </section>

        {/* Items */}
        <section className="sp-section">
          <h2 className="sp-h2">Items</h2>
          <div className="sp-items">
            {(order.items || []).map((i) => (
              <div key={i.id} className="sp-item">
                {i.imageUrl ? <img src={i.imageUrl} alt={i.name || ""} className="sp-item-img" /> : <div className="sp-item-ph" aria-hidden />}
                <div className="sp-item-main">
                  <div className="sp-item-name">{i.name}</div>
                  <div className="sp-item-meta">Qty {i.quantity}</div>
                </div>
                <div className="sp-item-price">{formatMoney((i.priceCents * i.quantity) / 100)}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Totals */}
        <section className="sp-section sp-totals">
          <div className="sp-row"><span>Subtotal</span><b>{formatMoney(order.totals.subtotal)}</b></div>
          <div className="sp-row"><span>Shipping</span><b>{formatMoney(order.totals.shipping)}</b></div>
          <div className="sp-row"><span>Tax</span><b>{formatMoney(order.totals.tax)}</b></div>
          <div className="sp-row sp-row-total"><span>Total</span><b>{formatMoney(order.totals.total)}</b></div>
        </section>

        {/* Actions */}
        <div className="sp-actions">
          <button className="sp-btn sp-btn-primary" onClick={() => navigate("/profile")}>Track my order</button>
          <button className="sp-btn sp-btn-ghost" onClick={() => navigate("/products")}>Continue shopping</button>
          <button className="sp-btn sp-btn-ghost" onClick={() => window.print()} aria-label="Print receipt">Print receipt</button>
        </div>

        <p className="sp-help">Need help? Email <a href="mailto:peektrend.tech@gmail.com">peektrend.tech@gmail.com</a>.</p>
      </div>
    </div>
  );
}
