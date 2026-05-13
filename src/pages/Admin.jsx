import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

const Admin = () => {
  const [tab, setTab] = useState("dashboard");

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetailLoading, setUserDetailLoading] = useState(false);
  const [userDetailError, setUserDetailError] = useState("");

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pending: 0,
    delivered: 0,
  });

  const [form, setForm] = useState({
    title: "",
    price: "",
    category: "",
    image: "",
    description: "",
    sizes: "",
    featured: false,
  });

  useEffect(() => {
    fetchOrders();
    fetchProducts();
    fetchUsers();
    fetchStats();
  }, []);

  const fetchOrders = async () => {
    const res = await axios.get(`${API_URL}/order`);
    setOrders(res.data);
  };

  const fetchProducts = async () => {
    const res = await axios.get(`${API_URL}/product`);
    setProducts(res.data);
  };

  const fetchUsers = async () => {
    const res = await axios.get(`${API_URL}/user/admin/all`);
    setUsers(res.data);
  };

  const fetchStats = async () => {
    const res = await axios.get(`${API_URL}/order/stats/summary`);
    setStats(res.data);
  };

  const fetchUserDetail = async (email) => {
    setUserDetailLoading(true);
    setUserDetailError("");

    try {
      const res = await axios.get(
        `${API_URL}/user/admin/${encodeURIComponent(email)}`
      );
      setSelectedUser(res.data);
    } catch (err) {
      setSelectedUser(null);
      setUserDetailError("Unable to load user details");
    }

    setUserDetailLoading(false);
  };

  const addProduct = async () => {
    if (!form.title || !form.price) return alert("Fill fields");

    await axios.post(`${API_URL}/product/add`, {
      ...form,
      sizes: form.sizes ? form.sizes.split(",").map((s) => s.trim()) : [],
    });

    alert("Product added");
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    await axios.delete(`${API_URL}/product/${id}`);
    fetchProducts();
  };

  const updateStatus = async (id, status) => {
    await axios.put(`${API_URL}/order/${id}`, { status });
    fetchOrders();
  };

  const openUsers = () => {
    setTab("users");
    setSelectedUser(null);
    setUserDetailError("");
  };

  const formatDate = (value) => {
    if (!value) return "Not available";
    return new Date(value).toLocaleString();
  };

  const showValue = (value) => {
    if (value === null || value === undefined || value === "") return "Not available";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (Array.isArray(value)) return value.length ? `${value.length} saved` : "None";
    if (typeof value === "object") return JSON.stringify(value);
    return value;
  };

  const DetailRow = ({ label, value }) => (
    <div className="border-b border-gray-100 py-2">
      <p className="text-xs uppercase text-gray-500">{label}</p>
      <p className="font-medium break-words">{showValue(value)}</p>
    </div>
  );

  const renderObjectDetails = (data, hiddenKeys = []) => {
    if (!data || Object.keys(data).length === 0) {
      return <p className="text-gray-500">No details saved</p>;
    }

    return Object.entries(data)
      .filter(([key]) => !hiddenKeys.includes(key))
      .map(([key, value]) => <DetailRow key={key} label={key} value={value} />);
  };

  const renderAddress = (address, index) => (
    <div key={index} className="border p-3 rounded mb-3">
      {renderObjectDetails(address)}
    </div>
  );

  const renderOrder = (order) => (
    <div key={order._id} className="border p-3 rounded mb-3">
      <div className="flex flex-col md:flex-row md:justify-between gap-2 mb-2">
        <div>
          <p className="font-semibold">Order #{order._id}</p>
          <p className="text-sm text-gray-500">{formatDate(order.date)}</p>
        </div>
        <div className="md:text-right">
          <p><b>Status:</b> {order.status}</p>
          <p><b>Final Amount:</b> Rs {order.finalAmount || 0}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold mb-2">Order Details</h4>
          <DetailRow label="Payment" value={order.payment} />
          <DetailRow label="Total" value={`Rs ${order.total || 0}`} />
          <DetailRow label="Items" value={order.items?.length || 0} />
          <DetailRow label="Resell" value={order.resell} />
          <DetailRow label="Margin" value={order.margin ? `Rs ${order.margin}` : ""} />
          <DetailRow label="Brand Name" value={order.brandName} />
        </div>

        <div>
          <h4 className="font-semibold mb-2">Delivery Address</h4>
          {renderObjectDetails(order.address)}
        </div>
      </div>
    </div>
  );

  const renderAdminOrderItem = (item, index) => {
    const productId = item.id || item._id || item.productId || "Not available";
    const image = item.image || item.images?.[0];

    return (
      <div key={`${productId}-${index}`} className="border rounded p-3 flex gap-3">
        <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center shrink-0">
          {image ? (
            <img
              src={image}
              alt={item.title || "Product"}
              className="w-full h-full object-contain rounded"
            />
          ) : (
            <span className="text-xs text-gray-500 text-center px-2">No image</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-semibold break-words">{item.title || "Untitled product"}</p>
          <p className="text-sm text-gray-600 break-words">
            <b>Product ID:</b> {productId}
          </p>
          <p className="text-sm text-gray-600">
            <b>Price:</b> Rs {item.price || 0}
          </p>
          <p className="text-sm text-gray-600">
            <b>Quantity:</b> {item.quantity || item.qty || 1}
          </p>
          {item.selectedSize && (
            <p className="text-sm text-gray-600">
              <b>Size:</b> {item.selectedSize}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <div className="md:hidden bg-black text-white p-4 flex justify-between items-center">
        <h2 className="font-bold">Admin</h2>
        <button onClick={() => setTab("dashboard")}>Home</button>
      </div>

      <div className="w-full md:w-60 bg-black text-white p-4 flex md:flex-col justify-around md:justify-start">
        <h2 className="hidden md:block text-xl font-bold mb-6">Admin Panel</h2>

        <p onClick={() => setTab("dashboard")} className="cursor-pointer mb-3">Dashboard</p>
        <p onClick={() => setTab("products")} className="cursor-pointer mb-3">Products</p>
        <p onClick={() => setTab("orders")} className="cursor-pointer mb-3">Orders</p>
        <p onClick={openUsers} className="cursor-pointer">Users</p>
      </div>

      <div className="flex-1 p-4 md:p-6 overflow-x-auto">
        {tab === "dashboard" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 shadow rounded">
              <p>Total Orders</p>
              <h2 className="text-xl font-bold">{stats.totalOrders}</h2>
            </div>

            <div className="bg-white p-4 shadow rounded">
              <p>Revenue</p>
              <h2 className="text-xl font-bold">Rs {stats.totalRevenue}</h2>
            </div>

            <div className="bg-white p-4 shadow rounded">
              <p>Pending</p>
              <h2 className="text-xl font-bold">{stats.pending}</h2>
            </div>

            <div className="bg-white p-4 shadow rounded">
              <p>Delivered</p>
              <h2 className="text-xl font-bold">{stats.delivered}</h2>
            </div>
          </div>
        )}

        {tab === "products" && (
          <>
            <h2 className="font-bold mb-4">Add Product</h2>

            <div className="bg-white p-4 shadow rounded mb-4">
              <input placeholder="Title" className="border p-2 w-full mb-2" onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <input placeholder="Price" className="border p-2 w-full mb-2" onChange={(e) => setForm({ ...form, price: e.target.value })} />
              <input placeholder="Category" className="border p-2 w-full mb-2" onChange={(e) => setForm({ ...form, category: e.target.value })} />
              <input placeholder="Image URL" className="border p-2 w-full mb-2" onChange={(e) => setForm({ ...form, image: e.target.value })} />
              <input placeholder="Description" className="border p-2 w-full mb-2" onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <input placeholder="Sizes (S,M,L)" className="border p-2 w-full mb-2" onChange={(e) => setForm({ ...form, sizes: e.target.value })} />

              <div className="flex items-center gap-2 mb-2">
                <input type="checkbox" onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                <label>Featured</label>
              </div>

              <button onClick={addProduct} className="bg-yellow-400 w-full py-2 rounded">
                Add Product
              </button>
            </div>

            {products.map((p) => (
              <div key={p._id} className="bg-white p-3 shadow mb-2 flex justify-between items-center">
                <div>
                  <p className="font-bold">{p.title}</p>
                  <p>Rs {p.price}</p>
                  <p className="text-sm">{p.description}</p>
                  <p className="text-sm text-gray-500">Sizes: {p.sizes?.join(", ")}</p>
                </div>

                <button onClick={() => deleteProduct(p._id)} className="bg-red-500 text-white px-3 py-1 rounded">
                  Delete
                </button>
              </div>
            ))}
          </>
        )}

        {tab === "orders" && (
          <>
            <h2 className="font-bold mb-4">Customer Orders</h2>

            {orders.map((o) => (
              <div key={o._id} className="bg-white p-4 shadow mb-3 rounded">
                <div className="flex flex-col md:flex-row md:justify-between gap-3">
                  <div>
                    <p className="font-semibold">Order #{o._id}</p>
                    <p><b>User Email:</b> {o.email || "Not available"}</p>
                    <p><b>Customer:</b> {o.address?.name || "Not available"}</p>
                    <p><b>Contact:</b> {o.address?.phone || "Not available"}</p>
                    <p><b>Items:</b> {o.itemsCount}</p>
                    <p><b>Payment:</b> {o.payment}</p>
                  </div>

                  <div className="md:text-right">
                    <p><b>Date:</b> {formatDate(o.date)}</p>
                    <p>Total: Rs {o.total}</p>
                    <p>Final: Rs {o.finalAmount}</p>
                    <p>Status: <b>{o.status}</b></p>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Ordered Products</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {o.items?.length ? (
                      o.items.map(renderAdminOrderItem)
                    ) : (
                      <p className="text-gray-500">No product details saved for this order</p>
                    )}
                  </div>
                </div>

                {o.address && (
                  <div className="mt-4 bg-gray-50 p-3 rounded">
                    <p className="font-semibold mb-1">Delivery Address</p>
                    <p>{o.address.name}</p>
                    <p>{o.address.house}, {o.address.area}</p>
                    <p>{o.address.city}, {o.address.state} {o.address.pincode}</p>
                  </div>
                )}

                <select
                  value={o.status}
                  onChange={(e) => updateStatus(o._id, e.target.value)}
                  className="border p-2 mt-4 rounded"
                >
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            ))}
          </>
        )}

        {tab === "users" && (
          <>
            {!selectedUser && (
              <>
                <h2 className="font-bold mb-4">All Users</h2>

                {userDetailError && (
                  <p className="bg-red-100 text-red-700 p-3 rounded mb-3">
                    {userDetailError}
                  </p>
                )}

                {users.map((u) => (
                  <button
                    key={u._id}
                    onClick={() => fetchUserDetail(u.email)}
                    className="bg-white p-4 shadow mb-3 rounded w-full text-left hover:bg-yellow-50 transition"
                  >
                    <div className="flex flex-col md:flex-row md:justify-between gap-2">
                      <div>
                        <p><b>Name:</b> {u.name || "Not available"}</p>
                        <p><b>Email:</b> {u.email}</p>
                        <p><b>Phone:</b> {u.phone || "Not available"}</p>
                      </div>

                      <div className="md:text-right">
                        <p>Orders: {u.totalOrders}</p>
                        <p>Spend: Rs {u.totalSpend}</p>
                        <p>{u.isVerified ? "Verified" : "Not Verified"}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </>
            )}

            {userDetailLoading && (
              <div className="bg-white p-4 shadow rounded">Loading user details...</div>
            )}

            {selectedUser && !userDetailLoading && (
              <div>
                <button onClick={() => setSelectedUser(null)} className="bg-black text-white px-4 py-2 rounded mb-4">
                  Back to Users
                </button>

                <div className="bg-white p-4 shadow rounded mb-4">
                  <div className="flex flex-col md:flex-row md:justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold">{selectedUser.user?.name || "User Detail"}</h2>
                      <p className="text-gray-600">{selectedUser.user?.email}</p>
                    </div>
                    <div className="md:text-right">
                      <p><b>Total Orders:</b> {selectedUser.totalOrders}</p>
                      <p><b>Total Spend:</b> Rs {selectedUser.totalSpend}</p>
                      <p><b>Status:</b> {selectedUser.user?.isVerified ? "Verified" : "Not Verified"}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white p-4 shadow rounded">
                    <h3 className="font-bold mb-3">Profile & Contact</h3>
                    <DetailRow label="Name" value={selectedUser.user?.name} />
                    <DetailRow label="Email" value={selectedUser.user?.email} />
                    <DetailRow label="Phone" value={selectedUser.user?.phone} />
                    <DetailRow label="Verified" value={selectedUser.user?.isVerified} />
                    <DetailRow label="Created At" value={formatDate(selectedUser.user?.createdAt)} />
                  </div>

                  <div className="bg-white p-4 shadow rounded">
                    <h3 className="font-bold mb-3">Bank / Payout Details</h3>
                    {renderObjectDetails(selectedUser.user?.payout)}
                  </div>
                </div>

                <div className="bg-white p-4 shadow rounded mb-4">
                  <h3 className="font-bold mb-3">Saved Addresses</h3>
                  {selectedUser.user?.addresses?.length
                    ? selectedUser.user.addresses.map(renderAddress)
                    : <p className="text-gray-500">No saved addresses</p>}
                </div>

                <div className="bg-white p-4 shadow rounded mb-4">
                  <h3 className="font-bold mb-3">Other Stored User Details</h3>
                  {renderObjectDetails(selectedUser.user, [
                    "_id",
                    "__v",
                    "otp",
                    "name",
                    "email",
                    "phone",
                    "isVerified",
                    "createdAt",
                    "payout",
                    "addresses",
                  ])}
                </div>

                <div className="bg-white p-4 shadow rounded">
                  <h3 className="font-bold mb-3">Orders</h3>
                  {selectedUser.orders?.length
                    ? selectedUser.orders.map(renderOrder)
                    : <p className="text-gray-500">No orders found</p>}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;
