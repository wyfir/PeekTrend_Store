import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { API_BASE_URL } from "../config";
import "../styles/styles-pure-components.css";

/* -------- shared ETA helpers -------- */
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
function computeEtaWindow(order, minDays = 6, maxDays = 10) {
  if (order?.deliveryDate) {
    const exact = new Date(order.deliveryDate);
    return { earliest: exact, latest: exact, rangeText: fmtShortWithYear(exact), helperText: "Estimated delivery date" };
  }
  if (order?.etaWindowStart || order?.etaWindowEnd) {
    const earliest = order.etaWindowStart ? new Date(order.etaWindowStart) : (order.etaWindowEnd ? new Date(order.etaWindowEnd) : null);
    const latest   = order.etaWindowEnd   ? new Date(order.etaWindowEnd)   : earliest;
    const rangeText = earliest && latest ? fmtRange(earliest, latest)
                    : earliest ? fmtShortWithYear(earliest)
                    : latest ? fmtShortWithYear(latest)
                    : "";
    return { earliest, latest, rangeText, helperText: `Usually ${minDays}–${maxDays} days` };
  }
  const base = new Date(order?.paidAt || order?.createdAt || Date.now());
  const earliest = addDays(base, minDays);
  const latest = addDays(base, maxDays);
  return { earliest, latest, rangeText: fmtRange(earliest, latest), helperText: `Usually ${minDays}–${maxDays} days` };
}
/* ------------------------------------ */

export default function TrackOrderPage() {
  const navigate = useNavigate();
  const qs = new URLSearchParams(window.location.search);
  const orderId = qs.get("order_id") || "";
  const token = qs.get("token") || "";

  const { user } = useUser();
  const { isSignedIn, getToken } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!orderId) {
      setErr("Missing order id.");
      setLoading(false);
      return;
    }
    const url = `${API_BASE_URL}/api/orders/id/${encodeURIComponent(orderId)}${token ? `?token=${encodeURIComponent(token)}` : ""}`;
    (async () => {
      try {
        const r = await fetch(url);
        if (!r.ok) throw new Error("Could not load order");
        const data = await r.json();
        setOrder(data);
      } catch (e) {
        setErr(e.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId, token]);

  // Link guest order to account if emails match
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

  // NEW: Build human-friendly payment label
  const paymentLabel = useMemo(() => {
    if (!order) return "-";
    const parts = [];
    if (order.paymentMethod) parts.push(order.paymentMethod);
    if (order.paymentMasked) parts.push(order.paymentMasked);
    return parts.join(" ") || (order.paymentSystem || "-");
  }, [order]);

  if (loading) {
    return (
      <div className="sp-wrap">
        <div className="sp-card">
          <div className="sp-header">
            <div className="sp-loader" aria-hidden />
            <h1 className="sp-title">Loading your order…</h1>
            <p className="sp-sub">Please wait a moment.</p>
          </div>
          <div className="sp-skeleton" />
        </div>
      </div>
    );
  }

  if (err || !order) {
    return (
      <div className="sp-wrap">
        <div className="sp-card">
          <div className="sp-header">
            <div className="sp-icon sp-icon-warn" aria-hidden>!</div>
            <h1 className="sp-title">We couldn’t find that order</h1>
            <p className="sp-sub">{err || "Please check the link or request a new one."}</p>
          </div>
          <div className="sp-actions">
            <button className="sp-btn sp-btn-primary" onClick={() => navigate("/products")}>Continue shopping</button>
          </div>
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
              <img className="sp-icon-success" src="https://fondy.io/guids/CABINET_246e57916cbb4875b5d613f67af74803d0c224c640569adaffd803f9155fcab5/images/success.gif" alt="Payment successful" />
            ) : failed ? (
              <div className="sp-icon-error">!</div>
            ) : (
              <div className="sp-icon-warn">…</div>
            )}
          </div>

          <h1 className="sp-title">
            {paid ? "Payment successful" : failed ? "Payment not completed" : "Order in progress"}
          </h1>

          <div className={`sp-badge ${paid ? "sp-badge-ok" : failed ? "sp-badge-error" : "sp-badge-warn"}`}>
            {order.status}
          </div>
          <p className="sp-sub">Order <b>{order.id}</b> • {createdAt}</p>

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

        {/* Purchase */}
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

        <div className="sp-actions">
          <button className="sp-btn sp-btn-primary" onClick={() => navigate("/profile")}>Track in my account</button>
          <button className="sp-btn sp-btn-ghost" onClick={() => navigate("/products")}>Continue shopping</button>
        </div>

        <p className="sp-help">Need help? Email <a href="mailto:peektrend.tech@gmail.com">peektrend.tech@gmail.com</a>.</p>
      </div>
    </div>
  );
}
