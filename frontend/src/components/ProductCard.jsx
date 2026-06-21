import { setData, getData } from "../utils/localStorageHelper";
import { Link } from "react-router-dom";

const ProductCard = ({ item }) => {
  const addCart = () => {
    const cart = getData("cart");
    cart.push(item);
    setData("cart", cart);
    alert("Added to cart");
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden group border border-gray-100">
      
      {/* Image Section */}
      <Link to={`/product/${item._id}`} className="block relative">
        <div className="w-full h-52 flex items-center justify-center bg-gray-100 rounded-t-xl">
  <img
    src={item.image}
    alt={item.title}
    className="max-h-full max-w-full object-contain"
    loading="lazy"
  />
</div>

        {/* Optional badge */}
        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
          New
        </span>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link to={`/product/${item._id}`}>
          <h2 className="font-semibold text-gray-800 text-sm line-clamp-2 hover:text-yellow-600 transition">
            {item.title}
          </h2>
        </Link>

        {/* Price */}
        <p className="text-red-500 font-bold text-lg mt-1">
          ₹{item.price}
        </p>

        {/* Button */}
        <button
          onClick={addCart}
          className="mt-3 w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 rounded-lg transition duration-300"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;