import { useState } from "react";
import { motion } from "framer-motion";

export default function Formulario() {
  // Estados para el formulario
  const [formData, setFormData] = useState({
    // Datos personales
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    
    // Información del hogar
    direccion: "",
    tipoVivienda: "",
    tieneMascotas: "",
    
    // Motivación
    motivacion: ""
  });

  // Información de la mascota (esto vendría de props o router params en una app real)
  const mascota = {
    nombre: "Luna",
    imagen: "/path-to-luna-image.jpg", // Reemplazar con imagen real
    descripcion: "Luna fue rescatada estaba en la calle sola y así es como con amor se puede cambiar vidas"
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos del formulario:", formData);
    // Aquí enviarías los datos al backend
    alert("Formulario enviado correctamente!");
  };

  return (
    <div className="min-h-screen bg-[#FFFCF4]">

      <div className="max-w-4xl mx-auto p-6">
        {/* Sección de la mascota */}
        <motion.div
          className="bg-[#D6D3C4] rounded-lg p-6 mb-8 flex items-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-20 h-20 rounded-full border-4 border-green-600 overflow-hidden bg-gray-200 flex items-center justify-center">
            {/* Placeholder para la imagen - reemplaza con imagen real */}
            <span className="text-2xl">🐕</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Conoce a {mascota.nombre}
            </h2>
            <p className="text-gray-700 mb-4 max-w-md">
              {mascota.descripcion}
            </p>
            <button className="bg-[#A5A07A] text-white px-4 py-2 rounded hover:bg-[#8C8762] transition">
              Ver carnet
            </button>
          </div>
        </motion.div>

        {/* Formulario principal */}
        <motion.div
          className="bg-white rounded-lg shadow-md p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Formulario de adopción
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Datos personales */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">🐾</span>
                <h3 className="text-xl font-semibold text-gray-800">Datos personales</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">Escribe tu nombre aquí...</p>
                </div>
                
                <div>
                  <input
                    type="text"
                    name="apellido"
                    placeholder="Apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">Escribe tu apellido aquí...</p>
                </div>
                
                <div>
                  <input
                    type="email"
                    name="correo"
                    placeholder="Correo electrónico"
                    value={formData.correo}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">Escribe tu correo aquí...</p>
                </div>
                
                <div>
                  <input
                    type="tel"
                    name="telefono"
                    placeholder="Número celular"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">Escribe tu número aquí...</p>
                </div>
              </div>
            </section>

            {/* Información del hogar */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">🏠</span>
                <h3 className="text-xl font-semibold text-gray-800">Información del hogar</h3>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <div>
                  <input
                    type="text"
                    name="direccion"
                    placeholder="Dirección"
                    value={formData.direccion}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ¿Vives en casa o apartamento?
                    </label>
                    <select
                      name="tipoVivienda"
                      value={formData.tipoVivienda}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="casa">Casa</option>
                      <option value="apartamento">Apartamento</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ¿Tienes más mascotas?
                    </label>
                    <select
                      name="tieneMascotas"
                      value={formData.tieneMascotas}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="si">Sí</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            {/* Motivación para adoptar */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">❤️</span>
                <h3 className="text-xl font-semibold text-gray-800">Motivación para adoptar</h3>
              </div>

              <textarea
                name="motivacion"
                placeholder="Escribe tu motivación aquí..."
                value={formData.motivacion}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                required
              />
            </section>

            {/* Botón de envío */}
            <div className="text-left">
              <button
                type="submit"
                className="bg-[#BCC990] text-white px-8 py-3 rounded-lg hover:bg-[#A5B67F] transition-colors font-medium"
              >
                Enviar
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
