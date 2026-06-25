import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";

const AdminLogin = () => {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const { data } = await api.post("/auth/admin-login", form);
      sessionStorage.setItem("adminToken", data.token);
      nav("/admin");
    } catch {
      alert("Wrong admin credentials");
    } finally { setLoading(false); }
  };

  return <div className="flex justify-center items-center h-[80vh]"><div className="bg-white p-6 shadow rounded w-80 space-y-3">
    <h2 className="font-bold text-xl">Admin Login</h2>
    <input type="email" autoComplete="username" placeholder="Email" className="border p-2 w-full" onChange={(e) => setForm({ ...form, email: e.target.value })} />
    <input type="password" autoComplete="current-password" placeholder="Password" className="border p-2 w-full" onChange={(e) => setForm({ ...form, password: e.target.value })} />
    <button disabled={loading} onClick={handleLogin} className="bg-yellow-400 w-full py-2 rounded">{loading ? "Signing in..." : "Login"}</button>
  </div></div>;
};

export default AdminLogin;
