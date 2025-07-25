import { useParams } from "react-router-dom";
import { PureProductDetailPage } from "../pages/PureProductDetailPage.jsx";
import { phoneCoolerProducts } from "../PhoneCoolerProducts.js";

export function PureProductDetailPageWrapper({ onAddToCart }) {
  const { id } = useParams();
const product = phoneCoolerProducts.find((p) => String(p.id) === id);


  if (!product) return <div>Product not found</div>;

  return (
    <PureProductDetailPage
      product={product}
      onBack={() => window.history.back()}
      onAddToCart={(quantity, selectedColor) =>
        onAddToCart(product, quantity, selectedColor)
      }
    />
  );
}
