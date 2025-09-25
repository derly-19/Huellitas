export default function Card({ name, img }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg w-full max-w-xs mx-auto flex flex-col overflow-hidden transition-transform duration-300 hover:scale-105">
      {/* Imagen grande */}
      <div className="w-full h-48 md:h-56 bg-gray-100 flex items-center justify-center overflow-hidden">
        <img
          src={img}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      {/* Contenido */}
      <div className="flex-1 flex flex-col justify-between p-5 text-center">
        <h3 className="font-bold text-xl text-gray-900 mb-2">{name}</h3>
        <p className="text-base text-gray-700 mb-4">
          Este peludito está buscando un hogar lleno de amor.
        </p>
        <button className="w-full py-2 rounded-xl bg-[#13B94A] text-white font-semibold text-base shadow hover:bg-[#0e8c37] transition">
          Conoce más
        </button>
      </div>
    </div>
  );
}
