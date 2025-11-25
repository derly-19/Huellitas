import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaUser, FaEnvelope, FaPhone, FaHome, FaPaw, FaHeart,
  FaCheck, FaTimes, FaEye, FaClock, FaFilter,
  FaChevronDown, FaChevronUp
} from "react-icons/fa";
import { MdPets } from "react-icons/md";

// Función helper para obtener la URL correcta de la imagen
const getImageUrl = (imgPath) => {
  if (!imgPath) return '/public/icon.png';
  if (imgPath.startsWith('http') || imgPath.startsWith('https')) {
    return imgPath;
  }
  if (imgPath.startsWith('/uploads')) {
    return `http://localhost:4000${imgPath}`;
  }
  return imgPath;
};

// Formatear fecha
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Componente para el badge de estado
const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800', icon: FaClock },
    approved: { label: 'Aprobada', color: 'bg-green-100 text-green-800', icon: FaCheck },
    rejected: { label: 'Rechazada', color: 'bg-red-100 text-red-800', icon: FaTimes },
    contacted: { label: 'Contactado', color: 'bg-blue-100 text-blue-800', icon: FaPhone }
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
      <Icon className="text-xs" />
      {config.label}
    </span>
  );
};

// Modal de detalle de solicitud
const RequestDetailModal = ({ request, onClose, onUpdateStatus }) => {
  const [notes, setNotes] = useState(request.notes || '');
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    await onUpdateStatus(request.id, newStatus, notes);
    setUpdating(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#005017] to-[#0e8c37] text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">Solicitud de Adopción</h2>
              <p className="text-green-100 mt-1">Recibida el {formatDate(request.created_at)}</p>
            </div>
            <button 
              onClick={onClose}
              className="text-white/80 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Info de la mascota */}
          <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl mb-6">
            <img 
              src={getImageUrl(request.pet_img)} 
              alt={request.pet_name}
              className="w-20 h-20 object-cover rounded-lg"
              onError={(e) => { e.target.src = '/public/icon.png'; }}
            />
            <div>
              <h3 className="font-bold text-lg text-gray-800">{request.pet_name}</h3>
              <p className="text-gray-600">
                {request.pet_type === 'dog' ? '🐕 Perro' : '🐱 Gato'} • {request.pet_breed} • {request.pet_age}
              </p>
              <StatusBadge status={request.status} />
            </div>
          </div>

          {/* Datos del solicitante */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Información personal */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FaUser className="text-green-600" /> Información Personal
              </h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Nombre:</span> {request.nombre} {request.apellido}</p>
                <p className="flex items-center gap-2">
                  <FaEnvelope className="text-gray-400" />
                  <a href={`mailto:${request.correo}`} className="text-blue-600 hover:underline">
                    {request.correo}
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <FaPhone className="text-gray-400" />
                  <a href={`tel:${request.telefono}`} className="text-blue-600 hover:underline">
                    {request.telefono}
                  </a>
                </p>
              </div>
            </div>

            {/* Información del hogar */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FaHome className="text-green-600" /> Información del Hogar
              </h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Dirección:</span> {request.direccion}</p>
                <p><span className="font-medium">Tipo de vivienda:</span> {request.tipo_vivienda}</p>
                <p><span className="font-medium">¿Tiene mascotas?:</span> {request.tiene_mascotas}</p>
              </div>
            </div>
          </div>

          {/* Motivación */}
          <div className="bg-green-50 rounded-xl p-4 mb-6">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <FaHeart className="text-red-500" /> ¿Por qué quiere adoptar?
            </h4>
            <p className="text-gray-700 leading-relaxed">{request.motivacion}</p>
          </div>

          {/* Notas de la fundación */}
          <div className="mb-6">
            <label className="block font-bold text-gray-800 mb-2">
              Notas internas (opcional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Agrega notas sobre esta solicitud..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={3}
            />
          </div>

          {/* Acciones */}
          {request.status === 'pending' && (
            <div className="flex flex-wrap gap-3 justify-end border-t pt-4">
              <button
                onClick={() => handleStatusChange('contacted')}
                disabled={updating}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
              >
                <FaPhone /> Marcar como Contactado
              </button>
              <button
                onClick={() => handleStatusChange('rejected')}
                disabled={updating}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
              >
                <FaTimes /> Rechazar
              </button>
              <button
                onClick={() => handleStatusChange('approved')}
                disabled={updating}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <FaCheck /> Aprobar Adopción
              </button>
            </div>
          )}

          {request.status !== 'pending' && (
            <div className="text-center text-gray-500 border-t pt-4">
              Esta solicitud ya fue {request.status === 'approved' ? 'aprobada' : request.status === 'rejected' ? 'rechazada' : 'procesada'}
              {request.notes && (
                <p className="mt-2 text-sm bg-gray-100 p-3 rounded-lg">
                  <span className="font-medium">Notas:</span> {request.notes}
                </p>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// Componente de tarjeta de solicitud
const RequestCard = ({ request, onViewDetail }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div 
      layout
      className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all ${
        request.status === 'pending' ? 'border-l-4 border-l-yellow-400' : 
        request.status === 'approved' ? 'border-l-4 border-l-green-400' :
        request.status === 'rejected' ? 'border-l-4 border-l-red-400' : 'border-l-4 border-l-blue-400'
      }`}
    >
      {/* Header de la tarjeta */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          {/* Info mascota y solicitante */}
          <div className="flex items-center gap-3 flex-1">
            <img 
              src={getImageUrl(request.pet_img)} 
              alt={request.pet_name}
              className="w-14 h-14 object-cover rounded-lg"
              onError={(e) => { e.target.src = '/public/icon.png'; }}
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-800 truncate">
                {request.nombre} {request.apellido}
              </h3>
              <p className="text-sm text-gray-500">
                Quiere adoptar a <span className="font-medium text-gray-700">{request.pet_name}</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {formatDate(request.created_at)}
              </p>
            </div>
          </div>

          {/* Estado y acciones */}
          <div className="flex flex-col items-end gap-2">
            <StatusBadge status={request.status} />
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-gray-400 hover:text-gray-600 text-sm flex items-center gap-1"
            >
              {expanded ? <FaChevronUp /> : <FaChevronDown />}
              {expanded ? 'Menos' : 'Más'}
            </button>
          </div>
        </div>

        {/* Preview expandida */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t"
            >
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium truncate">{request.correo}</p>
                </div>
                <div>
                  <p className="text-gray-500">Teléfono</p>
                  <p className="font-medium">{request.telefono}</p>
                </div>
                <div>
                  <p className="text-gray-500">Vivienda</p>
                  <p className="font-medium">{request.tipo_vivienda}</p>
                </div>
                <div>
                  <p className="text-gray-500">¿Tiene mascotas?</p>
                  <p className="font-medium">{request.tiene_mascotas}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                <span className="font-medium">Motivación:</span> {request.motivacion}
              </p>
              <button
                onClick={() => onViewDetail(request)}
                className="w-full py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <FaEye /> Ver solicitud completa
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Componente principal del panel de solicitudes
export default function AdoptionRequestsPanel({ foundationId }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Cargar solicitudes
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const statusQuery = filterStatus !== 'all' ? `?status=${filterStatus}` : '';
      const response = await fetch(
        `http://localhost:4000/api/adoption-requests/foundation/${foundationId}${statusQuery}`
      );
      const result = await response.json();

      if (result.success) {
        setRequests(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Error al cargar las solicitudes');
    } finally {
      setLoading(false);
    }
  };

  // Cargar estadísticas
  const fetchStats = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/adoption-requests/foundation/${foundationId}/stats`
      );
      const result = await response.json();

      if (result.success) {
        setStats(result.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Actualizar estado de solicitud
  const handleUpdateStatus = async (requestId, status, notes) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/adoption-requests/${requestId}/status`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status, notes })
        }
      );
      const result = await response.json();

      if (result.success) {
        fetchRequests();
        fetchStats();
        setSelectedRequest(null);
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert('Error al actualizar la solicitud');
    }
  };

  // Cargar datos al montar
  useEffect(() => {
    if (foundationId) {
      fetchRequests();
      fetchStats();
    }
  }, [foundationId]);

  // Recargar cuando cambie el filtro
  useEffect(() => {
    if (foundationId) {
      fetchRequests();
    }
  }, [filterStatus]);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <MdPets className="text-green-600" />
            Solicitudes de Adopción
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Revisa y gestiona las solicitudes de los adoptantes
          </p>
        </div>

        {/* Estadísticas rápidas */}
        <div className="flex gap-3">
          <div className="text-center px-4 py-2 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">{stats.pending || 0}</p>
            <p className="text-xs text-yellow-700">Pendientes</p>
          </div>
          <div className="text-center px-4 py-2 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{stats.approved || 0}</p>
            <p className="text-xs text-green-700">Aprobadas</p>
          </div>
          <div className="text-center px-4 py-2 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">{stats.rejected || 0}</p>
            <p className="text-xs text-red-700">Rechazadas</p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-4 mb-6 pb-4 border-b">
        <FaFilter className="text-gray-400" />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="all">Todas las solicitudes</option>
          <option value="pending">⏳ Pendientes</option>
          <option value="approved">✅ Aprobadas</option>
          <option value="rejected">❌ Rechazadas</option>
          <option value="contacted">📞 Contactados</option>
        </select>
        <button
          onClick={() => { fetchRequests(); fetchStats(); }}
          className="px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
        >
          🔄 Actualizar
        </button>
      </div>

      {/* Lista de solicitudes */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando solicitudes...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
          <button onClick={fetchRequests} className="mt-4 text-green-600 hover:underline">
            Intentar de nuevo
          </button>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-12">
          <MdPets className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            {filterStatus === 'all' 
              ? 'Aún no has recibido solicitudes de adopción'
              : `No hay solicitudes ${filterStatus === 'pending' ? 'pendientes' : filterStatus === 'approved' ? 'aprobadas' : 'rechazadas'}`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onViewDetail={setSelectedRequest}
            />
          ))}
        </div>
      )}

      {/* Modal de detalle */}
      <AnimatePresence>
        {selectedRequest && (
          <RequestDetailModal
            request={selectedRequest}
            onClose={() => setSelectedRequest(null)}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
