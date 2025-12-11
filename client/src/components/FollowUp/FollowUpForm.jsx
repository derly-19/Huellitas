import { useState } from 'react';
import { FaStar, FaCamera } from 'react-icons/fa';

export default function FollowUpForm({ petName, onSubmit, initialData = null, isLoading = false }) {
  const [formData, setFormData] = useState(initialData || {
    health_status: 'excelente',
    behavior_status: 'adaptado',
    environment_description: '',
    feeding_notes: '',
    medical_visits: 0,
    problems_encountered: '',
    overall_satisfaction: 5,
    additional_notes: '',
    photos: []
  });

  const [photoPreview, setPhotoPreview] = useState(initialData?.photos || []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(prev => [...prev, reader.result]);
        setFormData(prev => ({
          ...prev,
          photos: [...(prev.photos || []), reader.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index) => {
    setPhotoPreview(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Seguimiento de {petName}
      </h2>

      {/* Estado de Salud */}
      <div className="bg-blue-50 rounded-lg p-4">
        <label className="block text-sm font-bold text-gray-700 mb-3">
          🏥 Estado de Salud
        </label>
        <select
          name="health_status"
          value={formData.health_status}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#BCC990]"
        >
          <option value="excelente">Excelente - Sin problemas de salud</option>
          <option value="bueno">Bueno - Algún pequeño problema</option>
          <option value="regular">Regular - Problemas moderados</option>
          <option value="malo">Malo - Problemas serios</option>
        </select>
      </div>

      {/* Comportamiento */}
      <div className="bg-green-50 rounded-lg p-4">
        <label className="block text-sm font-bold text-gray-700 mb-3">
          😊 Comportamiento y Adaptación
        </label>
        <select
          name="behavior_status"
          value={formData.behavior_status}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#BCC990]"
        >
          <option value="adaptado">Perfectamente adaptado</option>
          <option value="en proceso">En proceso de adaptación</option>
          <option value="problemas">Tiene problemas de comportamiento</option>
        </select>
      </div>

      {/* Ambiente */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          🏠 Descripción del Ambiente
        </label>
        <textarea
          name="environment_description"
          value={formData.environment_description}
          onChange={handleChange}
          placeholder="Describe el lugar donde vive tu mascota (apartamento, casa, patio, etc.)"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#BCC990] resize-none"
          rows={3}
        />
      </div>

      {/* Alimentación */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          🍽️ Notas sobre Alimentación
        </label>
        <textarea
          name="feeding_notes"
          value={formData.feeding_notes}
          onChange={handleChange}
          placeholder="¿Cómo come? ¿Tiene preferencias? ¿Alguna alergia?"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#BCC990] resize-none"
          rows={2}
        />
      </div>

      {/* Visitas Veterinarias */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          💊 Visitas Veterinarias
        </label>
        <input
          type="number"
          name="medical_visits"
          value={formData.medical_visits}
          onChange={handleChange}
          min="0"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#BCC990]"
          placeholder="Número de visitas veterinarias"
        />
      </div>

      {/* Problemas */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          ⚠️ Problemas Encontrados (si los hay)
        </label>
        <textarea
          name="problems_encountered"
          value={formData.problems_encountered}
          onChange={handleChange}
          placeholder="Describe cualquier problema que hayas encontrado"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#BCC990] resize-none"
          rows={2}
        />
      </div>

      {/* Satisfacción */}
      <div className="bg-yellow-50 rounded-lg p-4">
        <label className="block text-sm font-bold text-gray-700 mb-3">
          ⭐ Satisfacción General
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, overall_satisfaction: star }))}
              className={`p-2 rounded-lg transition ${
                formData.overall_satisfaction >= star
                  ? 'bg-yellow-400 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              <FaStar size={24} />
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {formData.overall_satisfaction} de 5 estrellas
        </p>
      </div>

      {/* Notas Adicionales */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          📝 Notas Adicionales
        </label>
        <textarea
          name="additional_notes"
          value={formData.additional_notes}
          onChange={handleChange}
          placeholder="Cualquier otra información relevante"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#BCC990] resize-none"
          rows={3}
        />
      </div>

      {/* Fotos */}
      <div className="bg-purple-50 rounded-lg p-4">
        <label className="block text-sm font-bold text-gray-700 mb-3">
          📸 Fotos de tu Mascota
        </label>
        <div className="flex items-center justify-center border-2 border-dashed border-purple-300 rounded-lg p-6">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
            id="photo-upload"
          />
          <label
            htmlFor="photo-upload"
            className="flex flex-col items-center cursor-pointer"
          >
            <FaCamera className="text-3xl text-purple-400 mb-2" />
            <span className="text-sm text-gray-600">Haz clic para cargar fotos</span>
          </label>
        </div>

        {/* Vista previa de fotos */}
        {photoPreview.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-4">
            {photoPreview.map((photo, index) => (
              <div key={index} className="relative">
                <img
                  src={photo}
                  alt={`Preview ${index}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botones */}
      <div className="flex gap-4 pt-6 border-t">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-[#BCC990] text-white py-3 rounded-lg font-bold hover:bg-[#9FB36F] disabled:opacity-50 transition"
        >
          {isLoading ? 'Guardando...' : 'Guardar Seguimiento'}
        </button>
      </div>
    </form>
  );
}
