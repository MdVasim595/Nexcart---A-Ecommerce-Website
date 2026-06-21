import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const Earnings = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    accountName: "",
    bankName: "",
    accountNumber: "",
    ifsc: "",
    upi: "",
  });

  const [wallet, setWallet] = useState({
    balance: 0,
    total: 0,
    pending: 0,
    withdrawn: 0,
  });

  const [amount, setAmount] = useState("");

  const [history] = useState([
    { amount: 500, status: "Paid" },
    { amount: 300, status: "Pending" },
  ]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Orders fetch
      const orderRes = await axios.get(
        `${API_URL}/order/user/${user.email}`
      );

      const resellOrders = orderRes.data.filter((o) => o.resell);

      let total = 0;
      let pending = 0;

      resellOrders.forEach((o) => {
        const profit = Number(o.margin || 0);

        total += profit;

        if (o.status !== "Delivered") {
          pending += profit;
        }
      });

      const withdrawn = 0;
      const balance = total - pending - withdrawn;

      setWallet({
        total,
        pending,
        withdrawn,
        balance,
      });

      // User payout details fetch
      const userRes = await axios.get(
        `${API_URL}/user/${user.email}`
      );

      if (userRes.data.payout) {
        setForm(userRes.data.payout);
      }

    } catch (err) {
      console.log(err);
    }
  };

  const saveDetails = async () => {
    try {
      await axios.put(`${API_URL}/user/payout`, {
        email: user.email,
        payout: form,
      });

      alert("Payout details saved ✅");
    } catch (err) {
      alert("Failed to save details");
    }
  };

  const requestWithdraw = () => {
    if (!amount) return alert("Enter amount");

    alert(`Withdraw request ₹${amount} submitted`);
    setAmount("");
  };

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">
        💰 Earnings Wallet
      </h1>

      {/* TOP CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Wallet Balance</p>
          <h2 className="text-xl font-bold text-green-600">
            ₹{wallet.balance}
          </h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Total Earnings</p>
          <h2 className="text-xl font-bold">
            ₹{wallet.total}
          </h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Pending</p>
          <h2 className="text-xl font-bold text-yellow-600">
            ₹{wallet.pending}
          </h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Withdrawn</p>
          <h2 className="text-xl font-bold text-pink-600">
            ₹{wallet.withdrawn}
          </h2>
        </div>

      </div>

      {/* PAYOUT DETAILS */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h2 className="font-semibold mb-4">
          🏦 Payout Details
        </h2>

        <div className="grid md:grid-cols-2 gap-3">

          <input
            value={form.accountName}
            placeholder="Account Holder Name"
            className="border p-2 rounded"
            onChange={(e) =>
              setForm({ ...form, accountName: e.target.value })
            }
          />

          <input
            value={form.bankName}
            placeholder="Bank Name"
            className="border p-2 rounded"
            onChange={(e) =>
              setForm({ ...form, bankName: e.target.value })
            }
          />

          <input
            value={form.accountNumber}
            placeholder="Account Number"
            className="border p-2 rounded"
            onChange={(e) =>
              setForm({ ...form, accountNumber: e.target.value })
            }
          />

          <input
            value={form.ifsc}
            placeholder="IFSC Code"
            className="border p-2 rounded"
            onChange={(e) =>
              setForm({ ...form, ifsc: e.target.value })
            }
          />

          <input
            value={form.upi}
            placeholder="UPI ID"
            className="border p-2 rounded md:col-span-2"
            onChange={(e) =>
              setForm({ ...form, upi: e.target.value })
            }
          />

        </div>

        <button
          onClick={saveDetails}
          className="bg-pink-600 text-white px-5 py-2 rounded mt-4"
        >
          Save Details
        </button>
      </div>

      {/* WITHDRAW */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h2 className="font-semibold mb-4">
          💸 Withdraw Earnings
        </h2>

        <div className="flex gap-3">
          <input
            value={amount}
            placeholder="Enter amount"
            className="border p-2 rounded flex-1"
            onChange={(e) => setAmount(e.target.value)}
          />

          <button
            onClick={requestWithdraw}
            className="bg-green-600 text-white px-4 rounded"
          >
            Request
          </button>
        </div>
      </div>

      {/* HISTORY */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-semibold mb-4">
          📄 Withdraw History
        </h2>

        {history.map((h, i) => (
          <div
            key={i}
            className="flex justify-between border-b py-2"
          >
            <span>₹{h.amount}</span>
            <span>{h.status}</span>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Earnings;