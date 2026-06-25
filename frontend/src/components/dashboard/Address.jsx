const Address = () => {
  const [address, setAddress] = useState("");

  const saveAddress = () => {
    // API call
    alert("Saved");
  };

  return (
    <div>
      <h2>Address</h2>
      <input
        value={address}
        placeholder="Enter address"
        onChange={(e) => setAddress(e.target.value)}
      />
      <button onClick={saveAddress}>Save</button>
    </div>
  );
};

export default Address;
import { useState } from "react";
