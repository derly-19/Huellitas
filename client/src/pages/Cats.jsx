// src/pages/cats.jsx
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function Gatitos() {
  const cats = [
    { name: "Luna", img: "https://i.pinimg.com/736x/72/8c/9e/728c9e38d3db6dd75d6b27f7e3cb6e12.jpg" },
    { name: "Milo", img: "https://i.pinimg.com/736x/21/22/b6/2122b640f5d097a3a04ef0df628e71e4.jpg" },
    { name: "Nube", img: "https://i.pinimg.com/564x/07/13/5e/07135ed90c08bb06b228748a8200cf2f.jpg" },
    { name: "Simba", img: "https://i.pinimg.com/736x/0a/5c/19/0a5c195112a9fbcfbe285a7ff96e65e2.jpg" },
    { name: "Cleo", img: "https://i.pinimg.com/736x/f8/87/60/f8876048b623c63d8a1cf2dfcb0c8d7d.jpg" },
  ];

  return (
    <>

      {/* Hero */}
      <section className="bg-[#FDF8F5] text-center py-12">
        <h1 className="text-3xl font-bold text-gray-900">Gatitos en adopción</h1>
        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
          Estos gatitos buscan un hogar cálido y lleno de cariño.  
          ¿Te animas a darles una segunda oportunidad?
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
        {["Color", "Edad", "Sexo"].map((filtro, i) => (
          <button
            key={i}
            className="bg-[#EDE4D6] px-6 py-2 rounded-full shadow hover:bg-[#d6c9b5] transition"
          >
            {filtro} ⌄
          </button>
        ))}
      </motion.div>

      {/* Grid de Gatitos */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-6 max-w-6xl mx-auto my-10">
        {cats.map((cat, i) => (
          <motion.div
            key={i}
            className="bg-[#EDE4D6] rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <img src={cat.img} alt={cat.name} className="w-full h-48 object-cover" />
            <div className="p-4 text-left">
              <h3 className="font-bold text-lg">{cat.name}</h3>
              <p className="text-sm text-gray-600 mt-2">
                <span className="font-semibold">Cariñoso</span> •
                <span className="font-semibold"> Curioso</span> •
                <span className="font-semibold"> Juguetón</span>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Este gatito espera un hogar lleno de amor ❤️
              </p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Paginación */}
      <div className="flex justify-center items-center gap-2 my-10">
        {[1, 2, 3, "...", 34].map((page, i) => (
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
