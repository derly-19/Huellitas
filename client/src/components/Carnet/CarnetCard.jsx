import { useState, useEffect } from 'react';
import CarnetSection from './CarnetSection';

export default function CarnetCard({ initialData = {}, readOnly = false }) {
  const [expandedSection, setExpandedSection] = useState('vacunas');
  const [carnetData, setCarnetData] = useState({
    vacunas: initialData.vacunas || [],
    desparasitaciones: initialData.desparasitaciones || [],
    baños: initialData.baños || [],
    procedimientos: initialData.procedimientos || [],
    medicamentos: initialData.medicamentos || []
  });

  // Actualizar datos cuando cambien las props
  useEffect(() => {
    if (initialData) {
      setCarnetData({
        vacunas: initialData.vacunas || [],
        desparasitaciones: initialData.desparasitaciones || [],
        baños: initialData.baños || [],
        procedimientos: initialData.procedimientos || [],
        medicamentos: initialData.medicamentos || []
      });
    }
  }, [initialData]);

  const sections = [
    { 
      id: 'vacunas', 
      title: 'Vacunas', 
      icon: '💉' 
    },
    { 
      id: 'desparasitaciones', 
      title: 'Desparasitaciones', 
      icon: '🪱' 
    },
    { 
      id: 'baños', 
      title: 'Baños y Cuidados', 
      icon: '�' 
    },
    { 
      id: 'procedimientos', 
      title: 'Procedimientos Médicos', 
      icon: '🏥' 
    },
    { 
      id: 'medicamentos', 
      title: 'Medicamentos', 
      icon: '�' 
    }
  ];

  const handleToggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const handleAddRecord = (sectionType, newRecord) => {
    setCarnetData(prev => ({
      ...prev,
      [sectionType]: [...prev[sectionType], { ...newRecord, id: Date.now() }]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {readOnly && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            ℹ️ Estás visualizando el historial médico de esta mascota. Solo podrás modificarlo después de completar la adopción.
          </p>
        </div>
      )}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        {sections && sections.length > 0 && sections.map((section) => (
          <CarnetSection
            key={section.id}
            title={section.title}
            icon={section.icon}
            sectionType={section.id}
            data={carnetData[section.id]}
            onAddRecord={handleAddRecord}
            isExpanded={expandedSection === section.id}
            onToggle={() => handleToggleSection(section.id)}
            readOnly={readOnly}
          />
        ))}
      </div>
    </div>
  );
}