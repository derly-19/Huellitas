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
        className="fixed inset-0 flex items-center justify-center z-50 pt-20 backdrop-blur-sm bg-black/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gradient-to-br from-white via-green-50 to-emerald-50 rounded-3xl shadow-2xl border border-green-100 p-8 mx-4 w-11/12 max-w-md relative overflow-hidden"
          initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0.5, opacity: 0, rotate: 10 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Efectos de fondo decorativos */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200 to-emerald-300 rounded-full opacity-20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-teal-200 to-green-300 rounded-full opacity-20 blur-3xl" />
          
          {/* Header */}
          <div className="flex items-start justify-between mb-5 relative z-10">
            <div className="flex items-center gap-4">
              <motion.div 
                className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/50"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", damping: 15 }}
              >
                <IoCheckmarkCircle className="text-white text-3xl" />
              </motion.div>
              <div>
                <h4 className="font-bold text-gray-900 text-2xl">¡Éxito!</h4>
                <p className="text-sm text-gray-600 font-medium">Huellitas 🐾</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-all duration-200 hover:rotate-90"
            >
              <IoClose size={22} />
            </button>
          </div>

          {/* Mensaje */}
          <div className="text-center mb-7 relative z-10">
            <motion.p 
              className="text-gray-800 text-lg mb-3 font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              ¡Solicitud de adopción enviada para <strong className="text-green-600">{petName}</strong>!
            </motion.p>
            <motion.p 
              className="text-gray-600 text-base leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {message || "Nos pondremos en contacto contigo pronto."}
            </motion.p>
          </div>

          {/* Botón */}
          <div className="flex justify-center relative z-10">
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-[#BCC990] to-[#9FB36F] text-white py-3.5 px-8 rounded-xl text-base font-semibold shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-200"
            >
              Entendido ✓
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  );
}