// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function CallToAction() {
  return (
    <motion.section
      className="max-w-5xl mx-auto bg-gradient-to-r from-[#fff3e6] via-[#fffaf5] to-white 
      border rounded-xl my-10 p-6 sm:p-10 lg:p-16 text-center shadow-xl"
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
        {/* Emoji 🐾 */}
        <motion.span
          className="text-4xl"
          variants={{
            hidden: { scale: 0.5, opacity: 0 },
            visible: { scale: 1, opacity: 1 },
          }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
        >
          🐾
        </motion.span>

        {/* Título */}
        <motion.h2
          className="text-2xl md:text-3xl font-bold mt-2 mb-4 text-[var(--secondary)]"
          variants={{
            hidden: { opacity: 0, y: -30 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.6 }}
        >
          Adopta con responsabilidad, ama sin condiciones
        </motion.h2>

        {/* Texto */}
        <motion.p
          className="max-w-2xl mx-auto text-[var(--text)] mb-6 text-sm sm:text-base"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          En nuestra plataforma encontrarás perritos y gatitos que esperan un hogar lleno de amor.  
          Cada adopción incluye un carnet digital con su historial médico y recordatorios de vacunación 
          para que nunca olvides su cuidado.
        </motion.p>

        {/* Botón */}
        <motion.button
          className="bg-[var(--primary)] text-white px-6 py-2 rounded-lg hover:bg-[var(--secondary)] transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Ver mascotas en adopción
        </motion.button>
      </motion.div>
    </motion.section>
  );
}
