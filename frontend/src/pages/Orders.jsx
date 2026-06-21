import { getData } from "../utils/localStorageHelper";

const Orders = () => {
  const orders = getData("orders");

  if (!orders.length)
    return <div className="p-6">No orders placed yet</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>

      {orders.map((o, i) => (
        <div key={i} className="bg-white p-4 mb-4 shadow rounded">

          {/* Items */}
          {o.items?.map((item, idx) => (
            <div key={idx} className="flex justify-between border-b py-1">
              <span>{item.title}</span>
              <span>₹{item.price}</span>
            </div>
          ))}

          {/* Address */}
          {o.address && (
            <p className="mt-2 text-sm text-gray-600">
              Deliver to: {o.address.name}, {o.address.city}
            </p>
          )}

          {/* Payment */}
          {o.payment && (
            <p className="text-sm">Payment: {o.payment}</p>
          )}

          {/* Total */}
          <p className="font-semibold mt-1">Total: ₹{o.total}</p>

          {/* Date */}
          <p className="text-xs text-gray-500">Ordered on: {o.date}</p>

          {/* 🔥 Status */}
          <p className="mt-2 font-semibold">
            Status:{" "}
            <span
              className={
                o.status === "Delivered"
                  ? "text-green-600"
                  : o.status === "Shipped"
                  ? "text-yellow-600"
                  : "text-blue-600"
              }
            >
              {o.status}
            </span>
          </p>

        </div>
      ))}
    </div>
  );
};

export default Orders;