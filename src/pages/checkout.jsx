import { useState } from "react";
import { getData, setData } from "../utils/localStorageHelper";
import { useNavigate } from "react-router-dom";
import AddressForm from "../components/AddressForm";

const Checkout = () => {
  const nav = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [address, setAddress] = useState(null);

  const cart = getData("cart");
  const total = cart.reduce((a, b) => a + Number(b.price), 0);

  const handleOrder = () => {
  if (!address) return alert("Add address first");

  // sirf address save karo
  setData("address", address);

  // payment page pe jao
  nav("/payment");
};

  return (
    <div className="p-6 grid md:grid-cols-2 gap-6">

      {/* LEFT SIDE */}
      <div>

        {/* Product */}
        <div className="bg-white p-4 shadow rounded mb-4">
          <h2 className="font-bold mb-2">Product Details</h2>

          {cart.map((c, i) => (
            <div key={i} className="flex gap-3 mb-3">
              <img src={c.image || c.images?.[0]} className="w-16 h-16" />
              <div>
                <p>{c.title}</p>
                <p>₹{c.price}</p>
                <p>Size: {c.selectedSize || "Free"}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Address */}
        <div className="bg-white p-4 shadow rounded">
          <h2 className="font-bold mb-2">Delivery Address</h2>

          {address ? (
            <div>
              <p>{address.name}</p>
              <p>{address.city}</p>
              <p>{address.phone}</p>
            </div>
          ) : (
            <p className="text-gray-500">No address added</p>
          )}

          <button
            onClick={() => setShowForm(true)}
            className="mt-3 border border-pink-500 text-pink-500 px-4 py-2 rounded"
          >
            + Add Address
          </button>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="bg-white p-4 shadow rounded">
        <h2 className="font-bold mb-3">Price Details</h2>

        <div className="flex justify-between">
          <span>Total</span>
          <span>₹{total}</span>
        </div>

        <button
          onClick={handleOrder}
          className="bg-pink-600 text-white w-full py-2 mt-4 rounded"
        >
          Continue
        </button>
      </div>

      {/* Address Form Popup */}
      {showForm && (
        <AddressForm
          onSave={(data) => {
            setAddress(data);
            setData("address", data);
          }}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default Checkout;