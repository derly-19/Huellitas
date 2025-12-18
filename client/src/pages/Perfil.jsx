import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FaUser, FaEnvelope, FaPhone, FaHome, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaPaw, FaCalendar, FaLock } from "react-icons/fa";
import ChangePasswordModal from "../components/ChangePasswordModal";

export default function Perfil() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [adoptedPets, setAdoptedPets] = useState([]);
  const [loadingPets, setLoadingPets] = useState(true);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    direccion: "",
    ciudad: ""
  });

  // Cargar datos del usuario al montar
  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || "",
        apellido: user.apellido || "",
        telefono: user.telefono || "",
        direccion: user.direccion || "",
        ciudad: user.ciudad || ""
      });
      if (user.id) {
        fetchAdoptedPets();
      }
    }
  }, [user]);

  // Obtener mascotas adoptadas
  const fetchAdoptedPets = async () => {
    try {
      console.log('🔍 Buscando mascotas adoptadas para usuario:', user.id);
      const response = await fetch(`http://localhost:4000/api/adoption-requests/user/${user.id}/adopted`);
      const result = await response.json();
      
      console.log('📦 Resultado de mascotas adoptadas:', result);
      
      if (result.success) {
        setAdoptedPets(result.data || []);
        console.log('✅ Mascotas adoptadas cargadas:', result.data.length);
      }
    } catch (error) {
      console.error('Error al cargar mascotas adoptadas:', error);
    } finally {
      setLoadingPets(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`http://localhost:4000/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        // Actualizar los datos del usuario en el contexto
        if (updateUser) {
          updateUser({ ...user, ...formData });
        }
        
        // Actualizar localStorage
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        localStorage.setItem('userData', JSON.stringify({
          ...userData,
          ...formData
        }));

        setMessage("✅ Perfil actualizado correctamente");
        setIsEditing(false);
      } else {
        setMessage("❌ " + (result.message || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error al actualizar:', error);
      if (error.message.includes('Failed to fetch')) {
        setMessage("❌ No se pudo conectar con el servidor. Verifica que esté corriendo.");
      } else {
        setMessage("❌ Error al actualizar el perfil: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Restaurar los datos originales
    setFormData({
      nombre: user.nombre || "",
      apellido: user.apellido || "",
      telefono: user.telefono || "",
      direccion: user.direccion || "",
      ciudad: user.ciudad || ""
    });
    setIsEditing(false);
    setMessage("");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Debes iniciar sesión para ver tu perfil</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFCF4] to-[#EDE4D6] py-12 px-4 pt-32">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-[#005017] to-[#0e8c37] p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  <FaUser className="text-4xl text-green-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Mi Perfil</h1>
                  <p className="text-green-100 mt-1">
                    {user.correo}
                  </p>
                </div>
              </div>
              {!isEditing && (
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    <FaEdit /> Editar Perfil
                  </button>
                  <button
                    onClick={() => setIsChangePasswordOpen(true)}
                    className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    <FaLock /> Cambiar Contraseña
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Información del perfil */}
          <div className="p-8">
            {message && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}>
                {message}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <FaUser className="text-green-600" /> Nombre
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Tu nombre"
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded-lg text-gray-800">
                    {user.nombre || "No especificado"}
                  </p>
                )}
              </div>

              {/* Apellido */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <FaUser className="text-green-600" /> Apellido
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Tu apellido"
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded-lg text-gray-800">
                    {user.apellido || "No especificado"}
                  </p>
                )}
              </div>

              {/* Email (no editable) */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <FaEnvelope className="text-green-600" /> Correo Electrónico
                </label>
                <p className="p-3 bg-gray-100 rounded-lg text-gray-600">
                  {user.correo}
                </p>
                <p className="text-xs text-gray-500 mt-1">El correo no se puede modificar</p>
              </div>

              {/* Teléfono */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <FaPhone className="text-green-600" /> Teléfono
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Tu teléfono"
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded-lg text-gray-800">
                    {user.telefono || "No especificado"}
                  </p>
                )}
              </div>

              {/* Dirección */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <FaHome className="text-green-600" /> Dirección
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Tu dirección"
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded-lg text-gray-800">
                    {user.direccion || "No especificado"}
                  </p>
                )}
              </div>

              {/* Ciudad */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <FaMapMarkerAlt className="text-green-600" /> Ciudad
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Tu ciudad"
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded-lg text-gray-800">
                    {user.ciudad || "No especificado"}
                  </p>
                )}
              </div>
            </div>

            {/* Botones de acción */}
            {isEditing && (
              <div className="flex gap-4 mt-8">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                >
                  <FaSave /> {loading ? "Guardando..." : "Guardar Cambios"}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaTimes /> Cancelar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mis mascotas adoptadas */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaPaw className="text-green-600" /> Mis Mascotas
          </h2>
          
          {loadingPets ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Cargando mascotas...</p>
            </div>
          ) : adoptedPets.length === 0 ? (
            <div className="text-center py-8">
              <FaPaw className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aún no has adoptado ninguna mascota</p>
              <button
                onClick={() => navigate('/perros')}
                className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Ver Mascotas en Adopción
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {adoptedPets.map((pet) => (
                <div 
                  key={pet.id} 
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => navigate('/carnet')}
                >
                  <img 
                    src={pet.img?.startsWith('http') ? pet.img : `http://localhost:4000${pet.img}`} 
                    alt={pet.name}
                    className="w-16 h-16 object-cover rounded-full"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/icon.png';
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{pet.name}</h3>
                    <p className="text-sm text-gray-600">{pet.type === 'dog' ? '🐕 Perro' : '🐱 Gato'}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/carnet');
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                  >
                    Ver Carnet
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de cambio de contraseña */}
      <ChangePasswordModal 
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        user={user}
      />
    </div>
  );
}
