// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen">
      {/* Imagen de fondo con fade-in */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <img
          src="https://content.nationalgeographic.com.es/medio/2024/07/05/ojos-perros-4_5ecf1b1a_240705084153_1280x720.jpg"
          alt="Perrito"
          className="w-full h-full object-cover object-center"
        />
      </motion.div>

      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Contenido animado */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center text-center text-white p-6 max-w-xl mx-auto min-h-screen"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
      >
        <h2 className="text-3xl md:text-5xl font-bold drop-shadow-lg">
          ¿Te gustaría un buen acompañante?
        </h2>
        <p className="mt-3 text-gray-200 text-base md:text-lg">
          Miles de animales esperan por ti. Explora sus historias, conoce sus
          necesidades y encuentra al compañero ideal que llenará tu vida de amor
          incondicional.
        </p>
    
      </motion.div>
    </section>
  );
}
