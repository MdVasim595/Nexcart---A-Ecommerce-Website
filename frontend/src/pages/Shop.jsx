import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { useLocation } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const Shop = () => {
  const [allProducts, setAllProducts] = useState([]); // 🔥 NEW
  const [category, setCategory] = useState("All");

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const search = query.get("search");
  const categoryQuery = query.get("category");

  // 🔥 LOAD FROM DB
  useEffect(() => {
   axios.get(`${API_URL}/product`)
      .then(res => {
        setAllProducts(res.data);
      });
  }, []);

  // 🔥 FILTER LOGIC (same as before)
  const products = useMemo(() => {
    let data = [...allProducts];

    // 🔍 Search
    if (search) {
      data = data.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 📦 Category button
    if (category !== "All") {
      data = data.filter((p) => p.category === category);
    }

    // 📦 URL category
    if (categoryQuery) {
      data = data.filter((p) => p.category === categoryQuery);
    }

    return data;

  }, [search, category, categoryQuery, allProducts]);

  // 🔥 Dynamic categories (DB se)
  const categories = ["All", ...new Set(allProducts.map((p) => p.category))];

  return (
    <div className="p-6">

      {/* Category buttons */}
      <div className="flex gap-3 mb-4 flex-wrap">
        {categories.map((c, i) => (
          <button
            key={i}
            onClick={() => setCategory(c)}
            className={`px-3 py-1 rounded ${
              category === c ? "bg-yellow-400" : "bg-gray-200"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.length ? (
          products.map((p) => (
            <ProductCard key={p._id} item={p} /> // 🔥 FIX (_id)
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>

    </div>
  );
};

export default Shop;
