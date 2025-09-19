// src/pages/dogs.jsx
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Perritos() {
  const dogs = [
    { name: "Bella", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnNTDiPRdfGMebY_P_6IPEyW2264DmSupI6Q&s" },
    { name: "Rocky", img: "https://preview.redd.it/as6631550tj61.jpg?auto=webp&s=9f8b41d109ff5bed814b3422efd1f5872a5b63d3" },
    { name: "Nina", img: "https://i.pinimg.com/1200x/5d/a7/42/5da7428cf51bb650635a0cb309c2366d.jpg" },
    { name: "Max", img: "https://i.pinimg.com/736x/39/de/b5/39deb59ff143470cd25f296b9639f7e4.jpg" },
    { name: "Toby", img: "https://e7.pngegg.com/pngimages/582/702/png-clipart-grumpy-cat-meme-humour-mouse-cat-animals-cat-like-mammal-thumbnail.png" },
  ];

  return (
    <>

      {/* Hero */}
      <section className="bg-[#FAF9F5] text-center py-12">
        <h1 className="text-3xl font-bold text-gray-900">Perritos en adopción</h1>
        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
          Estos pequeños buscan un hogar lleno de amor.  
          ¿Te animarías a cambiar sus vidas y la tuya?
        </p>
      </section>

      {/* Filtros */}
      <motion.div
        className="flex justify-center gap-4 my-6 flex-wrap"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        {["Tamaño", "Edad", "Sexo"].map((filtro, i) => (
          <button
            key={i}
            className="bg-[#EDE4D6] px-6 py-2 rounded-full shadow hover:bg-[#d6c9b5] transition"
          >
            {filtro} ⌄
          </button>
        ))}
      </motion.div>

      {/* Grid de Perritos */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-6 max-w-6xl mx-auto my-10">
        {dogs.map((dog, i) => (
          <motion.div
            key={i}
            className="bg-[#EDE4D6] rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <img src={dog.img} alt={dog.name} className="w-full h-48 object-cover" />
            <div className="p-4 text-left">
              <h3 className="font-bold text-lg">{dog.name}</h3>
              <p className="text-sm text-gray-600 mt-2">
                <span className="font-semibold">Tranquilo</span> •
                <span className="font-semibold"> Amistoso</span> •
                <span className="font-semibold"> Juguetón</span>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Este perrito espera un hogar lleno de amor ❤️
              </p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Paginación */}
      <div className="flex justify-center items-center gap-2 my-10">
        {[1, 2, 3, "...", 68].map((page, i) => (
          <button
            key={i}
            className={`px-3 py-1 rounded ${
              page === 1 ? "bg-[var(--primary)] text-white" : "bg-gray-200"
            } hover:bg-[var(--secondary)] hover:text-white transition`}
          >
            {page}
          </button>
        ))}
      </div>

    </>
  );
}
