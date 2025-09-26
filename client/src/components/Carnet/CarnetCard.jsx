import { useState } from 'react';
import CarnetSection from './CarnetSection';

export default function CarnetCard({ initialData = {} }) {
  const [expandedSection, setExpandedSection] = useState('vacunas');
  const [carnetData, setCarnetData] = useState({
    vacunas: initialData.vacunas || [],
    baños: initialData.baños || [],
    desparasitacion: initialData.desparasitacion || [],
    medicamentos: initialData.medicamentos || [],
    historialMedico: initialData.historialMedico || []
  });

  const sections = [
    { 
      id: 'vacunas', 
      title: 'Vacunas', 
      icon: '💉' 
    },
    { 
      id: 'baños', 
      title: 'Baños', 
      icon: '🛁' 
    },
    { 
      id: 'desparasitacion', 
      title: 'Desparasitación', 
      icon: '💊' 
    },
    { 
      id: 'medicamentos', 
      title: 'Medicamentos', 
      icon: '🏥' 
    },
    { 
      id: 'historialMedico', 
      title: 'Historial médico', 
      icon: '📋' 
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
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        {sections.map((section) => (
          <CarnetSection
            key={section.id}
            title={section.title}
            icon={section.icon}
            sectionType={section.id}
            data={carnetData[section.id]}
            onAddRecord={handleAddRecord}
            isExpanded={expandedSection === section.id}
            onToggle={() => handleToggleSection(section.id)}
          />
        ))}
      </div>
    </div>
  );
}