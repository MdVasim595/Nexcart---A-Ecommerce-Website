import { useNavigate } from "react-router-dom";

const Settings = () => {
  const nav = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.reload();
  };

  const deleteAccount = () => {
    const confirmDelete = window.confirm("Are you sure you want to delete account?");

    if (confirmDelete) {
      // 🔥 future backend API call yaha hoga
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      alert("Account deleted (demo)");
      nav("/");
      window.location.reload();
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-md">

      <h2 className="text-xl font-bold mb-4">Account Settings</h2>

      {/* Logout */}
      <button
        onClick={logout}
        className="w-full bg-red-500 text-white py-2 rounded mb-3"
      >
        Logout
      </button>

      {/* Delete Account */}
      <button
        onClick={deleteAccount}
        className="w-full bg-black text-white py-2 rounded"
      >
        Delete Account
      </button>

    </div>
  );
};

export default Settings;
