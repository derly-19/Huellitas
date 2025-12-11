import { FaPaw, FaCalendarAlt, FaClipboardList, FaCheckCircle, FaClock } from 'react-icons/fa';

// Función helper para obtener la URL correcta de la imagen
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

export default function AdoptedPetCard({ adoption, followUpsCount, visitsCount, pendingVisitsCount, onNewFollowUp, onViewVisits }) {
  const petTypeIcon = adoption.pet_type === 'dog' ? '🐕' : '🐱';
  
  // Formatear fecha de adopción
  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all">
      {/* Header con imagen */}
      <div className="relative h-40">
        <img 
          src={getImageUrl(adoption.pet_img)} 
          alt={adoption.pet_name}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = '/public/icon.png'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3 text-white">
          <h3 className="font-bold text-xl flex items-center gap-2">
            {petTypeIcon} {adoption.pet_name}
          </h3>
          <p className="text-sm text-white/80">
            {adoption.pet_size} • {adoption.pet_age}
          </p>
        </div>
        <div className="absolute top-3 right-3">
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <FaCheckCircle /> Adoptado
          </span>
        </div>
        {/* Badge de visitas pendientes */}
        {pendingVisitsCount > 0 && (
          <div className="absolute top-3 left-3">
            <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
              {pendingVisitsCount} visita{pendingVisitsCount > 1 ? 's' : ''} pendiente{pendingVisitsCount > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <FaClock className="text-[#BCC990]" />
          <span>Adoptado el {formatDate(adoption.approved_at || adoption.updated_at)}</span>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-blue-50 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-blue-600">{followUpsCount || 0}</p>
            <p className="text-xs text-blue-500">Seguimientos</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-purple-600">{visitsCount || 0}</p>
            <p className="text-xs text-purple-500">Visitas</p>
          </div>
        </div>

        {/* Fundación */}
        <div className="text-sm text-gray-600 mb-4 bg-gray-50 rounded-lg p-2">
          <span className="font-medium">Fundación:</span> {adoption.foundation_name || 'No especificada'}
        </div>

        {/* Acciones */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onNewFollowUp(adoption)}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-[#BCC990] text-white rounded-lg hover:bg-[#9FB36F] transition-colors text-sm font-medium"
          >
            <FaClipboardList /> Seguimiento
          </button>
          <button
            onClick={() => onViewVisits(adoption)}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium relative"
          >
            <FaCalendarAlt /> Ver Visitas
            {pendingVisitsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {pendingVisitsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
