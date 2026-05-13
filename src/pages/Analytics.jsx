import { getData } from "../utils/localStorageHelper";

const Analytics = () => {
  const orders = getData("resellerOrders");

  const totalOrders = orders.length;
  const totalProfit = orders.reduce((a, b) => a + Number(b.margin), 0);

  return (
    <div className="p-6">
      <h2 className="font-bold text-xl mb-4">Reseller Analytics</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 shadow rounded">
          <p>Total Orders</p>
          <h3 className="text-2xl font-bold">{totalOrders}</h3>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <p>Total Profit</p>
          <h3 className="text-2xl font-bold text-green-600">
            ₹{totalProfit}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Analytics;