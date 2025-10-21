// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { IoClose, IoHeart } from "react-icons/io5";

export default function AdoptionNotification({ 
  isVisible, 
  onClose, 
  petName, 
  onLogin, 
  onRegister 
}) {
  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-50 pt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 mx-4 w-11/12 max-w-md"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center">
                <IoHeart className="text-red-500 text-sm" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">¡{petName} te está esperando!</h4>
                <p className="text-xs text-gray-500">Huellitas</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <IoClose size={16} />
            </button>
          </div>

          {/* Mensaje */}
          <p className="text-gray-600 text-sm mb-4">
            Para adoptar necesitas una cuenta. ¿Tienes cuenta o prefieres crear una nueva?
          </p>

          {/* Botones */}
          <div className="flex gap-2">
            <button
              onClick={onLogin}
              className="flex-1 bg-[#005017] text-white py-2 px-3 rounded text-sm font-medium hover:bg-[#0e8c37] transition"
            >
              Iniciar Sesión
            </button>
            <button
              onClick={onRegister}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded text-sm font-medium hover:bg-gray-200 transition"
            >
              Crear Cuenta
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}