// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Card from "./Card";

export default function AdoptionSection({ title, pets, onAdopt, onCardClick }) {
  return (
    <section className="my-12 px-4 md:px-8 lg:px-16">
      {/* Título animado */}
      <motion.h2
        className="text-2xl md:text-3xl font-bold mb-8 text-center"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: false }}
      >
        {title}
      </motion.h2>

      {/* Grid responsive */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        initial="hidden"
        whileInView="visible"
        transition={{ staggerChildren: 0.2 }}
        viewport={{ once: false }}
      >
        {pets.map((pet, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
            }}
            animate={{
              y: [0, -15, 0],
            }}
            whileHover={{
              scale: 1.05,
              y: 0,
              boxShadow: "0px 8px 20px rgba(0,0,0,0.15)",
              transition: {
                scale: { duration: 0.3 },
                y: { duration: 0.3 },
              }
            }}
            whileTap={{ scale: 0.97 }}
            style={{
              animation: `float 3s ease-in-out ${i * 0.2}s infinite`,
            }}
          >
            <Card 
              id={pet.id}
              name={pet.name} 
              img={pet.img} 
              description={pet.description}
              type={pet.type}
              onAdopt={onAdopt}
              onCardClick={onCardClick}
              petData={pet}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
