import { useState } from 'react';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaVideo, FaTimes, FaUser, FaLink } from 'react-icons/fa';

export default function ScheduleVisitModal({ adoption, onClose, onSchedule, isFoundation = true }) {
  const [formData, setFormData] = useState({
    scheduled_date: '',
    scheduled_time: '',
    visit_type: 'presencial',
    meeting_link: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  // Obtener fecha mínima (mañana)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.scheduled_date) {
      alert('Por favor selecciona una fecha');
      return;
    }

    // Debug: verificar que user_id viene correctamente
    console.log('Adoption data:', adoption);
    console.log('User ID del adoptante:', adoption.user_id);

    setLoading(true);
    await onSchedule({
      ...formData,
      adoption_request_id: adoption.id,
      pet_id: adoption.pet_id,
      user_id: adoption.user_id,
      foundation_id: adoption.foundation_id,
      pet_name: adoption.pet_name,
      adopter_name: adoption.adopter_name || adoption.nombre
    });
    setLoading(false);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#BCC990] to-[#9FB36F] p-5">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white">Programar Visita de Seguimiento</h2>
              <p className="text-white/80 text-sm">
                Para {adoption.pet_name}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="text-white/80 hover:text-white text-2xl"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Info del adoptante */}
          <div className="bg-blue-50 rounded-lg p-3 flex items-center gap-3">
            <FaUser className="text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Adoptante</p>
              <p className="font-medium text-gray-800">{adoption.adopter_name || adoption.nombre || 'Usuario'}</p>
            </div>
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <FaCalendarAlt className="text-[#BCC990]" /> Fecha de la visita
            </label>
            <input
              type="date"
              name="scheduled_date"
              value={formData.scheduled_date}
              onChange={handleChange}
              min={getMinDate()}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#BCC990] focus:outline-none"
            />
          </div>

          {/* Hora */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <FaClock className="text-[#BCC990]" /> Hora de la visita
            </label>
            <input
              type="time"
              name="scheduled_time"
              value={formData.scheduled_time}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#BCC990] focus:outline-none"
            />
          </div>

          {/* Tipo de visita */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Tipo de visita
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, visit_type: 'presencial' }))}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  formData.visit_type === 'presencial'
                    ? 'border-[#BCC990] bg-[#BCC990]/10 text-[#7a8a45]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <FaMapMarkerAlt /> Presencial
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, visit_type: 'virtual' }))}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  formData.visit_type === 'virtual'
                    ? 'border-[#BCC990] bg-[#BCC990]/10 text-[#7a8a45]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <FaVideo /> Virtual
              </button>
            </div>
          </div>

          {/* Enlace de reunión (solo para virtual) */}
          {formData.visit_type === 'virtual' && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <FaLink className="text-[#BCC990]" /> Enlace de la reunión
              </label>
              <input
                type="url"
                name="meeting_link"
                value={formData.meeting_link}
                onChange={handleChange}
                placeholder="https://meet.google.com/xxx-xxxx-xxx"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#BCC990] focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Pega el enlace de Google Meet, Zoom, Teams, etc.
              </p>
            </div>
          )}

          {/* Notas */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Notas para el adoptante (opcional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Ej: Llevaremos documentos para firmar..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#BCC990] focus:outline-none resize-none"
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-[#BCC990] text-white rounded-lg hover:bg-[#9FB36F] transition-colors font-bold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <>
                  <FaCalendarAlt /> Programar Visita
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
