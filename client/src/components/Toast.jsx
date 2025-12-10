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
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: FaCheckCircle,
      iconColor: 'text-green-600',
      textColor: 'text-green-800'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: FaExclamationCircle,
      iconColor: 'text-red-600',
      textColor: 'text-red-800'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: FaInfoCircle,
      iconColor: 'text-blue-600',
      textColor: 'text-blue-800'
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: 0 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -20, x: 0 }}
          className={`fixed top-4 right-4 z-50 ${config.bg} border ${config.border} rounded-lg shadow-lg p-4 max-w-xs`}
        >
          <div className="flex items-center gap-3">
            <Icon className={`text-xl ${config.iconColor}`} />
            <p className={`text-sm font-medium ${config.textColor}`}>
              {message}
            </p>
            <button
              onClick={onClose}
              className={`ml-2 ${config.textColor} hover:opacity-70`}
            >
              <FaTimes size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
