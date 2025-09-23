export default function Card({ name, img }) {
  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 w-full max-w-xs mx-auto">
      {/* Imagen */}
      <img
        src={img}
        alt={name}
        className="w-full h-40 sm:h-48 md:h-56 object-cover"
      />

      {/* Contenido */}
      <div className="p-4 text-center">
        <h3 className="font-semibold text-lg">{name}</h3>
        <p className="text-sm text-gray-600 mt-2">
          Este peludito está buscando un hogar lleno de amor.
        </p>
        <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition">
          Conoce más
        </button>
      </div>
    </div>
  );
}
