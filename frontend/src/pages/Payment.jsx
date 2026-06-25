import { useState } from "react";
import { getData } from "../utils/localStorageHelper";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";

const Payment = () => {
  const nav = useNavigate();
  const cart = getData("cart");
  const address = getData("address");
  const [payment, setPayment] = useState("COD");
  const [resell, setResell] = useState(false);
  const [margin, setMargin] = useState(0);
  const [brandName, setBrandName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const total = cart.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const finalAmount = resell ? total + Number(margin) : total;
  const payload = { items: cart, address, resell, margin, brandName };

  const completeOrder = () => {
    localStorage.removeItem("cart");
    alert("Order placed successfully");
    nav("/orders");
  };

  const handleOnlinePayment = async () => {
    if (!window.Razorpay) throw new Error("Razorpay checkout failed to load");
    const { data } = await api.post("/payment/create-order", payload);
    const razorpay = new window.Razorpay({
      key: data.key, amount: data.amount, currency: data.currency, name: "NexCart",
      description: "Order Payment", order_id: data.orderId,
      handler: async (response) => {
        try {
          await api.post("/payment/verify", response);
          completeOrder();
        } catch (error) {
          alert(error.response?.data?.message || "Payment could not be verified. Contact support with your payment ID.");
        } finally { setSubmitting(false); }
      },
      modal: { ondismiss: () => setSubmitting(false) },
      theme: { color: "#db2777" },
    });
    razorpay.on("payment.failed", (event) => {
      setSubmitting(false);
      alert(event.error?.description || "Payment failed");
    });
    razorpay.open();
  };

  const handleOrder = async () => {
    if (!cart.length) return alert("Your cart is empty");
    if (!address?.name) return alert("Address missing");
    if (resell && !brandName.trim()) return alert("Enter brand name");
    try {
      setSubmitting(true);
      if (payment === "Online") return await handleOnlinePayment();
      await api.post("/order/create", { ...payload, payment: "COD" });
      completeOrder();
    } catch (error) {
      setSubmitting(false);
      alert(error.response?.data?.message || error.message || "Order failed");
    }
  };

  return <div className="p-6 grid md:grid-cols-2 gap-6">
    <div>
      <div className="bg-white p-4 shadow rounded mb-4"><h2 className="font-bold mb-3">Select Payment Method</h2>
        <button type="button" className={`border p-3 mb-2 w-full text-left ${payment === "COD" ? "border-pink-500" : ""}`} onClick={() => setPayment("COD")}>₹{finalAmount} - Cash on Delivery</button>
        <button type="button" className={`border p-3 w-full text-left ${payment === "Online" ? "border-pink-500" : ""}`} onClick={() => setPayment("Online")}>₹{finalAmount} - Pay Online</button>
      </div>
      {payment === "Online" && <div className="bg-white p-4 shadow rounded mb-4"><h3 className="font-semibold mb-2">Online Payment</h3><p className="text-gray-600">UPI, cards, net banking and wallets through Razorpay Secure Checkout.</p></div>}
      <div className="bg-white p-4 shadow rounded mb-4"><h2 className="font-bold mb-2">Reselling the order?</h2>
        <div className="flex gap-4 mb-3"><button onClick={() => setResell(true)} className={`px-4 py-1 border rounded ${resell ? "bg-pink-500 text-white" : ""}`}>Yes</button><button onClick={() => setResell(false)} className={`px-4 py-1 border rounded ${!resell ? "bg-pink-500 text-white" : ""}`}>No</button></div>
        {resell && <><input type="text" maxLength={100} placeholder="Enter your brand name" value={brandName} onChange={(e) => setBrandName(e.target.value)} className="border p-2 w-full mb-2"/><input type="number" min="0" max="100000" value={margin} className="border p-2 w-full" onChange={(e) => setMargin(Number(e.target.value))}/></>}
      </div>
      <div className="bg-gray-100 p-3 rounded"><p className="font-semibold">Delivery Address</p><p>{address?.name}</p><p>{address?.house}, {address?.area}</p><p>{address?.city}, {address?.state} {address?.pincode}</p><p>{address?.phone}</p></div>
    </div>
    <div className="bg-white p-4 shadow rounded h-fit"><h2 className="font-bold mb-3">Price Details ({cart.length} items)</h2><div className="flex justify-between"><span>Product Total</span><span>₹{total}</span></div>{resell && <div className="flex justify-between"><span>Your Margin</span><span>₹{margin}</span></div>}<h3 className="mt-3 font-bold">Final: ₹{finalAmount}</h3><button disabled={submitting} onClick={handleOrder} className="bg-pink-600 disabled:opacity-60 text-white w-full py-2 mt-4 rounded">{submitting ? "Please wait..." : "Place Order"}</button></div>
  </div>;
};

export default Payment;
