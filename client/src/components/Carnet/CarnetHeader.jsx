export default function CarnetHeader({ mascota }) {
  return (
    <div className="text-center py-8">
      <h1 className="text-3xl font-bold text-gray-800">
        Carnet digital
      </h1>
      {mascota && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold text-gray-700">
            {mascota.name}
          </h2>
          <p className="text-gray-600">
            {mascota.type === 'dog' ? '🐕 Perrito' : '🐱 Gatito'} • {mascota.age} • {mascota.size} • {mascota.sex}
          </p>
        </div>
      )}
    </div>
  );
}