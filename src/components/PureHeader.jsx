import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/styles-pure-components.css";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";

export function PureHeader({ cartItemCount, onCartClick }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    setIsMobileMenuOpen(false); // Close on route change
  }, [location.pathname]);
  return (
    <header className="pure-header">
      <div className="pure-header-container">
        <div onClick={() => navigate("/")} className="pure-logo">
          <img src="/peektrend_logo.svg" alt="" />
        </div>

        <nav className="pure-nav">
          <button
            className={`pure-nav-link ${
              location.pathname === "/" ? "active" : ""
            }`}
            onClick={() => navigate("/")}
          >
            Home
          </button>
          <button
            className={`pure-nav-link ${
              location.pathname.startsWith("/products") ? "active" : ""
            }`}
            onClick={() => navigate("/products")}
          >
            Products
          </button>
          <button
            className={`pure-nav-link ${
              location.pathname === "/reviews" ? "active" : ""
            }`}
            onClick={() => navigate("/reviews")}
          >
            Reviews
          </button>
        </nav>

        <button onClick={onCartClick} className="pure-cart-button">
          🛒
          {cartItemCount > 0 && (
            <span className="pure-cart-badge">{cartItemCount}</span>
          )}
        </button>

        <SignedOut>
          <SignInButton mode="modal" />
          <SignUpButton mode="modal" />
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
        <button
          className="pure-mobile-menu"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          ☰
        </button>
      </div>

      {isMobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 100,
          }}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              width: "250px",
              height: "100vh",
              backgroundColor: "white",
              padding: "2rem 1rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                navigate("/");
                setIsMobileMenuOpen(false);
              }}
              className={`pure-nav-link ${
                location.pathname === "/" ? "active" : ""
              }`}
            >
              Home
            </button>
            <button
              onClick={() => {
                navigate("/products");
                setIsMobileMenuOpen(false);
              }}
              className={`pure-nav-link ${
                location.pathname.startsWith("/products") ? "active" : ""
              }`}
            >
              Products
            </button>
            <button
              onClick={() => {
                navigate("/reviews");
                setIsMobileMenuOpen(false);
              }}
              className={`pure-nav-link ${
                location.pathname === "/reviews" ? "active" : ""
              }`}
            >
              Reviews
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
