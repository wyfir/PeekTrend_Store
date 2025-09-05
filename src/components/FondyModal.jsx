// src/components/FondyModal.jsx
import { useEffect, useRef } from "react";

export default function FondyModal({ url, onCancel, onSuccess }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!url) return;
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    html.classList.add("no-scroll");
    body.classList.add("no-scroll");
    return () => {
      html.classList.remove("no-scroll");
      body.classList.remove("no-scroll");
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, [url]);

  const handleLoad = () => {
    try {
      const loc = iframeRef.current?.contentWindow?.location;
      if (!loc) return;
      const sameOrigin = loc.origin === window.location.origin;
      const isSuccess = sameOrigin && loc.pathname.startsWith("/success");
      if (isSuccess) {
        onSuccess?.();                     // ✅ do NOT mark abandoned here
        window.top.location.href = loc.href;
      }
    } catch {
      // still on pay.fondy.eu; ignore
    }
  };

  if (!url) return null;

  return (
    <div className="pure-modal-overlay" role="dialog" aria-modal="true" onClick={() => onCancel?.()}>
      <div className="pure-modal-content" onClick={(e) => e.stopPropagation()} style={{ overflow: "hidden" }}>
        <button className="pure-modal-close" aria-label="Close checkout" onClick={() => onCancel?.()}>✕</button>
        <iframe
          ref={iframeRef}
          key={url}
          src={url}
          title="Fondy Checkout"
          width="100%"
          height="700"
          frameBorder="0"
          allow="payment"
          onLoad={handleLoad}
          style={{ display: "block", border: "none" }}
        />
      </div>
    </div>
  );
}
