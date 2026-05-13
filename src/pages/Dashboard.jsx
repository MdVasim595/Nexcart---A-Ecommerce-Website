import { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Profile from "../components/dashboard/Profile";
import Orders from "../components/dashboard/Orders";
import Wishlist from "../components/dashboard/Wishlist";
import Address from "../components/dashboard/Address";
import Resell from "../components/dashboard/Resell";
import Settings from "../components/dashboard/Settings";
import SummaryCards from "../components/dashboard/SummaryCards";
import Earnings from "../components/dashboard/Earnings";

const Dashboard = () => {
  const [tab, setTab] = useState("summary");

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar setTab={setTab} />

      <div className="flex-1 p-6">
        {tab === "summary" && <SummaryCards />}
        {tab === "profile" && <Profile />}
        {tab === "orders" && <Orders />}
        {tab === "wishlist" && <Wishlist />}
        {tab === "address" && <Address />}
        {tab === "resell" && <Resell />}
        {tab === "earnings" && <Earnings />}
        {tab === "settings" && <Settings />}
      </div>
    </div>
  );
};

export default Dashboard;