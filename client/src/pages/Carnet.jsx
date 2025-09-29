import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import CarnetHeader from '../components/Carnet/CarnetHeader';
import CarnetCard from '../components/Carnet/CarnetCard';

export default function Carnet() {
  const location = useLocation();
  const { petId } = useParams();
  const [carnetData, setCarnetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener petId desde diferentes fuentes
  const getPetId = () => {
    // 1. Desde URL params (si viene como /carnet/:petId)
    if (petId) return petId;
    
    // 2. Desde estado de navegación (cuando viene del formulario)
    if (location.state?.petInfo?.id) return location.state.petInfo.id;
    
    // 3. Default: usar mascota ID 1 (Bella) para demo
    return 1;
  };

  // Función para obtener datos del carnet desde la API
  const fetchCarnetData = async () => {
    try {
      setLoading(true);
      const currentPetId = getPetId();
      const response = await fetch(`http://localhost:4000/api/carnet/${currentPetId}`);
      const result = await response.json();

      if (result.success) {
        // Transformar datos de la API al formato que espera CarnetCard
        const transformedData = {
          mascota: result.data.mascota,
          vacunas: result.data.vacunas.map(v => ({
            id: v.id,
            nombre: v.nombre_vacuna,
            fecha: v.fecha_aplicacion,
            proximoRefuerzo: v.proxima_dosis,
            lote: v.lote,
            veterinario: v.veterinario,
            observaciones: v.observaciones || 'Sin observaciones'
          })),
          desparasitaciones: result.data.desparasitaciones.map(d => ({
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
          baños: result.data.banos.map(b => ({
            id: b.id,
            fecha: b.fecha,
            tipoShampoo: b.tipo_shampoo,
            tratamientoEspecial: b.tratamiento_especial,
            realizadoPor: b.realizado_por,
            observaciones: b.observaciones || 'Sin observaciones'
          })),
          procedimientos: result.data.procedimientos.map(p => ({
            id: p.id,
            tipo: p.tipo_procedimiento,
            descripcion: p.descripcion,
            fecha: p.fecha,
            veterinario: p.veterinario,
            costo: p.costo,
            observaciones: p.observaciones || 'Sin observaciones'
          })),
          medicamentos: result.data.medicamentos.map(m => ({
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
        console.log('📋 Datos del carnet cargados:', transformedData);
      } else {
        setError(result.message || 'Error al cargar el carnet');
      }
    } catch (err) {
      console.error('Error fetching carnet:', err);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchCarnetData();
  }, [petId, location.state]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFCF4] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005017] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando carnet médico...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FFFCF4] flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
          <button 
            onClick={fetchCarnetData}
            className="bg-[#005017] text-white px-4 py-2 rounded hover:bg-[#0e8c37] transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFCF4]">
      <CarnetHeader mascota={carnetData?.mascota} />
      <CarnetCard initialData={carnetData} />
    </div>
  );
}