export default function Card({ name, img }) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden w-60 hover:scale-105 transition">
      <img src={img} alt={name} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h3 className="font-semibold">{name}</h3>
        <p className="text-sm text-gray-600">Este peludito está buscando un hogar lleno de amor.</p>
        <button className="mt-3 w-full bg-green-600 text-white py-1 rounded">Conoce más</button>
      </div>
    </div>
  );
}
