// src/pages/cats.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { IoChevronDown } from "react-icons/io5";
import { useAuth } from "../contexts/AuthContext";
import { useAdoption } from "../contexts/AdoptionContext";

export default function Gatitos() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { saveAdoptionIntent } = useAdoption();
  
  const [selectedCat, setSelectedCat] = useState(null);
  // Estados para filtros y control de menú de filtros
  const [openFilter, setOpenFilter] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedAge, setSelectedAge] = useState(null);
  const [selectedSex, setSelectedSex] = useState(null);

  // Estados para manejar los datos de la API
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para manejar la adopción
  const handleAdopt = (cat) => {
    if (isAuthenticated()) {
      // Si está autenticado, ir directamente al formulario
      navigate(`/formulario/${cat.id}`);
    } else {
      // Si NO está autenticado, guardar intención y redirigir al login
      saveAdoptionIntent({
        id: cat.id,
        name: cat.name,
        img: cat.img,
        description: cat.desc,
        type: 'cat'
      });
      
      // Mostrar mensaje y redirigir
      alert(`¡${cat.name} te está esperando! Necesitas iniciar sesión para adoptar.`);
      navigate("/login");
    }
  };

  // Función para obtener gatos desde la API
  const fetchCats = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/pets?type=cat');
      const result = await response.json();
      
      if (result.success) {
        // Mapear los datos de la API al formato que espera el componente
        const formattedCats = result.data.map(cat => ({
          id: cat.id,
          name: cat.name,
          img: cat.img,
          desc: cat.description,
          edad: cat.age,
          tamaño: cat.size,
          sexo: cat.sex,
          fundacion: cat.foundation,
          historial: cat.historial, // Historia de rescate
        }));
        
        setCats(formattedCats);
      } else {
        setError('Error al cargar los gatos');
      }
    } catch (err) {
      console.error('Error fetching cats:', err);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchCats();
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="bg-[#FFFCF4] text-center py-20">
        <h1 className="text-3xl font-bold text-gray-900">Gatitos en adopción</h1>
        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
          Estos pequeños buscan un hogar lleno de amor.  
          ¿Quieres cambiar sus vidas y la tuya?
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
              {['Pequeña','Mediano','Grande'].map((opt) => (
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
          <span className="ml-3 text-gray-600">Cargando gatitos...</span>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto">
            <strong>Error:</strong> {error}
            <button 
              onClick={fetchCats}
              className="ml-3 underline hover:no-underline"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}

      {/* Grid de Gatitos */}
      {!loading && !error && (
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-6 max-w-6xl mx-auto my-10">
        {cats
          .filter((cat) => {
            const normalize = (s) => (s || "").toLowerCase().replace(/[ao]$/,'');
            if (selectedSize && normalize(cat.tamaño) !== normalize(selectedSize)) return false;
            if (selectedAge && normalize(cat.edad) !== normalize(selectedAge)) return false;
            if (selectedSex && cat.sexo.toLowerCase() !== selectedSex.toLowerCase()) return false;
            return true;
          })
          .map((cat, i) => (
          <motion.div
            key={i}
            className="bg-[#EDE4D6] rounded-lg shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: true }}
            onClick={() => setSelectedCat(cat)} // Abrir modal al hacer clic en la card
          >
            <img src={cat.img} alt={cat.name} className="w-full h-48 object-cover" />
            <div className="p-4 text-left">
              <h3 className="font-bold text-lg">{cat.name}</h3>
              <p className="text-sm text-gray-600 mt-2">
                <span className="font-semibold">Cariñoso</span> •
                <span className="font-semibold"> Juguetón</span> •
                <span className="font-semibold"> Tranquilo</span>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {cat.desc.substring(0, 50)}...
              </p>
              
              {/* Botón de acción */}
              <div className="w-full mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Evitar que se abra el modal
                    handleAdopt(cat);
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
      {selectedCat && (
        <div 
            className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50"
            onClick={() => setSelectedCat(null)} // Cerrar al hacer clic en el fondo
        >
          <div 
              className="bg-[#FDF8E7] rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 p-6 relative"
              onClick={(e) => e.stopPropagation()} // Evitar que se cierre al hacer clic dentro del modal
          >

            <h2 className="text-2xl font-bold mb-4 text-center">{selectedCat.name}</h2>

            <div className="flex flex-col md:flex-row gap-6 items-center">
              <img
                src={selectedCat.img}
                alt={selectedCat.name}
                className="w-48 h-40 object-cover rounded-lg"
              />
              <div className="flex-1">
                  <p className="text-gray-700 mb-4">{selectedCat.desc || selectedCat.description}</p>
                  
                  {/* Historial de rescate */}
                  {selectedCat.historial && (
                      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
                          <h4 className="font-semibold text-amber-800 mb-2">📖 Historia de rescate</h4>
                          <p className="text-amber-700 text-sm leading-relaxed">{selectedCat.historial}</p>
                      </div>
                  )}
              </div>
            </div>

            {/* Info */}
            <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
              <span><strong>Edad:</strong> {selectedCat.age || selectedCat.edad}</span>
              <span><strong>Tamaño:</strong> {selectedCat.size || selectedCat.tamaño}</span>
              <span><strong>Sexo:</strong> {selectedCat.sex || selectedCat.sexo}</span>
              <span><strong>Fundación:</strong> {selectedCat.foundation || selectedCat.fundacion}</span>
            </div>

            {/* Botón adoptar */}
            <div className="text-center mt-6">
              <button 
                  onClick={() => handleAdopt(selectedCat)}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition"
              >
                🐾 Adoptar a {selectedCat.name}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Paginación */}
      <div className="flex justify-center items-center gap-2 my-10">
        {[1, 2, 3, "...", 34].map((page, i) => (
          <button
            key={i}
            className={`px-3 py-1 rounded ${
              page === 1 ? "bg-[var(--primary)] text-white" : "bg-gray-200"
            } hover:bg-[var(--secondary)] hover:text-white transition`}
          >
            {page}
          </button>
        ))}
      </div>
    </>
  );
}
