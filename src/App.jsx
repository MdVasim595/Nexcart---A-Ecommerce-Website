import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import Reseller from "./pages/Reseller";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import ResellerOrders from "./pages/ResellerOrders";
import Withdraw from "./pages/Withdraw";
import Analytics from "./pages/Analytics";
import Orders from "./pages/Orders";
import Payment from "./pages/Payment";
import OrderDetail from "./pages/OrderDetail";


function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reseller" element={<Reseller />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route path="/reseller-orders" element={<ResellerOrders />} />
        <Route path="/withdraw" element={<Withdraw />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/orders" element={<Orders />} />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route path="/order/:id" element={<OrderDetail />} />

      </Routes>
    </div>
  );
}

export default App;