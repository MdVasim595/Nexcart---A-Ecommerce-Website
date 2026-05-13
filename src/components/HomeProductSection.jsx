import { useNavigate } from "react-router-dom";

const HomeProductSection = ({ title, category, products }) => {
  const nav = useNavigate();

  // 🔥 DB se aaye products use kar
  let filtered = products;

  // featured filter
  filtered = filtered.filter(
    (p) => p.featured && (!category || p.category === category)
  );

  // limit
  filtered = filtered.slice(0, 12);

  return (
    <div className="px-4 mt-8">

      {/* Title + view all */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">{title}</h2>

        <button
          onClick={() => nav(`/shop?category=${category}`)}
          className="bg-red-600 text-white px-4 py-1 rounded-full text-sm"
        >
          View All
        </button>
      </div>

      {/* Scroll container */}
      <div className="flex md:overflow-x-auto gap-4 md:pb-2">

        {filtered.map((p) => (
          <div
            key={p._id} // 🔥 FIX
            onClick={() => nav(`/product/${p._id}`)}
            className="min-w-[160px] md:min-w-[260px] bg-white rounded-xl shadow cursor-pointer"
          >
            <img
              src={p.image}
              className="h-[220px] md:h-[320px] w-full object-cover rounded-t-xl"
            />

            <div className="p-2">
              <p className="text-xs md:text-sm">{p.title}</p>
              <p className="text-red-600 font-semibold">₹{p.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeProductSection;
