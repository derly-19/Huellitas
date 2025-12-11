import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  FaPlus,
  FaClipboardList,
  FaHeart,
  FaChartLine,
  FaSmile,
  FaHeartbeat,
  FaUserCheck,
  FaExclamationTriangle
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import FollowUpForm from '../components/FollowUp/FollowUpForm';
import FollowUpCard from '../components/FollowUp/FollowUpCard';
import FollowUpModal from '../components/FollowUp/FollowUpModal';
import Toast from '../components/Toast';

export default function FollowUp() {
  const { user, isAuthenticated, isFoundation } = useAuth();
  const navigate = useNavigate();

  const formatStatValue = (value, decimals = 0) => {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
      return decimals > 0 ? (0).toFixed(decimals) : 0;
    }
    return decimals > 0 ? numericValue.toFixed(decimals) : numericValue;
  };

  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFollowUp, setSelectedFollowUp] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingFollowUp, setEditingFollowUp] = useState(null);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });
  const [stats, setStats] = useState(null);

  // Verificar autenticación
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Obtener seguimientos
  const fetchFollowUps = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const endpoint = isFoundation?.()
        ? `http://localhost:4000/api/follow-ups/foundation/${user.id}`
        : `http://localhost:4000/api/follow-ups/user/${user.id}`;

      const response = await fetch(endpoint);
      const result = await response.json();

      if (result.success) {
        setFollowUps(result.data);
        
        // Si es fundación, obtener estadísticas
        if (isFoundation?.()) {
          fetchStats();
        }
      } else {
        setError(result.message || 'Error al cargar seguimientos');
      }
    } catch (err) {
      console.error('Error fetching follow-ups:', err);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Obtener estadísticas (solo para fundación)
  const fetchStats = async () => {
    if (!user?.id || !isFoundation?.()) return;

    try {
      const response = await fetch(`http://localhost:4000/api/follow-ups/foundation/${user.id}/stats`);
      const result = await response.json();

      if (result.success) {
        setStats(result.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Cargar seguimientos al montar
  useEffect(() => {
    if (user?.id) {
      fetchFollowUps();
    }
  }, [user?.id]);

  // Crear seguimiento
  const handleCreateFollowUp = async (formData) => {
    try {
      // Obtener el primer seguimiento del usuario para obtener los datos necesarios
      const adoptionResponse = await fetch(`http://localhost:4000/api/adoption-requests/user/${user.id}`);
      const adoptionResult = await adoptionResponse.json();

      if (!adoptionResult.success || !adoptionResult.data || adoptionResult.data.length === 0) {
        setToast({
          isVisible: true,
          message: '❌ Error: No tienes adopciones registradas',
          type: 'error'
        });
        return;
      }

      const adoption = adoptionResult.data.find(a => a.status === 'approved');
      if (!adoption) {
        setToast({
          isVisible: true,
          message: '❌ Error: Debes tener una adopción aprobada',
          type: 'error'
        });
        return;
      }

      const followUpData = {
        ...formData,
        adoption_request_id: adoption.id,
        pet_id: adoption.pet_id,
        foundation_id: adoption.foundation_id,
        pet_name: adoption.pet_name,
        follow_up_date: new Date().toISOString().split('T')[0]
      };

      const response = await fetch('http://localhost:4000/api/follow-ups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(followUpData)
      });

      const result = await response.json();

      if (result.success) {
        setToast({
          isVisible: true,
          message: '✅ Seguimiento creado exitosamente',
          type: 'success'
        });
        setTimeout(() => setToast({ ...toast, isVisible: false }), 3000);

        setShowForm(false);
        fetchFollowUps();
      } else {
        setToast({
          isVisible: true,
          message: `❌ Error: ${result.message}`,
          type: 'error'
        });
      }
    } catch (err) {
      console.error('Error creating follow-up:', err);
      setToast({
        isVisible: true,
        message: '❌ Error al crear el seguimiento',
        type: 'error'
      });
    }
  };

  // Agregar feedback
  const handleAddFeedback = async (followUpId, feedback) => {
    try {
      const response = await fetch(`http://localhost:4000/api/follow-ups/${followUpId}/feedback`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback })
      });

      const result = await response.json();

      if (result.success) {
        setToast({
          isVisible: true,
          message: '✅ Feedback agregado exitosamente',
          type: 'success'
        });
        setTimeout(() => setToast({ ...toast, isVisible: false }), 3000);
        fetchFollowUps();
        setSelectedFollowUp(null);
      }
    } catch (err) {
      console.error('Error adding feedback:', err);
      setToast({
        isVisible: true,
        message: '❌ Error al agregar feedback',
        type: 'error'
      });
    }
  };

  // Eliminar seguimiento
  const handleDeleteFollowUp = async (followUpId) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este seguimiento?')) return;

    try {
      const response = await fetch(`http://localhost:4000/api/follow-ups/${followUpId}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        setToast({
          isVisible: true,
          message: '✅ Seguimiento eliminado',
          type: 'success'
        });
        setTimeout(() => setToast({ ...toast, isVisible: false }), 3000);
        fetchFollowUps();
      }
    } catch (err) {
      console.error('Error deleting follow-up:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFCF4] flex items-center justify-center mt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005017] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando seguimientos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFCF4] py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaClipboardList className="text-3xl text-[#BCC990]" />
            <h1 className="text-4xl font-bold text-gray-800">
              {isFoundation?.() ? 'Seguimientos de Adopciones' : 'Mis Seguimientos'}
            </h1>
            <FaHeart className="text-3xl text-red-500" />
          </div>
          <p className="text-gray-600 text-lg">
            {isFoundation?.()
              ? 'Revisa el progreso de tus mascotas adoptadas'
              : 'Comparte cómo va tu mascota adoptada'}
          </p>
        </motion.div>

        {/* Estadísticas (solo para fundación) */}
        {isFoundation?.() && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-10"
          >
            {[
              {
                icon: <FaChartLine className="text-blue-500 text-2xl" />,
                label: 'Seguimientos',
                value: formatStatValue(stats?.total_follow_ups),
                bg: 'from-blue-50 to-blue-100/60'
              },
              {
                icon: <FaSmile className="text-yellow-500 text-2xl" />,
                label: 'Satisfacción Prom.',
                value: formatStatValue(stats?.avg_satisfaction, 1),
                bg: 'from-yellow-50 to-amber-100/60'
              },
              {
                icon: <FaHeartbeat className="text-green-500 text-2xl" />,
                label: 'Salud Excelente',
                value: formatStatValue(stats?.excellent_health),
                bg: 'from-emerald-50 to-green-100/60'
              },
              {
                icon: <FaUserCheck className="text-purple-500 text-2xl" />,
                label: 'Bien Adaptados',
                value: formatStatValue(stats?.well_adapted),
                bg: 'from-purple-50 to-violet-100/60'
              },
              {
                icon: <FaExclamationTriangle className="text-red-500 text-2xl" />,
                label: 'Con Problemas',
                value: formatStatValue(stats?.with_problems),
                bg: 'from-rose-50 to-red-100/60'
              }
            ].map(({ icon, label, value, bg }) => (
              <div
                key={label}
                className={`rounded-xl p-5 shadow-sm bg-gradient-to-br ${bg} border border-white/60 backdrop-blur-sm flex items-center justify-between`}
              >
                <div>
                  <p className="text-sm uppercase tracking-wide text-gray-500">{label}</p>
                  <p className="mt-1 text-3xl font-bold text-gray-800">{value}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-white/70 flex items-center justify-center shadow-inner">
                  {icon}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Botón crear (solo para usuarios) */}
        {!isFoundation?.() && (
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-[#BCC990] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#9FB36F] flex items-center gap-2 transition"
            >
              <FaPlus /> Nuevo Seguimiento
            </button>
          </div>
        )}

        {/* Formulario */}
        {showForm && !isFoundation?.() && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <FollowUpForm
              petName="Mi mascota"
              onSubmit={handleCreateFollowUp}
            />
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-red-700">
            {error}
          </div>
        )}

        {/* Lista de seguimientos */}
        {followUps.length === 0 ? (
          <div className="text-center py-16 px-6 bg-gradient-to-br from-white via-white to-[#f5f1e4] rounded-2xl border border-[#e9e3d2] shadow-sm">
            <div className="mx-auto mb-6 h-16 w-16 flex items-center justify-center rounded-full bg-[#BCC990]/15">
              <FaClipboardList className="text-4xl text-[#BCC990]" />
            </div>
            <p className="text-gray-600 text-xl font-semibold mb-2">
              {isFoundation?.()
                ? 'Aún no hay seguimientos de adopciones'
                : 'Aún no has completado ningún seguimiento'}
            </p>
            <p className="text-gray-400 max-w-sm mx-auto">
              {isFoundation?.()
                ? 'Cuando las familias compartan avances, los verás aquí con sus métricas principales.'
                : 'Cuéntanos cómo va la adaptación de tu mascota para mantener informada a la fundación.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {followUps.map((followUp, index) => (
              <motion.div
                key={followUp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <FollowUpCard
                  followUp={followUp}
                  onViewDetail={setSelectedFollowUp}
                  onEdit={setEditingFollowUp}
                  onDelete={handleDeleteFollowUp}
                  isFoundation={isFoundation?.()}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedFollowUp && (
        <FollowUpModal
          followUp={selectedFollowUp}
          onClose={() => setSelectedFollowUp(null)}
          isFoundation={isFoundation?.()}
          onAddFeedback={isFoundation?.() ? handleAddFeedback : null}
        />
      )}

      {/* Toast */}
      <Toast
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
        message={toast.message}
        type={toast.type}
      />
    </div>
  );
}
