import { useEffect, useState } from "react";
import { getData, setData } from "../utils/localStorageHelper";
import { useNavigate } from "react-router-dom";


const Reseller = () => {
  const nav = useNavigate();
  const [products, setProducts] = useState([]);
  const [margin, setMargin] = useState({});
  const [customer, setCustomer] = useState({});
  const [earnings, setEarnings] = useState(0);

  useEffect(() => {
    setProducts(getData("products"));
    setEarnings(Number(localStorage.getItem("earnings")) || 0);
  }, []);

  const placeResellerOrder = (p) => {
    const m = Number(margin[p.id] || 0);
    const finalPrice = Number(p.price) + m;

    const cust = customer[p.id];

    if (!cust?.name || !cust?.address) {
      return alert("Fill customer details");
    }

    const resellerOrders = getData("resellerOrders");

    const newOrder = {
      product: p,
      margin: m,
      finalPrice,
      customer: cust,
      status: "Pending",
      date: new Date().toLocaleString(),
    };

    setData("resellerOrders", [...resellerOrders, newOrder]);

    const newEarn = earnings + m;
    setEarnings(newEarn);
    localStorage.setItem("earnings", newEarn);

    alert("Reseller order placed");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Reseller Dashboard</h2>

      <h3 className="text-green-600 font-semibold mb-4">
        Total Earnings: ₹{earnings}
      </h3>

      <div className="flex gap-4 mb-6">
  <button
    onClick={() => nav("/reseller-orders")}
    className="bg-blue-500 text-white px-4 py-2 rounded"
  >
    My Orders
  </button>

  <button
    onClick={() => nav("/withdraw")}
    className="bg-green-500 text-white px-4 py-2 rounded"
  >
    Withdraw
  </button>

  <button
    onClick={() => nav("/analytics")}
    className="bg-purple-500 text-white px-4 py-2 rounded"
  >
    Analytics
  </button>
</div>

      <div className="grid md:grid-cols-3 gap-4">
        {products.map((p) => {
          const m = Number(margin[p.id] || 0);
          const final = Number(p.price) + m;

          return (
            <div key={p.id} className="bg-white p-4 shadow rounded">
              <img src={p.image} className="h-32 mx-auto" />

              <h2 className="font-semibold">{p.title}</h2>
              <p>Base Price: ₹{p.price}</p>

              <input
                placeholder="Add Margin"
                className="border p-1 w-full mt-2"
                onChange={(e) =>
                  setMargin({ ...margin, [p.id]: e.target.value })
                }
              />

              <p className="text-blue-600 mt-1">
                Final Price: ₹{final}
              </p>

              {/* Customer form */}
              <input
                placeholder="Customer Name"
                className="border p-1 w-full mt-2"
                onChange={(e) =>
                  setCustomer({
                    ...customer,
                    [p.id]: { ...customer[p.id], name: e.target.value },
                  })
                }
              />

              <input
                placeholder="Customer Address"
                className="border p-1 w-full mt-2"
                onChange={(e) =>
                  setCustomer({
                    ...customer,
                    [p.id]: { ...customer[p.id], address: e.target.value },
                  })
                }
              />

              <button
                onClick={() => placeResellerOrder(p)}
                className="bg-yellow-400 w-full mt-2 py-1 rounded"
              >
                Place Order
              </button>

              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    `${window.location.origin}/product/${p.id}`
                  )
                }
                className="bg-blue-500 text-white w-full mt-2 py-1 rounded"
              >
                Copy Share Link
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Reseller;