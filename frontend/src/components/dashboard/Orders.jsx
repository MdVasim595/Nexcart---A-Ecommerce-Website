import { useEffect, useState } from "react";
import { api } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    api
  .get("/order/mine")
  .then((res) => setOrders(res.data));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">My Orders</h2>

      {orders.length ? (
        orders.map((o) =>
          o.items.map((item, i) => (
            <div
              key={i}
              onClick={() => nav(`/order/${o._id}`)}
              className="flex gap-3 bg-white p-3 rounded-lg shadow mb-3 cursor-pointer hover:shadow-md"
            >
              {/* Image */}
              <img
                src={item.image}
                className="w-20 h-20 object-cover rounded"
              />

              {/* Info */}
              <div className="flex-1">
                <p className="font-semibold text-sm">
                  {o.status === "Delivered"
                    ? "Delivered"
                    : o.status === "Cancelled"
                    ? "Order Cancelled"
                    : "Order Placed"}
                </p>

                <p className="text-xs text-gray-500">
                  {new Date(o.createdAt).toDateString()}
                </p>

                <p className="text-xs text-gray-600 mt-1">
                  Size: {item.selectedSize || "N/A"} • Qty:{" "}
                  {item.quantity || 1}
                </p>
              </div>

              <span className="text-gray-400">›</span>
            </div>
          ))
        )
      ) : (
        <p>No orders found</p>
      )}
    </div>
  );
};

export default Orders;
