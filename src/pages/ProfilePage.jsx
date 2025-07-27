import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import "../styles/globals.css";

export function ProfilePage() {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [productCatalog, setProductCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          fetch(`http://localhost:3001/api/orders/user/${user.id}`),
          fetch(`http://localhost:3001/api/products/phone-coolers`)
        ]);

        if (!ordersRes.ok || !productsRes.ok) throw new Error("Fetch failed");

        const [ordersData, productsData] = await Promise.all([
          ordersRes.json(),
          productsRes.json()
        ]);

        setOrders(ordersData);
        setProductCatalog(productsData);
      } catch (err) {
        setError("Unable to load your order history.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getProductInfo = (name) =>
    productCatalog.find((p) => p.name === name);

  const getDeliveryStatus = (deliveryDate) => {
    if (!deliveryDate) return { label: "Pending", color: "pending" };

    const today = new Date();
    const target = new Date(deliveryDate);

    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    if (today.getTime() === target.getTime()) {
      return { label: "Arriving Today", color: "today" };
    } else if (today < target) {
      return { label: "Pending", color: "pending" };
    } else {
      return { label: "Delivered", color: "delivered" };
    }
  };

  if (!user) return <p className="order-error-msg">Please sign in to view your orders.</p>;

  return (
    <div className="profile-page">
      <h1 className="profile-title">My Orders</h1>

      {loading && <p className="order-status">Loading your orders...</p>}
      {error && <p className="order-error-msg">{error}</p>}
      {!loading && !orders.length && <p className="order-status">No orders yet.</p>}

      <div className="orders-list">
        {orders.map((order) => {
          const firstProduct = order.products[0];
          const productInfo = getProductInfo(firstProduct.name);
          const status = getDeliveryStatus(order.deliveryDate);

          return (
            <div key={order.orderId} className="order-block">
              <div className="order-image">
                <img
                  src={productInfo?.image || "/placeholder.jpg"}
                  alt={firstProduct.name}
                />
              </div>

              <div className="order-content">
                <div className="order-meta">
                  <span className="order-date">
                    {new Date(order.created * 1000).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric"
                    })}
                  </span>

                  <span className={`order-badge ${status.color}`}>
                    {status.label}
                  </span>
                </div>

                <h2 className="order-product-name">{firstProduct.name}</h2>

                <p className="order-details">
                  <strong>Total:</strong> ${order.amount.toFixed(2)} {order.currency.toUpperCase()}
                </p>

                <p className="order-details">
                  <strong>Delivery:</strong>{" "}
                  {order.deliveryDate
                    ? new Date(order.deliveryDate).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                      })
                    : "Estimated soon"}
                </p>

                <div className="order-quantity-list">
                  {order.products.map((item, idx) => (
                    <div key={idx} className="product-line">
                      {item.quantity} × <span>{item.name}</span> (${item.price.toFixed(2)})
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
