// import { useEffect, useState, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import { useUser, useAuth } from "@clerk/clerk-react";
// import { API_BASE_URL } from "../config";
// import "../styles/styles-pure-components.css";

// /* -------- ETA helpers (shared) -------- */
// function addDays(d, n) {
//   const x = new Date(d);
//   x.setDate(x.getDate() + n);
//   return x;
// }
// function fmtShort(d) {
//   return new Date(d).toLocaleDateString(undefined, {
//     month: "short",
//     day: "numeric",
//   });
// }
// function fmtShortWithYear(d) {
//   return new Date(d).toLocaleDateString(undefined, {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   });
// }
// function fmtRange(a, b) {
//   const A = new Date(a),
//     B = new Date(b);
//   const sameYear = A.getFullYear() === B.getFullYear();
//   const sameMonth = sameYear && A.getMonth() === B.getMonth();
//   if (sameMonth) return `${fmtShort(A)}–${B.getDate()}`;
//   const Atext = sameYear ? fmtShort(A) : fmtShortWithYear(A);
//   const Btext = fmtShortWithYear(B);
//   return `${Atext} – ${Btext}`;
// }
// /** Prefer etaWindowStart/End -> deliveryDate -> fallback (6–10d) */
// function computeEtaWindow(order, minDays = 6, maxDays = 10) {
//   // Explicit single date
//   if (order?.deliveryDate) {
//     const exact = new Date(order.deliveryDate);
//     return {
//       earliest: exact,
//       latest: exact,
//       rangeText: fmtShortWithYear(exact),
//       helperText: "Estimated delivery date",
//     };
//   }
//   // Saved window from backend
//   if (order?.etaWindowStart || order?.etaWindowEnd) {
//     const earliest = order.etaWindowStart
//       ? new Date(order.etaWindowStart)
//       : order.etaWindowEnd
//       ? new Date(order.etaWindowEnd)
//       : null;
//     const latest = order.etaWindowEnd ? new Date(order.etaWindowEnd) : earliest;
//     const rangeText =
//       earliest && latest
//         ? fmtRange(earliest, latest)
//         : earliest
//         ? fmtShortWithYear(earliest)
//         : latest
//         ? fmtShortWithYear(latest)
//         : "";
//     return {
//       earliest,
//       latest,
//       rangeText,
//       helperText: `Usually ${minDays}–${maxDays} days`,
//     };
//   }
//   // Fallback from paidAt/createdAt
//   const base = new Date(order?.paidAt || order?.createdAt || Date.now());
//   const earliest = addDays(base, minDays);
//   const latest = addDays(base, maxDays);
//   return {
//     earliest,
//     latest,
//     rangeText: fmtRange(earliest, latest),
//     helperText: `Usually ${minDays}–${maxDays} days`,
//   };
// }
// /* ------------------------------------- */

// export function SuccessPage() {
//   const navigate = useNavigate();
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const orderId = new URLSearchParams(window.location.search).get("order_id");

//   const { user } = useUser();
//   const { isSignedIn, getToken } = useAuth();

//   // Escape Fondy iframe if needed
//   useEffect(() => {
//     if (window.top !== window.self) {
//       try {
//         window.top.location.href = window.location.href;
//       } catch {}
//     }
//   }, []);

//   // Load order + poll until it flips from awaiting_payment
//   useEffect(() => {
//     if (!orderId) return;
//     let timer;
//     const load = async () => {
//       try {
//         const r = await fetch(`${API_BASE_URL}/api/orders/id/${orderId}`);
//         if (!r.ok) throw new Error("Order not found");
//         const o = await r.json();
//         setOrder(o);
//         setLoading(false);

//         if (o.status === "awaiting_payment") {
//           timer = setTimeout(load, 2000);
//         } else if (o.status === "approved") {
//           // clear client cart caches
//           localStorage.removeItem("cart");
//           localStorage.removeItem("cartItems");
//           localStorage.removeItem("cartTotal");
//           const referrer = localStorage.getItem("pendingReferrer");
//           if (referrer) {
//             fetch(`${API_BASE_URL}/api/save-referrer`, {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({ referrer, timestamp: Date.now() }),
//             }).catch(() => {});
//             localStorage.removeItem("pendingReferrer");
//           }
//         }
//       } catch {
//         setLoading(false);
//       }
//     };
//     load();
//     return () => clearTimeout(timer);
//   }, [orderId]);

