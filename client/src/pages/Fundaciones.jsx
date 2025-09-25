import { motion } from "framer-motion";

export default function Fundaciones() {
  const reviews = new Array(4).fill(0).map((_, i) => ({
    id: i,
    title: "Review title",
    body: "Review body",
    reviewer: ["Paola Martino", "Ana Perez", "Eva Gonzalez", "Luis Soto"][i] || "Reviewer name",
    avatar: "https://i.pravatar.cc/80?img=" + (i + 10),
    date: ["12 Oct 2024", "10 Sep 2024", "25 Aug 2024", "06 Jul 2024"][i],
  }));

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };

  const card = {
    hidden: { opacity: 0, y: 18, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: "easeOut" } },
  };

  return (
    <div className="bg-[#FFFCF4] text-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-extrabold text-center mb-3">Fundaciones</h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">Encuentra las mejores fundaciones para adoptar a tu nuevo amigo</p>

        {/* Grid animado de reseñas */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12 auto-rows-fr"
        >
          {reviews.map((r) => (
            <motion.article
              key={r.id}
              variants={card}
              whileHover={{ y: -6, scale: 1.02 }}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col h-full"
            >
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-1 text-green-700">
                    {/* estrellas verdes */}
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M12 .587l3.668 7.431L23.6 9.748l-5.6 5.456L19.335 24 12 19.897 4.665 24l1.335-8.796L.4 9.748l7.932-1.73z" />
                    </svg>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M12 .587l3.668 7.431L23.6 9.748l-5.6 5.456L19.335 24 12 19.897 4.665 24l1.335-8.796L.4 9.748l7.932-1.73z" />
                    </svg>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M12 .587l3.668 7.431L23.6 9.748l-5.6 5.456L19.335 24 12 19.897 4.665 24l1.335-8.796L.4 9.748l7.932-1.73z" />
                    </svg>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M12 .587l3.668 7.431L23.6 9.748l-5.6 5.456L19.335 24 12 19.897 4.665 24l1.335-8.796L.4 9.748l7.932-1.73z" />
                    </svg>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M12 .587l3.668 7.431L23.6 9.748l-5.6 5.456L19.335 24 12 19.897 4.665 24l1.335-8.796L.4 9.748l7.932-1.73z" />
                    </svg>
                  </div>
                  <div className="text-xs text-gray-400">{r.date}</div>
                </div>

                <h3 className="font-semibold text-lg mt-4 mb-1">{r.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{r.body}</p>
              </div>

              {/* Footer con avatar y botón - siempre al final */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <img src={r.avatar} alt={r.reviewer} className="w-10 h-10 rounded-full shadow-sm" />
                  <div className="text-sm">
                    <div className="font-medium">{r.reviewer}</div>
                    <div className="text-xs text-gray-400">Reseña</div>
                  </div>
                </div>

                <button className="w-full px-3 py-2 bg-[#BCC990] hover:bg-[#9FB36F] text-white rounded-md text-sm font-medium">
                  Ver más
                </button>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* CTA grande en caja - centrado como en la imagen */}
        <div className="bg-white rounded-xl shadow-lg p-10 border border-gray-100 mt-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              {/* Corazón con huella usando la imagen */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-[#BCC990] rounded-3xl flex items-center justify-center shadow-lg relative overflow-hidden">
                  {/* SVG del corazón como fondo */}
                  <svg className="absolute inset-0 w-full h-full text-[#BCC990]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  {/* Imagen de la huella centrada */}
                  <img 
                    src="/Huella.png" 
                    alt="Huella" 
                    className="relative z-10 w-12 h-12 object-contain filter brightness-0 invert"
                  />
                </div>
              </div>

              <div className="flex-1 max-w-2xl">
                <h2 className="text-3xl font-bold mb-4 text-gray-800">Únete a esta gran familia</h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  En nuestra plataforma encontrarás perritos y gatitos que esperan un hogar lleno de amor. 
                  Cada adopción incluye un carnet digital con su historial médico y recordatorios de vacunación 
                  para que nunca olvides su cuidado.
                </p>
              </div>
            </div>
            
            {/* Botón centrado debajo */}
            <div className="mt-8">
              <a 
                href="/dogs" 
                className="inline-block px-10 py-4 bg-[#BCC990] hover:bg-[#9FB36F] text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Ver mascotas en adopción
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
