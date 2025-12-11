import { useState, useEffect } from 'react';
import { FaCalendarPlus, FaPaw, FaUser, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const getImageUrl = (imgPath) => {
  if (!imgPath) return '/public/icon.png';
  if (imgPath.startsWith('http') || imgPath.startsWith('https')) {
    return imgPath;
  }
  if (imgPath.startsWith('/uploads')) {
    return `http://localhost:4000${imgPath}`;
  }
  return imgPath;
};

export default function FoundationAdoptionsTab({ foundationId, onScheduleVisit }) {
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdoptions = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/adoption-requests/foundation/${foundationId}?status=approved`);
        const result = await response.json();
        
        if (result.success) {
          setAdoptions(result.data);
        }
      } catch (err) {
        console.error('Error fetching adoptions:', err);
      } finally {
        setLoading(false);
      }
    };

    if (foundationId) {
      fetchAdoptions();
    }
  }, [foundationId]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#BCC990] mx-auto"></div>
        <p className="text-gray-500 mt-4">Cargando adopciones...</p>
      </div>
    );
  }

  if (adoptions.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-gradient-to-br from-white via-white to-[#f5f1e4] rounded-2xl border border-[#e9e3d2] shadow-sm">
        <div className="mx-auto mb-6 h-16 w-16 flex items-center justify-center rounded-full bg-[#BCC990]/15">
          <FaPaw className="text-4xl text-[#BCC990]" />
        </div>
        <p className="text-gray-600 text-xl font-semibold mb-2">
          No hay adopciones aprobadas
        </p>
        <p className="text-gray-400 max-w-sm mx-auto">
          Cuando apruebes adopciones, podrás programar visitas de seguimiento aquí.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {adoptions.map((adoption, index) => (
        <motion.div
          key={adoption.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
        >
          {/* Header con imagen */}
          <div className="relative h-36">
            <img 
              src={getImageUrl(adoption.pet_img)} 
              alt={adoption.pet_name}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = '/public/icon.png'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 left-3 text-white">
              <h3 className="font-bold text-lg flex items-center gap-2">
                {adoption.pet_type === 'dog' ? '🐕' : '🐱'} {adoption.pet_name}
              </h3>
            </div>
            <div className="absolute top-3 right-3">
              <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <FaCheckCircle /> Adoptado
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            {/* Adoptante */}
            <div className="flex items-center gap-2 mb-3 bg-blue-50 rounded-lg p-2">
              <FaUser className="text-blue-500" />
              <div>
                <p className="text-xs text-gray-500">Adoptante</p>
                <p className="font-medium text-gray-800 text-sm">{adoption.nombre} {adoption.apellido}</p>
              </div>
            </div>

            {/* Fecha de adopción */}
            <p className="text-sm text-gray-500 mb-4">
              Adoptado el {formatDate(adoption.updated_at)}
            </p>

            {/* Botón programar visita */}
            <button
              onClick={() => onScheduleVisit({
                ...adoption,
                adopter_name: `${adoption.nombre} ${adoption.apellido}`
              })}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
            >
              <FaCalendarPlus /> Programar Visita
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
