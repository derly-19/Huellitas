// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import image2 from "../assets/Image2.jpeg"; // ajusta la ruta según tu carpeta

export default function InfoSection() {
  return (
    <motion.section
      className="max-w-6xl mx-auto bg-[#F5ECCA] py-10 sm:py-14 px-4 sm:px-8 flex flex-col 
      rounded-xl md:flex-row items-center md:items-start justify-center gap-8 md:gap-12"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: false, amount: 0.3 }}
    >
      {/* Imagen ilustrativa */}
      <motion.img
          src={image2}
          alt="Adopción"
          className="w-28 sm:w-40 md:w-56 lg:w-64 flex-shrink-0 rounded-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false }}
          whileHover={{ scale: 1.1 }}
        />


      {/* Texto */}
      <motion.div
        className="text-center md:text-left max-w-2xl"
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.2 }}
        viewport={{ once: false }}
      >
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-[var(--secondary)] leading-snug">
          Adoptar cambia su vida... <br className="hidden sm:block" /> y también la tuya
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-[var(--text)] leading-relaxed">
          Un peludito adoptado no solo encuentra un hogar, también te regala
          alegría, compañía y un amor sin condiciones.  
          Es la oportunidad perfecta de crecer juntos y crear momentos inolvidables.
        </p>
      </motion.div>
    </motion.section>
  );
}
