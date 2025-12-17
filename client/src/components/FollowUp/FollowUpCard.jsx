import { FaStar, FaEdit, FaTrash, FaEye } from 'react-icons/fa';

// Helper para parsear fotos que pueden venir como string JSON o array
const parsePhotos = (photos) => {
  if (!photos) return [];
  if (Array.isArray(photos)) return photos;
  if (typeof photos === 'string') {
    try {
      const parsed = JSON.parse(photos);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

export default function FollowUpCard({ followUp, onViewDetail, onEdit, onDelete, isFoundation = false }) {
  // Parsear fotos de forma segura
  const photos = parsePhotos(followUp.photos);

  const getHealthColor = (status) => {
    switch(status) {
      case 'excelente': return 'bg-green-100 text-green-800';
      case 'bueno': return 'bg-blue-100 text-blue-800';
      case 'regular': return 'bg-yellow-100 text-yellow-800';
      case 'malo': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBehaviorColor = (status) => {
    switch(status) {
      case 'adaptado': return 'bg-green-100 text-green-800';
      case 'en proceso': return 'bg-yellow-100 text-yellow-800';
      case 'problemas': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-lg text-gray-800">{followUp.pet_name}</h3>
            <p className="text-xs text-gray-500">{formatDate(followUp.follow_up_date)}</p>
          </div>
          {isFoundation && !followUp.reviewed && (
            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-semibold">
              Pendiente
            </span>
          )}
          {isFoundation && followUp.reviewed && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
              Revisado
            </span>
          )}
        </div>

        {/* Badges de estado */}
        <div className="flex gap-2 mb-3 flex-wrap">
          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getHealthColor(followUp.health_status)}`}>
            🏥 {followUp.health_status}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getBehaviorColor(followUp.behavior_status)}`}>
            😊 {followUp.behavior_status}
          </span>
        </div>

        {/* Información */}
        {followUp.problems_encountered && (
          <div className="bg-red-50 border-l-2 border-red-300 p-2 mb-3 rounded text-xs text-red-700">
            <strong>⚠️ Problemas:</strong> {followUp.problems_encountered.substring(0, 80)}...
          </div>
        )}

        {/* Fotos */}
        {photos.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-semibold text-gray-600 mb-2">📸 Fotos ({photos.length})</p>
            <div className="flex gap-2">
              {photos.slice(0, 3).map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`Photo ${index}`}
                  className="w-12 h-12 object-cover rounded"
                />
              ))}
              {photos.length > 3 && (
                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-600">
                  +{photos.length - 3}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex gap-2 pt-3 border-t border-gray-200">
          <button
            onClick={() => onViewDetail(followUp)}
            className="flex-1 flex items-center justify-center gap-1 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 py-2 rounded font-semibold transition"
          >
            <FaEye size={14} /> Ver
          </button>
          {!isFoundation && !followUp.reviewed && (
            <button
              onClick={() => onEdit(followUp)}
              className="flex items-center justify-center gap-1 text-sm bg-orange-100 text-orange-700 hover:bg-orange-200 px-3 py-2 rounded font-semibold transition"
            >
              <FaEdit size={14} />
            </button>
          )}
          {!isFoundation && (
            <button
              onClick={() => onDelete(followUp.id)}
              className="flex items-center justify-center gap-1 text-sm bg-red-100 text-red-700 hover:bg-red-200 px-3 py-2 rounded font-semibold transition"
            >
              <FaTrash size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
