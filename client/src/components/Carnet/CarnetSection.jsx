import { useState } from 'react';
import { IoChevronDown } from "react-icons/io5";
import CarnetTable from './CarnetTable';
import AddRecordButton from './AddRecordButton';
import AddRecordModal from './AddRecordModal';

export default function CarnetSection({ 
  title, 
  icon, 
  sectionType, 
  data, 
  onAddRecord,
  isExpanded, 
  onToggle,
  readOnly = false
}) {
  const [showModal, setShowModal] = useState(false);

  const getColumns = () => {
    switch (sectionType) {
      case 'vacunas':
        return [
          { key: 'nombre', label: 'Vacunas' },
          { key: 'fecha', label: 'Fecha de aplicación' },
          { key: 'proximoRefuerzo', label: 'Próximo refuerzo' },
          { key: 'observaciones', label: 'Observaciones' }
        ];
      case 'baños':
        return [
          { key: 'fecha', label: 'Fecha' },
          { key: 'tipoShampoo', label: 'Tipo de shampoo' },
          { key: 'observaciones', label: 'Observaciones' }
        ];
      case 'desparasitaciones':
        return [
          { key: 'medicamento', label: 'Medicamento' },
          { key: 'fecha', label: 'Fecha aplicación' },
          { key: 'proximaDosis', label: 'Próxima dosis' },
          { key: 'observaciones', label: 'Observaciones' }
        ];
      case 'medicamentos':
        return [
          { key: 'medicamento', label: 'Medicamento' },
          { key: 'dosis', label: 'Dosis' },
          { key: 'frecuencia', label: 'Frecuencia' },
          { key: 'fechaInicio', label: 'Fecha inicio' },
          { key: 'fechaFin', label: 'Fecha fin' }
        ];
      case 'historialMedico':
        return [
          { key: 'fecha', label: 'Fecha' },
          { key: 'diagnostico', label: 'Diagnóstico' },
          { key: 'tratamiento', label: 'Tratamiento' },
          { key: 'veterinario', label: 'Veterinario' }
        ];
      default:
        return [];
    }
  };

  const getButtonLabel = () => {
    const labels = {
      vacunas: 'Agregar vacuna',
      baños: 'Agregar baño',
      desparasitaciones: 'Agregar desparasitación',
      medicamentos: 'Agregar medicamento',
      procedimientos: 'Agregar procedimiento',
      historialMedico: 'Agregar registro médico'
    };
    return labels[sectionType] || 'Agregar registro';
  };

  const handleAddRecord = (newRecord) => {
    onAddRecord(sectionType, newRecord);
  };

  return (
    <div className="mb-4">
      {/* Header de la sección */}
      <button
        onClick={onToggle}
        className="w-full bg-[#BCC990] rounded-lg p-4 flex items-center justify-between hover:bg-[#A5B67F] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <span className="font-semibold text-gray-800">{title}</span>
        </div>
        <IoChevronDown className={`text-xl transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      {/* Contenido expandible */}
      {isExpanded && (
        <div className="mt-4 bg-white rounded-lg border border-gray-200 p-4">
          {!readOnly && (
            <AddRecordButton 
              onClick={() => setShowModal(true)}
              label={getButtonLabel()}
            />
          )}
          
          <CarnetTable 
            columns={getColumns()}
            data={data}
            sectionType={sectionType}
          />

          {!readOnly && (
            <AddRecordModal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              sectionType={sectionType}
              onSubmit={handleAddRecord}
            />
          )}
        </div>
      )}
    </div>
  );
}