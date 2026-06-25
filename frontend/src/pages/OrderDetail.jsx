import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../utils/api";

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/order/${id}`)
      .then(res => setOrder(res.data));
  }, [id]);

  if (!order) return <p className="p-4">Loading...</p>;

  const item = order.items[0];

  return (
    <div className="p-4">

      {/* TOP */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <div className="flex gap-3">

          <img src={item.image} className="w-20 h-20 rounded" />

          <div>
            <p className="font-semibold">{item.title}</p>
            <p className="text-sm text-gray-500">
              Size: {item.selectedSize || "N/A"}
            </p>
            <p className="text-sm text-gray-500">
              Payment: {order.payment}
            </p>
          </div>
        </div>
      </div>

      {/* STATUS */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <p className="font-semibold mb-1">{order.status}</p>
        <p className="text-sm text-gray-500">
          {new Date(order.date).toDateString()}
        </p>
      </div>

      {/* ADDRESS */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <h3 className="font-semibold mb-2">Delivery Address</h3>
        <p>{order.address?.name}</p>
        <p>{order.address?.house}, {order.address?.area}</p>
        <p>{order.address?.city}, {order.address?.state}</p>
        <p>{order.address?.pincode}</p>
        <p>{order.address?.phone}</p>
      </div>

      {/* PRICE */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Total Product Price</h3>
        <p className="text-lg font-bold">₹{order.total}</p>
      </div>

    </div>
  );
};

export default OrderDetail;
