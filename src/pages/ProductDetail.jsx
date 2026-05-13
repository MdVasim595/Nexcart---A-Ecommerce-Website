import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { getData, setData } from "../utils/localStorageHelper";

const ProductDetail = () => {
  const { id } = useParams();
  const nav = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  // 🔥 FETCH FROM DB
  useEffect(() => {
    axios.get("http://localhost:5000/api/product")
      .then(res => {
        const found = res.data.find(p => p._id === id);
        setProduct(found);
        setSelectedImage(found?.image);
      });
  }, [id]);

  if (!product) return <div className="p-6">Loading...</div>;

  // 🔥 ADD TO CART
  const addCart = () => {
    const cart = getData("cart");

    const item = {
      id: product._id, // 🔥 FIX
      title: product.title,
      price: Number(product.price),
      image: product.image,
      selectedSize: selectedSize || null
    };

    setData("cart", [...cart, item]);
    alert("Added to cart");
  };

  // 🔥 BUY NOW
  const buyNow = () => {
    if (product.sizes?.length && !selectedSize) {
      alert("Please select size");
      return;
    }

    const item = {
      id: product._id,
      title: product.title,
      price: Number(product.price),
      image: product.image,
      selectedSize: selectedSize || null
    };

    setData("cart", [item]);
    nav("/checkout");
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6 md:p-10">
      <div className="bg-white p-6 rounded shadow grid md:grid-cols-2 gap-10">

        {/* LEFT IMAGE */}
        <div className="flex justify-center">
          <img
            src={selectedImage}
            alt={product.title}
            className="w-96 object-contain"
          />
        </div>

        {/* RIGHT DETAILS */}
        <div>
          <h1 className="text-2xl font-bold">{product.title}</h1>

          <p className="text-gray-500 mt-2">
            ⭐ 3.8 | 11,000+ ratings
          </p>

          <p className="text-2xl font-bold mt-3">
            ₹{product.price}
          </p>

          {/* SIZE */}
          {product.sizes?.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Select Size</h3>

              <div className="flex gap-3 flex-wrap">
                {product.sizes.map((size, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-full ${
                      selectedSize === size
                        ? "bg-pink-500 text-white"
                        : ""
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* BUTTONS */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={addCart}
              className="border border-pink-500 text-pink-500 px-6 py-2 rounded"
            >
              Add to Cart
            </button>

            <button
              onClick={buyNow}
              className="bg-pink-600 text-white px-6 py-2 rounded"
            >
              Buy Now
            </button>
          </div>

          {/* DESCRIPTION */}
          <div className="mt-8">
            <h2 className="font-semibold text-lg mb-2">
              Product Description
            </h2>
            <p className="text-gray-600">
              {product.description || "No description available"}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;