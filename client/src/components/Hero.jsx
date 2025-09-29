// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Imagen1 from "../assets/Imagen1.png";
import p1 from "../assets/p1.jpg";

export default function Hero() {
  return (
    <div>
      {/* Imagen de fondo responsive */}
      <motion.section
        className="relative min-h-[70vh] md:min-h-[90vh] lg:min-h-[100vh] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <motion.div
          className="absolute inset-0 overflow-hidden"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <img
            src={p1}
            alt="Banner principal"
            className="
              absolute inset-0 
              w-full h-full 
              object-cover 
              translate-y-6 sm:translate-y-8 md:translate-y-10 lg:translate-y-12
            "
          />
        </motion.div>
      </motion.section>

      {/* Sección crema con texto e imagen */}
      <motion.section
        className="bg-[#FFFCF4] py-12 sm:py-16 md:py-20 lg:py-24"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Encabezado central */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900">
              ¿Te gustaría un buen acompañante?
            </h2>
            <p className="mt-4 text-gray-700 text-base sm:text-lg md:text-xl">
              Miles de animales esperan por ti. Explora sus historias, conoce sus
              necesidades y encuentra al compañero ideal que llenará tu vida de
              amor incondicional.
            </p>
          </div>

          {/* Imagen destacada */}
          <div className="flex justify-center">
            <div className="w-full max-w-3xl sm:max-w-4xl md:max-w-5xl">
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
