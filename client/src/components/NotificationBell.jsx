import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBell, FaTimes, FaCheckCircle, FaTimesCircle, FaInfoCircle } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

export default function NotificationBell() {
  const { user, isFoundation } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPanel, setShowPanel] = useState(false);
  const [loading, setLoading] = useState(false);

  // No renderizar para fundaciones
  if (isFoundation?.()) {
    return null;
  }

  // Función memoizada para cargar notificaciones
  const reloadNotifications = useCallback(async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`http://localhost:4000/api/notifications/user/${user.id}`);
      const result = await response.json();
      
      if (result.success && Array.isArray(result.data)) {
        setNotifications(result.data);
        const unread = result.data.filter(n => n.is_read === 0).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Error recargando notificaciones:', error);
    }
  }, [user?.id]);

  // Cargar al montar y cada 30 segundos
  useEffect(() => {
    if (!user?.id) return;

    // Cargar inmediatamente
    reloadNotifications();

    // Luego cada 30 segundos
    const interval = setInterval(reloadNotifications, 30000);
    return () => clearInterval(interval);
  }, [user?.id, reloadNotifications]);

  // Marcar como leída
  const markAsRead = async (notificationId) => {
    try {
      await fetch(`http://localhost:4000/api/notifications/${notificationId}/read`, {
        method: 'PATCH'
      });
      await reloadNotifications();
    } catch (error) {
      console.error('Error marcando notificación:', error);
    }
  };

  // Marcar todas como leídas
  const markAllAsRead = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      await fetch(`http://localhost:4000/api/notifications/user/${user.id}/read-all`, {
        method: 'PATCH'
      });
      await reloadNotifications();
    } catch (error) {
      console.error('Error marcando todas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar notificación
  const deleteNotification = async (notificationId) => {
    try {
      await fetch(`http://localhost:4000/api/notifications/${notificationId}`, {
        method: 'DELETE'
      });
      await reloadNotifications();
    } catch (error) {
      console.error('Error eliminando notificación:', error);
    }
  };

  // Obtener icono según tipo
  const getIcon = (type) => {
    switch(type) {
      case 'approved':
        return (
          <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
            <FaCheckCircle className="text-white text-lg" />
          </div>
        );
      case 'rejected':
        return (
          <div className="w-9 h-9 bg-gradient-to-br from-red-400 to-rose-500 rounded-xl flex items-center justify-center shadow-md">
            <FaTimesCircle className="text-white text-lg" />
          </div>
        );
      default:
        return (
          <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
            <FaInfoCircle className="text-white text-lg" />
          </div>
        );
    }
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `Hace ${minutes}m`;
    if (hours < 24) return `Hace ${hours}h`;
    if (days < 7) return `Hace ${days}d`;
    return date.toLocaleDateString();
  };

  // No mostrar nada si no hay usuario
  if (!user) return null;

  return (
    <div className="relative">
      {/* Botón de campana */}
      <motion.button
        onClick={() => setShowPanel(!showPanel)}
        className="relative p-2.5 text-gray-700 hover:text-blue-600 transition-all duration-200 hover:bg-blue-50 rounded-xl"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={unreadCount > 0 ? { rotate: [0, -15, 15, -15, 0] } : {}}
          transition={{ duration: 0.5, repeat: unreadCount > 0 ? Infinity : 0, repeatDelay: 3 }}
        >
          <FaBell className="text-2xl" />
        </motion.div>
        {unreadCount > 0 && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-pink-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg ring-2 ring-white"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Panel de notificaciones */}
      <AnimatePresence>
        {showPanel && (
          <>
            {/* Overlay */}
            <motion.div 
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPanel(false)}
            />
            
            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 400 }}
              className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 max-h-[600px] flex flex-col overflow-hidden"
            >
              {/* Header con gradiente mejorado */}
              <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 px-5 py-4 relative overflow-hidden">
                {/* Efectos decorativos en el header */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl" />
                
                <div className="flex items-center justify-between mb-2 relative z-10">
                  <h3 className="font-bold text-xl text-white flex items-center gap-2.5">
                    <motion.div
                      animate={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <FaBell className="text-lg" />
                    </motion.div>
                    Notificaciones
                  </h3>
                  <button
                    onClick={() => setShowPanel(false)}
                    className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-1.5 transition-all duration-200"
                  >
                    <FaTimes />
                  </button>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    disabled={loading}
                    className="text-sm text-white/95 hover:text-white font-medium bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg disabled:opacity-50 transition-all duration-200 relative z-10"
                  >
                    {loading ? 'Marcando...' : 'Marcar todas como leídas'}
                  </button>
                )}
              </div>

              {/* Lista de notificaciones */}
              <div className="overflow-y-auto flex-1 bg-gradient-to-b from-gray-50 to-white">
                {notifications.length === 0 ? (
                  <div className="p-10 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 15 }}
                      className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                    >
                      <FaBell className="text-4xl text-blue-500" />
                    </motion.div>
                    <p className="font-bold text-gray-700 text-lg">No tienes notificaciones</p>
                    <p className="text-sm mt-2 text-gray-500">¡Todo listo! 🎉</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {notifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 relative ${
                          notification.is_read === 0 ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <motion.div 
                            className="mt-1"
                            whileHover={{ scale: 1.2, rotate: 10 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            {getIcon(notification.type)}
                          </motion.div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 text-sm">
                              {notification.title}
                            </h4>
                            <p className="text-gray-700 text-sm mt-1 leading-relaxed">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-xs text-gray-500 font-medium">
                                {formatDate(notification.created_at)}
                              </span>
                              <div className="flex gap-2">
                                {notification.is_read === 0 && (
                                  <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                                  >
                                    Marcar leída
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteNotification(notification.id)}
                                  className="text-xs text-red-500 hover:text-red-600 font-medium hover:underline transition-colors"
                                >
                                  Eliminar
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