//   // Link guest order to signed-in user when emails match
//   useEffect(() => {
//     if (!order || !isSignedIn || !user) return;
//     if (order.clerkId) return;
//     const email = user?.emailAddresses?.[0]?.emailAddress;
//     if (!email || order.email !== email) return;
//     (async () => {
//       let bearer = null;
//       try {
//         bearer = await getToken();
//       } catch {}
//       await fetch(`${API_BASE_URL}/api/orders/link-my-orders`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
//         },
//         body: JSON.stringify(bearer ? { email } : { userId: user.id, email }),
//       }).catch(() => {});
//     })();
//   }, [order, isSignedIn, user, getToken]);

//   const currency = order?.currency || "USD";
//   const formatMoney = useMemo(
//     () => (n) =>
//       new Intl.NumberFormat(undefined, { style: "currency", currency }).format(
//         Number(n)
//       ),
//     [currency]
//   );

//   const paid = order?.status === "approved";
//   const failed = order?.status === "declined" || order?.status === "expired";
//   const createdAt = useMemo(() => {
//     const d =
//       (order?.paidAt && new Date(order.paidAt)) ||
//       (order?.createdAt && new Date(order.createdAt)) ||
//       null;
//     return d ? d.toLocaleString() : "-";
//   }, [order]);

//   const eta = useMemo(
//     () => (order ? computeEtaWindow(order, 6, 10) : null),
//     [order]
//   );

//   // NEW: Build a human-friendly payment label like "Apple Pay VISA **** 1111"
//   const paymentLabel = useMemo(() => {
//     if (!order) return "-";
//     const parts = [];
//     if (order.paymentMethod) parts.push(order.paymentMethod); // Apple Pay / Google Pay / Card
//     if (order.paymentMasked) parts.push(order.paymentMasked); // VISA **** 1111
//     return parts.join(" ") || order.paymentSystem || "-";
//   }, [order]);

//   if (!orderId) {
//     return (
//       <div className="sp-wrap">
//         <div className="sp-card">
//           <div className="sp-header">
//             <div className="sp-icon sp-icon-warn" aria-hidden>
//               !
//             </div>
//             <h1 className="sp-title">We’re missing your order.</h1>
//             <p className="sp-sub">
//               No <b>order_id</b> found in the URL.
//             </p>
//           </div>
//           <div className="sp-actions">
//             <button
//               className="sp-btn sp-btn-primary"
//               onClick={() => navigate("/products")}
//             >
//               Continue shopping
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }
//   if (loading || !order) {
//     return (
//       <div className="sp-wrap">
//         <div className="sp-card">
//           <div className="sp-header">
//             <div className="sp-loader" aria-hidden />
//             <h1 className="sp-title">Finalizing your order…</h1>
//             <p className="sp-sub">Please wait while we confirm your payment.</p>
//           </div>
//           <div className="sp-skeleton" />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="sp-wrap">
//       <div className="sp-card">
//         {/* Header with status icon */}
//         <div className="sp-header">
//           <div className="sp-icon" aria-hidden>
//             {paid ? (
//               // Show the first product image as the success image
//               order.items && order.items.length > 0 && order.items[0].imageUrl ? (
//                 <img
//                   src={order.items[0].imageUrl}
//                   alt={order.items[0].name || "Product"}
//                   className="sp-icon-success"
//                 />
//               ) : (
//                 // fallback if no image
//                 <div className="sp-icon-warn">✓</div>
//               )
//             ) : failed ? (
//               <div className="sp-icon-error">!</div>
//             ) : (
//               <div className="sp-icon-warn">…</div>
//             )}
//           </div>

//           <h1 className="sp-title">
//             {paid
//               ? "Payment successful"
//               : failed
//               ? "Payment not completed"
//               : "Processing your payment…"}
//           </h1>
//           <div className="sp_scc_wrapper">
//             <div className="tg_succ">
//             <div
//               className={`sp-badge ${
//                 paid
//                   ? "sp-badge-ok"
//                   : failed
//                   ? "sp-badge-error"
//                   : "sp-badge-warn"
//               }`}
//             >
//               {order.status}
//             </div>
//             <p className="sp-sub">
//               Order <b>{order.id}</b> • {createdAt}
//             </p>
//           </div>
//           </div>

