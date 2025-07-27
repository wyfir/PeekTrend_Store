import { useParams } from "react-router-dom";
import { PureProductDetailPage } from "../pages/PureProductDetailPage.jsx";
import { useState, useEffect } from "react";

export function PureProductDetailPageWrapper({ onAddToCart, setIsCartOpen }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/products/phone-coolers")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(console.error);
  }, []);

  const { id } = useParams();
  const product = products.find((p) => String(p.id) === id);

  if (!product) return <div>Product not found</div>;

  return (
    <PureProductDetailPage
      product={product}
      onBack={() => window.history.back()}
      onAddToCart={(quantity, selectedColor) =>
        onAddToCart(product, quantity, selectedColor)
      }
      setIsCartOpen={setIsCartOpen} // ✅ now properly passed
    />
  );
}
