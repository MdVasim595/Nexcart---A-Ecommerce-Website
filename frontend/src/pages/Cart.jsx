import { getData } from "../utils/localStorageHelper";

const Cart = () => {
  const cart = getData("cart");

  return (
    <div className="p-6">
      {cart.map((c, i) => (
        <div key={i} className="border p-3 mb-2 flex justify-between">
          <h2>{c.title}</h2>
          <p>₹{c.price}</p>
        </div>
      ))}
    </div>
  );
};

export default Cart;