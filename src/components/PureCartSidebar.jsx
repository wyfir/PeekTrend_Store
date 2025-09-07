// src/components/PureCartSidebar.jsx
import "../styles/styles-pure-components.css";
import { useState, useEffect, useCallback, useRef } from "react";

export function PureCartSidebar({
  isOpen,
  onClose,            // parent sets isCartOpen(false)
  items,
  total,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,         // parent callback to run AFTER the panel fully closes (navigate('/checkout'))
}) {
  const [isClosing, setIsClosing] = useState(false);
  const shouldRender = isOpen || isClosing;

  // holds a function to run after close animation completes
  const afterCloseRef = useRef(null);

  useEffect(() => {
    if (isOpen) setIsClosing(false);
  }, [isOpen]);

  const startClosing = useCallback(() => {
    if (!isClosing) setIsClosing(true);
  }, [isClosing]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSidebarAnimationEnd = (e) => {
    if (isClosing && e.currentTarget === e.target) {
      onClose?.(); // parent unmounts the sidebar (isCartOpen=false)

      // run any pending "after close" action (e.g., navigate to /checkout)
      const fn = afterCloseRef.current;
      afterCloseRef.current = null;
      if (fn) fn();

      // always scroll to top after close
      scrollToTop();

      setIsClosing(false);
    }
  };

  const handleCheckoutClick = () => {
    if (!items?.length) return;
    // schedule navigating (or any action) AFTER close completes
    afterCloseRef.current = () => {
      onCheckout?.(items);
      // ensure scroll also runs on checkout flow
      scrollToTop();
    };
    startClosing();
  };

  if (!shouldRender) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`pure-sidebar-overlay ${isClosing ? "closing" : ""}`}
        onClick={startClosing}
      />
      {/* Sidebar panel */}
      <div
        className={`pure-sidebar ${isClosing ? "closing" : ""}`}
        onAnimationEnd={handleSidebarAnimationEnd}
      >
        <div className="pure-sidebar-header">
          <h2 className="pure-sidebar-title">Shopping Cart</h2>
          <button onClick={startClosing} className="pure-sidebar-close" aria-label="Close cart">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="pure-sidebar-content">
          {items.length === 0 ? (
            <div className="pure-empty-cart">
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div>
              {items.map((item, index) => (
                <div
                  key={`${item.id}-${item.selectedColor}-${item.selectedSize}-${index}`}
                  className="pure-cart-item"
                >
                  <img src={item.image} alt={item.name} className="pure-cart-item-image" />
                  <div className="pure-cart-item-details">
                    <h3 className="pure-cart-item-name">{item.name}</h3>
                    {(item.selectedColor || item.selectedSize) && (
                      <p className="pure-cart-item-variant">
                        {item.selectedColor && `Color: ${item.selectedColor}`}
                        {item.selectedColor && item.selectedSize && " • "}
                        {item.selectedSize && `Size: ${item.selectedSize}`}
                      </p>
                    )}
                    <p className="pure-cart-item-price">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="pure-cart-item-controls">
                    <button
                      onClick={() => onRemoveItem(item.id, item.selectedColor, item.selectedSize)}
                      className="pure-cart-remove"
                    >
                      Remove
                    </button>
                    <div className="pure-cart-quantity">
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity - 1, item.selectedColor, item.selectedSize)
                        }
                        className="pure-cart-quantity-button"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          onUpdateQuantity(
                            item.id,
                            parseInt(e.target.value) || 1,
                            item.selectedColor,
                            item.selectedSize
                          )
                        }
                        className="pure-cart-quantity-input"
                        min="1"
                      />
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity + 1, item.selectedColor, item.selectedSize)
                        }
                        className="pure-cart-quantity-button"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="pure-sidebar-footer">
            <div className="pure-cart-total">
              <span>Total: ${total.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckoutClick}
              className="pure-checkout-button"
              disabled={isClosing}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
