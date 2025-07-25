import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/styles-pure-components.css";

export function PureProductModal({ product, onClose, onAddToCart }) {
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "");
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={
          i < Math.floor(rating) ? "pure-star" : "pure-star pure-star-empty"
        }
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const handleAddToCart = () => {
    onAddToCart(quantity, selectedColor);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="pure-modal-overlay" onClick={onClose}>
      <div className="pure-modal-content" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="pure-modal-close">
          ×
        </button>

        <div style={{ padding: "2rem" }}>
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: "100%",
              height: "300px",
              objectFit: "cover",
              borderRadius: "0.75rem",
              marginBottom: "1.5rem",
              backgroundColor: "#f8f9fa",
            }}
          />

          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              color: "#030213",
              marginBottom: "1rem",
              lineHeight: "1.3",
            }}
          >
            {product.name}
          </h2>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <span
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                color: "#030213",
              }}
            >
              ${product.price}
            </span>
            {product.originalPrice && (
              <span
                style={{
                  fontSize: "1.125rem",
                  color: "#717182",
                  textDecoration: "line-through",
                }}
              >
                ${product.originalPrice}
              </span>
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <div style={{ display: "flex", gap: "0.25rem" }}>
              {renderStars(product.rating)}
            </div>
            <span style={{ color: "#717182", fontSize: "0.875rem" }}>
              ({product.reviews} reviews)
            </span>
          </div>

          <p
            style={{
              color: "#717182",
              lineHeight: "1.6",
              marginBottom: "1.5rem",
            }}
          >
            {product.description.length > 200
              ? `${product.description.slice(0, 200)}...`
              : product.description}
          </p>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div
              className="pure-color-selector"
              style={{ marginBottom: "1.5rem" }}
            >
              <label className="pure-color-label">Color: {selectedColor}</label>
              <div className="pure-color-options">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`pure-color-option ${
                      selectedColor === color ? "selected" : ""
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selection */}
          <div
            className="pure-quantity-selector"
            style={{ marginBottom: "1.5rem" }}
          >
            <label className="pure-quantity-label">Quantity</label>
            <div className="pure-quantity-controls">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                className="pure-quantity-button"
              >
                −
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) =>
                  handleQuantityChange(parseInt(e.target.value) || 1)
                }
                className="pure-quantity-input"
                min="1"
              />
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="pure-quantity-button"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              onClose(); // ✅ Close the modal first
              navigate(`/product-detail/${product.id}`); // ✅ Then navigate
            }}
            className="pure-add-to-cart"
          >
            View Product
          </button>
        </div>
      </div>
    </div>
  );
}
