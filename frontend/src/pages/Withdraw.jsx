import { useState } from "react";

const Withdraw = () => {
  const [amount, setAmount] = useState("");
  const earnings = Number(localStorage.getItem("earnings")) || 0;

  const withdraw = () => {
    if (amount > earnings) return alert("Not enough balance");

    const newEarn = earnings - amount;
    localStorage.setItem("earnings", newEarn);
    alert("Withdrawal request submitted");
  };

  return (
    <div className="p-6">
      <h2 className="font-bold mb-3">Withdraw Earnings</h2>

      <p className="mb-2">Available: ₹{earnings}</p>

      <input
        placeholder="Amount"
        className="border p-2 mr-2"
        onChange={(e) => setAmount(e.target.value)}
      />

      <button
        onClick={withdraw}
        className="bg-green-500 text-white px-4 py-1"
      >
        Withdraw
      </button>
    </div>
  );
};

export default Withdraw;