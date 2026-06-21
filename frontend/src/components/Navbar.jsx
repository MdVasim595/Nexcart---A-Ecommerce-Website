import { Link, useNavigate } from "react-router-dom";
import { getUser, getData } from "../utils/localStorageHelper";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { MdOutlineShoppingBag, MdLogout } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useState, useEffect } from "react";

const Navbar = () => {
  const nav = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setUser(getUser());
    setCartCount(getData("cart").length);
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <div className="bg-[#131921] text-white px-6 py-3 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-yellow-400">
        ShopHub
      </Link>

      {/* Search */}
      <div className="flex items-center w-[45%] mx-auto">
        <div className="flex w-full bg-white rounded-xl shadow-md overflow-hidden border">
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 outline-none text-gray-700"
          />

          <button
            onClick={() => nav(`/shop?search=${search}`)}
            className="bg-pink-300 hover:bg-pink-400 px-4"
          >
            🔍
          </button>
        </div>
      </div>

      <div className="flex gap-5 items-center">
        <Link to="/">Home</Link>
        <Link to="/shop">Shop</Link>
        <Link to="/reseller">Reseller</Link>

        <div
  className="relative"
  onMouseEnter={() => setShowMenu(true)}
  onMouseLeave={() => setShowMenu(false)}
>
  <div
    className="flex items-center gap-1 cursor-pointer"
    onClick={() => setShowMenu(!showMenu)}
  >
    <FaUserCircle size={22} />
    <span className="text-sm">Profile</span>
  </div>

  {showMenu && (
    <div className="absolute right-0 mt-0 w-64 bg-white text-black rounded-xl shadow-xl z-50 overflow-hidden">

      {/* TOP SECTION */}
      {!user ? (
        <div className="p-4 border-b">
          <p className="font-semibold text-gray-800">Hello User</p>
          <p className="text-xs text-gray-500 mb-3">
            To access your account
          </p>

          <button
            onClick={() => nav("/register")}
            className="w-full bg-pink-600 text-white py-2 rounded-lg font-semibold"
          >
            Sign Up
          </button>
        </div>
      ) : (
        <div className="p-4 border-b flex items-center gap-3">
          <FaUserCircle size={35} className="text-gray-400" />

          <div>
            <p className="font-semibold text-gray-800">
              Hello User
            </p>
            <p className="text-sm text-gray-500">
              {user.email}
            </p>
          </div>
        </div>
      )}

      {/* MENU ITEMS */}
      {user && (
        <div>

          {/* Orders */}
          <div
            onClick={() => nav("/dashboard")}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer"
          >
            <MdOutlineShoppingBag />
            <span>My Orders</span>
          </div>

          {/* Delete */}
          <div
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer"
          >
            <RiDeleteBin6Line />
            <span>Delete Account</span>
          </div>

          {/* Logout */}
          <div
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer text-red-500"
          >
            <MdLogout />
            <span>Logout</span>
          </div>

        </div>
      )}

    </div>
  )}
</div>

        <Link to="/admin-login">Admin</Link>

        <Link to="/cart" className="flex items-center gap-1 relative">
          <FaShoppingCart />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-yellow-400 text-black text-xs px-1 rounded">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </div>
  );
};

export default Navbar;