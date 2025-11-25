import { FaExclamationTriangle } from "react-icons/fa";

export default function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        {/* Icono de advertencia */}
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-4 rounded-full">
            <FaExclamationTriangle className="text-red-600 text-3xl" />
          </div>
        </div>

        {/* Título */}
        <h2 className="text-xl font-bold text-gray-800 text-center mb-2">
          {title}
        </h2>

        {/* Mensaje */}
        <p className="text-gray-600 text-center mb-6">
          {message}
        </p>

        {/* Botones */}
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
