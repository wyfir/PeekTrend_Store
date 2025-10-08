import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient"; // ✅ import client
import "../styles/styles-pure-components.css";

export function DropCountdown({
  quantity = 1,
  price = 0,
  showPrice = true,
  compact = false,
}) {
  const getDropTime = () => {
    const now = new Date();
    return new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000); // 2 days
  };

  const [dropTime] = useState(getDropTime());
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [notified, setNotified] = useState(false);
  const [email, setEmail] = useState(""); // ✅ email input
  const [error, setError] = useState("");

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const distance = dropTime.getTime() - now;

      if (distance < 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [dropTime]);

  // ✅ Save email to Supabase
  const handleNotifyMe = async () => {
    setError("");

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email.");
      return;
    }

    const { error } = await supabase
      .from("drop_notifications")
      .insert([{ email, drop_time: dropTime }]);

    if (error) {
      console.error(error);
      setError("Something went wrong. Try again.");
      return;
    }

    setNotified(true);
    setTimeout(() => setNotified(false), 3000);
    setEmail("");
  };

  if (compact) {
    return (
      <div className="drop-countdown-compact">
        <div className="drop-badge">
          <svg
            className="drop-badge-icon"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
          <span>
            Drops in {timeRemaining.days}d {timeRemaining.hours}h{" "}
            {timeRemaining.minutes}m
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="drop-countdown-container">
      {/* Header */}
      <div className="drop-countdown-header">
        <div className="drop-lightning-icon">⚡</div>
        <h3 className="drop-countdown-title">EXCLUSIVE DROP</h3>
        <div className="drop-lightning-icon">⚡</div>
      </div>

      <p className="drop-countdown-subtitle">
        Limited quantities available. Be ready when the timer hits zero!
      </p>

      {/* Timer */}
      <div className="drop-timer-grid">
        <div className="drop-timer-unit">
          <div className="drop-timer-value">
            {String(timeRemaining.days).padStart(2, "0")}
          </div>
          <div className="drop-timer-label">Days</div>
        </div>
        <div className="drop-timer-separator">:</div>
        <div className="drop-timer-unit">
          <div className="drop-timer-value">
            {String(timeRemaining.hours).padStart(2, "0")}
          </div>
          <div className="drop-timer-label">Hours</div>
        </div>
        <div className="drop-timer-separator">:</div>
        <div className="drop-timer-unit">
          <div className="drop-timer-value">
            {String(timeRemaining.minutes).padStart(2, "0")}
          </div>
          <div className="drop-timer-label">Minutes</div>
        </div>
        <div className="drop-timer-separator">:</div>
        <div className="drop-timer-unit">
          <div className="drop-timer-value">
            {String(timeRemaining.seconds).padStart(2, "0")}
          </div>
          <div className="drop-timer-label">Seconds</div>
        </div>
      </div>

      {/* ✅ Email input */}
      <input
      id="drop-email-input"
        type="email"
        className="drop-email-input"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {error && <p className="drop-error">{error}</p>}

      {/* Notify Button */}
      <button
        onClick={handleNotifyMe}
        className={`drop-notify-button ${notified ? "notified" : ""}`}
        disabled={notified}
      >
        {notified ? (
          <>
            <svg
              className="drop-check-icon"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            You'll Be Notified!
          </>
        ) : (
          <>
            <svg
              className="drop-bell-icon"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            NOTIFY ME WHEN IT DROPS
            {showPrice && price > 0 && (
              <span className="drop-notify-price">
                {" "}
                - ${(price * quantity).toFixed(2)}
              </span>
            )}
          </>
        )}
      </button>

      <div className="drop-features">
        {" "}
        <div className="drop-feature-item">
          {" "}
          <svg
            className="drop-feature-icon"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            {" "}
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />{" "}
          </svg>{" "}
          <span>First come, first served</span>{" "}
        </div>{" "}
        <div className="drop-feature-item">
          {" "}
          <svg
            className="drop-feature-icon"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            {" "}
            <path
              fillRule="evenodd"
              d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
              clipRule="evenodd"
            />{" "}
          </svg>{" "}
          <span>Limited stock available</span>{" "}
        </div>{" "}
        <div className="drop-feature-item">
          {" "}
          <svg
            className="drop-feature-icon"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            {" "}
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clipRule="evenodd"
            />{" "}
          </svg>{" "}
          <span>Special launch pricing</span>{" "}
        </div>{" "}
      </div>

      <div className="drop-urgency-banner">
        <div className="drop-urgency-pulse"></div>
        <p className="drop-urgency-text">
          🔥 Over 112 people are waiting for this drop!
        </p>
      </div>
    </div>
  );
}
