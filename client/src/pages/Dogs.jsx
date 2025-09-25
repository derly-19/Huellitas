// src/pages/dogs.jsx
import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function Perritos() {
  const [selectedDog, setSelectedDog] = useState(null);

  const dogs = [
    {
      name: "Bella",
      img: "/p1.jpg",
      desc: "Bella es una perrita tranquila, le encanta jugar y busca un hogar lleno de cariño.",
      edad: "Cachorra",
      tamaño: "Pequeña",
      sexo: "Hembra",
      fundacion: "Huellitas de Amor",
    },
    {
      name: "Rocky",
      img: "/p2.jpg",
      desc: "Rocky es un perro lleno de energía, ideal para familias activas.",
      edad: "Adulto",
      tamaño: "Grande",
      sexo: "Macho",
      fundacion: "Corazón Canino",
    },
    {
      name: "Nina",
      img: "/p3.jpg",
      desc: "Nina es amorosa y muy sociable, perfecta para cualquier familia.",
      edad: "Joven",
      tamaño: "Mediana",
      sexo: "Hembra",
      fundacion: "Refugio Esperanza",
    },
    {
      name: "Max",
      img: "/p4.jpg",
      desc: "Max es juguetón y muy noble, siempre está listo para recibir cariño.",
      edad: "Cachorro",
      tamaño: "Grande",
      sexo: "Macho",
      fundacion: "Amigos de 4 Patas",
    },
    {
      name: "Toby",
      img: "/p5.jpg",
      desc: "Toby es tranquilo, le gusta descansar y disfrutar de la compañía.",
      edad: "Adulto",
      tamaño: "Mediano",
      sexo: "Macho",
      fundacion: "Patitas Felices",
    },
  ];

  return (
    <>

      {/* Hero */}
      <section className="bg-[#FFFCF4] text-center py-12">
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
            onClick={() => setSelectedDog(dog)}
            className="bg-[#EDE4D6] rounded-lg shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer"
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
                {dog.desc.substring(0, 50)}...
              </p>
            </div>
          </motion.div>
        ))}
      </section>

        {/* Modal */}
        {selectedDog && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50">
            <div className="bg-[#FDF8E7] rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 p-6 relative">
            {/* Cerrar */}
            <button
                onClick={() => setSelectedDog(null)}
                className="absolute top-3 right-3 text-xl font-bold text-gray-700 hover:text-black"
            >
                ✖
            </button>

            <h2 className="text-2xl font-bold mb-4 text-center">{selectedDog.name}</h2>

            <div className="flex flex-col md:flex-row gap-6 items-center">
                <img
                src={selectedDog.img}
                alt={selectedDog.name}
                className="w-48 h-40 object-cover rounded-lg"
                />
                <p className="text-gray-700">{selectedDog.desc}</p>
            </div>

            {/* Info */}
            <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
                <span><strong>Edad:</strong> {selectedDog.edad}</span>
                <span><strong>Tamaño:</strong> {selectedDog.tamaño}</span>
                <span><strong>Sexo:</strong> {selectedDog.sexo}</span>
                <span><strong>Fundación:</strong> {selectedDog.fundacion}</span>
            </div>

            {/* Botón adoptar */}
            <div className="text-center mt-6">
                <button className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition">
                🐾 Adoptar a {selectedDog.name}
                </button>
            </div>
            </div>
        </div>
        )}

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
