import { useMemo } from "react";

/**
 * DeliveryEtaBadge
 * Props:
 * - startOffsetDays: number (default 5)
 * - endOffsetDays:   number (default 9)
 * - label:           string  (default "Estimated delivery")
 * - className:       string  (optional)
 */
export default function DeliveryEtaBadge({
  startOffsetDays = 5,
  endOffsetDays = 9,
  label = "Estimated delivery",
  className = "",
}) {
  const text = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getTime() + startOffsetDays * 86400000);
    const end = new Date(now.getTime() + endOffsetDays * 86400000);

    const sameMonth =
      start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();

    const startDay = start.getDate();
    const endDay = end.getDate();

    const startMonthLong = start.toLocaleString(undefined, { month: "long" });
    const startMonthShort = start.toLocaleString(undefined, { month: "short" });
    const endMonthShort = end.toLocaleString(undefined, { month: "short" });

    return sameMonth
      ? `${startDay}–${endDay} ${startMonthLong}`
      : `${startDay} ${startMonthShort} – ${endDay} ${endMonthShort}`;
  }, [startOffsetDays, endOffsetDays]);

  return (
    <div className={`eta-badge ${className}`}>
      <span className="eta-icon" aria-hidden>
        {/* Minimal truck icon */}
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path
            d="M3 6h11a1 1 0 011 1v6h2.5a2 2 0 011.8 1.1l1.6 3.2A1 1 0 0119 19h-1a3 3 0 11-6 0H9a3 3 0 11-6 0H2a1 1 0 01-1-1V7a1 1 0 011-1zm1 2v6h9V8H4zm13 6h1.5a1 1 0 01.9.55L20 17h-3v-3zM7 20a2 2 0 100-4 2 2 0 000 4zm8 0a2 2 0 100-4 2 2 0 000 4z"
            fill="currentColor"
          />
        </svg>
      </span>
      <span className="eta-text">
        <b>{label}:</b> {text}
      </span>
    </div>
  );
}
