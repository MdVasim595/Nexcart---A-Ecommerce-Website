import { useEffect, useState } from "react";

const banners = [
  {
    img: "https://idaho-o.com/cdn/shop/files/SAVE_20250813_171048.jpg?v=1755188614&width=1600",
    // title: "Mega Fashion Sale",
  },
  {
    img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    title: "Electronics Deals",
  },
  {
    img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7",
    title: "Home Essentials",
  },
];

const BannerSlider = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((prev) => (prev + 1) % banners.length),
      3000
    );
    return () => clearInterval(timer);
  }, []);

  const prev = () =>
    setIndex((index - 1 + banners.length) % banners.length);

  const next = () => setIndex((index + 1) % banners.length);

  return (
   <div className="relative h-[350px] md:h-[520px] overflow-hidden">
      <img
        src={banners[index].img}
        className="w-full h-full object-cover"
      />

      {/* Overlay text */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
        <h2 className="text-white text-2xl md:text-4xl font-bold">
          {banners[index].title}
        </h2>
      </div>

      {/* Buttons */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 bg-white px-3 py-1"
      >
        ◀
      </button>

      <button
        onClick={next}
        className="absolute right-2 top-1/2 bg-white px-3 py-1"
      >
        ▶
      </button>
    </div>
  );
};

export default BannerSlider;