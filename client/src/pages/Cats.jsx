// src/pages/cats.jsx
import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function Gatitos() {
  const [selectedCat, setSelectedCat] = useState(null);

  const cats = [
    {
      name: "Luna",
      img: "https://i.pinimg.com/originals/1d/40/0e/1d400e79e924b844848049f3e52172b2.jpg",
      desc: "Luna es dulce y tranquila, disfruta acurrucarse en lugares soleados.",
      edad: "Joven",
      tamaño: "Pequeña",
      sexo: "Hembra",
      fundacion: "Patitas de Amor",
    },
    {
      name: "Simba",
      img: "https://i.ytimg.com/vi/BdEKok52qPY/maxresdefault.jpg",
      desc: "Simba es curioso y muy juguetón, le encanta explorar.",
      edad: "Cachorro",
      tamaño: "Mediano",
      sexo: "Macho",
      fundacion: "Gatitos Felices",
    },
    {
      name: "Misu",
      img: "https://hips.hearstapps.com/hmg-prod/images/grumpy-cat-gatos-internet-meme-1582125875.jpg?crop=0.663xw:1.00xh;0.169xw,0&resize=1200:*",
      desc: "Misu es independiente, pero adora las caricias cuando tiene confianza.",
      edad: "Adulto",
      tamaño: "Mediano",
      sexo: "Hembra",
      fundacion: "Refugio Esperanza",
    },
    {
      name: "Tom",
      img: "https://i.pinimg.com/736x/39/de/b5/39deb59ff143470cd25f296b9639f7e4.jpg",
      desc: "Tom es un gato cariñoso que siempre busca compañía.",
      edad: "Adulto",
      tamaño: "Grande",
      sexo: "Macho",
      fundacion: "Amigos Felinos",
    },
    {
      name: "Nieve",
      img: "https://stickerly.pstatic.net/sticker_pack/M6DUfwweCC1PPhJ9HOcpw/DAS3U4/19/-837628409.png",
      desc: "Nieve es tranquila, ideal para familias que busquen calma.",
      edad: "Joven",
      tamaño: "Pequeña",
      sexo: "Hembra",
      fundacion: "Colitas Suaves",
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-[#FAF9F5] text-center py-12">
        <h1 className="text-3xl font-bold text-gray-900">Gatitos en adopción</h1>
        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
          Estos pequeños buscan un hogar lleno de amor.  
          ¿Quieres cambiar sus vidas y la tuya?
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

      {/* Grid de Gatitos */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-6 max-w-6xl mx-auto my-10">
        {cats.map((cat, i) => (
          <motion.div
            key={i}
            onClick={() => setSelectedCat(cat)}
            className="bg-[#EDE4D6] rounded-lg shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer"
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
                <span className="font-semibold"> Juguetón</span> •
                <span className="font-semibold"> Tranquilo</span>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {cat.desc.substring(0, 50)}...
              </p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Modal */}
      {selectedCat && (
        <div className="fixed inset-0  flex items-center justify-center z-50">
          <div className="bg-[#FDF8E7] rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 p-6 relative">
            {/* Cerrar */}
            <button
              onClick={() => setSelectedCat(null)}
              className="absolute top-3 right-3 text-xl font-bold text-gray-700 hover:text-black"
            >
              ✖
            </button>

            <h2 className="text-2xl font-bold mb-4 text-center">{selectedCat.name}</h2>

            <div className="flex flex-col md:flex-row gap-6 items-center">
              <img
                src={selectedCat.img}
                alt={selectedCat.name}
                className="w-48 h-40 object-cover rounded-lg"
              />
              <p className="text-gray-700">{selectedCat.desc}</p>
            </div>

            {/* Info */}
            <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
              <span><strong>Edad:</strong> {selectedCat.edad}</span>
              <span><strong>Tamaño:</strong> {selectedCat.tamaño}</span>
              <span><strong>Sexo:</strong> {selectedCat.sexo}</span>
              <span><strong>Fundación:</strong> {selectedCat.fundacion}</span>
            </div>

            {/* Botón adoptar */}
            <div className="text-center mt-6">
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition">
                🐾 Adoptar a {selectedCat.name}
              </button>
            </div>
          </div>
        </div>
      )}

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
