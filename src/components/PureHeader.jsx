// PureHeader.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import "../styles/styles-pure-components.css";

export function PureHeader({ cartItemCount, onCartClick }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const accountRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isSignedIn } = useUser();

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsAccountOpen(false);
  }, [location.pathname]);

  // Helper: is the click inside any Clerk portal element?
  const isClerkClick = (el) =>
    !!el?.closest?.(
      ".cl-root, .cl-userButton-root, [data-clerk], [data-cl-component]"
    );

  // Close account dropdown on outside click, but IGNORE Clerk UI clicks
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isClerkClick(e.target)) return; // let Clerk popover handle it
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setIsAccountOpen(false);
      }
    };
    // capture phase helps catch it before other handlers
    document.addEventListener("mousedown", handleClickOutside, true);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside, true);
  }, []);

  return (
    <>
      <div className="homepage-topbar">
        <div className="homepage-topbar-content">
          ✉ Support:{" "}
          <a style={{ textDecoration: "none" }} href="mailto:support@peektrend.com">
            support@peektrend.com
          </a>
          <span className="separator">|</span>✅ 30-Day Return Guarantee
        </div>
      </div>

      <header className="homepage-header">
        <div className="homepage-header-container">
          <div onClick={() => navigate("/")} className="homepage-logo">
            <img src="/peektrend_logo.svg" alt="Logo" style={{ height: "40px" }} />
          </div>

          <nav className="homepage-nav">
            {["/", "/products", "/reviews"].map((path, i) => {
              const names = ["Home", "Products", "Reviews"];
              const active =
                location.pathname === path ||
                (path === "/products" && location.pathname.startsWith("/products"));
              return (
                <button
                  key={path}
                  className={`homepage-nav-link ${active ? "active" : ""}`}
                  onClick={() => navigate(path)}
                >
                  {names[i]}
                </button>
              );
            })}
          </nav>

          <div className="homepage-header-right">
            <button onClick={onCartClick} className="homepage-cart-button">
              🛒
              {cartItemCount > 0 && (
                <span className="homepage-cart-badge">{cartItemCount}</span>
              )}
            </button>

            <div className="account-dropdown-wrapper" ref={accountRef}>
              <button
                className="homepage-account-button"
                onClick={() => setIsAccountOpen((prev) => !prev)}
              >
                Account
              </button>

              {isAccountOpen && (
                <div className="account-dropdown">
                  <SignedOut>
                    <SignInButton mode="modal">
                      <button className="account-action">Sign In</button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="account-action">Sign Up</button>
                    </SignUpButton>
                  </SignedOut>

                  <SignedIn>
                    {/* Make sure sign-out lands somewhere sensible */}
                    <UserButton afterSignOutUrl="/" />

                    <button
                      className="account-action"
                      onClick={() => {
                        navigate("/profile");
                        setIsAccountOpen(false);
                      }}
                    >
                      View Orders
                    </button>
                  </SignedIn>
                </div>
              )}
            </div>

            <button
              className="homepage-mobile-menu"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              ☰
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div
            className="mobile-menu-backdrop"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
              {["/", "/products", "/reviews"].map((path, i) => {
                const names = ["Home", "Products", "Reviews"];
                const active =
                  location.pathname === path ||
                  (path === "/products" && location.pathname.startsWith("/products"));
                return (
                  <button
                    key={path}
                    onClick={() => {
                      navigate(path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`homepage-nav-link ${active ? "active" : ""}`}
                  >
                    {names[i]}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
