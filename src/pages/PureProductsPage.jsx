import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/styles-pure-components.css";

export function PureProductsPage({ products }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const navigate = useNavigate();

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

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

  return (
    <div className="pure-component pure-products-page">
      <div className="pure-products-container">
        <div className="pure-products-header">
          <h1 className="pure-products-title">Phone Cooling Solutions</h1>
          <p className="pure-products-subtitle">
            Discover our complete range of premium phone cooling accessories
            designed to keep your device performing at its best.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="pure-products-filters">
          <div className="pure-search-container">
            <svg
              className="pure-search-icon"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pure-search-input"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="pure-filter-select"
          >
            <option value="all">All Categories</option>
            <option value="phone-cooler">Phone Coolers</option>
            <option value="accessory">Accessories</option>
          </select>
        </div>

        {/* Products Grid */}
        <div className="pure-products-grid">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="pure-product-card"
              onClick={() => navigate(`/product-detail/${product.id}`)}
            >
              <img
                src={product.image}
                alt={product.name}
                className="pure-product-image"
              />
              <div className="pure-product-content">
                <h3 className="pure-product-name">{product.name}</h3>
                <p className="pure-product-description">
                  {product.description.length > 100
                    ? `${product.description.slice(0, 100)}...`
                    : product.description}
                </p>

                <div className="pure-product-footer">
                  <div className="pure-product-price">
                    <span className="pure-product-current-price">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="pure-product-original-price">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>

                  <div className="pure-product-rating">
                    {renderStars(product.rating)}
                    <span className="pure-product-reviews">
                      ({product.reviews})
                    </span>
                  </div>
                  {/* <div className="for_type">
                    <div className="inside_type">
                      <img
                        style={{ width: "23px" }}
                        src="https://cdn-icons-png.flaticon.com/512/7887/7887081.png "
                        alt=""
                      />
                      <p>{product.for}</p>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div
            style={{ textAlign: "center", padding: "3rem", color: "#717182" }}
          >
            <p>No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
