import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { PureHeader } from "./components/PureHeader.jsx";
import { PureProductModal } from "./components/PureProductModal.jsx";
import { PureCartSidebar } from "./components/PureCartSidebar.jsx";
import { PureProductsPage } from "./pages/PureProductsPage.jsx";
import { PureProductDetailPageWrapper } from "./components/PureProductDetailPageWrapper.jsx";
import { PureReviewsPage } from "./pages/PureReviewsPage.jsx";
import { PureFooter } from "./components/PureFooter.jsx";
import { AboutUsPage } from "./pages/AboutUsPage.jsx";
import { ContactPage } from "./pages/ContactPage.jsx";
import { FAQPage } from "./pages/FAQPage.jsx";
import { ReviewsPage } from "./pages/ReviewsPage.jsx";
import { CheckoutPage } from './pages/CheckoutPage.jsx';
import {
  PurePrivacyPolicyPage,
  PureTermsOfServicePage,
  PureShippingPage,
  PureReturnsPage,
} from "./components/PurePages.jsx";

import PureHomepage from "./components/PureHomepage.jsx"; 

import { phoneCoolerProducts } from "./PhoneCoolerProducts.js";

import "./styles/styles-homepage.css";
import "./styles/styles-pure-components.css";
import 'flag-icons/css/flag-icons.min.css';



export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailProduct, setDetailProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, quantity = 1, selectedColor, selectedSize) => {
    setCartItems((prev) => {
      const existingItem = prev.find(
        (item) =>
          item.id === product.id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
      );
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity, selectedColor, selectedSize }];
    });
  };

  const removeFromCart = (productId, selectedColor, selectedSize) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.id === productId &&
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize
          )
      )
    );
  };

  const updateQuantity = (productId, quantity, selectedColor, selectedSize) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedColor, selectedSize);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
          ? { ...item, quantity }
          : item
      )
    );
  };

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div>
      <PureHeader
        cartItemCount={cartItemCount}
        onCartClick={() => setIsCartOpen(true)}
      />

      <Routes>
        <Route
          path="/"
          element={
            <PureHomepage
              products={phoneCoolerProducts}
              onProductClick={(p) => setSelectedProduct(p)}
              cartItemCount={cartItemCount}
              onCartClick={() => setIsCartOpen(true)}
            />
          }
        />
        <Route
          path="/products"
          element={
            <PureProductsPage
              products={phoneCoolerProducts}
              onProductClick={(p) => setDetailProduct(p)}
            />
          }
        />
        <Route
          path="/product-detail/:id"
          element={<PureProductDetailPageWrapper onAddToCart={addToCart} />}
        />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/privacy" element={<PurePrivacyPolicyPage />} />
        <Route path="/terms" element={<PureTermsOfServicePage />} />
        <Route path="/shipping" element={<PureShippingPage />} />
        <Route path="/returns" element={<PureReturnsPage />} />
      </Routes>

      <PureFooter />

      {selectedProduct && (
        <PureProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(quantity, selectedColor) => {
            addToCart(selectedProduct, quantity, selectedColor);
            setSelectedProduct(null);
          }}
        />
      )}

      <PureCartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        total={cartTotal}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
      />
    </div>
  );
}
