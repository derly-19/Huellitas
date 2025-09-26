import CarnetHeader from '../components/Carnet/CarnetHeader';
import CarnetCard from '../components/Carnet/CarnetCard';

export default function Carnet() {
  // Datos de ejemplo (en una app real vendrían de una API o props)
  const initialData = {
    vacunas: [
      {
        id: 1,
        nombre: 'Rabia',
        fecha: '2024-01-15',
        proximoRefuerzo: '2025-01-15',
        observaciones: 'Sin observaciones'
      }
    ],
    baños: [
      {
        id: 1,
        fecha: '2024-03-10',
        tipoShampoo: 'Antipulgas',
        observaciones: 'Comportamiento normal'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#FFFCF4]">
      <CarnetHeader />
      <CarnetCard initialData={initialData} />
    </div>
  );
}