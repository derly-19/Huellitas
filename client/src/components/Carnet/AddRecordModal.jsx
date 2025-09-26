import { useState } from 'react';

export default function AddRecordModal({ isOpen, onClose, sectionType, onSubmit }) {
  const [formData, setFormData] = useState({});

  const getFormFields = () => {
    switch (sectionType) {
      case 'vacunas':
        return [
          { name: 'nombre', label: 'Nombre vacuna', type: 'select', options: ['Rabia', 'Parvovirus', 'Moquillo', 'Hepatitis', 'Otra'] },
          { name: 'fecha', label: 'Fecha de aplicación', type: 'date' },
          { name: 'observaciones', label: 'Observaciones', type: 'select', options: ['Sin observaciones', 'Reacción leve', 'Normal', 'Otra'] },
          { name: 'evidencia', label: 'Adjunte evidencia', type: 'file' }
        ];
      case 'baños':
        return [
          { name: 'fecha', label: 'Fecha del baño', type: 'date' },
          { name: 'tipoShampoo', label: 'Tipo de shampoo', type: 'text' },
          { name: 'observaciones', label: 'Observaciones', type: 'textarea' },
          { name: 'evidencia', label: 'Adjunte evidencia', type: 'file' }
        ];
      case 'desparasitacion':
        return [
          { name: 'medicamento', label: 'Medicamento', type: 'text' },
          { name: 'fecha', label: 'Fecha de aplicación', type: 'date' },
          { name: 'proximaDosis', label: 'Próxima dosis', type: 'date' },
          { name: 'observaciones', label: 'Observaciones', type: 'textarea' },
          { name: 'evidencia', label: 'Adjunte evidencia', type: 'file' }
        ];
      case 'medicamentos':
        return [
          { name: 'medicamento', label: 'Medicamento', type: 'text' },
          { name: 'dosis', label: 'Dosis', type: 'text' },
          { name: 'frecuencia', label: 'Frecuencia', type: 'text' },
          { name: 'fechaInicio', label: 'Fecha de inicio', type: 'date' },
          { name: 'fechaFin', label: 'Fecha de fin', type: 'date' },
          { name: 'observaciones', label: 'Observaciones', type: 'textarea' }
        ];
      case 'historialMedico':
        return [
          { name: 'fecha', label: 'Fecha', type: 'date' },
          { name: 'diagnostico', label: 'Diagnóstico', type: 'text' },
          { name: 'tratamiento', label: 'Tratamiento', type: 'textarea' },
          { name: 'veterinario', label: 'Veterinario', type: 'text' },
          { name: 'observaciones', label: 'Observaciones', type: 'textarea' },
          { name: 'evidencia', label: 'Adjunte evidencia', type: 'file' }
        ];
      default:
        return [];
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? e.target.files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({});
    onClose();
  };

  if (!isOpen) return null;

  const fields = getFormFields();
  const getSectionTitle = () => {
    const titles = {
      vacunas: 'Agregar vacuna',
      baños: 'Agregar baño',
      desparasitacion: 'Agregar desparasitación',
      medicamentos: 'Agregar medicamento',
      historialMedico: 'Agregar registro médico'
    };
    return titles[sectionType] || 'Agregar registro';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">{getSectionTitle()}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Grid 2x2 para los primeros 4 campos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {fields.slice(0, 4).map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                  </label>
                  
                  {field.type === 'select' ? (
                    <select
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white"
                      required
                    >
                      <option value="">Seleccionar...</option>
                      {field.options.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : field.type === 'file' ? (
                    <div className="relative">
                      <input
                        type="file"
                        name={field.name}
                        onChange={handleChange}
                        accept="image/*"
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                      />
                      {!formData[field.name] && (
                        <span className="absolute left-3 top-3 text-gray-500 pointer-events-none">
                          Imagen
                        </span>
                      )}
                    </div>
                  ) : field.type === 'date' ? (
                    <input
                      type="date"
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white"
                      placeholder="DD/MM/AAAA"
                      required
                    />
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white"
                      placeholder={`Ingrese ${field.label.toLowerCase()}`}
                      required
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Campos adicionales si los hay (textarea, etc.) */}
            {fields.length > 4 && (
              <div className="space-y-4 mb-6">
                {fields.slice(4).map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                    </label>
                    
                    {field.type === 'textarea' ? (
                      <textarea
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white resize-none"
                        placeholder={`Ingrese ${field.label.toLowerCase()}`}
                      />
                    ) : field.type === 'file' ? (
                      <div className="relative">
                        <input
                          type="file"
                          name={field.name}
                          onChange={handleChange}
                          accept="image/*"
                          className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                        />
                        {!formData[field.name] && (
                          <span className="absolute left-3 top-3 text-gray-500 pointer-events-none">
                            Imagen
                          </span>
                        )}
                      </div>
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white"
                        placeholder={field.type === 'date' ? 'DD/MM/AAAA' : `Ingrese ${field.label.toLowerCase()}`}
                        required={field.type !== 'file'}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-[#BCC990] text-white rounded-lg hover:bg-[#A5B67F] transition-colors"
              >
                Agregar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}