//           {/* ETA callout near the top */}
//           {eta && (
//             <div className="sp-eta">
//               <div className="sp-eta-title">Estimated delivery</div>
//               <div className="sp-eta-date">{eta.rangeText}</div>
//               <div className="sp-eta-sub">
//                 {eta.helperText} • We’ll email a tracking link once it ships.
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Purchase summary */}
//         <section className="sp-section">
//           <h2 className="sp-h2">Purchase</h2>
//           <div className="sp-grid">
//             <div className="sp-kv">
//               <span className="sp-k">Amount</span>
//               <span className="sp-v">{formatMoney(order.totals.total)}</span>
//             </div>
//             <div className="sp-kv">
//               <span className="sp-k">Currency</span>
//               <span className="sp-v">{currency}</span>
//             </div>
//             <div className="sp-kv">
//               <span className="sp-k">Email</span>
//               <span className="sp-v">{order.email || "-"}</span>
//             </div>
//             {/* NEW: Payment method */}
//             <div className="sp-kv">
//               <span className="sp-k">Payment method</span>
//               <span className="sp-v">{paymentLabel}</span>
//             </div>
//           </div>
//         </section>

//         {/* Delivery */}
//         <section className="sp-section">
//           <h2 className="sp-h2">Delivery</h2>
//           <address className="sp-address">
//             <div>{order.fullName || "-"}</div>
//             <div>
//               {order.line1}
//               {order.line2 ? `, ${order.line2}` : ""}
//             </div>
//             <div>
//               {order.city}
//               {order.region ? `, ${order.region}` : ""} {order.postalCode}
//             </div>
//             <div>{order.country}</div>
//             {order.phone ? <div>{order.phone}</div> : null}
//           </address>
//         </section>

//         {/* Items */}
//         <section className="sp-section">
//           <h2 className="sp-h2">Items</h2>
//           <div className="sp-items">
//             {(order.items || []).map((i) => (
//               <div key={i.id} className="sp-item">
//                 {i.imageUrl ? (
//                   <img
//                     src={i.imageUrl}
//                     alt={i.name || ""}
//                     className="sp-item-img"
//                   />
//                 ) : (
//                   <div className="sp-item-ph" aria-hidden />
//                 )}
//                 <div className="sp-item-main">
//                   <div className="sp-item-name">{i.name}</div>
//                   <div className="sp-item-meta">Qty {i.quantity}</div>
//                 </div>
//                 <div className="sp-item-price">
//                   {formatMoney((i.priceCents * i.quantity) / 100)}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Totals */}
//         <section className="sp-section sp-totals">
//           <div className="sp-row">
//             <span>Subtotal</span>
//             <b>{formatMoney(order.totals.subtotal)}</b>
//           </div>
//           <div className="sp-row">
//             <span>Shipping</span>
//             <b>{formatMoney(order.totals.shipping)}</b>
//           </div>
//           <div className="sp-row">
//             <span>Tax</span>
//             <b>{formatMoney(order.totals.tax)}</b>
//           </div>
//           <div className="sp-row sp-row-total">
//             <span>Total</span>
//             <b>{formatMoney(order.totals.total)}</b>
//           </div>
//         </section>

//         {/* Actions */}
//         <div className="sp-actions">
//           <button
//             className="sp-btn sp-btn-primary"
//             onClick={() => navigate("/profile")}
//           >
//             Track my order
//           </button>
//           <button
//             className="sp-btn sp-btn-ghost"
//             onClick={() => navigate("/products")}
//           >
//             Continue shopping
//           </button>
//           <button
//             className="sp-btn sp-btn-ghost"
//             onClick={() => window.print()}
//             aria-label="Print receipt"
//           >
//             Print receipt
//           </button>
//         </div>

//         <p className="sp-help">
//           Need help? Email{" "}
//           <a href="mailto:peektrend.tech@gmail.com">peektrend.tech@gmail.com</a>
//           .
//         </p>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { API_BASE_URL } from "../config";

/* -------- ETA helpers (shared) -------- */
function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
function fmtShort(d) {
  return new Date(d).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}
function fmtShortWithYear(d) {
  return new Date(d).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
function fmtRange(a, b) {
  const A = new Date(a),
    B = new Date(b);
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
    return {
      earliest: exact,
      latest: exact,
      rangeText: fmtShortWithYear(exact),
      helperText: "Estimated delivery date",
    };
  }
  // Saved window from backend
  if (order?.etaWindowStart || order?.etaWindowEnd) {
    const earliest = order.etaWindowStart
      ? new Date(order.etaWindowStart)
      : order.etaWindowEnd
      ? new Date(order.etaWindowEnd)
      : null;
    const latest = order.etaWindowEnd ? new Date(order.etaWindowEnd) : earliest;
    const rangeText =
      earliest && latest
        ? fmtRange(earliest, latest)
        : earliest
        ? fmtShortWithYear(earliest)
        : latest
        ? fmtShortWithYear(latest)
        : "";
    return {
      earliest,
      latest,
      rangeText,
      helperText: `Usually ${minDays}–${maxDays} days`,
    };
  }
  // Fallback from paidAt/createdAt
  const base = new Date(order?.paidAt || order?.createdAt || Date.now());
  const earliest = addDays(base, minDays);
  const latest = addDays(base, maxDays);
  return {
    earliest,
    latest,
    rangeText: fmtRange(earliest, latest),
    helperText: `Usually ${minDays}–${maxDays} days`,
  };
}
/* ------------------------------------- */

