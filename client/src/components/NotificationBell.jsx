import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBell, FaTimes, FaCheckCircle, FaTimesCircle, FaInfoCircle } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPanel, setShowPanel] = useState(false);
  const [loading, setLoading] = useState(false);

  // Cargar notificaciones
  const fetchNotifications = async () => {
    if (!user?.id) {
      console.log('⚠️ No hay usuario autenticado');
      return;
    }
    
    console.log(`🔔 Cargando notificaciones para usuario ${user.id}`);
    
    try {
      const response = await fetch(`http://localhost:4000/api/notifications/user/${user.id}`);
      const result = await response.json();
      
      console.log('📬 Respuesta de notificaciones:', result);
      
      if (result.success) {
        setNotifications(result.data);
        const unread = result.data.filter(n => n.is_read === 0).length;
        setUnreadCount(unread);
        console.log(`✅ ${result.data.length} notificaciones cargadas, ${unread} sin leer`);
      }
    } catch (error) {
      console.error('❌ Error cargando notificaciones:', error);
    }
  };

  // Cargar al montar y cada 30 segundos
  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user?.id]);

  // Marcar como leída
  const markAsRead = async (notificationId) => {
    try {
      await fetch(`http://localhost:4000/api/notifications/${notificationId}/read`, {
        method: 'PATCH'
      });
      fetchNotifications();
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
      fetchNotifications();
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
      fetchNotifications();
    } catch (error) {
      console.error('Error eliminando notificación:', error);
    }
  };

  // Obtener icono según tipo
  const getIcon = (type) => {
    switch(type) {
      case 'approved':
        return <FaCheckCircle className="text-green-500" />;
      case 'rejected':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaInfoCircle className="text-blue-500" />;
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

  if (!user) return null;

  return (
    <div className="relative">
      {/* Botón de campana */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="relative p-2 text-gray-700 hover:text-[#BCC990] transition-colors"
      >
        <FaBell className="text-2xl" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Panel de notificaciones */}
      <AnimatePresence>
        {showPanel && (
          <>
            {/* Overlay */}
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setShowPanel(false)}
            />
            
            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[600px] flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg text-gray-800">Notificaciones</h3>
                  <button
                    onClick={() => setShowPanel(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes />
                  </button>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    disabled={loading}
                    className="text-sm text-[#BCC990] hover:underline disabled:opacity-50"
                  >
                    Marcar todas como leídas
                  </button>
                )}
              </div>

              {/* Lista de notificaciones */}
              <div className="overflow-y-auto flex-1">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <FaBell className="text-4xl mx-auto mb-2 opacity-30" />
                    <p>No tienes notificaciones</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-gray-50 transition-colors ${
                          notification.is_read === 0 ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {getIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 text-sm">
                              {notification.title}
                            </h4>
                            <p className="text-gray-600 text-sm mt-1">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-400">
                                {formatDate(notification.created_at)}
                              </span>
                              <div className="flex gap-2">
                                {notification.is_read === 0 && (
                                  <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="text-xs text-[#BCC990] hover:underline"
                                  >
                                    Marcar leída
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteNotification(notification.id)}
                                  className="text-xs text-red-500 hover:underline"
                                >
                                  Eliminar
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
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
