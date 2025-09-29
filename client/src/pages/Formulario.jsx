import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";

export default function Formulario() {
  const { petId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
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

  // Estados para la mascota
  const [mascota, setMascota] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Función para obtener datos de la mascota
  const fetchPetData = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/api/pets/${id}`);
      const result = await response.json();
      
      if (result.success) {
        setMascota(result.data);
      } else {
        setError('Mascota no encontrada');
      }
    } catch (err) {
      console.error('Error fetching pet data:', err);
      setError('Error al cargar la información de la mascota');
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    // Verificar autenticación
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Pre-llenar datos del usuario si están disponibles
    if (user) {
      setFormData(prev => ({
        ...prev,
        correo: user.email || "",
        nombre: user.username || ""
      }));
    }

    // Cargar datos de la mascota si se proporciona un ID
    if (petId) {
      fetchPetData(petId);
    } else {
      setLoading(false);
    }
  }, [petId, user, isAuthenticated, navigate]);

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
      // Aquí enviarías los datos del formulario a tu API
      const adoptionData = {
        ...formData,
        petId: petId,
        petName: mascota?.name,
        userId: user?.id,
        timestamp: new Date().toISOString()
      };

      console.log("Datos de adopción:", adoptionData);
      
      // Simular envío a API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(`¡Solicitud de adopción enviada para ${mascota?.name || 'la mascota'}! Nos pondremos en contacto contigo pronto.`);
      navigate("/");
      
    } catch (error) {
      console.error('Error enviando formulario:', error);
      alert('Error al enviar la solicitud. Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  // Estados de carga para el UI
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFCF4] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005017] mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando información...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FFFCF4] flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
            <strong>Error:</strong> {error}
            <button 
              onClick={() => navigate('/')}
              className="ml-3 underline hover:no-underline"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            {/* Imagen de la mascota */}
            {mascota?.img ? (
              <img 
                src={mascota.img} 
                alt={mascota.name}
                className="w-24 h-24 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = '/public/icon.png';
                }}
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-2xl">{mascota?.type === 'cat' ? '🐱' : '🐕'}</span>
              </div>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {mascota ? `Conoce a ${mascota.name}` : 'Formulario de Adopción'}
            </h2>
            <p className="text-gray-700 mb-4 max-w-md">
              {mascota?.description || 'Completa el formulario para adoptar una mascota.'}
            </p>
            {mascota && (
              <div className="text-sm text-gray-600 mb-4">
                <p><strong>Edad:</strong> {mascota.age}</p>
                <p><strong>Tamaño:</strong> {mascota.size}</p>
                <p><strong>Sexo:</strong> {mascota.sex}</p>
                <p><strong>Fundación:</strong> {mascota.foundation}</p>
              </div>
            )}
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
                disabled={submitting}
                className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                  submitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-[#BCC990] hover:bg-[#A5B67F] text-white'
                }`}
              >
                {submitting ? 'Enviando solicitud...' : `Adoptar${mascota ? ` a ${mascota.name}` : ''}`}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
