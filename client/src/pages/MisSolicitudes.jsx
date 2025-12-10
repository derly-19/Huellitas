import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Check, X, Clock, ChevronDown, Eye } from "lucide-react";
import CarnetHeader from "../components/Carnet/CarnetHeader";
import CarnetCard from "../components/Carnet/CarnetCard";

export default function MisSolicitudes() {
  const { user } = useAuth();
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [selectedPetForCarnet, setSelectedPetForCarnet] = useState(null);
  const [carnetData, setCarnetData] = useState(null);
  const [carnetLoading, setCarnetLoading] = useState(false);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      if (!user?.id) return;

      try {
        const response = await fetch(
          `http://localhost:4000/api/adoption-requests/user/${user.id}`
        );
        const data = await response.json();

        if (data.success) {
          setSolicitudes(data.data || []);
        } else {
          console.error("Error fetching solicitudes:", data.message);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitudes();
  }, [user?.id]);

  // Cargar carnet cuando se selecciona una mascota
  useEffect(() => {
    if (!selectedPetForCarnet?.pet_id) return;

    const fetchCarnetData = async () => {
      try {
        setCarnetLoading(true);
        const response = await fetch(
          `http://localhost:4000/api/carnet/${selectedPetForCarnet.pet_id}`
        );
        const result = await response.json();

        if (result.success) {
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
  }, [selectedPetForCarnet?.pet_id]);

  const getStatusInfo = (status) => {
    switch (status) {
      case "pending":
        return {
          label: "Pendiente",
          color: "bg-yellow-100 text-yellow-800",
          icon: <Clock size={20} className="text-yellow-600" />
        };
      case "approved":
        return {
          label: "Aprobada",
          color: "bg-green-100 text-green-800",
          icon: <Check size={20} className="text-green-600" />
        };
      case "rejected":
        return {
          label: "Rechazada",
          color: "bg-red-100 text-red-800",
          icon: <X size={20} className="text-red-600" />
        };
      case "contacted":
        return {
          label: "Contactado",
          color: "bg-blue-100 text-blue-800",
          icon: <FileText size={20} className="text-blue-600" />
        };
      default:
        return {
          label: status,
          color: "bg-gray-100 text-gray-800",
          icon: <FileText size={20} className="text-gray-600" />
        };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Si hay un carnet seleccionado, mostrarlo
  if (selectedPetForCarnet) {
    return (
      <div className="min-h-screen bg-[#FFFCF4]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-r from-[#BCC990] to-[#9FB36F] py-6 mt-16"
        >
          <div className="max-w-6xl mx-auto px-4">
            <button
              onClick={() => {
                setSelectedPetForCarnet(null);
                setCarnetData(null);
              }}
              className="text-white hover:text-yellow-100 transition mb-4 font-semibold"
            >
              ← Volver a mis solicitudes
            </button>
            <h2 className="text-white text-2xl font-bold">
              Carnet Médico - {selectedPetForCarnet.pet_name} {selectedPetForCarnet.pet_type === 'dog' ? '🐶' : '🐱'}
            </h2>
          </div>
        </motion.div>

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
            <CarnetCard initialData={carnetData} readOnly={false} petId={selectedPetForCarnet?.pet_id} />
          </>
        ) : (
          <div className="py-20 text-center">
            <p className="text-gray-600">No hay información del carnet disponible</p>
          </div>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 mt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BCC990] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando solicitudes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <FileText size={32} className="text-[#BCC990]" />
            <h1 className="text-4xl font-bold text-gray-900">Mis Solicitudes</h1>
          </div>
          <p className="text-gray-600">
            Aquí puedes ver el estado de tus solicitudes de adopción y acceder a los carnets
          </p>
        </motion.div>

        {/* Lista de solicitudes */}
        {solicitudes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg shadow-sm p-12 text-center"
          >
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No tienes solicitudes
            </h3>
            <p className="text-gray-600 mb-6">
              Aún no has enviado ninguna solicitud de adopción. ¡Explora nuestras mascotas disponibles!
            </p>
            <a
              href="/Dogs"
              className="inline-block bg-[#BCC990] text-white px-6 py-2 rounded-lg hover:bg-[#9FB36F] transition"
            >
              Ver mascotas disponibles
            </a>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {solicitudes.map((solicitud, index) => {
              const statusInfo = getStatusInfo(solicitud.status);
              const isExpanded = expandedId === solicitud.id;
              const isApproved = solicitud.status === 'approved';

              return (
                <motion.div
                  key={solicitud.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Header - Clickable */}
                  <div
                    onClick={() =>
                      setExpandedId(isExpanded ? null : solicitud.id)
                    }
                    className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-4 text-left flex-1">
                      {/* Status Icon */}
                      <div className={`p-3 rounded-lg ${statusInfo.color}`}>
                        {statusInfo.icon}
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {solicitud.pet_name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Solicitud enviada el {formatDate(solicitud.created_at)}
                        </p>
                        <div className="mt-2">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}
                          >
                            {statusInfo.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-2 items-center" onClick={(e) => e.stopPropagation()}>
                      {isApproved && (
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPetForCarnet(solicitud);
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-[#BCC990] text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-[#9FB36F] transition flex items-center gap-2"
                        >
                          <Eye size={16} />
                          Ver Carnet
                        </motion.button>
                      )}
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown size={24} className="text-gray-400" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-gray-200 p-6 bg-gray-50"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Información personal */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">
                            Información Personal
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs text-gray-600 uppercase tracking-wide">
                                Nombre
                              </p>
                              <p className="text-gray-900 font-medium">
                                {solicitud.nombre} {solicitud.apellido}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 uppercase tracking-wide">
                                Correo
                              </p>
                              <p className="text-gray-900 font-medium break-all">
                                {solicitud.correo}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 uppercase tracking-wide">
                                Teléfono
                              </p>
                              <p className="text-gray-900 font-medium">
                                {solicitud.telefono}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Información del hogar */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">
                            Información del Hogar
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs text-gray-600 uppercase tracking-wide">
                                Dirección
                              </p>
                              <p className="text-gray-900 font-medium">
                                {solicitud.direccion}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 uppercase tracking-wide">
                                Tipo de Vivienda
                              </p>
                              <p className="text-gray-900 font-medium capitalize">
                                {solicitud.tipo_vivienda}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 uppercase tracking-wide">
                                Tiene Mascotas
                              </p>
                              <p className="text-gray-900 font-medium capitalize">
                                {solicitud.tiene_mascotas}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Motivación */}
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                          Motivación para Adoptar
                        </h4>
                        <p className="text-gray-700 leading-relaxed">
                          {solicitud.motivacion}
                        </p>
                      </div>

                      {/* Notas (si existen) */}
                      {solicitud.notes && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                            Comentarios de la Fundación
                          </h4>
                          <p className="text-gray-700 leading-relaxed bg-blue-50 p-4 rounded-lg border-l-4 border-blue-300">
                            {solicitud.notes}
                          </p>
                        </div>
                      )}

                      {/* Información de la mascota */}
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                          Mascota
                        </h4>
                        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                          <div>
                            <p className="text-gray-600 text-sm">Mascota solicitada</p>
                            <p className="text-gray-900 font-semibold text-lg">
                              {solicitud.pet_name}
                            </p>
                            <p className="text-gray-600 text-sm capitalize">
                              {solicitud.pet_type}
                            </p>
                          </div>
                          <div className="text-4xl">
                            {solicitud.pet_type === "dog" ? "🐶" : "🐱"}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
