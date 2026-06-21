import { useState } from "react";
import { getData, setData } from "../utils/localStorageHelper";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const Payment = () => {
  const nav = useNavigate();

  const cart = getData("cart");
  const address = getData("address");

  const [payment, setPayment] = useState("COD");
  const [resell, setResell] = useState(false);
  const [margin, setMargin] = useState(0);
  const [paid, setPaid] = useState(false); // 🔥
  const [brandName, setBrandName] = useState("");

  const total = cart?.length
    ? cart.reduce((a, b) => a + Number(b.price || 0), 0)
    : 0;

  const finalAmount = resell ? total + Number(margin) : total;

  // 🔥 FINAL ORDER FUNCTION
  const placeOrder = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        alert("Login required");
        return;
      }

      const res = await fetch(`${API_URL}/order/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: { email: user.email },
          items: cart,
          address,
          payment,
          total,
          finalAmount,
          margin,
          resell,
          brandName: resell ? brandName : null,
        }),
      });

      // 🔥 IMPORTANT CHANGE
      if (!res.ok) {
        throw new Error("Server error");
      }

      const data = await res.json();
      console.log("SUCCESS:", data);

      localStorage.removeItem("cart");

      alert("Order placed successfully");
      nav("/orders");

    } catch (err) {
      console.log("ERROR:", err);
      alert("Order failed");
    }
  };

  // 🔥 MAIN BUTTON
  const handleOrder = () => {
    if (!address) return alert("Address missing");
    if (resell && !brandName) {
      return alert("Enter brand name");
    }

    if (payment === "COD") {
      placeOrder(); // direct
    } else {
      if (!paid) {
        alert("Please complete payment first");
        return;
      }
      placeOrder();
    }
  };

  return (
    <div className="p-6 grid md:grid-cols-2 gap-6">

      {/* LEFT */}
      <div>

        {/* PAYMENT OPTIONS */}
        <div className="bg-white p-4 shadow rounded mb-4">
          <h2 className="font-bold mb-3">Select Payment Method</h2>

          <div
            className={`border p-3 mb-2 cursor-pointer ${payment === "COD" ? "border-pink-500" : ""
              }`}
            onClick={() => setPayment("COD")}
          >
            ₹{total} - Cash on Delivery
          </div>

          <div
            className={`border p-3 cursor-pointer ${payment === "Online" ? "border-pink-500" : ""
              }`}
            onClick={() => setPayment("Online")}
          >
            ₹{total} - Pay Online
          </div>
        </div>

        {/* 🔥 ONLINE PAYMENT UI */}
        {payment === "Online" && (
          <div className="bg-white p-4 shadow rounded mb-4 text-center">

            <h3 className="font-semibold mb-2">Scan & Pay</h3>

            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay"
              alt="QR"
              className="mx-auto"
            />

            <p className="text-sm mt-2">
              Pay ₹{total} using any UPI app
            </p>

            <button
              onClick={() => setPaid(true)}
              className="bg-green-500 text-white px-4 py-2 mt-3 rounded"
            >
              I Have Paid
            </button>

            {paid && (
              <p className="text-green-600 mt-2">
                Payment Successful ✅
              </p>
            )}
          </div>
        )}

        {/* RESELL */}
        <div className="bg-white p-4 shadow rounded">
          <h2 className="font-bold mb-2">Reselling the order?</h2>

          <div className="flex gap-4 mb-3">
            <button
              onClick={() => setResell(true)}
              className={`px-4 py-1 border rounded ${resell ? "bg-pink-500 text-white" : ""
                }`}
            >
              Yes
            </button>

            <button
              onClick={() => setResell(false)}
              className={`px-4 py-1 border rounded ${!resell ? "bg-pink-500 text-white" : ""
                }`}
            >
              No
            </button>
          </div>

          {resell && (
            <div className="mt-3">

              {/* BRAND NAME */}
              <input
                type="text"
                placeholder="Enter your brand name"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="border p-2 w-full mb-2"
              />

              {/* MARGIN */}
              <input
                type="number"
                placeholder="Enter margin"
                className="border p-2 w-full"
                onChange={(e) => setMargin(Number(e.target.value))}
              />

              <p className="mt-2 text-green-600">
                Your Margin: ₹{margin}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Order will be delivered to above address
              </p>

            </div>
          )}
        </div>

        <div className="bg-gray-100 p-3 rounded mb-4">
          <p className="font-semibold">Delivery Address</p>
          <p>{address?.name}</p>
          <p>{address?.house}, {address?.area}</p>
          <p>{address?.city}, {address?.state}</p>
          <p>{address?.pincode}</p>
          <p>{address?.phone}</p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="bg-white p-4 shadow rounded">
        <h2 className="font-bold mb-3">
          Price Details ({cart.length} items)
        </h2>

        <div className="flex justify-between">
          <span>Product Total</span>
          <span>₹{total}</span>
        </div>

        {resell && (
          <div className="flex justify-between">
            <span>Your Margin</span>
            <span>₹{margin}</span>
          </div>
        )}

        <h3 className="mt-3 font-bold">
          Final: ₹{finalAmount}
        </h3>

        <button
          onClick={handleOrder}
          className="bg-pink-600 text-white w-full py-2 mt-4 rounded"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Payment;