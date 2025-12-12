import { useState } from 'react';
import { FaStar, FaEye, FaUser, FaEnvelope, FaCalendarAlt, FaCheckCircle, FaClock, FaExclamationTriangle, FaChevronDown, FaChevronUp, FaCommentDots } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

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

export default function FollowUpCardFoundation({ followUp, onViewDetail, onMarkReviewed }) {
  const [expanded, setExpanded] = useState(false);
  const photos = parsePhotos(followUp.photos);

  const getHealthConfig = (status) => {
    switch(status) {
      case 'excelente': return { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: '✨', label: 'Excelente' };
      case 'bueno': return { bg: 'bg-blue-100', text: 'text-blue-700', icon: '👍', label: 'Bueno' };
      case 'regular': return { bg: 'bg-amber-100', text: 'text-amber-700', icon: '⚠️', label: 'Regular' };
      case 'malo': return { bg: 'bg-red-100', text: 'text-red-700', icon: '❌', label: 'Malo' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', icon: '❓', label: status };
    }
  };

  const getBehaviorConfig = (status) => {
    switch(status) {
      case 'adaptado': return { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: '😊', label: 'Adaptado' };
      case 'en proceso': return { bg: 'bg-amber-100', text: 'text-amber-700', icon: '🔄', label: 'En proceso' };
      case 'problemas': return { bg: 'bg-red-100', text: 'text-red-700', icon: '😟', label: 'Problemas' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', icon: '❓', label: status };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} sem.`;
    return `Hace ${Math.floor(diffDays / 30)} mes(es)`;
  };

  const healthConfig = getHealthConfig(followUp.health_status);
  const behaviorConfig = getBehaviorConfig(followUp.behavior_status);
  const hasProblems = followUp.problems_encountered && followUp.problems_encountered.trim().length > 0;

  return (
    <motion.div
      layout
      className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all hover:shadow-md ${
        !followUp.reviewed 
          ? 'border-l-4 border-l-orange-400 ring-1 ring-orange-100' 
          : 'border-l-4 border-l-emerald-400'
      } ${hasProblems ? 'ring-2 ring-red-100' : ''}`}
    >
      {/* Header con imagen de mascota y status */}
      <div className="relative">
        <div className="flex items-stretch">
          {/* Imagen de mascota */}
          <div className="w-24 h-24 flex-shrink-0">
            <img 
              src={getImageUrl(followUp.pet_img)} 
              alt={followUp.pet_name}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = '/public/icon.png'; }}
            />
          </div>
          
          {/* Info principal */}
          <div className="flex-1 p-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                  {followUp.pet_type === 'dog' ? '🐕' : '🐱'} {followUp.pet_name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <FaCalendarAlt className="text-xs" />
                  <span>{formatDate(followUp.follow_up_date)}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs font-medium text-gray-400">{getTimeAgo(followUp.follow_up_date)}</span>
                </div>
              </div>
              
              {/* Badge de estado */}
              {!followUp.reviewed ? (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
                  <FaClock className="text-[10px]" /> Nuevo
                </span>
              ) : (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                  <FaCheckCircle className="text-[10px]" /> Revisado
                </span>
              )}
            </div>

            {/* Badges de estado de salud y comportamiento */}
            <div className="flex gap-2 mt-2">
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${healthConfig.bg} ${healthConfig.text} flex items-center gap-1`}>
                <span>{healthConfig.icon}</span>
                <span>Salud: {healthConfig.label}</span>
              </span>
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${behaviorConfig.bg} ${behaviorConfig.text} flex items-center gap-1`}>
                <span>{behaviorConfig.icon}</span>
                <span>{behaviorConfig.label}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Alerta de problemas */}
        {hasProblems && (
          <div className="mx-3 -mt-1 mb-2 px-3 py-2 bg-red-50 border-l-3 border-red-400 rounded text-xs text-red-700 flex items-center gap-2">
            <FaExclamationTriangle className="text-red-500 flex-shrink-0" />
            <span className="line-clamp-1">{followUp.problems_encountered}</span>
          </div>
        )}
      </div>

      {/* Contenido expandible */}
      <div className="px-4 pb-3">
        {/* Satisfacción y fotos en línea */}
        <div className="flex items-center justify-between py-2 border-t border-gray-100">
          <div className="flex items-center gap-3">
            {/* Estrellas */}
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  size={14}
                  className={i < followUp.overall_satisfaction ? 'text-yellow-400' : 'text-gray-200'}
                />
              ))}
              <span className="text-xs text-gray-500 ml-1">({followUp.overall_satisfaction}/5)</span>
            </div>
            
            {/* Indicador de fotos */}
            {photos.length > 0 && (
              <span className="text-xs text-gray-500 flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full">
                📸 {photos.length} foto{photos.length > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Botón expandir */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-gray-400 hover:text-gray-600 p-1 transition"
          >
            {expanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
          </button>
        </div>

        {/* Sección expandida */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              {/* Info del adoptante */}
              <div className="bg-blue-50/70 rounded-xl p-3 mb-3">
                <p className="text-xs text-blue-600 font-semibold mb-2 flex items-center gap-1">
                  <FaUser size={10} /> ADOPTANTE
                </p>
                <p className="font-medium text-gray-800 text-sm">{followUp.user_name}</p>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <FaEnvelope size={10} /> {followUp.user_email}
                  </span>
                </div>
              </div>

              {/* Notas */}
              {followUp.additional_notes && (
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-xs text-gray-500 font-semibold mb-1">📝 Notas</p>
                  <p className="text-sm text-gray-700 line-clamp-2">{followUp.additional_notes}</p>
                </div>
              )}

              {/* Fotos preview */}
              {photos.length > 0 && (
                <div className="flex gap-2 mb-3">
                  {photos.slice(0, 4).map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Foto ${index + 1}`}
                      className="w-14 h-14 object-cover rounded-lg"
                    />
                  ))}
                  {photos.length > 4 && (
                    <div className="w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-600 font-semibold">
                      +{photos.length - 4}
                    </div>
                  )}
                </div>
              )}

              {/* Feedback existente */}
              {followUp.foundation_feedback && (
                <div className="bg-purple-50 rounded-lg p-3 mb-3">
                  <p className="text-xs text-purple-600 font-semibold mb-1 flex items-center gap-1">
                    <FaCommentDots size={10} /> Tu respuesta
                  </p>
                  <p className="text-sm text-gray-700">{followUp.foundation_feedback}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botones de acción */}
        <div className="flex gap-2 pt-2 border-t border-gray-100">
          <button
            onClick={() => onViewDetail(followUp)}
            className="flex-1 flex items-center justify-center gap-2 text-sm bg-gradient-to-r from-[#BCC990] to-[#9FB36F] text-white hover:opacity-90 py-2.5 rounded-lg font-semibold transition shadow-sm"
          >
            <FaEye size={14} /> Ver completo
          </button>
          {!followUp.reviewed && (
            <button
              onClick={() => onMarkReviewed?.(followUp.id)}
              className="flex items-center justify-center gap-2 text-sm bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-4 py-2.5 rounded-lg font-semibold transition"
            >
              <FaCheckCircle size={14} /> Marcar revisado
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
