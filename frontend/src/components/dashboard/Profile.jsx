import { useEffect, useState } from "react";
import { api } from "../../utils/api";

const Profile = () => {
  const [data, setData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);

  // 🔥 LOAD USER DATA
  useEffect(() => {
    api
  .get("/user/me")
      .then((res) => {
        setData({
          name: res.data.name || "",
          phone: res.data.phone || "",
          email: res.data.email || "",
        });
      });
  }, []);

  // 🔥 HANDLE CHANGE
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // 🔥 SAVE PROFILE
  const saveProfile = async () => {
    setLoading(true);

    try {
      await api.put("/user/update", {
        name: data.name,
        phone: data.phone,
      });

      // 🔥 save ke baad data reload
      const res = await api.get("/user/me");

      setData({
        name: res.data.name || "",
        phone: res.data.phone || "",
        email: res.data.email || "",
      });

      alert("Profile Updated ✅");
    } catch {
      alert("Error updating profile");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-lg">

      <h2 className="text-xl font-bold mb-5">My Profile</h2>

      {/* EMAIL */}
      <div className="mb-3">
        <label className="text-sm text-gray-500">Email</label>
        <input
          value={data.email || ""}
          disabled
          className="w-full border p-2 rounded bg-gray-100"
        />
      </div>

      {/* NAME */}
      <div className="mb-3">
        <label className="text-sm text-gray-500">Name</label>
        <input
          name="name"
          value={data.name || ""}
          onChange={handleChange}
          placeholder="Enter your name"
          className="w-full border p-2 rounded"
        />
      </div>

      {/* PHONE */}
      <div className="mb-4">
        <label className="text-sm text-gray-500">Phone</label>
        <input
          name="phone"
          value={data.phone || ""}
          onChange={handleChange}
          placeholder="Enter phone number"
          className="w-full border p-2 rounded"
        />
      </div>

      {/* SAVE BUTTON */}
      <button
        onClick={saveProfile}
        className="w-full bg-pink-600 text-white py-2 rounded-lg font-semibold"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>

    </div>
  );
};

export default Profile;
