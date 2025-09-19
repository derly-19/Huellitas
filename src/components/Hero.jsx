// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative">
      {/* Imagen con fade-in */}
      <motion.img
        src="https://content.nationalgeographic.com.es/medio/2024/07/05/ojos-perros-4_5ecf1b1a_240705084153_1280x720.jpg"
        alt="Perrito"
        className="w-full h-[520px] object-cover"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      {/* Contenido animado */}
      <motion.div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 text-center bg-white/70 p-6 rounded max-w-xl"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
      >
        <h2 className="text-3xl font-bold">
          ¿Te gustaría un buen acompañante?
        </h2>
        <p className="mt-3 text-gray-700">
          Miles de animales esperan por ti. Explora sus historias, conoce sus
          necesidades y encuentra al compañero ideal que llenará tu vida de amor
          incondicional.
        </p>
      </motion.div>
    </section>
  );
}
