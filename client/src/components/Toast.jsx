import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from "react-icons/fa";

export default function Toast({ 
  isVisible, 
  onClose, 
  message,
  type = 'success' // 'success', 'error', 'info'
}) {
  const typeConfig = {
    success: {
      gradient: 'from-green-50 via-emerald-50 to-teal-50',
      border: 'border-green-300',
      iconBg: 'from-green-400 to-emerald-500',
      icon: FaCheckCircle,
      iconColor: 'text-white',
      textColor: 'text-green-900',
      shadow: 'shadow-green-200'
    },
    error: {
      gradient: 'from-red-50 via-rose-50 to-pink-50',
      border: 'border-red-300',
      iconBg: 'from-red-400 to-rose-500',
      icon: FaExclamationCircle,
      iconColor: 'text-white',
      textColor: 'text-red-900',
      shadow: 'shadow-red-200'
    },
    info: {
      gradient: 'from-blue-50 via-sky-50 to-cyan-50',
      border: 'border-blue-300',
      iconBg: 'from-blue-400 to-cyan-500',
      icon: FaInfoCircle,
      iconColor: 'text-white',
      textColor: 'text-blue-900',
      shadow: 'shadow-blue-200'
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, x: 50, scale: 0.8 }}
          transition={{ type: "spring", damping: 20, stiffness: 400 }}
          className={`fixed top-6 right-6 z-50 bg-gradient-to-br ${config.gradient} border-2 ${config.border} rounded-2xl shadow-2xl ${config.shadow} p-4 max-w-sm backdrop-blur-sm`}
        >
          <div className="flex items-center gap-4">
            <motion.div
              className={`w-10 h-10 bg-gradient-to-br ${config.iconBg} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Icon className={`text-lg ${config.iconColor}`} />
            </motion.div>
            <p className={`text-sm font-semibold ${config.textColor} flex-1 leading-snug`}>
              {message}
            </p>
            <button
              onClick={onClose}
              className={`${config.textColor} hover:bg-white/50 rounded-lg p-1.5 transition-all duration-200 hover:rotate-90 flex-shrink-0`}
            >
              <FaTimes size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
