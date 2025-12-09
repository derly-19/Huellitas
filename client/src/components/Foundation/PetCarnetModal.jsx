import { useState, useEffect } from "react";

const PetCarnetModal = ({ pet, onClose }) => {
  const [carnetData, setCarnetData] = useState({
    vacunas: [],
    desparasitaciones: [],
    banos: [],
    procedimientos: [],
    medicamentos: []
  });
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('solicitudes');
  const [showAddModal, setShowAddModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchCarnetData();
    fetchAdoptionRequests();
  }, [pet.id]);

  const fetchAdoptionRequests = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/adoption-requests/pet/${pet.id}`);
      const result = await response.json();
      
      if (result.success) {
        setAdoptionRequests(result.data || []);
      }
    } catch (error) {
      console.error('Error al cargar solicitudes:', error);
    }
  };

  const fetchCarnetData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/api/carnet/${pet.id}`);
      const result = await response.json();
      
      if (result.success) {
        setCarnetData({
          vacunas: result.data.vacunas || [],
          desparasitaciones: result.data.desparasitaciones || [],
          banos: result.data.banos || [],
          procedimientos: result.data.procedimientos || [],
          medicamentos: result.data.medicamentos || []
        });
      }
    } catch (error) {
      console.error('Error al cargar carnet:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (recordId, tipo) => {
    if (!confirm('¿Estás seguro de eliminar este registro?')) return;

    try {
      const response = await fetch(`http://localhost:4000/api/carnet/${pet.id}/${tipo}/${recordId}`, {
        method: 'DELETE'
      });
      const result = await response.json();

      if (result.success) {
        fetchCarnetData();
      } else {
        alert('Error al eliminar el registro');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar el registro');
    }
  };

  const handleUpdateRequestStatus = async (requestId, newStatus) => {
    if (!confirm(`¿Cambiar estado a "${newStatus}"?`)) return;

    setUpdatingStatus(true);
    try {
      const response = await fetch(`http://localhost:4000/api/adoption-requests/${requestId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      const result = await response.json();

      if (result.success) {
        await fetchAdoptionRequests();
      } else {
        alert('Error al actualizar el estado');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar el estado');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const tabs = [
    { id: 'solicitudes', label: 'Solicitudes', emoji: '📋', color: 'orange' },
    { id: 'vacunas', label: 'Vacunas', emoji: '💉', color: 'blue' },
    { id: 'desparasitaciones', label: 'Desparasitaciones', emoji: '🐛', color: 'green' },
    { id: 'banos', label: 'Baños', emoji: '🛁', color: 'purple' },
    { id: 'procedimientos', label: 'Procedimientos', emoji: '⚕️', color: 'red' },
    { id: 'medicamentos', label: 'Medicamentos', emoji: '💊', color: 'pink' }
  ];

  const currentTab = tabs.find(t => t.id === activeTab);

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const renderRecords = () => {
    // Caso especial para solicitudes de adopción
    if (activeTab === 'solicitudes') {
      if (adoptionRequests.length === 0) {
        return (
          <div className="text-center py-12">
            <div className="text-6xl mx-auto mb-4">📋</div>
            <p className="text-gray-500">No hay solicitudes de adopción para esta mascota</p>
          </div>
        );
      }

      return (
        <div className="space-y-4">
          {adoptionRequests.map((request) => {
            const statusConfig = {
              pending: { label: 'Pendiente', color: 'yellow', emoji: '⏳' },
              contacted: { label: 'Contactado', color: 'blue', emoji: '📞' },
              rejected: { label: 'Rechazada', color: 'red', emoji: '❌' },
              approved: { label: 'Aprobada', color: 'green', emoji: '✅' }
            };
            const config = statusConfig[request.status] || statusConfig.pending;

            return (
              <div key={request.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold text-gray-800">{request.user_name}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${config.color}-100 text-${config.color}-800`}>
                        {config.emoji} {config.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Email:</span>
                        <p className="font-medium">{request.user_email}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Teléfono:</span>
                        <p className="font-medium">{request.phone || 'No proporcionado'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Fecha de solicitud:</span>
                        <p className="font-medium">{formatDate(request.created_at)}</p>
                      </div>
                    </div>
                    {request.message && (
                      <div className="mt-3 pt-3 border-t">
                        <span className="text-gray-500 text-sm">Mensaje:</span>
                        <p className="text-gray-700 mt-1">{request.message}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Botones de estado */}
                <div className="flex gap-2 flex-wrap pt-3 border-t">
                  <button
                    onClick={() => handleUpdateRequestStatus(request.id, 'pending')}
                    disabled={request.status === 'pending' || updatingStatus}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      request.status === 'pending'
                        ? 'bg-yellow-500 text-white ring-2 ring-yellow-300'
                        : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 disabled:opacity-50'
                    }`}
                  >
                    ⏳ Pendiente
                  </button>
                  <button
                    onClick={() => handleUpdateRequestStatus(request.id, 'contacted')}
                    disabled={request.status === 'contacted' || updatingStatus}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      request.status === 'contacted'
                        ? 'bg-blue-500 text-white ring-2 ring-blue-300'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50'
                    }`}
                  >
                    📞 Contactado
                  </button>
                  <button
                    onClick={() => handleUpdateRequestStatus(request.id, 'rejected')}
                    disabled={request.status === 'rejected' || updatingStatus}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      request.status === 'rejected'
                        ? 'bg-red-500 text-white ring-2 ring-red-300'
                        : 'bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50'
                    }`}
                  >
                    ❌ Rechazada
                  </button>
                  <button
                    onClick={() => handleUpdateRequestStatus(request.id, 'approved')}
                    disabled={request.status === 'approved' || updatingStatus}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      request.status === 'approved'
                        ? 'bg-green-500 text-white ring-2 ring-green-300'
                        : 'bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50'
                    }`}
                  >
                    ✅ Aprobada
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    // Caso normal para registros médicos
    const records = carnetData[activeTab] || [];
    
    if (records.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-6xl mx-auto mb-4">
            {currentTab.emoji}
          </div>
          <p className="text-gray-500">No hay registros de {currentTab.label.toLowerCase()}</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 px-4 py-2 bg-[#BCC990] text-white rounded-lg hover:bg-[#9FB36F] transition-colors flex items-center gap-2 mx-auto"
          >
            <span>➕</span>
            Agregar {currentTab.label}
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {records.map((record) => (
          <div key={record.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-bold text-gray-800 mb-2">
                  {record.nombre_vacuna || record.producto || record.tipo || record.medicamento || 'Registro'}
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Fecha:</span>
                    <p className="font-medium">{formatDate(record.fecha_aplicacion || record.fecha || record.fecha_inicio)}</p>
                  </div>
                  {record.proxima_dosis && (
                    <div>
                      <span className="text-gray-500">Próxima dosis:</span>
                      <p className="font-medium">{formatDate(record.proxima_dosis)}</p>
                    </div>
                  )}
                  {record.veterinario && (
                    <div>
                      <span className="text-gray-500">Veterinario:</span>
                      <p className="font-medium">{record.veterinario}</p>
                    </div>
                  )}
                  {record.lote && (
                    <div>
                      <span className="text-gray-500">Lote:</span>
                      <p className="font-medium">{record.lote}</p>
                    </div>
                  )}
                  {record.dosis && (
                    <div>
                      <span className="text-gray-500">Dosis:</span>
                      <p className="font-medium">{record.dosis}</p>
                    </div>
                  )}
                  {record.duracion && (
                    <div>
                      <span className="text-gray-500">Duración:</span>
                      <p className="font-medium">{record.duracion}</p>
                    </div>
                  )}
                  {record.fecha_fin && (
                    <div>
                      <span className="text-gray-500">Fecha fin:</span>
                      <p className="font-medium">{formatDate(record.fecha_fin)}</p>
                    </div>
                  )}
                  {record.descripcion && (
                    <div className="col-span-2">
                      <span className="text-gray-500">Descripción:</span>
                      <p className="font-medium">{record.descripcion}</p>
                    </div>
                  )}
                  {record.observaciones && (
                    <div className="col-span-2">
                      <span className="text-gray-500">Observaciones:</span>
                      <p className="text-gray-600">{record.observaciones}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleDelete(record.id, activeTab)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <span className="text-lg">🗑️</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#BCC990] p-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <img 
                src={pet.img?.startsWith('http') ? pet.img : `http://localhost:4000${pet.img}`}
                alt={pet.name}
                className="w-16 h-16 object-cover rounded-lg"
                onError={(e) => { e.target.src = '/public/icon.png'; }}
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Carnet Digital</h2>
                <p className="text-gray-700">{pet.name}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    isActive 
                      ? 'border-[#BCC990] text-[#BCC990] font-medium' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className="text-xl">{tab.emoji}</span>
                  {tab.label}
                  {tab.id === 'solicitudes' ? (
                    adoptionRequests.length > 0 && (
                      <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                        {adoptionRequests.length}
                      </span>
                    )
                  ) : (
                    carnetData[tab.id]?.length > 0 && (
                      <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                        {carnetData[tab.id].length}
                      </span>
                    )
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BCC990] mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando información...</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="text-2xl">{currentTab.emoji}</span>
                  {currentTab.label}
                </h3>
                {carnetData[activeTab]?.length > 0 && (
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-4 py-2 bg-[#BCC990] text-white rounded-lg hover:bg-[#9FB36F] transition-colors flex items-center gap-2"
                  >
                    <span>➕</span>
                    Agregar
                  </button>
                )}
              </div>
              {renderRecords()}
            </>
          )}
        </div>
      </div>

      {/* Modal para agregar registro */}
      {showAddModal && (
        <AddRecordModal
          petId={pet.id}
          tipo={activeTab}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchCarnetData();
          }}
        />
      )}
    </div>
  );
};

// Modal para agregar nuevo registro
const AddRecordModal = ({ petId, tipo, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0]
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`http://localhost:4000/api/carnet/${petId}/${tipo}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        onSuccess();
      } else {
        alert(result.message || 'Error al guardar el registro');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar el registro');
    } finally {
      setSaving(false);
    }
  };

  const renderFields = () => {
    switch (tipo) {
      case 'vacunas':
        return (
          <>
            <input
              type="text"
              placeholder="Nombre de la vacuna *"
              value={formData.nombre_vacuna || ''}
              onChange={(e) => setFormData({ ...formData, nombre_vacuna: e.target.value })}
              className="w-full p-3 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Lote"
              value={formData.lote || ''}
              onChange={(e) => setFormData({ ...formData, lote: e.target.value })}
              className="w-full p-3 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Veterinario"
              value={formData.veterinario || ''}
              onChange={(e) => setFormData({ ...formData, veterinario: e.target.value })}
              className="w-full p-3 border rounded-lg"
            />
            <input
              type="date"
              placeholder="Próxima dosis"
              value={formData.proxima_dosis || ''}
              onChange={(e) => setFormData({ ...formData, proxima_dosis: e.target.value })}
              className="w-full p-3 border rounded-lg"
            />
          </>
        );
      case 'desparasitaciones':
        return (
          <>
            <input
              type="text"
              placeholder="Producto usado *"
              value={formData.producto || ''}
              onChange={(e) => setFormData({ ...formData, producto: e.target.value })}
              className="w-full p-3 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Dosis"
              value={formData.dosis || ''}
              onChange={(e) => setFormData({ ...formData, dosis: e.target.value })}
              className="w-full p-3 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Veterinario"
              value={formData.veterinario || ''}
              onChange={(e) => setFormData({ ...formData, veterinario: e.target.value })}
              className="w-full p-3 border rounded-lg"
            />
            <input
              type="date"
              placeholder="Próxima dosis"
              value={formData.proxima_dosis || ''}
              onChange={(e) => setFormData({ ...formData, proxima_dosis: e.target.value })}
              className="w-full p-3 border rounded-lg"
            />
          </>
        );
      case 'banos':
        return (
          <>
            <input
              type="text"
              placeholder="Producto usado"
              value={formData.producto || ''}
              onChange={(e) => setFormData({ ...formData, producto: e.target.value })}
              className="w-full p-3 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Responsable"
              value={formData.responsable || ''}
              onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
              className="w-full p-3 border rounded-lg"
            />
          </>
        );
      case 'procedimientos':
        return (
          <>
            <input
              type="text"
              placeholder="Tipo de procedimiento *"
              value={formData.tipo || ''}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
              className="w-full p-3 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Veterinario"
              value={formData.veterinario || ''}
              onChange={(e) => setFormData({ ...formData, veterinario: e.target.value })}
              className="w-full p-3 border rounded-lg"
            />
            <textarea
              placeholder="Descripción"
              value={formData.descripcion || ''}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className="w-full p-3 border rounded-lg"
              rows={3}
            />
          </>
        );
      case 'medicamentos':
        return (
          <>
            <input
              type="text"
              placeholder="Nombre del medicamento *"
              value={formData.medicamento || ''}
              onChange={(e) => setFormData({ ...formData, medicamento: e.target.value })}
              className="w-full p-3 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Dosis"
              value={formData.dosis || ''}
              onChange={(e) => setFormData({ ...formData, dosis: e.target.value })}
              className="w-full p-3 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Duración (ej: 7 días)"
              value={formData.duracion || ''}
              onChange={(e) => setFormData({ ...formData, duracion: e.target.value })}
              className="w-full p-3 border rounded-lg"
            />
            <input
              type="date"
              placeholder="Fecha fin"
              value={formData.fecha_fin || ''}
              onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })}
              className="w-full p-3 border rounded-lg"
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        <div className="p-6 border-b">
          <h3 className="text-xl font-bold text-gray-800">Agregar {tipo}</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha {tipo === 'medicamentos' ? 'de inicio' : 'de aplicación'}
            </label>
            <input
              type="date"
              value={formData.fecha}
              onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>

          {renderFields()}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Observaciones adicionales</label>
            <textarea
              value={formData.observaciones || ''}
              onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
              placeholder="Información adicional..."
              className="w-full p-3 border rounded-lg"
              rows={3}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-[#BCC990] text-white rounded-lg hover:bg-[#9FB36F] disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PetCarnetModal;
