import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import CarnetHeader from '../components/Carnet/CarnetHeader';
import CarnetCard from '../components/Carnet/CarnetCard';
import { motion } from 'framer-motion';
import { Heart, AlertCircle } from 'lucide-react';

export default function Carnet() {
  const { user } = useAuth();
  const [adoptedPets, setAdoptedPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [carnetData, setCarnetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [carnetLoading, setCarnetLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener mascotas adoptadas del usuario
  useEffect(() => {
    const fetchAdoptedPets = async () => {
      if (!user?.id) {
        setError('Usuario no autenticado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Obtener solicitudes aprobadas del usuario
        const response = await fetch(
          `http://localhost:4000/api/adoption-requests/user/${user.id}`
        );
        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          // Filtrar solo las solicitudes aprobadas
          const approved = result.data.filter(req => req.status === 'approved');
          
          if (approved.length > 0) {
            setAdoptedPets(approved);
            // Seleccionar la primera mascota por defecto
            setSelectedPet(approved[0]);
          } else {
            setError('No tienes mascotas adoptadas aún');
          }
        } else {
          setError(result.message || 'Error al cargar mascotas adoptadas');
        }
      } catch (err) {
        console.error('Error fetching adopted pets:', err);
        setError('Error de conexión con el servidor');
      } finally {
        setLoading(false);
      }
    };

    fetchAdoptedPets();
  }, [user?.id]);

  // Obtener carnet de la mascota seleccionada
  useEffect(() => {
    if (!selectedPet?.pet_id) return;

    const fetchCarnetData = async () => {
      try {
        setCarnetLoading(true);
        const response = await fetch(
          `http://localhost:4000/api/carnet/${selectedPet.pet_id}`
        );
        const result = await response.json();

        if (result.success) {
          // Transformar datos de la API
          const transformedData = {
            mascota: result.data.mascota,
            vacunas: (result.data.vacunas || []).map(v => ({
              id: v.id,
              nombre: v.nombre_vacuna,
              fecha: v.fecha_aplicacion,
              proximoRefuerzo: v.proxima_dosis,
              lote: v.lote,
              veterinario: v.veterinario,
              observaciones: v.observaciones || 'Sin observaciones'
            })),
            desparasitaciones: (result.data.desparasitaciones || []).map(d => ({
              id: d.id,
              tipo: d.tipo,
              medicamento: d.medicamento,
              fecha: d.fecha_aplicacion,
              dosis: d.dosis,
              peso: d.peso_mascota,
              veterinario: d.veterinario,
              proximaDosis: d.proxima_dosis,
              observaciones: d.observaciones || 'Sin observaciones'
            })),
            baños: (result.data.banos || []).map(b => ({
              id: b.id,
              fecha: b.fecha,
              tipoShampoo: b.tipo_shampoo,
              tratamientoEspecial: b.tratamiento_especial,
              realizadoPor: b.realizado_por,
              observaciones: b.observaciones || 'Sin observaciones'
            })),
            procedimientos: (result.data.procedimientos || []).map(p => ({
              id: p.id,
              tipo: p.tipo_procedimiento,
              descripcion: p.descripcion,
              fecha: p.fecha,
              veterinario: p.veterinario,
              costo: p.costo,
              observaciones: p.observaciones || 'Sin observaciones'
            })),
            medicamentos: (result.data.medicamentos || []).map(m => ({
              id: m.id,
              medicamento: m.medicamento,
              dosis: m.dosis,
              frecuencia: m.frecuencia,
              fechaInicio: m.fecha_inicio,
              fechaFin: m.fecha_fin,
              motivo: m.motivo,
              veterinario: m.veterinario,
              observaciones: m.observaciones || 'Sin observaciones'
            }))
          };

          setCarnetData(transformedData);
        }
      } catch (err) {
        console.error('Error fetching carnet:', err);
      } finally {
        setCarnetLoading(false);
      }
    };

    fetchCarnetData();
  }, [selectedPet?.pet_id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFCF4] flex items-center justify-center mt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005017] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tus mascotas adoptadas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FFFCF4] flex items-center justify-center mt-20">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <AlertCircle size={48} className="mx-auto text-orange-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error === 'No tienes mascotas adoptadas aún' ? '¡Sin mascotas! 🐾' : 'Error'}
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          {error === 'No tienes mascotas adoptadas aún' && (
            <a
              href="/Dogs"
              className="inline-block bg-[#BCC990] text-white px-6 py-2 rounded-lg hover:bg-[#9FB36F] transition"
            >
              Explorar mascotas
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFCF4]">
      {/* Selector de mascotas */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#BCC990] to-[#9FB36F] py-6 mt-16"
      >
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-white text-2xl font-bold mb-4 flex items-center gap-2">
            <Heart size={28} /> Mis Mascotas Adoptadas
          </h2>
          
          {adoptedPets.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {adoptedPets.map((pet) => (
                <motion.button
                  key={pet.id}
                  onClick={() => setSelectedPet(pet)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
                    selectedPet?.id === pet.id
                      ? 'bg-white text-[#005017]'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {pet.pet_name} {pet.pet_type === 'dog' ? '🐶' : '🐱'}
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Carnet de la mascota seleccionada */}
      {carnetLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005017] mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando carnet médico...</p>
          </div>
        </div>
      ) : carnetData ? (
        <>
          <CarnetHeader mascota={carnetData?.mascota} />
          <CarnetCard initialData={carnetData} />
        </>
      ) : (
        <div className="py-20 text-center">
          <p className="text-gray-600">No hay información del carnet disponible</p>
        </div>
      )}
    </div>
  );
}