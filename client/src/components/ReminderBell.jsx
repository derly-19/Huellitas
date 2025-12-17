import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBell, FaTimes, FaSyringe, FaPills, FaShower, FaCapsules, FaCheck, FaClock } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

export default function ReminderBell() {
  const { user, token, isFoundation } = useAuth();
  const [reminders, setReminders] = useState([]);
  const [showPanel, setShowPanel] = useState(false);
  const [loading, setLoading] = useState(false);

  // No renderizar para fundaciones
  if (isFoundation?.()) {
    return null;
  }

  // Función para cargar recordatorios
  const loadReminders = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch("http://localhost:4000/api/reminders", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const result = await response.json();
      
      if (result.success) {
        setReminders(result.reminders || []);
      }
    } catch (error) {
      console.error("Error cargando recordatorios:", error);
    }
  }, [token]);

  // Cargar al montar y cada 5 minutos
  useEffect(() => {
    if (!token) return;

    loadReminders();
    const interval = setInterval(loadReminders, 300000); // 5 minutos
    return () => clearInterval(interval);
  }, [token, loadReminders]);

  // Marcar como leído
  const markAsRead = async (reminderId) => {
    try {
      await fetch(`http://localhost:4000/api/reminders/${reminderId}/read`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      await loadReminders();
    } catch (error) {
      console.error("Error marcando recordatorio:", error);
    }
  };

  // Marcar todos como leídos
  const markAllAsRead = async () => {
    setLoading(true);
    try {
      await fetch("http://localhost:4000/api/reminders/read-all", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      await loadReminders();
    } catch (error) {
      console.error("Error marcando todos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Obtener icono según tipo
  const getIcon = (type) => {
    switch (type) {
      case "vaccine":
        return <FaSyringe className="text-red-500" />;
      case "deworming":
        return <FaPills className="text-purple-500" />;
      case "bath":
        return <FaShower className="text-blue-500" />;
      case "medication":
        return <FaCapsules className="text-yellow-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  // Formatear fecha
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const diff = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
    
    if (diff === 0) return "Hoy";
    if (diff === 1) return "Mañana";
    if (diff < 0) return "Vencido";
    return `En ${diff} días`;
  };

  const unreadCount = reminders.length;

  if (!user) return null;

  return (
    <div className="relative">
      {/* Botón campana */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="relative p-2 text-gray-600 hover:text-orange-500 transition-colors"
        title="Recordatorios del carnet"
      >
        <FaClock className="text-xl" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-gradient-to-br from-orange-500 to-yellow-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Panel de recordatorios */}
      <AnimatePresence>
        {showPanel && (
          <>
            {/* Overlay para cerrar */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowPanel(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 overflow-hidden border border-gray-200"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-500 to-yellow-500 px-4 py-3 flex items-center justify-between">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <FaClock className="animate-pulse" />
                  Recordatorios
                </h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      disabled={loading}
                      className="text-white/80 hover:text-white text-xs flex items-center gap-1"
                    >
                      <FaCheck /> Marcar todo
                    </button>
                  )}
                  <button
                    onClick={() => setShowPanel(false)}
                    className="text-white/80 hover:text-white"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              {/* Lista de recordatorios */}
              <div className="max-h-96 overflow-y-auto">
                {reminders.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FaClock className="text-3xl text-orange-400" />
                    </div>
                    <p className="font-semibold text-gray-700">No tienes recordatorios pendientes</p>
                    <p className="text-sm mt-1 text-gray-500">
                      ¡Tu mascota está al día! 🐾
                    </p>
                  </div>
                ) : (
                  reminders.map((reminder) => (
                    <motion.div
                      key={reminder.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex gap-3">
                        <div className="text-xl mt-1">
                          {getIcon(reminder.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-medium text-gray-800 text-sm truncate">
                              {reminder.title}
                            </p>
                            <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${
                              reminder.days_before <= 1 
                                ? "bg-red-100 text-red-600" 
                                : "bg-yellow-100 text-yellow-700"
                            }`}>
                              {formatDate(reminder.due_date)}
                            </span>
                          </div>
                          <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                            {reminder.message}
                          </p>
                          <button
                            onClick={() => markAsRead(reminder.id)}
                            className="text-xs text-[#BCC990] hover:text-[#9ab06a] mt-1"
                          >
                            Marcar como leído
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="p-3 bg-gray-50 border-t border-gray-200">
                <Link
                  to="/carnet"
                  onClick={() => setShowPanel(false)}
                  className="block text-center text-sm text-[#BCC990] hover:text-[#9ab06a] font-medium"
                >
                  Ver carnet completo →
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
