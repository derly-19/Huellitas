import { useState } from 'react';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaVideo, FaTrash, FaCheck, FaTimes, FaExchangeAlt } from 'react-icons/fa';

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

const statusConfig = {
  scheduled: { label: 'Programada', color: 'bg-blue-100 text-blue-700', icon: FaCalendarAlt },
  accepted: { label: 'Aceptada', color: 'bg-green-100 text-green-700', icon: FaCheck },
  completed: { label: 'Completada', color: 'bg-emerald-100 text-emerald-700', icon: FaCheck },
  cancelled: { label: 'Cancelada', color: 'bg-red-100 text-red-700', icon: FaTimes },
  rescheduled: { label: 'Reprogramada', color: 'bg-yellow-100 text-yellow-700', icon: FaClock },
  pending_reschedule: { label: 'Cambio solicitado', color: 'bg-orange-100 text-orange-700', icon: FaExchangeAlt }
};

export default function VisitCard({ visit, isFoundation = false, onAccept, onCancel, onComplete, onSuggestReschedule, onApproveReschedule }) {
  const [showRescheduleForm, setShowRescheduleForm] = useState(false);
  const [suggestedDate, setSuggestedDate] = useState('');
  const [suggestedTime, setSuggestedTime] = useState('');
  const [suggestReason, setSuggestReason] = useState('');

  const config = statusConfig[visit.status] || statusConfig.scheduled;
  const StatusIcon = config.icon;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Hora por definir';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const isPending = () => {
    return ['scheduled', 'rescheduled'].includes(visit.status);
  };

  const canAdopterRespond = () => {
    return !isFoundation && visit.status === 'scheduled';
  };

  const handleSuggestSubmit = () => {
    if (!suggestedDate) {
      alert('Por favor selecciona una fecha');
      return;
    }
    onSuggestReschedule?.(visit.id, suggestedDate, suggestedTime, suggestReason);
    setShowRescheduleForm(false);
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all ${
      isPending() ? 'border-l-4 border-l-blue-400' : 
      visit.status === 'accepted' ? 'border-l-4 border-l-green-400' :
      visit.status === 'pending_reschedule' ? 'border-l-4 border-l-orange-400' :
      'border-l-4 border-l-gray-200'
    }`}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Imagen mascota */}
          <img 
            src={getImageUrl(visit.pet_img)} 
            alt={visit.pet_name}
            className="w-14 h-14 rounded-lg object-cover"
            onError={(e) => { e.target.src = '/public/icon.png'; }}
          />

          <div className="flex-1 min-w-0">
            {/* Info */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-gray-800">
                  {visit.pet_type === 'dog' ? '🐕' : '🐱'} {visit.pet_name}
                </h3>
                {isFoundation && (
                  <p className="text-sm text-gray-500">
                    Adoptante: {visit.adopter_name}
                  </p>
                )}
                {!isFoundation && (
                  <p className="text-sm text-gray-500">
                    Fundación: {visit.foundation_name}
                  </p>
                )}
              </div>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                <StatusIcon className="text-xs" />
                {config.label}
              </span>
            </div>

            {/* Fecha y hora */}
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCalendarAlt className="text-[#BCC990]" />
                <span className="capitalize">{formatDate(visit.scheduled_date)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaClock className="text-gray-400" />
                <span>{formatTime(visit.scheduled_time)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                {visit.visit_type === 'virtual' ? (
                  <>
                    <FaVideo className="text-purple-500" />
                    <span>Visita Virtual</span>
                  </>
                ) : (
                  <>
                    <FaMapMarkerAlt className="text-red-400" />
                    <span>Visita Presencial</span>
                  </>
                )}
              </div>
            </div>

            {/* Notas de la fundación */}
            {visit.notes && (
              <p className="mt-2 text-sm text-gray-500 bg-gray-50 p-2 rounded">
                <span className="font-medium">Nota:</span> {visit.notes}
              </p>
            )}

            {/* Sugerencia de cambio (si existe) */}
            {visit.status === 'pending_reschedule' && visit.suggested_date && (
              <div className="mt-2 text-sm bg-orange-50 p-2 rounded border border-orange-200">
                <p className="font-medium text-orange-700">📅 Fecha sugerida por adoptante:</p>
                <p className="text-orange-600">{formatDate(visit.suggested_date)} {visit.suggested_time ? `a las ${formatTime(visit.suggested_time)}` : ''}</p>
                {visit.reschedule_reason && (
                  <p className="text-gray-600 mt-1"><span className="font-medium">Razón:</span> {visit.reschedule_reason}</p>
                )}
              </div>
            )}

            {/* Formulario de sugerir cambio (para adoptante) */}
            {showRescheduleForm && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-3">
                <p className="text-sm font-medium text-gray-700">Sugerir otra fecha:</p>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={suggestedDate}
                    onChange={(e) => setSuggestedDate(e.target.value)}
                    min={getMinDate()}
                    className="px-3 py-2 border rounded-lg text-sm"
                  />
                  <input
                    type="time"
                    value={suggestedTime}
                    onChange={(e) => setSuggestedTime(e.target.value)}
                    className="px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                <textarea
                  value={suggestReason}
                  onChange={(e) => setSuggestReason(e.target.value)}
                  placeholder="¿Por qué no puedes en la fecha propuesta?"
                  className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
                  rows={2}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowRescheduleForm(false)}
                    className="flex-1 px-3 py-2 text-sm border rounded-lg hover:bg-gray-100"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSuggestSubmit}
                    className="flex-1 px-3 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                  >
                    Enviar sugerencia
                  </button>
                </div>
              </div>
            )}

            {/* Acciones */}
            {!showRescheduleForm && (
              <div className="mt-3 flex flex-wrap gap-2">
                {/* Acciones para ADOPTANTE */}
                {canAdopterRespond() && (
                  <>
                    <button
                      onClick={() => onAccept?.(visit.id)}
                      className="flex-1 text-xs px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition flex items-center justify-center gap-1"
                    >
                      <FaCheck /> Aceptar
                    </button>
                    <button
                      onClick={() => setShowRescheduleForm(true)}
                      className="flex-1 text-xs px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition flex items-center justify-center gap-1"
                    >
                      <FaExchangeAlt /> Sugerir cambio
                    </button>
                  </>
                )}

                {/* Acciones para FUNDACIÓN */}
                {isFoundation && visit.status === 'pending_reschedule' && (
                  <>
                    <button
                      onClick={() => onApproveReschedule?.(visit.id, visit.suggested_date, visit.suggested_time)}
                      className="flex-1 text-xs px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition flex items-center justify-center gap-1"
                    >
                      <FaCheck /> Aceptar nueva fecha
                    </button>
                    <button
                      onClick={() => onCancel?.(visit.id)}
                      className="flex-1 text-xs px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition flex items-center justify-center gap-1"
                    >
                      <FaTimes /> Cancelar visita
                    </button>
                  </>
                )}

                {isFoundation && visit.status === 'accepted' && (
                  <button
                    onClick={() => onComplete?.(visit.id)}
                    className="flex-1 text-xs px-3 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition flex items-center justify-center gap-1"
                  >
                    <FaCheck /> Marcar como completada
                  </button>
                )}

                {isFoundation && visit.status === 'scheduled' && (
                  <button
                    onClick={() => onCancel?.(visit.id)}
                    className="text-xs px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition flex items-center gap-1"
                  >
                    <FaTrash /> Cancelar
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
