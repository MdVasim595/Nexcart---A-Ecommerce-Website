import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleLogin = () => {
    if (form.email === "admin@gmail.com" && form.password === "1234") {
      localStorage.setItem("admin", true);
      nav("/admin");
    } else {
      alert("Wrong admin credentials");
    }
  };

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="bg-white p-6 shadow rounded w-80 space-y-3">
        <h2 className="font-bold text-xl">Admin Login</h2>

        <input
          placeholder="Email"
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="Password"
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          onClick={handleLogin}
          className="bg-yellow-400 w-full py-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;