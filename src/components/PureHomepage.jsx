import React from "react";
import { useNavigate } from "react-router-dom";

export default function PureHomepage({
  products,
  onProductClick,
  cartItemCount,
  onCartClick,
}) {
  const navigate = useNavigate();

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={
          i < Math.floor(rating)
            ? "homepage-star"
            : "homepage-star homepage-star-empty"
        }
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="homepage-hero">
        <div className="homepage-hero-container">
          <h1 className="homepage-hero-title">
            Keep Your Phone Cool.
            <br />
            Stay in the Game.
          </h1>
          <p className="homepage-hero-subtitle">
            Discover premium phone cooling solutions that eliminate overheating
            and unlock your device's full potential during gaming, streaming,
            and intensive use.
          </p>
          <button
            className="homepage-hero-cta"
            onClick={() => (window.location.href = "/products")}
          >
            Shop Phone Coolers
          </button>
        </div>
      </section>
      {/* Trust Badges Section */}
      <section className="homepage-trust">
        <div className="homepage-trust-container">
          <p className="homepage-trust-title">
            Trusted by 100,000+ Customers Worldwide
          </p>
          <div className="homepage-trust-grid">
            <div className="homepage-trust-item">
              <div className="homepage-trust-icon">
                <svg
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="homepage-trust-text">Secure Payments</div>
              <div className="homepage-trust-subtext">SSL & Encryption</div>
            </div>

            <div className="homepage-trust-item">
              <div className="homepage-trust-icon">
                <svg
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <div className="homepage-trust-text">Fast Shipping</div>
              <div className="homepage-trust-subtext">1-3 Business Days</div>
            </div>

            <div className="homepage-trust-item">
              <div className="homepage-trust-icon">
                <svg
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="homepage-trust-text">30-Day Returns</div>
              <div className="homepage-trust-subtext">Money Back Guarantee</div>
            </div>

            <div className="homepage-trust-item">
              <div className="homepage-trust-icon">
                <svg
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="homepage-trust-text">Expert Support</div>
              <div className="homepage-trust-subtext">24/7 Customer Care</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="homepage-products">
        <div className="homepage-products-container">
          <div className="homepage-products-header">
            <h2 className="homepage-products-title">Featured Phone Coolers</h2>
            <p className="homepage-products-subtitle">
              Discover our best-selling cooling solutions designed to keep your
              phone performing at its peak
            </p>
          </div>

          <div className="homepage-products-grid">
            {products.slice(0, 4).map((product) => (
              <div
                key={product.id}
                className="homepage-product-card"
                onClick={() => onProductClick(product)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="homepage-product-image"
                />
                <div className="homepage-product-content">
                  <h3 className="homepage-product-name">{product.name}</h3>
                  <p className="homepage-product-description">
                    {product.description.slice(0, 100)}...
                  </p>

                  <div className="homepage-product-footer">
                    <div className="homepage-product-price">
                      <span className="homepage-product-current-price">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="homepage-product-original-price">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>

                    <div className="homepage-product-rating">
                      {renderStars(product.rating)}
                      <span className="homepage-product-reviews">
                        ({product.reviews})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="homepage-reviews">
        <div className="homepage-reviews-container">
          <div className="homepage-reviews-header">
            <h2 className="homepage-reviews-title">What Our Customers Say</h2>
            <p className="homepage-reviews-subtitle">
              Join thousands of satisfied customers who've transformed their
              mobile experience
            </p>
          </div>

          <div className="homepage-reviews-grid">
            <div className="homepage-review-card">
              <div className="homepage-review-quote">"</div>
              <div className="homepage-review-rating">{renderStars(5)}</div>
              <p className="homepage-review-text">
                "Game changer! My iPhone was constantly overheating during long
                gaming sessions. The X1 cooler dropped the temperature instantly
                and I can finally play without throttling. Amazing build quality
                too!"
              </p>
              <div className="homepage-review-author">
                <div className="homepage-review-avatar">AM</div>
                <div className="homepage-review-info">
                  <div className="homepage-review-name">Alex M.</div>
                  <div className="homepage-review-location">Chicago, IL</div>
                </div>
              </div>
            </div>

            <div className="homepage-review-card">
              <div className="homepage-review-quote">"</div>
              <div className="homepage-review-rating">{renderStars(5)}</div>
              <p className="homepage-review-text">
                "Perfect for content creation! I stream live on Instagram and my
                phone would always overheat after 10 minutes. With the PeekTrend
                cooler, I can stream for hours without any issues. Highly
                recommended!"
              </p>
              <div className="homepage-review-author">
                <div className="homepage-review-avatar">MJ</div>
                <div className="homepage-review-info">
                  <div className="homepage-review-name">Mia Johnson</div>
                  <div className="homepage-review-location">Amsterdam, NL</div>
                </div>
              </div>
            </div>

            <div className="homepage-review-card">
              <div className="homepage-review-quote">"</div>
              <div className="homepage-review-rating">{renderStars(4)}</div>
              <p className="homepage-review-text">
                "Really impressed with the wireless model. The battery lasts all
                day and it's so convenient not having cables. The only minor
                issue is it adds a bit of bulk, but the cooling performance
                makes it worth it."
              </p>
              <div className="homepage-review-author">
                <div className="homepage-review-avatar">DL</div>
                <div className="homepage-review-info">
                  <div className="homepage-review-name">David Liu</div>
                  <div className="homepage-review-location">
                    San Francisco, CA
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
