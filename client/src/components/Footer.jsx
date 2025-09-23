import React from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      className="relative bg-[var(--primary)] py-10 mt-16"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: false }}
    >
      {/* Wave animada arriba */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180 -translate-y-full">
        <svg
          className="relative block w-[calc(100%+1.3px)] h-16"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
        >
          <path
            d="M321.39 56.24C213.1 75.41 106.55 104.35 0 103.78V0h1200v27.35c-104.72 14.17-209.44 28.33-316.05 27.25-106.62-1.09-213.23-17.61-319.85-19.69-106.61-2.08-213.22 11.26-319.84 21.33-106.61 10.07-213.22 16.29-323.87 0z"
            fill="var(--primary)"
          >
            <animate
              attributeName="d"
              dur="8s"
              repeatCount="indefinite"
              values="
                M321.39 56.24C213.1 75.41 106.55 104.35 0 103.78V0h1200v27.35c-104.72 14.17-209.44 28.33-316.05 27.25-106.62-1.09-213.23-17.61-319.85-19.69-106.61-2.08-213.22 11.26-319.84 21.33-106.61 10.07-213.22 16.29-323.87 0z;
                M321.39 36.24C213.1 55.41 106.55 94.35 0 93.78V0h1200v37.35c-104.72 10.17-209.44 22.33-316.05 21.25-106.62-1.09-213.23-11.61-319.85-13.69-106.61-2.08-213.22 6.26-319.84 15.33-106.61 9.07-213.22 14.29-323.87 0z;
                M321.39 56.24C213.1 75.41 106.55 104.35 0 103.78V0h1200v27.35c-104.72 14.17-209.44 28.33-316.05 27.25-106.62-1.09-213.23-17.61-319.85-19.69-106.61-2.08-213.22 11.26-319.84 21.33-106.61 10.07-213.22 16.29-323.87 0z
              "
            />
          </path>
        </svg>
      </div>

      {/* Contenido */}
      <div className="relative z-10 max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        {/* Marca */}
        <motion.p
          className="font-bold text-xl sm:text-2xl text-[var(--secondary)] mb-4"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          Huellitas 🐾
        </motion.p>

        {/* Redes sociales */}
        <motion.div
          className="flex justify-center gap-5 sm:gap-8 text-xl sm:text-2xl text-[var(--secondary)]/80 mb-6 flex-wrap"
          initial="hidden"
          whileInView="visible"
          transition={{ staggerChildren: 0.2 }}
        >
          {[
            { Icon: FaFacebook, label: "Facebook" },
            { Icon: FaInstagram, label: "Instagram" },
            { Icon: FaTwitter, label: "Twitter" },
          ].map(({ Icon, label }, i) => (
            <motion.a
              key={i}
              href="#"
              aria-label={label}
              className="hover:text-white transition"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              {React.createElement(Icon)}
            </motion.a>
          ))}
        </motion.div>

        {/* Botón */}
        <motion.button
          className="bg-[var(--secondary)] text-white px-6 py-2 sm:px-8 sm:py-3 rounded-lg shadow hover:bg-opacity-90 transition text-sm sm:text-base"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Ver mascotas
        </motion.button>

        {/* Créditos */}
        <motion.p
          className="mt-6 text-xs sm:text-sm text-[var(--secondary)]/60"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          © {new Date().getFullYear()} Huellitas
        </motion.p>
      </div>
    </motion.footer>
  );
}
