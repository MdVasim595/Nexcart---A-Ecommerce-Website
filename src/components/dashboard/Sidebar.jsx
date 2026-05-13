const Sidebar = ({ setTab }) => {
  return (
    <div className="w-64 bg-black text-white p-4">
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>

      <p onClick={() => setTab("summary")}>Overview</p>
      <p onClick={() => setTab("profile")}>Profile</p>
      <p onClick={() => setTab("orders")}>Orders</p>
      <p onClick={() => setTab("wishlist")}>Wishlist</p>
      <p onClick={() => setTab("address")}>Address</p>
      <p onClick={() => setTab("resell")}>Resell</p>
      <p onClick={() => setTab("earnings")}>Earnings</p>
      <p onClick={() => setTab("settings")}>Settings</p>
    </div>
  );
};

export default Sidebar;