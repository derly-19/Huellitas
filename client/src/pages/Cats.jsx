// src/pages/cats.jsx
import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

// Importar imágenes locales desde src/assets (si moviste las imágenes ahí)
import g1 from "../assets/g1.jpg";
import g2 from "../assets/g2.jpg";
import g3 from "../assets/g3.jpg";
import g4 from "../assets/g4.jpg";
import g5 from "../assets/g5.jpg";

export default function Gatitos() {
  const [selectedCat, setSelectedCat] = useState(null);
  // Estados para filtros y control de menú de filtros
  const [openFilter, setOpenFilter] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedAge, setSelectedAge] = useState(null);
  const [selectedSex, setSelectedSex] = useState(null);

  const cats = [
    {
      name: "Luna",
      img: g1,
      desc: "Luna es dulce y tranquila, disfruta acurrucarse en lugares soleados.",
      edad: "Joven",
      tamaño: "Pequeña",
      sexo: "Hembra",
      fundacion: "Patitas de Amor",
    },
    {
      name: "Simba",
      img: g2,
      desc: "Simba es curioso y muy juguetón, le encanta explorar.",
      edad: "Cachorro",
      tamaño: "Mediano",
      sexo: "Macho",
      fundacion: "Gatitos Felices",
    },
    {
      name: "Misu",
      img: g3,
      desc: "Misu es independiente, pero adora las caricias cuando tiene confianza.",
      edad: "Adulto",
      tamaño: "Mediano",
      sexo: "Hembra",
      fundacion: "Refugio Esperanza",
    },
    {
      name: "Tom",
      img: g4,
      desc: "Tom es un gato cariñoso que siempre busca compañía.",
      edad: "Adulto",
      tamaño: "Grande",
      sexo: "Macho",
      fundacion: "Amigos Felinos",
    },
    {
      name: "Nieve",
      img: g5,
      desc: "Nieve es tranquila, ideal para familias que busquen calma.",
      edad: "Joven",
      tamaño: "Pequeña",
      sexo: "Hembra",
      fundacion: "Colitas Suaves",
    },
  ];

  return (
    <>
      {/* Filtros */}
      <motion.div
        className="flex justify-center gap-4 my-6 flex-wrap relative"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.1 }}
        viewport={{ once: true }}
      >
        {/* Filtro Tamaño */}
        <div className="relative">
          <button
            onClick={() => setOpenFilter(openFilter === 'Tamaño' ? null : 'Tamaño')}
            className={`px-6 py-3 rounded-full shadow ${selectedSize ? 'bg-white ring-2 ring-[#BCC990]' : 'bg-[#EDE4D6]'} transition`}
          >
            {selectedSize ? `Tamaño: ${selectedSize}` : 'Tamaño'} ⌄
          </button>
          {openFilter === 'Tamaño' && (
            <div className="absolute left-0 mt-2 bg-white rounded-lg shadow-md p-3 w-40 z-20">
              {['Pequeña','Mediano','Grande'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => { setSelectedSize(opt); setOpenFilter(null); }}
                  className={`block w-full text-left px-2 py-1 rounded hover:bg-[#F3F1EE] ${selectedSize===opt? 'font-semibold':''}`}
                >
                  {opt}
                </button>
              ))}
              <button onClick={()=>{setSelectedSize(null); setOpenFilter(null);}} className="mt-2 text-sm text-gray-500">Limpiar</button>
            </div>
          )}
        </div>

        {/* Filtro Edad */}
        <div className="relative">
          <button
            onClick={() => setOpenFilter(openFilter === 'Edad' ? null : 'Edad')}
            className={`px-6 py-3 rounded-full shadow ${selectedAge ? 'bg-white ring-2 ring-[#BCC990]' : 'bg-[#EDE4D6]'} transition`}
          >
            {selectedAge ? `Edad: ${selectedAge}` : 'Edad'} ⌄
          </button>
          {openFilter === 'Edad' && (
            <div className="absolute left-0 mt-2 bg-white rounded-lg shadow-md p-3 w-40 z-20">
              {['Cachorro','Joven','Adulto'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => { setSelectedAge(opt); setOpenFilter(null); }}
                  className={`block w-full text-left px-2 py-1 rounded hover:bg-[#F3F1EE] ${selectedAge===opt? 'font-semibold':''}`}
                >
                  {opt}
                </button>
              ))}
              <button onClick={()=>{setSelectedAge(null); setOpenFilter(null);}} className="mt-2 text-sm text-gray-500">Limpiar</button>
            </div>
          )}
        </div>

        {/* Filtro Sexo */}
        <div className="relative">
          <button
            onClick={() => setOpenFilter(openFilter === 'Sexo' ? null : 'Sexo')}
            className={`px-6 py-3 rounded-full shadow ${selectedSex ? 'bg-white ring-2 ring-[#BCC990]' : 'bg-[#EDE4D6]'} transition`}
          >
            {selectedSex ? `Sexo: ${selectedSex}` : 'Sexo'} ⌄
          </button>
          {openFilter === 'Sexo' && (
            <div className="absolute left-0 mt-2 bg-white rounded-lg shadow-md p-3 w-40 z-20">
              {['Hembra','Macho'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => { setSelectedSex(opt); setOpenFilter(null); }}
                  className={`block w-full text-left px-2 py-1 rounded hover:bg-[#F3F1EE] ${selectedSex===opt? 'font-semibold':''}`}
                >
                  {opt}
                </button>
              ))}
              <button onClick={()=>{setSelectedSex(null); setOpenFilter(null);}} className="mt-2 text-sm text-gray-500">Limpiar</button>
            </div>
          )}
        </div>

      </motion.div>
      

      {/* Grid de Gatitos */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-6 max-w-6xl mx-auto my-10">
        {cats
          .filter((cat) => {
            const normalize = (s) => (s || "").toLowerCase().replace(/[ao]$/,'');
            if (selectedSize && normalize(cat.tamaño) !== normalize(selectedSize)) return false;
            if (selectedAge && normalize(cat.edad) !== normalize(selectedAge)) return false;
            if (selectedSex && cat.sexo.toLowerCase() !== selectedSex.toLowerCase()) return false;
            return true;
          })
          .map((cat, i) => (
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
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50">
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
