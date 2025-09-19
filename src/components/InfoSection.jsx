// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function InfoSection() {
  return (
    <motion.section
      className="bg-[#FDF8E7] rounded-lg shadow-md mx-6 my-10 p-8 flex flex-col md:flex-row items-center gap-8"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: false, amount: 0.3 }} // Se repite cada vez que entra en vista
    >
      {/* Imagen ilustrativa */}
      <motion.img
        src="https://cdn-icons-png.flaticon.com/512/616/616408.png"
        alt="Adopción"
        className="w-40 md:w-60"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: false }}
        whileHover={{ scale: 1.1 }}
      />

      {/* Texto */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.2 }}
        viewport={{ once: false }}
      >
        <h2 className="text-2xl font-bold mb-3 text-[var(--secondary)]">
          Adoptar cambia su vida... <br /> y también la tuya
        </h2>
        <p className="text-[var(--text)] leading-relaxed">
          Un peludito adoptado no solo encuentra un hogar, también te regala
          alegría, compañía y un amor sin condiciones.  
          Es la oportunidad perfecta de crecer juntos y crear momentos inolvidables.
        </p>
      </motion.div>
    </motion.section>
  );
}

