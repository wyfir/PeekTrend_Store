import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import TrackOrderPage from "./pages/TrackOrderPage.jsx";
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
import CheckoutPage from "./pages/CheckoutPage.jsx";
import PureHomepage from "./components/PureHomepage.jsx";
import { ProfilePage } from "./pages/ProfilePage.jsx";
import "./styles/styles-homepage.css";
import "./styles/styles-pure-components.css";
import "flag-icons/css/flag-icons.min.css";
import { SuccessPage } from "./pages/SuccessPage";
import { API_BASE_URL } from "./config";
import {
  PureFAQPage,
  PureAboutUsPage,
  PureContactPage,
  PurePrivacyPolicyPage,
  PureTermsOfServicePage,
  PureShippingPage,
  PureReturnsPage,
} from "./components/PurePages.jsx";

import FondyModal from "./components/FondyModal";
import { useFondyCheckout } from "./hooks/useFondyCheckout";
import { useNavigate } from "react-router-dom";

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailProduct, setDetailProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [activePage, setActivePage] = useState(null);

  const { user } = useUser();
  const { fondyUrl, openFondy, closeFondy } = useFondyCheckout({
    getUserMeta: () => ({
      clerkId: user?.id,
      clerkEmail: user?.emailAddresses?.[0]?.emailAddress,
    }),
  });

  const navigate = useNavigate();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      localStorage.setItem("referrer", ref);
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, "", cleanUrl);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    const email = user?.emailAddresses?.[0]?.emailAddress;
    if (!email) return;

    // Link any guest orders by email to this Clerk user
    fetch(`${API_BASE_URL}/api/orders/link-my-orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, email }), // DEV version
    }).catch(() => {});
  }, [user]);
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products/phone-coolers`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(console.error);
  }, []);

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

  // NEW: called by PureCartSidebar when user clicks "Proceed to Checkout"
  const handleCartCheckout = async (items /*, smoothCloseCb? */) => {
    if (!items?.length) return;
    // Start fetching the Fondy checkout URL; the sidebar animates itself closed.
    await openFondy(items); // when it resolves, FondyModal will show via fondyUrl
  };

  return (
    <div>
      <PureHeader
        cartItemCount={cartItemCount}
        onCartClick={() => setIsCartOpen(true)}
      />

      {/* Top-level Fondy modal so it stays visible after the cart unmounts */}
      <FondyModal url={fondyUrl} onClose={closeFondy} />

      {activePage === null && (
        <Routes>
          <Route
            path="/"
            element={
              <PureHomepage
                products={products}
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
                products={products}
                onProductClick={(p) => setDetailProduct(p)}
              />
            }
          />
          <Route
            path="/product-detail/:id"
            element={
              <PureProductDetailPageWrapper
                onAddToCart={addToCart}
                setIsCartOpen={setIsCartOpen}
              />
            }
          />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/privacy" element={<PurePrivacyPolicyPage />} />
          <Route path="/terms" element={<PureTermsOfServicePage />} />
          <Route path="/shipping" element={<PureShippingPage />} />
          <Route path="/returns" element={<PureReturnsPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/orders/track" element={<TrackOrderPage />} />
          <Route
            path="/checkout"
            element={
              <CheckoutPage
                cartItems={cartItems}
                clearCart={() => setCartItems([])} // optional (use on success if you want)
              />
            }
          />
        </Routes>
      )}

      {activePage === "faq" && (
        <PureFAQPage onBack={() => setActivePage(null)} />
      )}
      {activePage === "about" && (
        <PureAboutUsPage onBack={() => setActivePage(null)} />
      )}
      {activePage === "contact" && (
        <PureContactPage onBack={() => setActivePage(null)} />
      )}
      {activePage === "privacy" && (
        <PurePrivacyPolicyPage onBack={() => setActivePage(null)} />
      )}
      {activePage === "terms" && (
        <PureTermsOfServicePage onBack={() => setActivePage(null)} />
      )}
      {activePage === "shipping" && (
        <PureShippingPage onBack={() => setActivePage(null)} />
      )}
      {activePage === "returns" && (
        <PureReturnsPage onBack={() => setActivePage(null)} />
      )}

      <PureFooter onPageChange={(page) => setActivePage(page)} />

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
        onCheckout={() => navigate("/checkout")} // 👈 navigate AFTER close animation
      />
    </div>
  );
}
