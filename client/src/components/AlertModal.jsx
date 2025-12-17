import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';

export default function AlertModal({ isOpen, onClose, title, message, type = 'info' }) {
  const typeConfig = {
    success: {
      icon: FaCheckCircle,
      iconColor: 'text-green-500',
      iconBg: 'bg-green-100',
      buttonColor: 'bg-green-500 hover:bg-green-600',
      borderColor: 'border-green-200'
    },
    error: {
      icon: FaExclamationTriangle,
      iconColor: 'text-red-500',
      iconBg: 'bg-red-100',
      buttonColor: 'bg-red-500 hover:bg-red-600',
      borderColor: 'border-red-200'
    },
    warning: {
      icon: FaExclamationTriangle,
      iconColor: 'text-yellow-500',
      iconBg: 'bg-yellow-100',
      buttonColor: 'bg-yellow-500 hover:bg-yellow-600',
      borderColor: 'border-yellow-200'
    },
    info: {
      icon: FaInfoCircle,
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-100',
      buttonColor: 'bg-blue-500 hover:bg-blue-600',
      borderColor: 'border-blue-200'
    }
  };

  const config = typeConfig[type] || typeConfig.info;
  const Icon = config.icon;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`relative bg-white rounded-2xl shadow-2xl max-w-md w-full border-2 ${config.borderColor} overflow-hidden`}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          >
            <FaTimes size={20} />
          </button>

          {/* Content */}
          <div className="p-6">
            {/* Icon */}
            <div className={`w-16 h-16 ${config.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <Icon className={`text-3xl ${config.iconColor}`} />
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
              {title}
            </h3>

            {/* Message */}
            <p className="text-gray-600 text-center mb-6">
              {message}
            </p>

            {/* Button */}
            <button
              onClick={onClose}
              className={`w-full ${config.buttonColor} text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95`}
            >
              Aceptar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
