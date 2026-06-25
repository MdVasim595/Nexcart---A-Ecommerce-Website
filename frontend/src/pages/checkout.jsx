import { useEffect, useState } from "react";
import { getData, setData } from "../utils/localStorageHelper";
import { useNavigate } from "react-router-dom";
import AddressForm from "../components/AddressForm";
import { api } from "../utils/api";

const Checkout = () => {
  const nav = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [address, setAddress] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  const cart = getData("cart");
  const total = cart.reduce((a, b) => a + Number(b.price), 0);

  useEffect(() => {
    const loadAddresses = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.email) return;

      setLoadingAddresses(true);

      try {
        const res = await api.get("/user/me");
        const savedAddresses = Array.isArray(res.data?.addresses)
          ? res.data.addresses
          : [];

        setAddresses(savedAddresses);

        if (savedAddresses.length) {
          setAddress(savedAddresses[0]);
          setData("address", savedAddresses[0]);
        }
      } catch (err) {
        console.log("Unable to load addresses", err);
      }

      setLoadingAddresses(false);
    };

    loadAddresses();
  }, []);

  const selectAddress = (selectedAddress) => {
    setAddress(selectedAddress);
    setData("address", selectedAddress);
  };

  const saveNewAddress = async (newAddress) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const updatedAddresses = [...addresses, newAddress];

    setAddresses(updatedAddresses);
    selectAddress(newAddress);

    if (!user?.email) {
      return;
    }

    try {
      await api.put("/user/update", {
        addresses: updatedAddresses,
      });
    } catch (err) {
      console.log("Unable to save address", err);
      alert("Address selected, but could not save it to your account");
    }
  };

  const handleOrder = () => {
    if (!address) return alert("Select or add address first");

    setData("address", address);

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

          {loadingAddresses ? (
            <p className="text-gray-500">Loading addresses...</p>
          ) : addresses.length ? (
            <div className="space-y-2">
              {addresses.map((savedAddress, index) => (
                <label
                  key={`${savedAddress.phone}-${savedAddress.pincode}-${index}`}
                  className={`flex items-center gap-3 border rounded p-3 cursor-pointer ${
                    address === savedAddress ? "border-pink-500 bg-pink-50" : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryAddress"
                    checked={address === savedAddress}
                    onChange={() => selectAddress(savedAddress)}
                  />
                  <div>
                    <p className="font-semibold">{savedAddress.name}</p>
                    <p className="text-sm text-gray-600">
                      Contact: {savedAddress.phone}
                    </p>
                    <p className="text-sm text-gray-600">
                      Pincode: {savedAddress.pincode}
                    </p>
                  </div>
                </label>
              ))}
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
            saveNewAddress(data);
          }}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default Checkout;
