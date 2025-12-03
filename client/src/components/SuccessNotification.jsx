import { motion, AnimatePresence } from "framer-motion";
import { IoClose, IoCheckmarkCircle } from "react-icons/io5";

export default function SuccessNotification({ 
  isVisible, 
  onClose, 
  petName, 
  message 
}) {
  return (
    <AnimatePresence>
      {isVisible && (
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-50 pt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mx-4 w-11/12 max-w-md"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <IoCheckmarkCircle className="text-green-600 text-xl" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-lg">¡Éxito!</h4>
                <p className="text-sm text-gray-500">Huellitas</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <IoClose size={20} />
            </button>
          </div>

          {/* Mensaje */}
          <div className="text-center mb-6">
            <p className="text-gray-700 text-base mb-2">
              ¡Solicitud de adopción enviada para <strong>{petName}</strong>!
            </p>
            <p className="text-gray-600 text-sm">
              {message || "Nos pondremos en contacto contigo pronto."}
            </p>
          </div>

          {/* Botón */}
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="bg-[#BCC990] text-white py-3 px-6 rounded-lg text-sm font-medium hover:bg-[#9FB36F] transition-colors"
            >
              Entendido
            </button>
          </div>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  );
}