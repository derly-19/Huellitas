// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Card from "./Card";

export default function AdoptionSection({ title, pets }) {
  return (
    <section className="my-12 text-center">
      {/* Título animado */}
      <motion.h2
        className="text-2xl font-bold mb-6"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: false }} // 👈 se repite cada vez que pasa
      >
        {title}
      </motion.h2>

      {/* Contenedor de cards */}
      <motion.div
        className="flex flex-wrap justify-center gap-6"
        initial="hidden"
        whileInView="visible"
        transition={{ staggerChildren: 0.2 }}
        viewport={{ once: false }} // 👈 también aquí
      >
        {pets.map((pet, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 8px 20px rgba(0,0,0,0.15)",
            }}
            whileTap={{ scale: 0.97 }}
          >
            <Card name={pet.name} img={pet.img} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
