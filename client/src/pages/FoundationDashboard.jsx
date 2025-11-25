import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FaDog, FaCat, FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaSearch, FaEye, FaExternalLinkAlt, FaClipboardList } from "react-icons/fa";
import { MdPets } from "react-icons/md";
import AddPetModal from "../components/Foundation/AddPetModal";
import EditPetModal from "../components/Foundation/EditPetModal";
import ConfirmModal from "../components/Foundation/ConfirmModal";
import AdoptionRequestsPanel from "../components/Foundation/AdoptionRequestsPanel";

// Función helper para obtener la URL correcta de la imagen
const getImageUrl = (imgPath) => {
  if (!imgPath) return '/public/icon.png';
  // Si ya es una URL completa (http/https) o ruta de uploads del servidor
  if (imgPath.startsWith('http') || imgPath.startsWith('https')) {
    return imgPath;
  }
  // Si es una ruta de uploads local
  if (imgPath.startsWith('/uploads')) {
    return `http://localhost:4000${imgPath}`;
  }
  return imgPath;
};

export default function FoundationDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para filtros
  const [filterType, setFilterType] = useState("all"); // all, dog, cat
  const [filterStatus, setFilterStatus] = useState("all"); // all, available, adopted
  const [searchTerm, setSearchTerm] = useState("");
  
  // Estados para modales
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  
  // Estadísticas
  const [stats, setStats] = useState({
    total: 0,
    dogs: 0,
    cats: 0,
    available: 0,
    adopted: 0
  });

  // Tab activo (mascotas o solicitudes)
  const [activeTab, setActiveTab] = useState("pets"); // "pets" o "requests"

  // Debug: observar cambios en stats
  useEffect(() => {
    console.log('🔄 Stats cambió:', stats);
  }, [stats]);

  // Verificar autenticación y tipo de usuario
  useEffect(() => {
    if (!isAuthenticated() || user?.user_type !== 'foundation') {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  // Cargar mascotas de la fundación
  const fetchPets = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:4000/api/pets/foundation/${user.id}`);
      
      if (!response.ok) {
        throw new Error('Error al cargar las mascotas');
      }
      
      const result = await response.json();
      
      if (result.success) {
        setPets(result.data);
        setFilteredPets(result.data);
        
        // Calcular estadísticas (normalizar type a minúsculas)
        const total = result.data.length;
        const dogs = result.data.filter(p => {
          const type = (p.type || '').toLowerCase();
          return type === 'dog' || type === 'perro';
        }).length;
        const cats = result.data.filter(p => {
          const type = (p.type || '').toLowerCase();
          return type === 'cat' || type === 'gato';
        }).length;
        const available = result.data.filter(p => p.available === 1 || p.available === true || p.available === '1').length;
        const adopted = result.data.filter(p => p.available === 0 || p.available === false || p.available === '0').length;
        
        console.log('📊 Estadísticas calculadas:', { total, dogs, cats, available, adopted });
        console.log('📦 Datos recibidos:', result.data);
        if (result.data.length > 0) {
          console.log('🐾 Primera mascota - type:', result.data[0].type, '| available:', result.data[0].available);
        }
        
        setStats({ total, dogs, cats, available, adopted });
        console.log('✅ Estado actualizado. Stats:', { total, dogs, cats, available, adopted });
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, [user]);

  // Aplicar filtros
  useEffect(() => {
    let result = [...pets];
    
    // Filtrar por tipo (soporta múltiples formatos)
    if (filterType !== "all") {
      if (filterType === "dog") {
        result = result.filter(pet => pet.type === 'dog' || pet.type === 'Perro' || pet.type === 'perro');
      } else if (filterType === "cat") {
        result = result.filter(pet => pet.type === 'cat' || pet.type === 'Gato' || pet.type === 'gato');
      }
    }
    
    // Filtrar por estado (comparación robusta)
    if (filterStatus !== "all") {
      if (filterStatus === "available") {
        result = result.filter(pet => pet.available === 1 || pet.available === true);
      } else {
        result = result.filter(pet => pet.available === 0 || pet.available === false);
      }
    }
    
    // Filtrar por búsqueda
    if (searchTerm) {
      result = result.filter(pet => 
        pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredPets(result);
  }, [pets, filterType, filterStatus, searchTerm]);

  // Manejar agregar mascota
  const handleAddPet = async (petData, imageFile) => {
    try {
      const formData = new FormData();
      
      // Agregar la imagen si existe
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      // Agregar los demás campos
      formData.append('name', petData.name);
      formData.append('type', petData.type);
      formData.append('breed', petData.breed);
      formData.append('age', petData.age);
      formData.append('gender', petData.gender);
      formData.append('size', petData.size);
      formData.append('description', petData.description);
      formData.append('foundation', user.foundation_name);
      formData.append('foundation_id', user.id);
      
      const response = await fetch('http://localhost:4000/api/pets/with-image', {
        method: 'POST',
        body: formData, // No incluir Content-Type header, el navegador lo configura automáticamente con boundary
      });
      
      const result = await response.json();
      
      if (result.success) {
        setShowAddModal(false);
        fetchPets();
        return { success: true };
      } else {
        return { success: false, message: result.message };
      }
    } catch (err) {
      return { success: false, message: 'Error de conexión' };
    }
  };

  // Manejar editar mascota
  const handleEditPet = async (petData, imageFile) => {
    try {
      const formData = new FormData();
      
      // Agregar la imagen si existe una nueva
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      // Agregar los demás campos
      formData.append('name', petData.name);
      formData.append('type', petData.type);
      formData.append('breed', petData.breed);
      formData.append('age', petData.age);
      formData.append('gender', petData.gender);
      formData.append('size', petData.size);
      formData.append('description', petData.description);
      
      const response = await fetch(`http://localhost:4000/api/pets/${selectedPet.id}/with-image`, {
        method: 'PUT',
        body: formData,
      });
      
      const result = await response.json();
      
      if (result.success) {
        setShowEditModal(false);
        setSelectedPet(null);
        fetchPets();
        return { success: true };
      } else {
        return { success: false, message: result.message };
      }
    } catch (err) {
      return { success: false, message: 'Error de conexión' };
    }
  };

  // Manejar cambio de disponibilidad
  const handleToggleAvailability = async (pet) => {
    try {
      const response = await fetch(`http://localhost:4000/api/pets/${pet.id}/availability`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ available: pet.available === 0 }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        fetchPets();
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  // Manejar eliminar mascota
  const handleDeletePet = async () => {
    if (!selectedPet) return;
    
    try {
      const response = await fetch(`http://localhost:4000/api/pets/${selectedPet.id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        setShowConfirmModal(false);
        setSelectedPet(null);
        fetchPets();
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  // Abrir modal de confirmación
  const openConfirmDelete = (pet) => {
    setSelectedPet(pet);
    setConfirmAction('delete');
    setShowConfirmModal(true);
  };

  // Abrir modal de edición
  const openEditModal = (pet) => {
    setSelectedPet(pet);
    setShowEditModal(true);
  };

  if (!user || user.user_type !== 'foundation') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header del Dashboard */}
      <div className="bg-gradient-to-r from-[#005017] to-[#0e8c37] text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                ¡Bienvenido, {user.foundation_name || user.username}!
              </h1>
              <p className="text-green-100">Panel de administración de mascotas</p>
            </div>
            
            {/* Enlaces a páginas públicas */}
            <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
              <Link 
                to="/Dogs" 
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
              >
                <FaEye />
                <span>Ver página de Perritos</span>
                <FaExternalLinkAlt className="text-xs" />
              </Link>
              <Link 
                to="/Cats" 
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
              >
                <FaEye />
                <span>Ver página de Gatitos</span>
                <FaExternalLinkAlt className="text-xs" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <MdPets className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-3">
            <div className="bg-amber-100 p-3 rounded-full">
              <FaDog className="text-amber-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Perros</p>
              <p className="text-2xl font-bold text-gray-800">{stats.dogs}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-3">
            <div className="bg-purple-100 p-3 rounded-full">
              <FaCat className="text-purple-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Gatos</p>
              <p className="text-2xl font-bold text-gray-800">{stats.cats}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-full">
              <FaToggleOn className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Disponibles</p>
              <p className="text-2xl font-bold text-gray-800">{stats.available}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-3">
            <div className="bg-red-100 p-3 rounded-full">
              <FaToggleOff className="text-red-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Adoptados</p>
              <p className="text-2xl font-bold text-gray-800">{stats.adopted}</p>
            </div>
          </div>
        </div>

        {/* Tabs de navegación */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl shadow-md p-2">
          <button
            onClick={() => setActiveTab("pets")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-colors ${
              activeTab === "pets"
                ? "bg-[#005017] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <MdPets className="text-xl" />
            <span>Mis Mascotas</span>
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-colors ${
              activeTab === "requests"
                ? "bg-[#005017] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <FaClipboardList className="text-xl" />
            <span>Solicitudes de Adopción</span>
          </button>
        </div>

        {/* Contenido según el tab activo */}
        {activeTab === "requests" ? (
          <AdoptionRequestsPanel foundationId={user?.id} />
        ) : (
        /* Sección de Mascotas en Adopción */
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
              Mis Mascotas en Adopción
            </h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center space-x-2 bg-[#005017] hover:bg-[#0e8c37] text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              <FaPlus />
              <span>Agregar Mascota</span>
            </button>
          </div>

          {/* Filtros y búsqueda */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Búsqueda */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            {/* Filtro por tipo */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Todos los tipos</option>
              <option value="dog">🐕 Solo Perros</option>
              <option value="cat">🐱 Solo Gatos</option>
            </select>
            
            {/* Filtro por estado */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="available">✅ Disponibles</option>
              <option value="adopted">❤️ Adoptados</option>
            </select>
          </div>

          {/* Lista de mascotas */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando mascotas...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
              <button 
                onClick={fetchPets}
                className="mt-4 text-green-600 hover:underline"
              >
                Intentar de nuevo
              </button>
            </div>
          ) : filteredPets.length === 0 ? (
            <div className="text-center py-12">
              <MdPets className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {pets.length === 0 
                  ? "Aún no has registrado ninguna mascota"
                  : "No se encontraron mascotas con los filtros seleccionados"
                }
              </p>
              {pets.length === 0 && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-4 text-green-600 hover:underline font-semibold"
                >
                  ¡Agrega tu primera mascota!
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPets.map((pet) => (
                <div 
                  key={pet.id} 
                  className={`bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                    pet.available === 0 ? 'opacity-75' : ''
                  }`}
                >
                  {/* Imagen */}
                  <div className="relative h-48 bg-gray-100">
                    <img
                      src={getImageUrl(pet.img)}
                      alt={pet.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/public/icon.png';
                      }}
                    />
                    {/* Badge de estado */}
                    <span className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold ${
                      pet.available === 1 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {pet.available === 1 ? '✅ Disponible' : '❤️ Adoptado'}
                    </span>
                    {/* Badge de tipo */}
                    <span className="absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/90">
                      {pet.type === 'dog' ? '🐕 Perro' : '🐱 Gato'}
                    </span>
                  </div>
                  
                  {/* Contenido */}
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{pet.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {pet.description || 'Sin descripción'}
                    </p>
                    
                    {/* Info adicional */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {pet.age && (
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                          {pet.age}
                        </span>
                      )}
                      {pet.size && (
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                          {pet.size}
                        </span>
                      )}
                      {pet.sex && (
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                          {pet.sex}
                        </span>
                      )}
                    </div>
                    
                    {/* Botón ver en página pública */}
                    {pet.available === 1 && (
                      <Link
                        to={pet.type === 'dog' ? '/Dogs' : '/Cats'}
                        className="flex items-center justify-center gap-2 w-full mb-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
                      >
                        <FaEye />
                        <span>Ver cómo aparece en {pet.type === 'dog' ? 'Perritos' : 'Gatitos'}</span>
                      </Link>
                    )}
                    
                    {/* Acciones */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleAvailability(pet)}
                        className={`flex-1 flex items-center justify-center space-x-1 py-2 rounded-lg font-medium transition-colors ${
                          pet.available === 1
                            ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                        title={pet.available === 1 ? 'Marcar como adoptado' : 'Poner en adopción'}
                      >
                        {pet.available === 1 ? <FaToggleOff /> : <FaToggleOn />}
                        <span className="text-sm">
                          {pet.available === 1 ? 'Adoptado' : 'Activar'}
                        </span>
                      </button>
                      
                      <button
                        onClick={() => openEditModal(pet)}
                        className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      
                      <button
                        onClick={() => openConfirmDelete(pet)}
                        className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                        title="Eliminar"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        )}
      </div>

      {/* Modales */}
      {showAddModal && (
        <AddPetModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddPet}
        />
      )}

      {showEditModal && selectedPet && (
        <EditPetModal
          pet={selectedPet}
          onClose={() => {
            setShowEditModal(false);
            setSelectedPet(null);
          }}
          onSubmit={handleEditPet}
        />
      )}

      {showConfirmModal && (
        <ConfirmModal
          title="Eliminar mascota"
          message={`¿Estás seguro de que deseas eliminar a ${selectedPet?.name}? Esta acción no se puede deshacer.`}
          onConfirm={handleDeletePet}
          onCancel={() => {
            setShowConfirmModal(false);
            setSelectedPet(null);
          }}
        />
      )}
    </div>
  );
}
