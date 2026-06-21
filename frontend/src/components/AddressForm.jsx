import { useState } from "react";

const AddressForm = ({ onSave, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    house: "",
    area: "",
    pincode: "",
    city: "",
    state: "",
  });

  const handleSave = () => {
    if (!form.name || !form.phone || !form.pincode) {
      return alert("Fill all required fields");
    }

    onSave(form);
    onClose();
  };

  return (
    <div className="fixed top-0 right-0 w-full md:w-100 h-full bg-white shadow-lg p-4 z-50 overflow-y-auto">

      <h2 className="text-lg font-bold mb-4">Add Delivery Address</h2>

      {Object.keys(form).map((key) => (
        <input
          key={key}
          placeholder={key}
          className="border p-2 w-full mb-2"
          onChange={(e) =>
            setForm({ ...form, [key]: e.target.value })
          }
        />
      ))}

      <button
        onClick={handleSave}
        className="bg-pink-600 text-white w-full py-2 rounded mt-3"
      >
        Save Address
      </button>

      <button
        onClick={onClose}
        className="text-gray-500 mt-2 w-full"
      >
        Cancel
      </button>
    </div>
  );
};

export default AddressForm;
