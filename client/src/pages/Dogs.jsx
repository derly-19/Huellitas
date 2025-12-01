// src/pages/dogs.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { IoChevronDown } from "react-icons/io5";
import { useAuth } from "../contexts/AuthContext";
import { useAdoption } from "../contexts/AdoptionContext";
import AdoptionNotification from "../components/AdoptionNotification";

// Función helper para obtener la URL correcta de la imagen
const getImageUrl = (imgPath) => {
  if (!imgPath) return '/icon.png';
  if (imgPath.startsWith('http') || imgPath.startsWith('https')) {
    return imgPath;
  }
  if (imgPath.startsWith('/uploads')) {
    return `http://localhost:4000${imgPath}`;
  }
  // Manejar rutas de assets locales (/src/assets/...)
  if (imgPath.startsWith('/src/assets/')) {
    return imgPath.replace('/src/assets/', '/src/assets/');
  }
  return imgPath;
};

export default function Perritos() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { saveAdoptionIntent } = useAdoption();
  
  const [selectedPet, setSelectedPet] = useState(null);
  const [showAdoptionNotification, setShowAdoptionNotification] = useState(false);
  const [pendingAdoption, setPendingAdoption] = useState(null);
  // Estados para filtros y control de menú de filtros
  const [openFilter, setOpenFilter] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedAge, setSelectedAge] = useState(null);
  const [selectedSex, setSelectedSex] = useState(null);
  const [selectedType, setSelectedType] = useState(null); // Nuevo filtro para tipo de mascota
  
  // Estados para manejar los datos de la API
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Función para manejar la adopción
  const handleAdopt = (pet) => {
    if (isAuthenticated()) {
      // Si está autenticado, ir directamente al formulario
      navigate(`/formulario/${pet.id}`);
    } else {
      // Si NO está autenticado, mostrar notificación personalizada
      setPendingAdoption(pet);
      setShowAdoptionNotification(true);
    }
  };

  // Función para manejar el login desde la notificación
  const handleLoginFromNotification = () => {
    if (pendingAdoption) {
      saveAdoptionIntent({
        id: pendingAdoption.id,
        name: pendingAdoption.name,
        img: pendingAdoption.img,
        description: pendingAdoption.desc,
        type: pendingAdoption.type
      });
    }
    setShowAdoptionNotification(false);
    navigate("/login");
  };

  // Función para manejar el registro desde la notificación
  const handleRegisterFromNotification = () => {
    if (pendingAdoption) {
      saveAdoptionIntent({
        id: pendingAdoption.id,
        name: pendingAdoption.name,
        img: pendingAdoption.img,
        description: pendingAdoption.desc,
        type: pendingAdoption.type
      });
    }
    setShowAdoptionNotification(false);
    navigate("/register");
  };

  // Función para obtener todas las mascotas (perros y gatos) desde la API
  const fetchPets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener perros y gatos en paralelo con timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout
      
      const [dogsResponse, catsResponse] = await Promise.all([
        fetch('http://localhost:4000/api/pets?type=dog', { signal: controller.signal }),
        fetch('http://localhost:4000/api/pets?type=cat', { signal: controller.signal })
      ]);
      
      clearTimeout(timeoutId);
      
      if (!dogsResponse.ok || !catsResponse.ok) {
        throw new Error('Error del servidor');
      }
      
      const dogsResult = await dogsResponse.json();
      const catsResult = await catsResponse.json();
      
      const allPets = [];
      
      if (dogsResult.success && Array.isArray(dogsResult.data)) {
        const formattedDogs = (dogsResult.data || []).map(dog => ({
          id: dog.id,
          name: dog.name,
          img: dog.img,
          desc: dog.description || '',
          edad: dog.age,
          tamaño: dog.size,
          sexo: dog.sex,
          fundacion: dog.foundation,
          historial: dog.historial,
          type: 'dog',
          typeLabel: 'Perro'
        }));
        allPets.push(...formattedDogs);
      }
      
      if (catsResult.success && Array.isArray(catsResult.data)) {
        const formattedCats = (catsResult.data || []).map(cat => ({
          id: cat.id,
          name: cat.name,
          img: cat.img,
          desc: cat.description || '',
          edad: cat.age,
          tamaño: cat.size,
          sexo: cat.sex,
          fundacion: cat.foundation,
          historial: cat.historial,
          type: 'cat',
          typeLabel: 'Gato'
        }));
        allPets.push(...formattedCats);
      }
      
      setPets(allPets);
    } catch (err) {
      console.error('Error fetching pets:', err);
      if (err.name === 'AbortError') {
        setError('La conexión tardó demasiado. Por favor, intenta de nuevo.');
      } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setError('No se puede conectar al servidor. Asegúrate de que el servidor esté corriendo en el puerto 4000.');
      } else {
        setError('Error de conexión con el servidor: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchPets();
  }, []);

  return (
    <>

      {/* Hero */}
      <section className="bg-[#FFFCF4] text-center py-20">
        <h1 className="text-3xl font-bold text-gray-900">Mascotas en adopción</h1>
        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
          Estos pequeños buscan un hogar lleno de amor.  
          ¿Te animarías a cambiar sus vidas y la tuya?
        </p>
      </section>

      {/* Filtros */}
      <motion.div
        className="flex justify-center gap-4 my-6 flex-wrap relative"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.1 }}
        viewport={{ once: true }}
      >
        {/* Filtro Tipo de Mascota */}
        <div className="relative">
          <button
            onClick={() => setOpenFilter(openFilter === 'Tipo' ? null : 'Tipo')}
            className={`px-6 py-3 rounded-full shadow ${selectedType ? 'bg-white ring-2 ring-[#BCC990]' : 'bg-[#EDE4D6]'} transition flex items-center gap-2`}
          >
            {selectedType ? (selectedType === 'dog' ? '🐕 Perros' : '🐱 Gatos') : 'Tipo'} 
            <IoChevronDown className="text-sm" />
          </button>
          {openFilter === 'Tipo' && (
            <div className="absolute left-0 mt-2 bg-white rounded-lg shadow-md p-3 w-40 z-20">
              <button
                onClick={() => { setSelectedType('dog'); setOpenFilter(null); }}
                className={`block w-full text-left px-2 py-1 rounded hover:bg-[#F3F1EE] ${selectedType==='dog'? 'font-semibold':''}`}
              >
                🐕 Perros
              </button>
              <button
                onClick={() => { setSelectedType('cat'); setOpenFilter(null); }}
                className={`block w-full text-left px-2 py-1 rounded hover:bg-[#F3F1EE] ${selectedType==='cat'? 'font-semibold':''}`}
              >
                🐱 Gatos
              </button>
              <button onClick={()=>{setSelectedType(null); setOpenFilter(null);}} className="mt-2 text-sm text-gray-500">Limpiar</button>
            </div>
          )}
        </div>

        {/* Filtro Tamaño */}
        <div className="relative">
          <button
            onClick={() => setOpenFilter(openFilter === 'Tamaño' ? null : 'Tamaño')}
            className={`px-6 py-3 rounded-full shadow ${selectedSize ? 'bg-white ring-2 ring-[#BCC990]' : 'bg-[#EDE4D6]'} transition flex items-center gap-2`}
          >
            {selectedSize ? `Tamaño: ${selectedSize}` : 'Tamaño'} 
            <IoChevronDown className="text-sm" />
          </button>
          {openFilter === 'Tamaño' && (
            <div className="absolute left-0 mt-2 bg-white rounded-lg shadow-md p-3 w-40 z-20">
              {['Pequeño','Mediano','Grande'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => { setSelectedSize(opt); setOpenFilter(null); }}
                  className={`block w-full text-left px-2 py-1 rounded hover:bg-[#F3F1EE] ${selectedSize===opt? 'font-semibold':''}`}
                >
                  {opt}
                </button>
              ))}
              <button onClick={()=>{setSelectedSize(null); setOpenFilter(null);}} className="mt-2 text-sm text-gray-500">Limpiar</button>
            </div>
          )}
        </div>

        {/* Filtro Edad */}
        <div className="relative">
          <button
            onClick={() => setOpenFilter(openFilter === 'Edad' ? null : 'Edad')}
            className={`px-6 py-3 rounded-full shadow ${selectedAge ? 'bg-white ring-2 ring-[#BCC990]' : 'bg-[#EDE4D6]'} transition flex items-center gap-2`}
          >
            {selectedAge ? `Edad: ${selectedAge}` : 'Edad'}
            <IoChevronDown className="text-sm" />
          </button>
          {openFilter === 'Edad' && (
            <div className="absolute left-0 mt-2 bg-white rounded-lg shadow-md p-3 w-40 z-20">
              {['Cachorro','Joven','Adulto'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => { setSelectedAge(opt); setOpenFilter(null); }}
                  className={`block w-full text-left px-2 py-1 rounded hover:bg-[#F3F1EE] ${selectedAge===opt? 'font-semibold':''}`}
                >
                  {opt}
                </button>
              ))}
              <button onClick={()=>{setSelectedAge(null); setOpenFilter(null);}} className="mt-2 text-sm text-gray-500">Limpiar</button>
            </div>
          )}
        </div>

        {/* Filtro Sexo */}
        <div className="relative">
          <button
            onClick={() => setOpenFilter(openFilter === 'Sexo' ? null : 'Sexo')}
            className={`px-6 py-3 rounded-full shadow ${selectedSex ? 'bg-white ring-2 ring-[#BCC990]' : 'bg-[#EDE4D6]'} transition flex items-center gap-2`}
          >
            {selectedSex ? `Sexo: ${selectedSex}` : 'Sexo'}
            <IoChevronDown className="text-sm" />
          </button>
          {openFilter === 'Sexo' && (
            <div className="absolute left-0 mt-2 bg-white rounded-lg shadow-md p-3 w-40 z-20">
              {['Hembra','Macho'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => { setSelectedSex(opt); setOpenFilter(null); }}
                  className={`block w-full text-left px-2 py-1 rounded hover:bg-[#F3F1EE] ${selectedSex===opt? 'font-semibold':''}`}
                >
                  {opt}
                </button>
              ))}
              <button onClick={()=>{setSelectedSex(null); setOpenFilter(null);}} className="mt-2 text-sm text-gray-500">Limpiar</button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Estados de carga y error */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005017]"></div>
          <span className="ml-3 text-gray-600">Cargando mascotas...</span>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto">
            <strong>Error:</strong> {error}
            <button 
              onClick={fetchPets}
              className="ml-3 underline hover:no-underline"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}

      {/* Mensaje cuando no hay mascotas */}
      {!loading && !error && pets.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            <p className="text-4xl mb-4">🐾</p>
            <p>No hay mascotas disponibles en este momento.</p>
            <button 
              onClick={fetchPets}
              className="mt-4 text-[#005017] underline hover:no-underline"
            >
              Actualizar
            </button>
          </div>
        </div>
      )}

      {/* Grid de Mascotas */}
      {!loading && !error && pets.length > 0 && (
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-6 max-w-6xl mx-auto my-10">
        {(() => {
          const filteredPets = pets.filter((pet) => {
            const normalize = (s) => (s || "").toLowerCase().replace(/[ao]$/,'');
            if (selectedType && pet.type !== selectedType) return false;
            if (selectedSize && normalize(pet.tamaño) !== normalize(selectedSize)) return false;
            if (selectedAge && normalize(pet.edad) !== normalize(selectedAge)) return false;
            if (selectedSex && pet.sexo && pet.sexo.toLowerCase() !== selectedSex.toLowerCase()) return false;
            return true;
          });
          
          if (filteredPets.length === 0) {
            return (
              <div className="col-span-3 text-center py-8 text-gray-500">
                <p className="text-2xl mb-2">😿</p>
                <p>No hay mascotas que coincidan con los filtros seleccionados.</p>
              </div>
            );
          }
          
          return filteredPets
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((pet, i) => (
          <motion.div
            key={`${pet.type}-${pet.id}`}
            className="bg-[#EDE4D6] rounded-lg shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: i * 0.1
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
            viewport={{ once: true }}
            onClick={() => setSelectedPet(pet)}
          >
            <div className="relative">
              <img src={getImageUrl(pet.img)} alt={pet.name} className="w-full h-48 object-cover" />
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                {pet.type === 'dog' ? '🐕 Perro' : '🐱 Gato'}
              </div>
            </div>
            <div className="p-4 text-left">
              <h3 className="font-bold text-lg">{pet.name}</h3>
              <p className="text-sm text-gray-600 mt-2">
                <span className="font-semibold">Tranquilo</span> •
                <span className="font-semibold"> Amistoso</span> •
                <span className="font-semibold"> Juguetón</span>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {pet.desc.substring(0, 50)}...
              </p>
              
              {/* Botón de acción */}
              <div className="w-full mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAdopt(pet);
                  }}
                  className="w-full bg-[#005017] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#0e8c37] transition"
                >
                  ¡Adoptar!
                </button>
              </div>
            </div>
          </motion.div>
        ));
        })()}
        </section>
      )}

        {/* Modal */}
        {selectedPet && (
        <div 
            className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50"
            onClick={() => setSelectedPet(null)}
        >
            <div 
                className="bg-[#FDF8E7] rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 p-6 relative"
                onClick={(e) => e.stopPropagation()}
            >

            <h2 className="text-2xl font-bold mb-4 text-center">{selectedPet.name}</h2>

            <div className="flex flex-col md:flex-row gap-6 items-center">
                <img
                src={getImageUrl(selectedPet.img)}
                alt={selectedPet.name}
                className="w-48 h-40 object-cover rounded-lg"
                />
                <div className="flex-1">
                    <p className="text-gray-700 mb-4">{selectedPet.desc}</p>
                    
                    {/* Historial de rescate */}
                    {selectedPet.historial && (
                        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
                            <h4 className="font-semibold text-amber-800 mb-2">📖 Historia de rescate</h4>
                            <p className="text-amber-700 text-sm leading-relaxed">{selectedPet.historial}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Info */}
            <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
                <span><strong>Edad:</strong> {selectedPet.edad}</span>
                <span><strong>Tamaño:</strong> {selectedPet.tamaño}</span>
                <span><strong>Sexo:</strong> {selectedPet.sexo}</span>
                <span><strong>Fundación:</strong> {selectedPet.fundacion}</span>
            </div>

            {/* Botón adoptar */}
            <div className="text-center mt-6">
                <button className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition">
                🐾 Adoptar a {selectedPet.name}
                </button>
            </div>
            </div>
        </div>
        )}

      {/* Paginación */}
      {!loading && !error && (() => {
        const filteredPets = pets.filter((pet) => {
          const normalize = (s) => (s || "").toLowerCase().replace(/[ao]$/,'');
          if (selectedType && pet.type !== selectedType) return false;
          if (selectedSize && normalize(pet.tamaño) !== normalize(selectedSize)) return false;
          if (selectedAge && normalize(pet.edad) !== normalize(selectedAge)) return false;
          if (selectedSex && pet.sexo.toLowerCase() !== selectedSex.toLowerCase()) return false;
          return true;
        });
        
        const totalPages = Math.ceil(filteredPets.length / itemsPerPage);
        
        if (totalPages <= 1) return null;
        
        const renderPageNumbers = () => {
          const pages = [];
          const maxVisiblePages = 5;
          
          if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
              pages.push(i);
            }
          } else {
            if (currentPage <= 3) {
              pages.push(1, 2, 3, 4, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
              pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
              pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
          }
          
          return pages;
        };
        
        return (
          <div className="flex justify-center items-center gap-2 my-10">
            {/* Botón anterior */}
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1 
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                  : "bg-gray-200 hover:bg-[var(--secondary)] hover:text-white"
              } transition`}
            >
              ‹
            </button>
            
            {/* Números de página */}
            {renderPageNumbers().map((page, i) => (
              <button
                key={typeof page === 'number' ? `page-${page}` : `ellipsis-${i}`}
                onClick={() => typeof page === 'number' && setCurrentPage(page)}
                disabled={typeof page !== 'number'}
                className={`px-3 py-1 rounded ${
                  page === currentPage 
                    ? "bg-[var(--primary)] text-white" 
                    : typeof page === 'number'
                    ? "bg-gray-200 hover:bg-[var(--secondary)] hover:text-white" 
                    : "bg-transparent cursor-default"
                } transition`}
              >
                {page}
              </button>
            ))}
            
            {/* Botón siguiente */}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages 
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                  : "bg-gray-200 hover:bg-[var(--secondary)] hover:text-white"
              } transition`}
            >
              ›
            </button>
          </div>
        );
      })()}

      {/* Notificación de adopción */}
      <AdoptionNotification
        isVisible={showAdoptionNotification}
        onClose={() => setShowAdoptionNotification(false)}
        petName={pendingAdoption?.name || ""}
        onLogin={handleLoginFromNotification}
        onRegister={handleRegisterFromNotification}
      />
      
    </>
  );
}
