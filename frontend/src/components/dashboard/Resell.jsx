import { useEffect, useState } from "react";
import { api } from "../../utils/api";

const Resell = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalEarnings: 0,
    totalMargin: 0,
  });

  useEffect(() => {
    api
  .get("/order/mine")
      .then((res) => {
        const resellOrders = res.data.filter((o) => o.resell);

        let earnings = 0;
        let margin = 0;

        resellOrders.forEach((o) => {
          earnings += o.finalAmount || 0;
          margin += o.margin || 0;
        });

        setOrders(resellOrders);

        setStats({
          totalOrders: resellOrders.length,
          totalEarnings: earnings,
          totalMargin: margin,
        });
      });
  }, []);

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-6">
        💰 Resell Dashboard
      </h1>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">

        {/* TOTAL ORDERS */}
        <div className="bg-white p-4 rounded-xl shadow hover:shadow-xl transition duration-300">
          <p className="text-gray-500 text-sm">Total Orders</p>
          <h2 className="text-2xl font-bold">
            {stats.totalOrders}
          </h2>
        </div>

        {/* EARNINGS */}
        <div className="bg-white p-4 rounded-xl shadow hover:shadow-xl transition duration-300">
          <p className="text-gray-500 text-sm">Total Revenue</p>
          <h2 className="text-2xl font-bold text-green-600">
            ₹{stats.totalEarnings}
          </h2>
        </div>

        {/* PROFIT */}
        <div className="bg-white p-4 rounded-xl shadow hover:shadow-xl transition duration-300">
          <p className="text-gray-500 text-sm">Your Profit</p>
          <h2 className="text-2xl font-bold text-pink-600">
            ₹{stats.totalMargin}
          </h2>
        </div>
      </div>

      {/* ORDERS LIST */}
      <div className="bg-white p-4 rounded-xl shadow">

        <h2 className="font-semibold mb-4">Resell Orders</h2>

        {orders.length ? (
          orders.map((o) => (
            <div
              key={o._id}
              className="flex justify-between items-center border-b py-3 hover:bg-gray-50 transition"
            >
              <div>
                <p className="font-medium">
                  {o.items?.[0]?.title}
                </p>

                <p className="text-xs text-gray-500">
                  {new Date(o.createdAt).toDateString()}
                </p>

                <p className="text-xs text-gray-600">
                  Brand: {o.brandName || "N/A"}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-500">
                  Revenue
                </p>
                <p className="font-semibold">
                  ₹{o.finalAmount}
                </p>

                <p className="text-green-600 text-sm">
                  Profit ₹{o.margin}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No resell orders yet</p>
        )}

      </div>
    </div>
  );
};

export default Resell;
