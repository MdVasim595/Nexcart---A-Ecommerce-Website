import { useNavigate } from "react-router-dom";

const categories = [
  {
    name: "Kurta Sets",
    img: "https://i.pinimg.com/736x/54/46/58/544658b8ab93d5419d6449f76117962f.jpg",
  },
  {
    name: "Suit Sets",
    img: "https://images.unsplash.com/photo-1617137968427-85924c800a22",
  },
  {
    name: "Maxis",
    img: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990",
  },
  {
    name: "Dresses",
    img: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03",
  },
  {
    name: "Tops",
    img: "https://idaho-o.com/cdn/shop/files/IMG_9886_dece5723-640c-4381-a884-4ba61a0b53e3.jpg?v=1744623460",
  },
  {
    name: "Sarees",
    img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c",
  },
  {
    name: "Lehengas",
    img: "https://idaho-o.com/cdn/shop/files/IMG_5990_2a4de460-9a1d-4b82-a639-2be335a68b60.jpg?v=1769765989&width=990",
  },
];

const CategoryCards = () => {
  const nav = useNavigate();

  return (
    <div className="bg-red-800 py-6 min-h-21 overflow-x-auto ">
      <div className="flex gap-8 px-6 min-w-max justify-center">
        {categories.map((c, i) => (
          <div
            key={i}
            onClick={() => nav(`/shop?category=${c.name}`)}
            className="flex flex-col items-center  cursor-pointer group"
          >
            {/* Circle image */}
            <div className="w-38 h-38 rounded-full overflow-hidden  ">
              <img
                src={c.img}
                className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-110"
              />
            </div>

            {/* Name */}
            <p className="text-white mt-2 text-sm">{c.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryCards;