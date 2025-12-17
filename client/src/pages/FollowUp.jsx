import { useState, useEffect, useMemo } from 'react';
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
  FaExclamationTriangle,
  FaCalendarAlt,
  FaPaw,
  FaThLarge,
  FaList
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import FollowUpForm from '../components/FollowUp/FollowUpForm';
import FollowUpCard from '../components/FollowUp/FollowUpCard';
import FollowUpCardFoundation from '../components/FollowUp/FollowUpCardFoundation';
import FollowUpFilters from '../components/FollowUp/FollowUpFilters';
import FollowUpModal from '../components/FollowUp/FollowUpModal';
import AdoptedPetCard from '../components/FollowUp/AdoptedPetCard';
import ScheduleVisitModal from '../components/FollowUp/ScheduleVisitModal';
import VisitCard from '../components/FollowUp/VisitCard';
import FoundationAdoptionsTab from '../components/FollowUp/FoundationAdoptionsTab';
import Toast from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';

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
  const [adoptedPets, setAdoptedPets] = useState([]);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFollowUp, setSelectedFollowUp] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedPetForFollowUp, setSelectedPetForFollowUp] = useState(null);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
  const [selectedPetForVisit, setSelectedPetForVisit] = useState(null);
  const [activeTab, setActiveTab] = useState('pets'); // 'pets', 'followups', 'visits'
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });
  const [stats, setStats] = useState(null);
  
  // Estado para filtros de fundación
  const [foundationFilters, setFoundationFilters] = useState({ type: 'all', search: '', sort: 'newest' });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' o 'list'

  // Filtrar y ordenar seguimientos para fundación
  const filteredFollowUps = useMemo(() => {
    if (!isFoundation?.()) return followUps;
    
    let filtered = [...followUps];
    
    // Aplicar filtro de búsqueda
    if (foundationFilters.search) {
      const searchLower = foundationFilters.search.toLowerCase();
      filtered = filtered.filter(f => 
        f.pet_name?.toLowerCase().includes(searchLower) ||
        f.user_name?.toLowerCase().includes(searchLower) ||
        f.user_email?.toLowerCase().includes(searchLower)
      );
    }
    
    // Aplicar filtro por tipo
    switch (foundationFilters.type) {
      case 'pending':
        filtered = filtered.filter(f => !f.reviewed);
        break;
      case 'reviewed':
        filtered = filtered.filter(f => f.reviewed);
        break;
      case 'withProblems':
        filtered = filtered.filter(f => f.problems_encountered && f.problems_encountered.trim());
        break;
      case 'excellentHealth':
        filtered = filtered.filter(f => f.health_status === 'excelente');
        break;
      case 'adapted':
        filtered = filtered.filter(f => f.behavior_status === 'adaptado');
        break;
    }
    
    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      const dateA = new Date(a.follow_up_date);
      const dateB = new Date(b.follow_up_date);
      
      if (foundationFilters.sort === 'newest') {
        return dateB - dateA;
      } else if (foundationFilters.sort === 'oldest') {
        return dateA - dateB;
      }
      return 0;
    });
    
    return filtered;
  }, [followUps, foundationFilters, isFoundation]);

  // Verificar autenticación
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Obtener mascotas adoptadas del usuario
  const fetchAdoptedPets = async () => {
    if (!user?.id || isFoundation?.()) return;

    try {
      const response = await fetch(`http://localhost:4000/api/adoption-requests/user/${user.id}`);
      const result = await response.json();

      if (result.success) {
        // Filtrar solo las aprobadas
        const approved = result.data.filter(a => a.status === 'approved');
        setAdoptedPets(approved);
      }
    } catch (err) {
      console.error('Error fetching adopted pets:', err);
    }
  };

  // Obtener seguimientos
  const fetchFollowUps = async () => {
    if (!user?.id) return;

    try {
      setError(null);

      const endpoint = isFoundation?.()
        ? `http://localhost:4000/api/follow-ups/foundation/${user.id}`
        : `http://localhost:4000/api/follow-ups/user/${user.id}`;

      const response = await fetch(endpoint);
      const result = await response.json();

      if (result.success) {
        setFollowUps(result.data);
        
        if (isFoundation?.()) {
          fetchStats();
        }
      } else {
        setError(result.message || 'Error al cargar seguimientos');
      }
    } catch (err) {
      console.error('Error fetching follow-ups:', err);
      setError('Error de conexión con el servidor');
    }
  };

  // Obtener visitas
  const fetchVisits = async () => {
    if (!user?.id) return;

    try {
      const endpoint = isFoundation?.()
        ? `http://localhost:4000/api/visits/foundation/${user.id}`
        : `http://localhost:4000/api/visits/user/${user.id}`;

      const response = await fetch(endpoint);
      const result = await response.json();

      if (result.success) {
        setVisits(result.data);
      }
    } catch (err) {
      console.error('Error fetching visits:', err);
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

  // Cargar datos al montar
  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      await Promise.all([
        fetchAdoptedPets(),
        fetchFollowUps(),
        fetchVisits()
      ]);
      setLoading(false);
    };

    loadData();
  }, [user?.id]);

  // Crear seguimiento
  const handleCreateFollowUp = async (formData) => {
    if (!selectedPetForFollowUp) {
      setToast({
        isVisible: true,
        message: '❌ Error: Selecciona una mascota',
        type: 'error'
      });
      return;
    }

    try {
      const followUpData = {
        ...formData,
        user_id: user.id,
        adoption_request_id: selectedPetForFollowUp.id,
        pet_id: selectedPetForFollowUp.pet_id,
        foundation_id: selectedPetForFollowUp.foundation_id,
        pet_name: selectedPetForFollowUp.pet_name,
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
        setSelectedPetForFollowUp(null);
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

  // Agendar visita
  const handleScheduleVisit = async (visitData) => {
    try {
      // Cuando una fundación programa la visita, no sobrescribimos el user_id
      // porque ya viene con el ID del adoptante desde ScheduleVisitModal
      const dataToSend = isFoundation 
        ? { ...visitData, foundation_id: user.id }  // Fundación programa: usar user_id del adoptante
        : { ...visitData, user_id: user.id };        // Adoptante sugiere: usar su propio ID

      const response = await fetch('http://localhost:4000/api/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });

      const result = await response.json();

      if (result.success) {
        setToast({
          isVisible: true,
          message: '✅ Visita programada exitosamente',
          type: 'success'
        });
        setTimeout(() => setToast({ ...toast, isVisible: false }), 3000);

        setShowVisitModal(false);
        setSelectedPetForVisit(null);
        fetchVisits();
      } else {
        setToast({
          isVisible: true,
          message: `❌ Error: ${result.message}`,
          type: 'error'
        });
      }
    } catch (err) {
      console.error('Error scheduling visit:', err);
      setToast({
        isVisible: true,
        message: '❌ Error al programar la visita',
        type: 'error'
      });
    }
  };

  // Cancelar visita
  const handleCancelVisit = async (visitId) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Cancelar visita',
      message: '¿Estás seguro de que deseas cancelar esta visita?',
      onConfirm: async () => {
        try {
          const response = await fetch(`http://localhost:4000/api/visits/${visitId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'cancelled' })
          });

          const result = await response.json();

          if (result.success) {
            setToast({
              isVisible: true,
              message: '✅ Visita cancelada',
              type: 'success'
            });
            fetchVisits();
          } else {
            setToast({
              isVisible: true,
              message: '❌ Error al cancelar visita',
              type: 'error'
            });
          }
        } catch (err) {
          console.error('Error cancelling visit:', err);
          setToast({
            isVisible: true,
            message: '❌ Error al cancelar visita',
            type: 'error'
          });
        }
      }
    });
  };

  // Completar visita (fundación)
  const handleCompleteVisit = async (visitId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/visits/${visitId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' })
      });

      const result = await response.json();

      if (result.success) {
        setToast({
          isVisible: true,
          message: '✅ Visita marcada como completada',
          type: 'success'
        });
        fetchVisits();
      }
    } catch (err) {
      console.error('Error completing visit:', err);
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

  // Marcar seguimiento como revisado (solo fundación)
  const handleMarkReviewed = async (followUpId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/follow-ups/${followUpId}/review`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await response.json();

      if (result.success) {
        setToast({
          isVisible: true,
          message: '✅ Seguimiento marcado como revisado',
          type: 'success'
        });
        setTimeout(() => setToast({ ...toast, isVisible: false }), 3000);
        fetchFollowUps();
        fetchStats();
      }
    } catch (err) {
      console.error('Error marking as reviewed:', err);
      setToast({
        isVisible: true,
        message: '❌ Error al marcar como revisado',
        type: 'error'
      });
    }
  };

  // Eliminar seguimiento
  const handleDeleteFollowUp = async (followUpId) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Eliminar seguimiento',
      message: '¿Estás seguro de que deseas eliminar este seguimiento? Esta acción no se puede deshacer.',
      onConfirm: async () => {
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
          } else {
            setToast({
              isVisible: true,
              message: '❌ Error al eliminar seguimiento',
              type: 'error'
            });
          }
        } catch (err) {
          console.error('Error deleting follow-up:', err);
          setToast({
            isVisible: true,
            message: '❌ Error al eliminar seguimiento',
            type: 'error'
          });
        }
      }
    });
  };

  // Contar seguimientos por mascota
  const getFollowUpsCountForPet = (petId) => {
    return followUps.filter(f => f.pet_id === petId).length;
  };

  // Contar visitas por mascota
  const getVisitsCountForPet = (petId) => {
    return visits.filter(v => v.pet_id === petId).length;
  };

  // Contar visitas pendientes por mascota (adoptante)
  const getPendingVisitsCountForPet = (petId) => {
    return visits.filter(v => v.pet_id === petId && v.status === 'scheduled').length;
  };

  // Manejar selección para nuevo seguimiento
  const handleNewFollowUp = (adoption) => {
    setSelectedPetForFollowUp(adoption);
    setShowForm(true);
    setActiveTab('followups');
  };

  // Ver visitas de una mascota (adoptante)
  const handleViewVisits = (adoption) => {
    setActiveTab('visits');
  };

  // Abrir modal para programar visita (fundación)
  const handleOpenVisitModal = (adoption) => {
    setSelectedPetForVisit(adoption);
    setShowVisitModal(true);
  };

  // Aceptar visita (adoptante)
  const handleAcceptVisit = async (visitId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/visits/${visitId}/accept`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await response.json();

      if (result.success) {
        setToast({
          isVisible: true,
          message: '✅ Visita aceptada',
          type: 'success'
        });
        fetchVisits();
      }
    } catch (err) {
      console.error('Error accepting visit:', err);
    }
  };

  // Sugerir cambio de fecha (adoptante)
  const handleSuggestReschedule = async (visitId, suggestedDate, suggestedTime, reason) => {
    try {
      const response = await fetch(`http://localhost:4000/api/visits/${visitId}/suggest-reschedule`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suggested_date: suggestedDate, suggested_time: suggestedTime, reason })
      });

      const result = await response.json();

      if (result.success) {
        setToast({
          isVisible: true,
          message: '✅ Sugerencia de cambio enviada',
          type: 'success'
        });
        fetchVisits();
      }
    } catch (err) {
      console.error('Error suggesting reschedule:', err);
    }
  };

  // Aprobar cambio de fecha sugerido (fundación)
  const handleApproveReschedule = async (visitId, newDate, newTime) => {
    try {
      const response = await fetch(`http://localhost:4000/api/visits/${visitId}/reschedule`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduled_date: newDate, scheduled_time: newTime })
      });

      const result = await response.json();

      if (result.success) {
        setToast({
          isVisible: true,
          message: '✅ Visita reprogramada',
          type: 'success'
        });
        fetchVisits();
      }
    } catch (err) {
      console.error('Error approving reschedule:', err);
    }
  };

  // Reprogramar visita directamente (fundación)
  const handleRescheduleVisit = async (visitId, newDate, newTime, meetingLink) => {
    try {
      const response = await fetch(`http://localhost:4000/api/visits/${visitId}/reschedule`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          scheduled_date: newDate, 
          scheduled_time: newTime,
          meeting_link: meetingLink 
        })
      });

      const result = await response.json();

      if (result.success) {
        setToast({
          isVisible: true,
          message: '✅ Visita reprogramada exitosamente',
          type: 'success'
        });
        setTimeout(() => setToast({ ...toast, isVisible: false }), 3000);
        fetchVisits();
      } else {
        setToast({
          isVisible: true,
          message: `❌ Error: ${result.message}`,
          type: 'error'
        });
      }
    } catch (err) {
      console.error('Error rescheduling visit:', err);
      setToast({
        isVisible: true,
        message: '❌ Error al reprogramar la visita',
        type: 'error'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFCF4] flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005017] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando seguimientos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFCF4] py-8 pt-24">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
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
              : 'Gestiona el seguimiento de tus mascotas adoptadas'}
          </p>
        </motion.div>

        {/* Estadísticas (solo para fundación) */}
        {isFoundation?.() && stats && (
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

        {/* Tabs para usuario */}
        {!isFoundation?.() && (
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-xl shadow-sm p-1 inline-flex gap-1">
              <button
                onClick={() => setActiveTab('pets')}
                className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activeTab === 'pets'
                    ? 'bg-[#BCC990] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FaPaw /> Mis Mascotas ({adoptedPets.length})
              </button>
              <button
                onClick={() => setActiveTab('followups')}
                className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activeTab === 'followups'
                    ? 'bg-[#BCC990] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FaClipboardList /> Seguimientos ({followUps.length})
              </button>
              <button
                onClick={() => setActiveTab('visits')}
                className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activeTab === 'visits'
                    ? 'bg-[#BCC990] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FaCalendarAlt /> Visitas ({visits.length})
              </button>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-red-700">
            {error}
          </div>
        )}

        {/* Contenido para usuarios */}
        {!isFoundation?.() && (
          <>
            {/* Tab: Mis Mascotas */}
            {activeTab === 'pets' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {adoptedPets.length === 0 ? (
                  <div className="text-center py-16 px-6 bg-gradient-to-br from-white via-white to-[#f5f1e4] rounded-2xl border border-[#e9e3d2] shadow-sm">
                    <div className="mx-auto mb-6 h-16 w-16 flex items-center justify-center rounded-full bg-[#BCC990]/15">
                      <FaPaw className="text-4xl text-[#BCC990]" />
                    </div>
                    <p className="text-gray-600 text-xl font-semibold mb-2">
                      Aún no tienes mascotas adoptadas
                    </p>
                    <p className="text-gray-400 max-w-sm mx-auto">
                      Cuando adoptes una mascota y sea aprobada, aparecerá aquí para hacer seguimiento.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {adoptedPets.map((adoption, index) => (
                      <motion.div
                        key={adoption.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <AdoptedPetCard
                          adoption={adoption}
                          followUpsCount={getFollowUpsCountForPet(adoption.pet_id)}
                          visitsCount={getVisitsCountForPet(adoption.pet_id)}
                          pendingVisitsCount={getPendingVisitsCountForPet(adoption.pet_id)}
                          onNewFollowUp={handleNewFollowUp}
                          onViewVisits={handleViewVisits}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Tab: Seguimientos */}
            {activeTab === 'followups' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {/* Formulario de seguimiento */}
                {showForm && selectedPetForFollowUp && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-gray-800">
                        Nuevo seguimiento para {selectedPetForFollowUp.pet_name}
                      </h3>
                      <button
                        onClick={() => {
                          setShowForm(false);
                          setSelectedPetForFollowUp(null);
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ✕ Cancelar
                      </button>
                    </div>
                    <FollowUpForm
                      petName={selectedPetForFollowUp.pet_name}
                      onSubmit={handleCreateFollowUp}
                    />
                  </motion.div>
                )}

                {/* Lista de seguimientos */}
                {!showForm && (
                  <>
                    {followUps.length === 0 ? (
                      <div className="text-center py-16 px-6 bg-gradient-to-br from-white via-white to-[#f5f1e4] rounded-2xl border border-[#e9e3d2] shadow-sm">
                        <div className="mx-auto mb-6 h-16 w-16 flex items-center justify-center rounded-full bg-[#BCC990]/15">
                          <FaClipboardList className="text-4xl text-[#BCC990]" />
                        </div>
                        <p className="text-gray-600 text-xl font-semibold mb-2">
                          Aún no has completado ningún seguimiento
                        </p>
                        <p className="text-gray-400 max-w-sm mx-auto mb-4">
                          Cuéntanos cómo va la adaptación de tu mascota para mantener informada a la fundación.
                        </p>
                        {adoptedPets.length > 0 && (
                          <button
                            onClick={() => setActiveTab('pets')}
                            className="bg-[#BCC990] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#9FB36F] transition"
                          >
                            Ver mis mascotas
                          </button>
                        )}
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
                              onDelete={handleDeleteFollowUp}
                              isFoundation={false}
                            />
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}

            {/* Tab: Visitas */}
            {activeTab === 'visits' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {visits.length === 0 ? (
                  <div className="text-center py-16 px-6 bg-gradient-to-br from-white via-white to-[#f5f1e4] rounded-2xl border border-[#e9e3d2] shadow-sm">
                    <div className="mx-auto mb-6 h-16 w-16 flex items-center justify-center rounded-full bg-purple-100">
                      <FaCalendarAlt className="text-4xl text-purple-500" />
                    </div>
                    <p className="text-gray-600 text-xl font-semibold mb-2">
                      No tienes visitas programadas
                    </p>
                    <p className="text-gray-400 max-w-sm mx-auto mb-4">
                      Las fundaciones programarán visitas para verificar el bienestar de tu mascota.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {visits.map((visit, index) => (
                      <motion.div
                        key={visit.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <VisitCard
                          visit={visit}
                          isFoundation={false}
                          onAccept={handleAcceptVisit}
                          onSuggestReschedule={handleSuggestReschedule}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </>
        )}

        {/* Contenido para fundaciones */}
        {isFoundation?.() && (
          <>
            {/* Tabs para fundación */}
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-xl shadow-sm p-1 inline-flex gap-1">
                <button
                  onClick={() => setActiveTab('adoptions')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    activeTab === 'adoptions'
                      ? 'bg-[#BCC990] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <FaPaw /> Adopciones
                </button>
                <button
                  onClick={() => setActiveTab('followups')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    activeTab === 'followups'
                      ? 'bg-[#BCC990] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <FaClipboardList /> Seguimientos ({followUps.length})
                </button>
                <button
                  onClick={() => setActiveTab('visits')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    activeTab === 'visits'
                      ? 'bg-[#BCC990] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <FaCalendarAlt /> Visitas ({visits.length})
                </button>
              </div>
            </div>

            {/* Tab: Adopciones aprobadas (para programar visitas) */}
            {activeTab === 'adoptions' && (
              <FoundationAdoptionsTab 
                onScheduleVisit={handleOpenVisitModal}
                foundationId={user?.id}
              />
            )}

            {/* Seguimientos de fundación */}
            {activeTab === 'followups' && (
              <>
                {followUps.length === 0 ? (
                  <div className="text-center py-16 px-6 bg-gradient-to-br from-white via-white to-[#f5f1e4] rounded-2xl border border-[#e9e3d2] shadow-sm">
                    <div className="mx-auto mb-6 h-16 w-16 flex items-center justify-center rounded-full bg-[#BCC990]/15">
                      <FaClipboardList className="text-4xl text-[#BCC990]" />
                    </div>
                    <p className="text-gray-600 text-xl font-semibold mb-2">
                      Aún no hay seguimientos de adopciones
                    </p>
                    <p className="text-gray-400 max-w-sm mx-auto">
                      Cuando las familias compartan avances, los verás aquí con sus métricas principales.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Filtros y búsqueda */}
                    <FollowUpFilters
                      followUps={followUps}
                      activeFilters={foundationFilters}
                      onFilterChange={setFoundationFilters}
                      stats={stats}
                    />

                    {/* Barra de herramientas con selector de vista */}
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm text-gray-600">
                        Mostrando <span className="font-semibold text-gray-800">{filteredFollowUps.length}</span> de {followUps.length} seguimientos
                      </p>
                      <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
                        <button
                          onClick={() => setViewMode('grid')}
                          className={`p-2 rounded transition-all ${viewMode === 'grid' ? 'bg-[#BCC990] text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                          title="Vista de cuadrícula"
                        >
                          <FaThLarge size={14} />
                        </button>
                        <button
                          onClick={() => setViewMode('list')}
                          className={`p-2 rounded transition-all ${viewMode === 'list' ? 'bg-[#BCC990] text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                          title="Vista de lista"
                        >
                          <FaList size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Lista vacía después de filtrar */}
                    {filteredFollowUps.length === 0 && (
                      <div className="text-center py-12 px-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="mx-auto mb-4 h-14 w-14 flex items-center justify-center rounded-full bg-gray-100">
                          <FaClipboardList className="text-2xl text-gray-400" />
                        </div>
                        <p className="text-gray-600 font-semibold mb-2">
                          No se encontraron seguimientos
                        </p>
                        <p className="text-gray-400 text-sm max-w-xs mx-auto">
                          Intenta ajustar los filtros o buscar con otros términos.
                        </p>
                      </div>
                    )}

                    {/* Grid de seguimientos */}
                    <AnimatePresence mode="popLayout">
                      <motion.div
                        layout
                        className={viewMode === 'grid' 
                          ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'
                          : 'flex flex-col gap-4'
                        }
                      >
                        {filteredFollowUps.map((followUp, index) => (
                          <motion.div
                            key={followUp.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: Math.min(index * 0.05, 0.3) }}
                          >
                            <FollowUpCardFoundation
                              followUp={followUp}
                              onViewDetail={setSelectedFollowUp}
                              onMarkReviewed={handleMarkReviewed}
                            />
                          </motion.div>
                        ))}
                      </motion.div>
                    </AnimatePresence>
                  </>
                )}
              </>
            )}

            {/* Visitas de fundación */}
            {activeTab === 'visits' && (
              <>
                {visits.length === 0 ? (
                  <div className="text-center py-16 px-6 bg-gradient-to-br from-white via-white to-[#f5f1e4] rounded-2xl border border-[#e9e3d2] shadow-sm">
                    <div className="mx-auto mb-6 h-16 w-16 flex items-center justify-center rounded-full bg-purple-100">
                      <FaCalendarAlt className="text-4xl text-purple-500" />
                    </div>
                    <p className="text-gray-600 text-xl font-semibold mb-2">
                      No hay visitas programadas
                    </p>
                    <p className="text-gray-400 max-w-sm mx-auto">
                      Programa visitas desde el tab "Adopciones" para verificar el bienestar de las mascotas.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {visits.map((visit, index) => (
                      <motion.div
                        key={visit.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <VisitCard
                          visit={visit}
                          isFoundation={true}
                          onComplete={handleCompleteVisit}
                          onCancel={handleCancelVisit}
                          onApproveReschedule={handleApproveReschedule}
                          onReschedule={handleRescheduleVisit}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Modal de seguimiento */}
      {selectedFollowUp && (
        <FollowUpModal
          followUp={selectedFollowUp}
          onClose={() => setSelectedFollowUp(null)}
          isFoundation={isFoundation?.()}
          onAddFeedback={isFoundation?.() ? handleAddFeedback : null}
        />
      )}

      {/* Modal de programar visita (fundación) */}
      {showVisitModal && selectedPetForVisit && (
        <ScheduleVisitModal
          adoption={selectedPetForVisit}
          onClose={() => {
            setShowVisitModal(false);
            setSelectedPetForVisit(null);
          }}
          onSchedule={handleScheduleVisit}
        />
      )}

      {/* Toast */}
      <Toast
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
        message={toast.message}
        type={toast.type}
      />

      {/* Modal de confirmación */}
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
      />
    </div>
  );
}
