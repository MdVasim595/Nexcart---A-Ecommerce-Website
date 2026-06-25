import { useEffect, useState } from "react";
import { api } from "../utils/api";

const Orders = () => {
  const [orders, setOrders] = useState(null);
  useEffect(() => { api.get("/order/mine").then(({ data }) => setOrders(data)).catch(() => setOrders([])); }, []);
  if (orders === null) return <div className="p-6">Loading orders...</div>;
  if (!orders.length) return <div className="p-6">No orders placed yet</div>;
  return <div className="p-6 bg-gray-100 min-h-screen"><h2 className="text-2xl font-bold mb-4">My Orders</h2>{orders.map((order) => <div key={order._id} className="bg-white p-4 mb-4 shadow rounded">
    {order.items?.map((item, index) => <div key={`${item.product}-${index}`} className="flex justify-between border-b py-1"><span>{item.title}</span><span>₹{item.price}</span></div>)}
    <p className="mt-2 text-sm text-gray-600">Deliver to: {order.address?.name}, {order.address?.city}</p>
    <p className="text-sm">Payment: {order.payment} ({order.paymentStatus})</p><p className="font-semibold mt-1">Total: ₹{order.finalAmount}</p>
    <p className="text-xs text-gray-500">Ordered on: {new Date(order.date).toLocaleDateString()}</p><p className="mt-2 font-semibold">Status: {order.status}</p>
  </div>)}</div>;
};
export default Orders;
