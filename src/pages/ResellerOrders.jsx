import { getData } from "../utils/localStorageHelper";

const ResellerOrders = () => {
  const orders = getData("resellerOrders");

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Reseller Orders</h2>

      {orders.map((o, i) => (
        <div key={i} className="border p-3 mb-3 bg-white rounded shadow">
          <p className="font-semibold">{o.product.title}</p>
          <p>Base: ₹{o.product.price}</p>
          <p>Margin: ₹{o.margin}</p>
          <p className="text-green-600">Final: ₹{o.finalPrice}</p>
          <p className="font-semibold mt-1">
  Status: <span className="text-blue-600">{o.status}</span>
</p>

          <p className="mt-2 text-sm">
            Customer: {o.customer.name} | {o.customer.address}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ResellerOrders;