import { useAuth } from '../contexts/AuthContext';

export default function Card({ 
  id, 
  name, 
  img, 
  description, 
  type = "pet", 
  onAdopt,
  onCardClick,
  petData
}) {
  const { isFoundation } = useAuth();

  // Función para manejar el clic en "Adoptar"
  const handleAdoptClick = (e) => {
    e.stopPropagation(); // Evitar que se abra el modal
    if (onAdopt) {
      onAdopt(petData || { id, name, img, description, type });
    } else {
      // Fallback si no se pasa la función onAdopt
      console.log(`Adoptar a ${name} (ID: ${id})`);
    }
  };

  // Función para manejar el clic en la tarjeta
  const handleCardClick = () => {
    if (onCardClick && petData) {
      onCardClick(petData);
    }
  };

  return (
    <div 
      className="bg-white rounded-2xl shadow-lg w-full max-w-xs mx-auto flex flex-col overflow-hidden transition-transform duration-300 hover:scale-105 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Imagen grande */}
      <div className="w-full h-48 md:h-56 bg-gray-100 flex items-center justify-center overflow-hidden">
        <img
          src={img}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback si la imagen no carga
            e.target.src = '/public/icon.png';
          }}
        />
      </div>
      
      {/* Contenido */}
      <div className="flex-1 flex flex-col justify-between p-5 text-center">
        <h3 className="font-bold text-xl text-gray-900 mb-2">{name}</h3>
        <p className="text-base text-gray-700 mb-4">
          {description 
            ? description.substring(0, 60) + (description.length > 60 ? '...' : '')
            : 'Este peludito está buscando un hogar lleno de amor.'
          }
        </p>
        
        {!isFoundation() && (
          <div className="w-full">
            <button 
              onClick={handleAdoptClick}
              className="w-full py-3 rounded-xl bg-[#005017] text-white font-semibold text-base shadow hover:bg-[#0e8c37] transition"
            >
              ¡Adóptame!
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
