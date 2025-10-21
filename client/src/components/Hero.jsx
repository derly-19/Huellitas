// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Imagen1 from "../assets/Imagen1.png";
import p1 from "../assets/p1.jpg";
import p2 from "../assets/p2.jpg";
import p3 from "../assets/p3.jpg";
import p4 from "../assets/p4.jpg";
import p5 from "../assets/p5.jpg";
import p6 from "../assets/p6.jpg";
import g1 from "../assets/g1.jpg";
import g2 from "../assets/g2.jpg";
import g3 from "../assets/g3.jpg";
import g4 from "../assets/g4.jpg";
import g5 from "../assets/g5.jpg";

const carouselImages = [p1, p2, p3, p4, p5, p6, g1, g2, g3, g4, g5];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 4000); // Cambia cada 4 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* Imagen de fondo responsive con carrusel */}
      <motion.section
        className="relative min-h-[70vh] md:min-h-[90vh] lg:min-h-[100vh] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={carouselImages[currentIndex]}
              alt={`Mascota ${currentIndex + 1}`}
              className="
                absolute inset-0 
                w-full h-full 
                object-cover 
                translate-y-6 sm:translate-y-8 md:translate-y-10 lg:translate-y-12
              "
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1 }}
            />
          </AnimatePresence>
        </div>

        {/* Indicadores del carrusel */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white w-8' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>
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