export function SuccessPage() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileView, setIsMobileView] = useState(
    typeof window !== "undefined" && window.innerWidth < 768
  );
  const orderId = new URLSearchParams(window.location.search).get("order_id");

  const { user } = useUser();
  const { isSignedIn, getToken } = useAuth();

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Escape Fondy iframe if needed
  useEffect(() => {
    if (window.top !== window.self) {
      try {
        window.top.location.href = window.location.href;
      } catch {}
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
      try {
        bearer = await getToken();
      } catch {}
      await fetch(`${API_BASE_URL}/api/orders/link-my-orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
        },
        body: JSON.stringify(bearer ? { email } : { userId: user.id, email }),
      }).catch(() => {});
    })();
  }, [order, isSignedIn, user, getToken]);

  const currency = order?.currency || "USD";
  const formatMoney = useMemo(
    () => (n) =>
      new Intl.NumberFormat(undefined, { style: "currency", currency }).format(
        Number(n)
      ),
    [currency]
  );

  const paid = order?.status === "approved";
  const failed = order?.status === "declined" || order?.status === "expired";
  const createdAt = useMemo(() => {
    const d =
      (order?.paidAt && new Date(order.paidAt)) ||
      (order?.createdAt && new Date(order.createdAt)) ||
      null;
    return d ? d.toLocaleString() : "-";
  }, [order]);

  const eta = useMemo(
    () => (order ? computeEtaWindow(order, 6, 10) : null),
    [order]
  );

  // NEW: Build a human-friendly payment label like "Apple Pay VISA **** 1111"
  const paymentLabel = useMemo(() => {
    if (!order) return "-";
    const parts = [];
    if (order.paymentMethod) parts.push(order.paymentMethod); // Apple Pay / Google Pay / Card
    if (order.paymentMasked) parts.push(order.paymentMasked); // VISA **** 1111
    return parts.join(" ") || order.paymentSystem || "-";
  }, [order]);

  // Get dynamic styles based on mobile view
  const styles = getStyles(isMobileView);

  if (!orderId) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.container}>
          <div style={styles.card}>
            <div style={styles.header}>
              <div style={{ ...styles.iconWrapper, ...styles.iconWrapperWarn }}>
                <div style={{ ...styles.icon, ...styles.iconWarn }}>!</div>
              </div>
              <h1 style={styles.title}>We're missing your order</h1>
              <p style={styles.subtitle}>
                No <strong>order_id</strong> found in the URL.
              </p>
            </div>
            <div style={styles.actions}>
              <button
                style={{ ...styles.button, ...styles.buttonPrimary }}
                onClick={() => navigate("/products")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(16, 185, 129, 0.3)";
                  e.currentTarget.style.background = "#059669";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 8px rgba(16, 185, 129, 0.2)";
                  e.currentTarget.style.background = "#10b981";
                }}
              >
                Continue shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !order) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.container}>
          <div style={styles.card}>
            <div style={styles.header}>
              <div style={styles.loaderWrapper}>
                <div style={styles.loader}></div>
              </div>
              <h1 style={styles.title}>Finalizing your order…</h1>
              <p style={styles.subtitle}>
                Please wait while we confirm your payment.
              </p>
            </div>
            <div style={styles.skeleton}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <div style={styles.card}>
          {/* Header with status icon */}
          <div style={styles.header}>
            <div className="iconWwrapper">
              <div style={styles.iconWrapper}>
                {paid ? (
                  // Show the first product image as the success image
                  order.items &&
                  order.items.length > 0 &&
                  order.items[0].imageUrl ? (
                    <img
                      src={order.items[0].imageUrl}
                      alt={order.items[0].name || "Product"}
                      style={styles.successImg}
                    />
                  ) : (
                    // fallback if no image
                    <div style={{ ...styles.icon, ...styles.iconWarn }}>✓</div>
                  )
                ) : failed ? (
                  <div style={{ ...styles.icon, ...styles.iconError }}>
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <circle cx="12" cy="12" r="10" strokeWidth="2" />
                      <line
                        x1="15"
                        y1="9"
                        x2="9"
                        y2="15"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <line
                        x1="9"
                        y1="9"
                        x2="15"
                        y2="15"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                ) : (
                  <div style={{ ...styles.icon, ...styles.iconWarn }}>
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <circle cx="12" cy="12" r="10" strokeWidth="2" />
                      <path
                        d="M12 8v4m0 4h.01"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            <div style={styles.orderInfoWrapper}>
              <div className="img-wrapper-SUCA">
                <img
                  src="https://taliso.com.br/img/ui/sucesso.png"
                  alt=""
                  style={styles.successGif}
                />
              </div>
              <div className="togg">
                <div
                  style={{
                    ...styles.badge,
                    ...(paid
                      ? styles.badgeSuccess
                      : failed
                      ? styles.badgeError
                      : styles.badgeWarning),
                  }}
                >
                  {order.status}
                </div>
                <p style={styles.orderMeta}>
                  Order <strong>#{order.id}</strong>
                  <b></b>
                  {createdAt}
                </p>
              </div>
            </div>

            <h1 style={styles.title}>
              {paid
                ? "Payment Successful!"
                : failed
                ? "Payment Not Completed"
                : "Processing Your Payment…"}
            </h1>
            {/* ETA Section */}
            {eta && paid && (
              <div style={styles.etaCard}>
                <div style={styles.etaIcon}>
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                </div>
                <div style={styles.etaContent}>
                  <div style={styles.etaLabel}>Estimated Delivery</div>
                  <div style={styles.etaDate}>{eta.rangeText}</div>
                  <div style={styles.etaHelper}>
                    {eta.helperText} • We'll email you a tracking link once it
                    ships.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Purchase Summary */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Purchase Summary</h2>
            <div style={styles.grid}>
              <div style={styles.gridItem}>
                <span style={styles.label}>Amount</span>
                <span style={styles.value}>
                  {formatMoney(order.totals.total)}
                </span>
              </div>
              <div style={styles.gridItem}>
                <span style={styles.label}>Currency</span>
                <span style={styles.value}>{currency}</span>
              </div>
              <div style={styles.gridItem}>
                <span style={styles.label}>Email</span>
                <span style={styles.value}>{order.email || "-"}</span>
              </div>
              <div style={styles.gridItem}>
                <span style={styles.label}>Payment Method</span>
                <span style={styles.value}>{paymentLabel}</span>
              </div>
            </div>
          </section>

          {/* Delivery Address */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Delivery Address</h2>
            <div style={styles.addressCard}>
              <div style={styles.addressIcon}>
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <address style={styles.address}>
                <div style={styles.addressLine}>{order.fullName || "-"}</div>
                <div style={styles.addressLine}>
                  {order.line1}
                  {order.line2 ? `, ${order.line2}` : ""}
                </div>
                <div style={styles.addressLine}>
                  {order.city}
                  {order.region ? `, ${order.region}` : ""} {order.postalCode}
                </div>
                <div style={styles.addressLine}>{order.country}</div>
                {order.phone && (
                  <div style={styles.addressLine}>📞 {order.phone}</div>
                )}
              </address>
            </div>
          </section>

          {/* Order Items */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Order Items</h2>
            <div style={styles.itemsWrapper}>
              {(order.items || []).map((item, index) => (
                <div key={item.id || index} style={styles.item}>
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name || "Product"}
                      style={styles.itemImage}
                    />
                  ) : (
                    <div style={styles.itemPlaceholder}>
                      <svg
                        width="32"
                        height="32"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M4 5a2 2 0 012-2h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" />
                      </svg>
                    </div>
                  )}
                  <div style={styles.itemMain}>
                    <div style={styles.itemName}>{item.name}</div>
                    <div style={styles.itemMeta}>Quantity: {item.quantity}</div>
                  </div>
                  <div style={styles.itemPrice}>
                    {formatMoney((item.priceCents * item.quantity) / 100)}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Order Totals */}
          <section style={styles.section}>
            <div style={styles.totalsWrapper}>
              <div style={styles.totalRow}>
                <span style={styles.totalLabel}>Subtotal</span>
                <span style={styles.totalValue}>
                  {formatMoney(order.totals.subtotal)}
                </span>
              </div>
              <div style={styles.totalRow}>
                <span style={styles.totalLabel}>Shipping</span>
                <span
                  style={{
                    ...styles.totalValue,
                    color: order.totals.shipping === 0 ? "#10b981" : "#1a1a1a",
                  }}
                >
                  {order.totals.shipping === 0
                    ? "FREE"
                    : formatMoney(order.totals.shipping)}
                </span>
              </div>
              <div style={styles.totalRow}>
                <span style={styles.totalLabel}>Tax</span>
                <span style={styles.totalValue}>
                  {formatMoney(order.totals.tax)}
                </span>
              </div>
              <div style={{ ...styles.totalRow, ...styles.totalRowFinal }}>
                <span style={styles.totalLabelFinal}>Total</span>
                <span style={styles.totalValueFinal}>
                  {formatMoney(order.totals.total)}
                </span>
              </div>
            </div>
          </section>

          {/* Actions */}
          <div style={styles.actions}>
            <button
              style={{ ...styles.button, ...styles.buttonPrimary }}
              onClick={() => navigate("/profile")}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(16, 185, 129, 0.3)";
                e.currentTarget.style.background = "#059669";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 2px 8px rgba(16, 185, 129, 0.2)";
                e.currentTarget.style.background = "#10b981";
              }}
            >
              Track My Order
            </button>
            <button
              style={{ ...styles.button, ...styles.buttonSecondary }}
              onClick={() => navigate("/products")}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f9fafb";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.borderColor = "#9ca3af";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "white";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "#d1d5db";
              }}
            >
              Continue Shopping
            </button>
            <button
              style={{ ...styles.button, ...styles.buttonSecondary }}
              onClick={() => window.print()}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f9fafb";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.borderColor = "#9ca3af";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "white";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "#d1d5db";
              }}
            >
              Print Receipt
            </button>
          </div>

          {/* Security Badge */}
          <div style={styles.securityBadge}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              style={{ flexShrink: 0 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span style={styles.securityText}>
              Secure SSL Encrypted Transaction
            </span>
          </div>

          {/* Help Section */}
          <p style={styles.helpText}>
            Need help? Email{" "}
            <a href="mailto:peektrend.tech@gmail.com" style={styles.link}>
              peektrend.tech@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ==================== STYLES FUNCTION ==================== */
const getStyles = (isMobile) => ({
  wrapper: {
    minHeight: "100vh",
    background: "#f7f9fc",
    padding: isMobile ? "20px 16px" : "40px 20px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  container: {
    maxWidth: "800px",
    margin: "0 auto",
  },
  card: {
    background: "white",
    borderRadius: isMobile ? "16px" : "20px",
    boxShadow: "0 2px 20px rgba(0, 0, 0, 0.06)",
    overflow: "hidden",
    animation: "slideUp 0.6s ease-out",
    border: "1px solid #e5e7eb",
  },
  header: {
    textAlign: "center",
    padding: isMobile ? "40px 20px 30px" : "60px 40px 40px",
    background: "linear-gradient(180deg, #f9fafb 0%, #ffffff 100%)",
    borderBottom: "1px solid #e5e7eb",
  },
  iconWwrapper: {
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    background: "#000",
  },
  iconWrapper: {
    display: "inline-block",
    // marginBottom: "24px",
    position: "relative",
  },
  iconWrapperWarn: {
    opacity: 0.8,
  },
  successGif: {
    width: "45px",
    height: "45px",
    objectFit: "contain",
    margin: "0 auto",
    display: "block",
    // filter: "drop-shadow(0 4px 20px rgba(16, 185, 129, 0.2))",
  },
  successImg: {
    width: "175px",
  },
  icon: {
    width: isMobile ? "80px" : "100px",
    height: isMobile ? "80px" : "100px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
  },
  iconWarn: {
    background: "#fef3c7",
    color: "#d97706",
    boxShadow: "0 4px 20px rgba(245, 158, 11, 0.15)",
    border: "3px solid #fbbf24",
  },
  iconError: {
    background: "#fee2e2",
    color: "#dc2626",
    boxShadow: "0 4px 20px rgba(239, 68, 68, 0.15)",
    border: "3px solid #f87171",
  },
  title: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1a1a1a",
    margin: "0 0 8px",
    lineHeight: "1.2",
    textAlign: "start",
  },
  subtitle: {
    fontSize: isMobile ? "14px" : "16px",
    color: "#666",
    margin: "0",
    lineHeight: "1.6",
    padding: isMobile ? "0 10px" : "0",
  },
  orderInfoWrapper: {
    padding: "9px",
    alignItems: "center",
    background: "rgb(246 246 246);",
    borderRadius: "7px",
    marginTop: "20px",
    marginBottom: "20px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "spaceBetween",
    gap: "12px",
  },
  badge: {
    display: "inline-block",
    padding: "3px 16px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  badgeSuccess: {
    background: "#d1fae5",
    color: "#065f46",
    border: "2px solid #10b981",
    boxShadow: "none",
  },
  badgeError: {
    background: "#fee2e2",
    color: "#991b1b",
    border: "2px solid #ef4444",
    boxShadow: "none",
  },
  badgeWarning: {
    background: "#fef3c7",
    color: "#92400e",
    border: "2px solid #f59e0b",
    boxShadow: "none",
  },
  orderMeta: {
    fontSize: isMobile ? "12px" : "14px",
    color: "#888",
    // padding: isMobile ? "0 10px" : "0",
    textAlign: "start",
    marginTop: "5px",
  },
  etaCard: {
    marginTop: "10px",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    borderRadius: isMobile ? "12px" : "16px",
    padding: isMobile ? "20px" : "24px",
    color: "white",
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    gap: isMobile ? "12px" : "16px",
    alignItems: isMobile ? "center" : "flex-start",
    boxShadow: "0 4px 20px rgba(16, 185, 129, 0.2)",
    textAlign: isMobile ? "center" : "left",
    border: "none",
  },
  etaIcon: {
    width: isMobile ? "40px" : "48px",
    height: isMobile ? "40px" : "48px",
    background: "rgba(255, 255, 255, 0.25)",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  etaContent: {
    flex: 1,
  },
  etaLabel: {
    fontSize: isMobile ? "12px" : "14px",
    opacity: 0.9,
    marginBottom: "6px",
    fontWeight: "500",
  },
  etaDate: {
    fontSize: isMobile ? "20px" : "24px",
    fontWeight: "700",
    marginBottom: "8px",
    letterSpacing: "-0.5px",
  },
  etaHelper: {
    fontSize: isMobile ? "12px" : "14px",
    opacity: 0.85,
    lineHeight: "1.5",
  },
  section: {
    padding: isMobile ? "24px 20px" : "32px 40px",
    borderBottom: "1px solid #e5e7eb",
  },
  sectionTitle: {
    fontSize: isMobile ? "17px" : "19px",
    fontWeight: "600",
    color: "#111827",
    margin: isMobile ? "0 0 20px" : "0 0 24px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    letterSpacing: "-0.02em",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: isMobile
      ? "1fr"
      : "repeat(auto-fit, minmax(200px, 1fr))",
    gap: isMobile ? "16px" : "20px",
  },
  gridItem: {
    display: "flex",
    flexDirection: "column",
    gap: isMobile ? "4px" : "6px",
    padding: isMobile ? "14px" : "0",
    background: isMobile ? "#f9fafb" : "transparent",
    borderRadius: isMobile ? "10px" : "0",
    border: isMobile ? "1px solid #e5e7eb" : "none",
  },
  label: {
    fontSize: isMobile ? "11px" : "12px",
    color: "#6b7280",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  value: {
    fontSize: isMobile ? "14px" : "15px",
    color: "#111827",
    fontWeight: "600",
    wordBreak: "break-word",
  },
  addressCard: {
    background: "#f9fafb",
    borderRadius: isMobile ? "12px" : "14px",
    padding: isMobile ? "20px" : "24px",
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    gap: isMobile ? "12px" : "16px",
    border: "1px solid #e5e7eb",
  },
  addressIcon: {
    width: isMobile ? "36px" : "40px",
    height: isMobile ? "36px" : "40px",
    background: "#10b981",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    flexShrink: 0,
    margin: isMobile ? "0 auto" : "0",
  },
  address: {
    fontStyle: "normal",
    flex: 1,
    textAlign: isMobile ? "center" : "left",
  },
  addressLine: {
    fontSize: isMobile ? "14px" : "15px",
    color: "#374151",
    lineHeight: "1.8",
    margin: "0",
  },
  itemsWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: isMobile ? "12px" : "16px",
  },
  item: {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    gap: isMobile ? "12px" : "16px",
    padding: isMobile ? "16px" : "16px",
    background: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    transition: "all 0.3s ease",
    alignItems: isMobile ? "stretch" : "center",
  },
  itemImage: {
    borderRadius: "8px",
    objectFit: "cover",
    flexShrink: 0,
    border: "1px solid #e5e7eb",
  },
  itemPlaceholder: {
    width: isMobile ? "100%" : "80px",
    height: isMobile ? "200px" : "80px",
    borderRadius: "8px",
    background: "#f3f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#9ca3af",
    flexShrink: 0,
    border: "1px solid #e5e7eb",
  },
  itemMain: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "6px",
  },
  itemName: {
    fontSize: isMobile ? "15px" : "16px",
    fontWeight: "600",
    color: "#111827",
    lineHeight: "1.4",
  },
  itemMeta: {
    fontSize: isMobile ? "13px" : "14px",
    color: "#6b7280",
  },
  itemPrice: {
    fontSize: isMobile ? "16px" : "17px",
    fontWeight: "700",
    color: "#111827",
    display: "flex",
    alignItems: "center",
    justifyContent: isMobile ? "flex-start" : "center",
  },
  totalsWrapper: {
    background: "#f9fafb",
    borderRadius: isMobile ? "12px" : "14px",
    padding: isMobile ? "20px" : "24px",
    border: "1px solid #e5e7eb",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: isMobile ? "10px 0" : "12px 0",
    borderBottom: "1px solid #e5e7eb",
  },
  totalRowFinal: {
    marginTop: isMobile ? "10px" : "12px",
    paddingTop: isMobile ? "16px" : "20px",
    borderTop: "2px solid #10b981",
    borderBottom: "none",
  },
  totalLabel: {
    fontSize: isMobile ? "14px" : "15px",
    color: "#6b7280",
    fontWeight: "500",
  },
  totalValue: {
    fontSize: isMobile ? "14px" : "15px",
    color: "#111827",
    fontWeight: "600",
  },
  totalLabelFinal: {
    fontSize: isMobile ? "16px" : "17px",
    color: "#111827",
    fontWeight: "700",
  },
  totalValueFinal: {
    fontSize: isMobile ? "20px" : "22px",
    color: "#10b981",
    fontWeight: "700",
  },
  actions: {
    padding: isMobile ? "24px 20px" : "40px",
    display: "flex",
    flexDirection: "column",
    gap: isMobile ? "10px" : "12px",
  },
  button: {
    padding: isMobile ? "14px 24px" : "16px 32px",
    borderRadius: "12px",
    fontSize: isMobile ? "15px" : "16px",
    fontWeight: "600",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontFamily: "inherit",
    WebkitTapHighlightColor: "transparent",
    touchAction: "manipulation",
    minHeight: isMobile ? "48px" : "auto",
  },
  buttonPrimary: {
    background: "#10b981",
    color: "white",
    boxShadow: "0 2px 8px rgba(16, 185, 129, 0.2)",
  },
  buttonSecondary: {
    background: "white",
    color: "#374151",
    border: "1px solid #d1d5db",
  },
  securityBadge: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: isMobile ? "12px 20px" : "12px 40px",
    color: "#10b981",
    borderTop: "1px solid #e5e7eb",
    background: "#f0fdf4",
  },
  securityText: {
    fontSize: isMobile ? "12px" : "13px",
    fontWeight: "500",
  },
  helpText: {
    textAlign: "center",
    fontSize: isMobile ? "13px" : "14px",
    color: "#6b7280",
    padding: isMobile ? "20px 20px 30px" : "20px 40px 40px",
    margin: "0",
    lineHeight: "1.6",
  },
  link: {
    color: "#10b981",
    textDecoration: "none",
    fontWeight: "600",
    wordBreak: "break-word",
  },
  loaderWrapper: {
    display: "flex",
    justifyContent: "center",
    marginBottom: isMobile ? "20px" : "24px",
  },
  loader: {
    width: isMobile ? "50px" : "60px",
    height: isMobile ? "50px" : "60px",
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #10b981",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  skeleton: {
    margin: isMobile ? "20px" : "40px",
    height: isMobile ? "150px" : "200px",
    background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
    borderRadius: "12px",
  },
});

// Add keyframe animations and responsive styles via a style tag
if (typeof document !== "undefined") {
  const existingStyle = document.getElementById("success-page-styles");
  if (!existingStyle) {
    const styleSheet = document.createElement("style");
    styleSheet.id = "success-page-styles";
    styleSheet.textContent = `
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes pulse {
        0%, 100% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 0.2;
        }
        50% {
          transform: translate(-50%, -50%) scale(1.2);
          opacity: 0.05;
        }
      }
      @keyframes iconPop {
        0% {
          transform: scale(0);
        }
        50% {
          transform: scale(1.1);
        }
        100% {
          transform: scale(1);
        }
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
      @keyframes shimmer {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }
      
      /* Mobile optimizations */
      @media (max-width: 767px) {
        * {
          -webkit-tap-highlight-color: transparent;
        }
        
        body {
          overflow-x: hidden;
        }
      }
      
      /* Print styles */
      @media print {
        body {
          background: white !important;
        }
        
        button {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(styleSheet);
  }
}
