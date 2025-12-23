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
        className="fixed inset-0 flex items-center justify-center z-50 pt-20 backdrop-blur-sm bg-black/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl border border-gray-100 p-6 mx-4 w-11/12 max-w-md overflow-hidden relative"
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 25, stiffness: 400 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Decoración de fondo */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-red-100 to-pink-100 rounded-full opacity-30 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full opacity-30 blur-3xl" />
          
          {/* Header */}
          <div className="flex items-start justify-between mb-4 relative z-10">
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-12 h-12 bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <IoHeart className="text-white text-xl" />
              </motion.div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">¡{petName} te está esperando!</h4>
                <p className="text-sm text-gray-500 font-medium">Huellitas 🐾</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1.5 transition-all duration-200 hover:rotate-90"
            >
              <IoClose size={20} />
            </button>
          </div>

          {/* Mensaje */}
          <div className="relative z-10">
            <p className="text-gray-700 text-base mb-6 leading-relaxed">
              Para adoptar necesitas una cuenta. ¿Tienes cuenta o prefieres crear una nueva?
            </p>

            {/* Botones */}
            <div className="flex gap-3">
              <motion.button
                onClick={onLogin}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-gradient-to-r from-[#005017] to-[#0e8c37] text-white py-3 px-4 rounded-xl text-sm font-semibold shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-200"
              >
                Iniciar Sesión
              </motion.button>
              <motion.button
                onClick={onRegister}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-white border-2 border-gray-200 text-gray-700 py-3 px-4 rounded-xl text-sm font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-md"
              >
                Crear Cuenta
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}