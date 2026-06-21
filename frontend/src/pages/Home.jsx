import { useEffect, useState } from "react";
import axios from "axios";
import BannerSlider from "../components/BannerSlider";
import CategoryCards from "../components/CategoryCards";
import HomeProductSection from "../components/HomeProductSection";

const Home = () => {

  const [products, setProducts] = useState([]);

  // 🔥 DB se load
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/product`)
      .then(res => setProducts(res.data));
  }, []);

  return (
    <div>
      <CategoryCards />
      <BannerSlider />

      {/* 🔥 Products pass karo */}
      <HomeProductSection
        title="Wedding Collection"
        category="Wedding Collection"
        products={products}
      />

      <HomeProductSection
        title="Kurta Collection"
        category="Kurta Sets"
        products={products}
      />

    </div>
  );
};

export default Home;