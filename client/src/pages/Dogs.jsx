// src/pages/dogs.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { IoChevronDown } from "react-icons/io5";
import { useAuth } from "../contexts/AuthContext";
import { useAdoption } from "../contexts/AdoptionContext";
import AdoptionNotification from "../components/AdoptionNotification";

export default function Perritos() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { saveAdoptionIntent } = useAdoption();
  
  const [selectedDog, setSelectedDog] = useState(null);
  const [showAdoptionNotification, setShowAdoptionNotification] = useState(false);
  const [pendingAdoption, setPendingAdoption] = useState(null);
  // Estados para filtros y control de menú de filtros
  const [openFilter, setOpenFilter] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedAge, setSelectedAge] = useState(null);
  const [selectedSex, setSelectedSex] = useState(null);
  
  // Estados para manejar los datos de la API
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Función para manejar la adopción
  const handleAdopt = (dog) => {
    if (isAuthenticated()) {
      // Si está autenticado, ir directamente al formulario
      navigate(`/formulario/${dog.id}`);
    } else {
      // Si NO está autenticado, mostrar notificación personalizada
      setPendingAdoption(dog);
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
        type: 'dog'
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
        type: 'dog'
      });
    }
    setShowAdoptionNotification(false);
    navigate("/register");
  };

  // Función para obtener perros desde la API
  const fetchDogs = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/pets?type=dog');
      const result = await response.json();
      
      if (result.success) {
        // Mapear los datos de la API al formato que espera el componente
        const formattedDogs = result.data.map(dog => ({
          id: dog.id,
          name: dog.name,
          img: dog.img,
          desc: dog.description,
          edad: dog.age,
          tamaño: dog.size,
          sexo: dog.sex,
          fundacion: dog.foundation,
          historial: dog.historial, // Historia de rescate
        }));
        setDogs(formattedDogs);
      } else {
        setError('Error al cargar los perros');
      }
    } catch (err) {
      console.error('Error fetching dogs:', err);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchDogs();
  }, []);

  return (
    <>

      {/* Hero */}
      <section className="bg-[#FFFCF4] text-center py-20">
        <h1 className="text-3xl font-bold text-gray-900">Perritos en adopción</h1>
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
          <span className="ml-3 text-gray-600">Cargando perritos...</span>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto">
            <strong>Error:</strong> {error}
            <button 
              onClick={fetchDogs}
              className="ml-3 underline hover:no-underline"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}

      {/* Grid de Perritos */}
      {!loading && !error && (
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-6 max-w-6xl mx-auto my-10">
        {dogs
      .filter((dog) => {
        const normalize = (s) => (s || "").toLowerCase().replace(/[ao]$/,'');
        if (selectedSize && normalize(dog.tamaño) !== normalize(selectedSize)) return false;
        if (selectedAge && normalize(dog.edad) !== normalize(selectedAge)) return false;
        if (selectedSex && dog.sexo.toLowerCase() !== selectedSex.toLowerCase()) return false;
        return true;
          })
          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
          .map((dog, i) => (
          <motion.div
            key={i}
            className="bg-[#EDE4D6] rounded-lg shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: true }}
            onClick={() => setSelectedDog(dog)} // Abrir modal al hacer clic en la card
          >
            <img src={dog.img} alt={dog.name} className="w-full h-48 object-cover" />
            <div className="p-4 text-left">
              <h3 className="font-bold text-lg">{dog.name}</h3>
              <p className="text-sm text-gray-600 mt-2">
                <span className="font-semibold">Tranquilo</span> •
                <span className="font-semibold"> Amistoso</span> •
                <span className="font-semibold"> Juguetón</span>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {dog.desc.substring(0, 50)}...
              </p>
              
              {/* Botón de acción */}
              <div className="w-full mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Evitar que se abra el modal
                    handleAdopt(dog);
                  }}
                  className="w-full bg-[#005017] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#0e8c37] transition"
                >
                  ¡Adoptar!
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        </section>
      )}

        {/* Modal */}
        {selectedDog && (
        <div 
            className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50"
            onClick={() => setSelectedDog(null)} // Cerrar al hacer clic en el fondo
        >
            <div 
                className="bg-[#FDF8E7] rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 p-6 relative"
                onClick={(e) => e.stopPropagation()} // Evitar que se cierre al hacer clic dentro del modal
            >

            <h2 className="text-2xl font-bold mb-4 text-center">{selectedDog.name}</h2>

            <div className="flex flex-col md:flex-row gap-6 items-center">
                <img
                src={selectedDog.img}
                alt={selectedDog.name}
                className="w-48 h-40 object-cover rounded-lg"
                />
                <div className="flex-1">
                    <p className="text-gray-700 mb-4">{selectedDog.desc}</p>
                    
                    {/* Historial de rescate */}
                    {selectedDog.historial && (
                        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
                            <h4 className="font-semibold text-amber-800 mb-2">📖 Historia de rescate</h4>
                            <p className="text-amber-700 text-sm leading-relaxed">{selectedDog.historial}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Info */}
            <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
                <span><strong>Edad:</strong> {selectedDog.edad}</span>
                <span><strong>Tamaño:</strong> {selectedDog.tamaño}</span>
                <span><strong>Sexo:</strong> {selectedDog.sexo}</span>
                <span><strong>Fundación:</strong> {selectedDog.fundacion}</span>
            </div>

            {/* Botón adoptar */}
            <div className="text-center mt-6">
                <button className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition">
                🐾 Adoptar a {selectedDog.name}
                </button>
            </div>
            </div>
        </div>
        )}

      {/* Paginación */}
      {!loading && !error && (() => {
        const filteredDogs = dogs.filter((dog) => {
          const normalize = (s) => (s || "").toLowerCase().replace(/[ao]$/,'');
          if (selectedSize && normalize(dog.tamaño) !== normalize(selectedSize)) return false;
          if (selectedAge && normalize(dog.edad) !== normalize(selectedAge)) return false;
          if (selectedSex && dog.sexo.toLowerCase() !== selectedSex.toLowerCase()) return false;
          return true;
        });
        
        const totalPages = Math.ceil(filteredDogs.length / itemsPerPage);
        
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
                key={i}
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
