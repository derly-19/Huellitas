import { useState } from 'react';
import { FaTimes, FaStar } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function FollowUpModal({ followUp, onClose, isFoundation = false, onAddFeedback = null }) {
  const [feedback, setFeedback] = useState('');
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  const handleAddFeedback = async () => {
    if (!feedback.trim() || !onAddFeedback) return;

    setLoadingFeedback(true);
    try {
      await onAddFeedback(followUp.id, feedback);
      setFeedback('');
    } finally {
      setLoadingFeedback(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getHealthIcon = (status) => {
    switch(status) {
      case 'excelente': return '✨';
      case 'bueno': return '👍';
      case 'regular': return '⚠️';
      case 'malo': return '❌';
      default: return '❓';
    }
  };

  return (
    <AnimatePresence>
      {followUp && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#BCC990] to-[#9FB36F] p-6 sticky top-0 z-10">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{followUp.pet_name}</h2>
                  <p className="text-gray-700 text-sm mt-1">
                    Seguimiento del {new Date(followUp.follow_up_date).toLocaleDateString('es-ES')}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-600 hover:text-gray-800 text-2xl"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-6 space-y-6">
              {/* Usuario (solo para fundación) */}
              {isFoundation && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-bold text-gray-800 mb-2">👤 Adoptante</h3>
                  <p className="text-gray-700">{followUp.user_name}</p>
                  <p className="text-gray-600 text-sm">{followUp.user_email}</p>
                </div>
              )}

              {/* Estado General */}
              <div className="grid grid-cols-2 gap-4">
                {/* Salud */}
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🏥</span>
                    <h3 className="font-bold text-gray-800">Salud</h3>
                  </div>
                  <p className="text-lg font-semibold text-gray-700">
                    {getHealthIcon(followUp.health_status)} {followUp.health_status}
                  </p>
                </div>

                {/* Comportamiento */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">😊</span>
                    <h3 className="font-bold text-gray-800">Comportamiento</h3>
                  </div>
                  <p className="text-lg font-semibold text-gray-700">
                    {followUp.behavior_status}
                  </p>
                </div>

                {/* Satisfacción */}
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">⭐</span>
                    <h3 className="font-bold text-gray-800">Satisfacción</h3>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={i < followUp.overall_satisfaction ? 'text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                </div>

                {/* Visitas Vet */}
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">💊</span>
                    <h3 className="font-bold text-gray-800">Vet. Visits</h3>
                  </div>
                  <p className="text-lg font-semibold text-gray-700">
                    {followUp.medical_visits}
                  </p>
                </div>
              </div>

              {/* Ambiente */}
              {followUp.environment_description && (
                <div className="bg-orange-50 rounded-lg p-4">
                  <h3 className="font-bold text-gray-800 mb-2">🏠 Ambiente</h3>
                  <p className="text-gray-700">{followUp.environment_description}</p>
                </div>
              )}

              {/* Alimentación */}
              {followUp.feeding_notes && (
                <div className="bg-amber-50 rounded-lg p-4">
                  <h3 className="font-bold text-gray-800 mb-2">🍽️ Alimentación</h3>
                  <p className="text-gray-700">{followUp.feeding_notes}</p>
                </div>
              )}

              {/* Problemas */}
              {followUp.problems_encountered && (
                <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-400">
                  <h3 className="font-bold text-gray-800 mb-2">⚠️ Problemas Encontrados</h3>
                  <p className="text-gray-700">{followUp.problems_encountered}</p>
                </div>
              )}

              {/* Notas adicionales */}
              {followUp.additional_notes && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-bold text-gray-800 mb-2">📝 Notas Adicionales</h3>
                  <p className="text-gray-700">{followUp.additional_notes}</p>
                </div>
              )}

              {/* Fotos */}
              {followUp.photos && Array.isArray(followUp.photos) && followUp.photos.length > 0 && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="font-bold text-gray-800 mb-3">📸 Fotos</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {followUp.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Photo ${index}`}
                        className="w-full h-40 object-cover rounded-lg cursor-pointer hover:opacity-80 transition"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Feedback de la fundación (solo si es revisado) */}
              {isFoundation && followUp.foundation_feedback && (
                <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-400">
                  <h3 className="font-bold text-gray-800 mb-2">✅ Feedback de la Fundación</h3>
                  <p className="text-gray-700">{followUp.foundation_feedback}</p>
                </div>
              )}

              {/* Agregar feedback (solo para fundación y si no está revisado) */}
              {isFoundation && !followUp.reviewed && onAddFeedback && (
                <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300">
                  <h3 className="font-bold text-gray-800 mb-3">💬 Agregar Feedback</h3>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Escribe tu retroalimentación para el adoptante..."
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-[#BCC990] resize-none"
                    rows={3}
                  />
                  <button
                    onClick={handleAddFeedback}
                    disabled={loadingFeedback || !feedback.trim()}
                    className="mt-3 w-full bg-[#BCC990] text-white py-2 rounded-lg font-bold hover:bg-[#9FB36F] disabled:opacity-50 transition"
                  >
                    {loadingFeedback ? 'Enviando...' : 'Enviar Feedback'}
                  </button>
                </div>
              )}

              {/* Info de creación */}
              <div className="text-xs text-gray-500 text-center pt-4 border-t">
                Creado el {formatDate(followUp.created_at)}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
