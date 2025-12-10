import { useState, useEffect } from 'react';
import CarnetSection from './CarnetSection';
import { useAuth } from '../../contexts/AuthContext';

export default function CarnetCard({ initialData = {}, readOnly = false, petId = null }) {
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
    // Actualizar estado local
    setCarnetData(prev => ({
      ...prev,
      [sectionType]: [...prev[sectionType], { ...newRecord, id: Date.now() }]
    }));

    // Guardar en el servidor si tenemos petId
    if (petId) {
      saveRecordToServer(sectionType, newRecord);
    }
  };

  const reloadCarnetData = async () => {
    if (!petId) return;
    
    try {
      const response = await fetch(`http://localhost:4000/api/carnet/${petId}`);
      const result = await response.json();

      if (result.success) {
        const transformedData = {
          mascota: result.data.mascota,
          vacunas: (result.data.vacunas || []).map(v => ({
            id: v.id,
            nombre: v.nombre_vacuna,
            fecha: v.fecha_aplicacion,
            proximoRefuerzo: v.proxima_dosis,
            lote: v.lote,
            veterinario: v.veterinario,
            observaciones: v.observaciones || 'Sin observaciones'
          })),
          desparasitaciones: (result.data.desparasitaciones || []).map(d => ({
            id: d.id,
            tipo: d.tipo,
            medicamento: d.medicamento,
            fecha: d.fecha_aplicacion,
            dosis: d.dosis,
            peso: d.peso_mascota,
            veterinario: d.veterinario,
            proximaDosis: d.proxima_dosis,
            observaciones: d.observaciones || 'Sin observaciones'
          })),
          baños: (result.data.banos || []).map(b => ({
            id: b.id,
            fecha: b.fecha,
            tipoShampoo: b.tipo_shampoo,
            tratamientoEspecial: b.tratamiento_especial,
            realizadoPor: b.realizado_por,
            observaciones: b.observaciones || 'Sin observaciones'
          })),
          procedimientos: (result.data.procedimientos || []).map(p => ({
            id: p.id,
            tipo: p.tipo_procedimiento,
            descripcion: p.descripcion,
            fecha: p.fecha,
            veterinario: p.veterinario,
            costo: p.costo,
            observaciones: p.observaciones || 'Sin observaciones'
          })),
          medicamentos: (result.data.medicamentos || []).map(m => ({
            id: m.id,
            medicamento: m.medicamento,
            dosis: m.dosis,
            frecuencia: m.frecuencia,
            fechaInicio: m.fecha_inicio,
            fechaFin: m.fecha_fin,
            motivo: m.motivo,
            veterinario: m.veterinario,
            observaciones: m.observaciones || 'Sin observaciones'
          }))
        };

        setCarnetData({
          vacunas: transformedData.vacunas,
          desparasitaciones: transformedData.desparasitaciones,
          baños: transformedData.baños,
          procedimientos: transformedData.procedimientos,
          medicamentos: transformedData.medicamentos
        });
      }
    } catch (error) {
      console.error('Error reloading carnet:', error);
    }
  };

  const saveRecordToServer = async (sectionType, recordData) => {
    try {
      const endpoint = `http://localhost:4000/api/carnet/${petId}/${sectionType}`;
      
      // Transformar los datos según el tipo de registro
      let transformedData = { ...recordData };
      
      switch(sectionType) {
        case 'vacunas':
          transformedData = {
            nombre_vacuna: recordData.nombre,
            fecha_aplicacion: recordData.fecha,
            observaciones: recordData.observaciones,
            lote: recordData.lote || '',
            veterinario: recordData.veterinario || ''
          };
          break;
        case 'desparasitaciones':
          transformedData = {
            medicamento: recordData.medicamento,
            fecha_aplicacion: recordData.fecha,
            proxima_dosis: recordData.proximaDosis,
            observaciones: recordData.observaciones,
            dosis: recordData.dosis || '',
            veterinario: recordData.veterinario || ''
          };
          break;
        case 'baños':
          transformedData = {
            fecha: recordData.fecha,
            tipo_shampoo: recordData.tipoShampoo,
            observaciones: recordData.observaciones,
            realizado_por: recordData.realizadoPor || ''
          };
          break;
        case 'procedimientos':
          transformedData = {
            tipo_procedimiento: recordData.tipo,
            fecha: recordData.fecha,
            veterinario: recordData.veterinario,
            duracion: recordData.duracion || '',
            complicaciones: recordData.complicaciones || '',
            observaciones: recordData.observaciones
          };
          break;
        case 'medicamentos':
          transformedData = {
            medicamento: recordData.medicamento,
            dosis: recordData.dosis,
            frecuencia: recordData.frecuencia,
            fecha_inicio: recordData.fechaInicio,
            fecha_fin: recordData.fechaFin,
            observaciones: recordData.observaciones,
            veterinario: recordData.veterinario || ''
          };
          break;
      }
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformedData)
      });

      const result = await response.json();
      if (result.success) {
        // Recargar los datos del carnet después de guardar exitosamente
        await reloadCarnetData();
      } else {
        console.error('Error saving record:', result.message);
      }
    } catch (error) {
      console.error('Error saving record to server:', error);
    }
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