import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import SuccessNotification from "./SuccessNotification";
import AlertModal from "./AlertModal";

export default function AdoptionFormModal({ isOpen, onClose, pet, user }) {
  const [formData, setFormData] = useState({
    nombre: user?.username || "",
    apellido: "",
    correo: user?.email || "",
    telefono: "",
    direccion: "",
    tipoVivienda: "",
    tieneMascotas: "",
    motivacion: ""
  });

  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const adoptionData = {
        ...formData,
        petId: pet.id,
        petName: pet.name,
        userId: user?.id,
        submittedAt: new Date().toISOString()
      };

      console.log("Solicitud de adopción:", adoptionData);

      // Simular envío (reemplaza con tu API real)
      await new Promise(resolve => setTimeout(resolve, 1500));

      setShowSuccess(true);
      
      // Cerrar modal después de 3 segundos
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        // Resetear formulario
        setFormData({
          nombre: user?.username || "",
          apellido: "",
          correo: user?.email || "",
          telefono: "",
          direccion: "",
          tipoVivienda: "",
          tieneMascotas: "",
          motivacion: ""
        });
      }, 3000);
    } catch (error) {
      console.error("Error:", error);
      setShowAlert(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay oscuro */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Botón cerrar */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

              {/* Contenido del modal */}
              <div className="p-6 md:p-8">
                {/* Encabezado con info de la mascota */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                  <img
                    src={pet.img}
                    alt={pet.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                      Formulario de Adopción
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Solicitud para adoptar a <span className="font-semibold text-[var(--primary)]">{pet.name}</span>
                    </p>
                  </div>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Datos personales */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Datos Personales</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre *
                        </label>
                        <input
                          type="text"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Apellido *
                        </label>
                        <input
                          type="text"
                          name="apellido"
                          value={formData.apellido}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Correo Electrónico *
                        </label>
                        <input
                          type="email"
                          name="correo"
                          value={formData.correo}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Teléfono *
                        </label>
                        <input
                          type="tel"
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Información del hogar */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Información del Hogar</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dirección *
                        </label>
                        <input
                          type="text"
                          name="direccion"
                          value={formData.direccion}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tipo de Vivienda *
                          </label>
                          <select
                            name="tipoVivienda"
                            value={formData.tipoVivienda}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
                          >
                            <option value="">Selecciona...</option>
                            <option value="casa">Casa</option>
                            <option value="apartamento">Apartamento</option>
                            <option value="finca">Finca</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            ¿Tienes otras mascotas? *
                          </label>
                          <select
                            name="tieneMascotas"
                            value={formData.tieneMascotas}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
                          >
                            <option value="">Selecciona...</option>
                            <option value="si">Sí</option>
                            <option value="no">No</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Motivación */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Motivación</h3>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ¿Por qué quieres adoptar a {pet.name}? *
                    </label>
                    <textarea
                      name="motivacion"
                      value={formData.motivacion}
                      onChange={handleChange}
                      required
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none resize-none"
                      placeholder="Cuéntanos por qué quieres darle un hogar a esta mascota..."
                    />
                  </div>

                  {/* Botones */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 px-6 py-3 bg-[var(--primary)] text-white rounded-lg font-semibold hover:bg-[var(--primary-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? "Enviando..." : "Enviar Solicitud"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>

          {/* Notificación de éxito */}
          <SuccessNotification
            isOpen={showSuccess}
            onClose={() => setShowSuccess(false)}
            petName={pet.name}
          />

          {/* Modal de alerta */}
          <AlertModal
            isOpen={showAlert}
            onClose={() => setShowAlert(false)}
            title="Error al enviar"
            message="Hubo un error al enviar la solicitud. Por favor, inténtalo de nuevo."
            type="error"
          />
        </>
      )}
    </AnimatePresence>
  );
}
