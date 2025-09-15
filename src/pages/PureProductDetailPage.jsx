import { useState, useMemo, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import FondyModal from "../components/FondyModal";
import { useFondyCheckout } from "../hooks/useFondyCheckout";
import "../styles/styles-pure-components.css";
import DeliveryEtaBadge from "../components/DeliveryEtaBadge";

export function PureProductDetailPage({
  product,
  onBack,
  onAddToCart,
  setIsCartOpen,
}) {
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { user } = useUser();

  const { fondyUrl, openFondy, closeFondy, loading } = useFondyCheckout({
    getUserMeta: () => ({
      clerkId: user?.id,
      clerkEmail: user?.emailAddresses?.[0]?.emailAddress,
    }),
  });

  const productImages = product.images || [];

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

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    onAddToCart(quantity, selectedColor);
    setIsCartOpen(true); // Open sidebar after adding
  };

  // inside PureProductDetailPage component

  // ---------------- SWIPE/DRAG LOGIC ----------------
  const startXRef = useRef(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [direction, setDirection] = useState(null);

  const goNext = () => {
    setDirection("left");
    setSelectedImageIndex((prev) =>
      prev === productImages.length - 1 ? 0 : prev + 1
    );
  };

  const goPrev = () => {
    setDirection("right");
    setSelectedImageIndex((prev) =>
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  };

  const handleTransitionEnd = () => {
    setDragOffset(0);
    setDirection(null);
  };

  // Touch
  const handleTouchStart = (e) => {
    startXRef.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    setDragOffset(currentX - startXRef.current);
  };

  const handleTouchEnd = () => {
    finishDrag();
  };

  // Mouse
  const handleMouseDown = (e) => {
    startXRef.current = e.clientX;
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    setDragOffset(currentX - startXRef.current);
  };

  const handleMouseUp = () => {
    finishDrag();
  };

  const finishDrag = () => {
    if (Math.abs(dragOffset) > 80) {
      if (dragOffset < 0) {
        goNext();
      } else {
        goPrev();
      }
    }
    setIsDragging(false);
    setDragOffset(0);
  };
  // ---------------------------------------------------

  return (
    <div className="pure-component pure-product-detail">
      {/* Reusable Fondy modal */}
      <FondyModal url={fondyUrl} onClose={closeFondy} />

      <div className="pure-product-detail-container">
        <button onClick={onBack} className="pure-back-button">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Products
        </button>

        <div className="pure-product-detail-grid">
          {/* Product Gallery */}
          <div className="pure-product-gallery">
            {/* Main image with swipe/drag */}
            <div
              className="pure-main-image-wrapper"
              style={{
    overflow: "hidden",
    width: "100%",
    maxHeight: "400px",  // <-- fixed maximum height
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }}
            >
              <div
                style={{
                  display: "flex",
                  transition: !isDragging ? "transform 0.3s ease" : "none",
                  transform: `translateX(${dragOffset}px)`,
                }}
                onTransitionEnd={handleTransitionEnd}
                onMouseMove={handleMouseMove}
                onMouseLeave={isDragging ? handleMouseUp : undefined}
              >
                <img
                  src={productImages[selectedImageIndex]}
                  alt={product.name}
                  className="pure-main-image"
                  style={{ flex: "0 0 100%" ,
                    maxHeight: "100%",
                  }}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                />
              </div>
            </div>

            {/* Thumbnail Grid */}
            <div className="pure-thumbnail-grid">
              {productImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} view ${index + 1}`}
                  className={`pure-thumbnail ${
                    selectedImageIndex === index ? "active" : ""
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="pure-product-info">
            <h1 className="pure-product-detail-title">{product.name}</h1>

            <div className="pure-product-detail-price">
              <span className="pure-product-detail-current-price">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="pure-product-detail-original-price">
                  ${product.originalPrice}
                </span>
              )}

              {product.for == "Hard Gaming" && (
                <div className="for_type">
                  <div className="inside_type">
                    <img
                      style={{ width: "23px" }}
                      src="https://cdn-icons-png.flaticon.com/512/7887/7887081.png "
                      alt=""
                    />
                    <p>Hard Gaming</p>
                  </div>
                </div>
              )}
              {product.for == "Games" && (
                <div className="for_type">
                  <div className="inside_type games">
                    <img
                      style={{ width: "23px" }}
                      src="https://cdn-icons-png.flaticon.com/512/7887/7887081.png "
                      alt=""
                    />
                    <p>Games</p>
                  </div>
                </div>
              )}
              {product.for === "Hybrid" && (
                <div className="for_type hybrid">
                  <div className="inside_type">
                    <img
                      style={{ width: "17px" }}
                      src="https://cdn-icons-png.flaticon.com/512/1153/1153269.png"
                      alt="Hybrid icon"
                    />
                    <p>Hybrid Use</p>
                  </div>
                </div>
              )}
              {product.for === "Streaming" && (
                <div className="for_type streaming">
                  <div className="inside_type streaming">
                    <img
                      style={{ width: "22px" }}
                      src="https://img.icons8.com/color/512/youtube-live.png"
                      alt="Streaming icon"
                    />
                    <p>Streaming</p>
                  </div>
                </div>
              )}
            </div>
            <DeliveryEtaBadge startOffsetDays={5} endOffsetDays={9} />
            <div className="pure-product-detail-rating">
              <div className="pure-product-detail-stars">
                {renderStars(product.rating)}
              </div>
              <span className="pure-product-detail-reviews">
                ({product.reviews} reviews)
              </span>
            </div>

            {product.stock !== undefined && (
              <p className="pure-product-stock">
                {product.stock > 0 ? (
                  <span>{product.stock} left in stock</span>
                ) : (
                  <span className="pure-out-of-stock">Out of Stock</span>
                )}
              </p>
            )}

            <p className="pure-product-detail-description">
              {product.description}
            </p>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="pure-color-selector">
                <label className="pure-color-label">
                  Color: {selectedColor}
                </label>
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

            {/* Quantity Selector */}
            <div className="pure-quantity-selector">
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

            {/* Add to Cart */}
            <button onClick={handleAddToCart} className="pure-add-to-cart">
              ADD TO CART - ${(product.price * quantity).toFixed(2)}
            </button>

            {/* Features */}
            {product.features && (
              <div className="pure-features-section">
                <h3 className="pure-features-title">Key Features</h3>
                <ul className="pure-features-list">
                  {product.features.map((feature, index) => (
                    <li key={index} className="pure-feature-item">
                      <svg
                        className="pure-feature-icon"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="pure-feature-text">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specifications */}
            {product.specs && (
              <div className="pure-specs-section">
                <h3 className="pure-specs-title">Specifications</h3>
                <div className="pure-specs-grid">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="pure-spec-item">
                      <span className="pure-spec-label">{key}</span>
                      <span className="pure-spec-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {product.feedbacks && product.feedbacks.length > 0 && (
          <div className="pure-feedback-section">
            <h3 className="pure-feedback-title">Customer Feedback</h3>
            <div className="pure-feedback-list">
              {product.feedbacks.map((feedback, index) => (
                <div key={index} className="pure-feedback-card">
                  <div className="pure-feedback-header">
                    <img
                      src={
                        feedback.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          feedback.user
                        )}`
                      }
                      alt={feedback.user}
                      className="pure-feedback-avatar"
                    />
                    <div className="pure-feedback-userblock">
                      <div className="pure-feedback-userline">
                        <p className="pure-feedback-username">
                          {feedback.user}
                        </p>
                        <span className="pure-feedback-verified">
                          ✔ Verified Buyer
                        </span>
                      </div>
                      <div className="pure-feedback-stars">
                        {Array.from({ length: 5 }, (_, i) => (
                          <svg
                            key={i}
                            className={
                              i < Math.floor(feedback.rating)
                                ? "pure-star"
                                : "pure-star pure-star-empty"
                            }
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="pure-feedback-comment">“{feedback.comment}”</p>

                  {feedback.photos && (
                    <img
                      src={feedback.photo}
                      alt="User photo"
                      className="pure-feedback-photo-small"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
