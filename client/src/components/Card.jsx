import { useNavigate } from "react-router-dom";

export default function Card({ 
  id, 
  name, 
  img, 
  description, 
  type = "pet", 
  onAdopt 
}) {
  const navigate = useNavigate();

  // Función para manejar el clic en "Adoptar"
  const handleAdoptClick = () => {
    if (onAdopt) {
      onAdopt({ id, name, img, description, type });
    } else {
      // Fallback si no se pasa la función onAdopt
      console.log(`Adoptar a ${name} (ID: ${id})`);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg w-full max-w-xs mx-auto flex flex-col overflow-hidden transition-transform duration-300 hover:scale-105">
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
        
        <div className="flex gap-2">
          <button 
            onClick={handleAdoptClick}
            className="flex-1 py-2 rounded-xl bg-[#005017] text-white font-semibold text-base shadow hover:bg-[#0e8c37] transition"
          >
            ¡Adóptame!
          </button>
          <button 
            onClick={() => navigate(`/pet/${id}`)}
            className="flex-1 py-2 rounded-xl bg-gray-200 text-gray-700 font-semibold text-base shadow hover:bg-gray-300 transition"
          >
            Ver más
          </button>
        </div>
      </div>
    </div>
  );
}
