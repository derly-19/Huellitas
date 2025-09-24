// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function CallToAction() {
  return (
    <motion.section
      className="max-w-6xl mx-auto bg-white rounded-xl my-10 p-8 sm:p-12 lg:p-16 text-center shadow-lg border border-gray-100"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: false }}
    >
      <motion.div
        className="flex flex-col items-center"
        initial="hidden"
        whileInView="visible"
        transition={{ staggerChildren: 0.2 }}
        viewport={{ once: false }}
      >
        {/* Huella usando la imagen del public */}
        <motion.div
          className="w-16 h-16 mb-6"
          variants={{
            hidden: { scale: 0.5, opacity: 0 },
            visible: { scale: 1, opacity: 1 },
          }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
        >
          <img 
            src="/Huella.png" 
            alt="Huella" 
            className="w-full h-full object-contain"
          />
        </motion.div>

        {/* Título */}
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 leading-tight"
          variants={{
            hidden: { opacity: 0, y: -30 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.6 }}
        >
          Adopta con responsabilidad,<br />
          ama sin condiciones
        </motion.h2>

        {/* Texto */}
        <motion.div
          className="max-w-4xl mx-auto mb-8"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <p className="text-gray-600 text-lg leading-relaxed mb-4">
            En nuestra plataforma encontrarás perritos y gatitos que esperan un hogar lleno de amor.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            Cada adopción incluye un carnet digital con su historial médico y recordatorios de vacunación 
            para que nunca olvides su cuidado.
          </p>
        </motion.div>

        {/* Botón con borde */}
        <motion.a
          href="/dogs"
          className="inline-block px-8 py-3 border-2 border-gray-400 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-500 transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Ver mascotas en adopción
        </motion.a>
      </motion.div>
    </motion.section>
  );
}
