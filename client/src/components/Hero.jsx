// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Imagen1 from "../assets/Imagen1.png";

export default function Hero() {
  return (
    <div>
      {/* Sección principal solo con la imagen del perrito (sin texto encima) */}
      <motion.section
        className="relative min-h-[70vh] overflow-hidden py-8 md:py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        {/* Imagen de fondo del perrito (más ancha y con espacio arriba/abajo) */}
        <motion.div
          className="absolute inset-0 overflow-hidden"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <img
            src="/p1.jpg"
            alt="Banner principal"
            className="absolute left-1/2 top-0 bottom-0 w-[140%] h-full object-cover transform -translate-x-1/2"
          />
        </motion.div>
      </motion.section>

      {/* Sección crema: título y párrafo centrados + tarjeta de imagen */}
      <motion.section
        className="bg-[#FFFCF4] py-16 md:py-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* Encabezado central como en el mockup */}
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900">
              ¿Te gustaría un buen acompañante?
            </h2>
            <p className="mt-4 text-gray-700 md:text-lg">
              Miles de animales esperan por ti. Explora sus historias, conoce sus
              necesidades y encuentra al compañero ideal que llenará tu vida de
              amor incondicional.
            </p>
          </div>

          {/* Imagen destacada más grande y ancha */}
          <div className="flex justify-center">
            <div className="w-full max-w-5xl">
              <img
                src={Imagen1}
                alt="Encuentra a tu compañero ideal"
                className="w-full object-contain"
              />
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
