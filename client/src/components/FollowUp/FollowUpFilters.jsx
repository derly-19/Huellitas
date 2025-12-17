import { useState, useMemo } from 'react';
import { FaSearch, FaFilter, FaTimes, FaSortAmountDown, FaSortAmountUp, FaCheckCircle, FaClock, FaExclamationTriangle, FaHeart } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function FollowUpFilters({ followUps, onFilterChange, activeFilters, stats }) {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest', 'oldest'

  // Calcular conteos para los filtros
  const filterCounts = useMemo(() => {
    return {
      all: followUps.length,
      pending: followUps.filter(f => !f.reviewed).length,
      reviewed: followUps.filter(f => f.reviewed).length,
      withProblems: followUps.filter(f => f.problems_encountered && f.problems_encountered.trim()).length,
      excellentHealth: followUps.filter(f => f.health_status === 'excelente').length,
      adapted: followUps.filter(f => f.behavior_status === 'adaptado').length
    };
  }, [followUps]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    onFilterChange({ ...activeFilters, search: term });
  };

  const handleFilterClick = (filterType) => {
    const newFilters = { ...activeFilters };
    
    if (activeFilters.type === filterType) {
      newFilters.type = 'all';
    } else {
      newFilters.type = filterType;
    }
    
    onFilterChange(newFilters);
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
    onFilterChange({ ...activeFilters, sort: order });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSortOrder('newest');
    onFilterChange({ type: 'all', search: '', sort: 'newest' });
  };

  const hasActiveFilters = activeFilters.type !== 'all' || searchTerm.length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
      {/* Barra de búsqueda y controles principales */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Búsqueda */}
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar por mascota o adoptante..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BCC990] focus:border-transparent text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <FaTimes size={14} />
            </button>
          )}
        </div>

        {/* Botón de filtros */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
            showFilters || hasActiveFilters
              ? 'bg-[#BCC990] text-white border-[#BCC990]'
              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <FaFilter size={14} />
          <span className="font-medium text-sm">Filtros</span>
          {hasActiveFilters && (
            <span className="bg-white/20 text-white text-xs px-1.5 py-0.5 rounded-full">
              {(activeFilters.type !== 'all' ? 1 : 0) + (searchTerm ? 1 : 0)}
            </span>
          )}
        </button>

        {/* Ordenar */}
        <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3">
          <span className="text-xs text-gray-500">Ordenar:</span>
          <button
            onClick={() => handleSortChange(sortOrder === 'newest' ? 'oldest' : 'newest')}
            className="flex items-center gap-1 py-2 text-gray-700 hover:text-[#BCC990] transition text-sm font-medium"
          >
            {sortOrder === 'newest' ? (
              <>
                <FaSortAmountDown size={14} /> Recientes
              </>
            ) : (
              <>
                <FaSortAmountUp size={14} /> Antiguos
              </>
            )}
          </button>
        </div>
      </div>

      {/* Panel de filtros expandible */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-4 border-t border-gray-100">
              {/* Filtros rápidos */}
              <div className="flex flex-wrap gap-2">
                <FilterChip
                  label="Todos"
                  count={filterCounts.all}
                  active={activeFilters.type === 'all'}
                  onClick={() => handleFilterClick('all')}
                  icon={<FaHeart className="text-gray-400" />}
                />
                <FilterChip
                  label="Pendientes"
                  count={filterCounts.pending}
                  active={activeFilters.type === 'pending'}
                  onClick={() => handleFilterClick('pending')}
                  icon={<FaClock className="text-orange-500" />}
                  highlight={filterCounts.pending > 0}
                />
                <FilterChip
                  label="Revisados"
                  count={filterCounts.reviewed}
                  active={activeFilters.type === 'reviewed'}
                  onClick={() => handleFilterClick('reviewed')}
                  icon={<FaCheckCircle className="text-emerald-500" />}
                />
                <FilterChip
                  label="Con problemas"
                  count={filterCounts.withProblems}
                  active={activeFilters.type === 'withProblems'}
                  onClick={() => handleFilterClick('withProblems')}
                  icon={<FaExclamationTriangle className="text-red-500" />}
                  alert={filterCounts.withProblems > 0}
                />
                <FilterChip
                  label="Salud excelente"
                  count={filterCounts.excellentHealth}
                  active={activeFilters.type === 'excellentHealth'}
                  onClick={() => handleFilterClick('excellentHealth')}
                  icon={<span className="text-sm">✨</span>}
                />
                <FilterChip
                  label="Bien adaptados"
                  count={filterCounts.adapted}
                  active={activeFilters.type === 'adapted'}
                  onClick={() => handleFilterClick('adapted')}
                  icon={<span className="text-sm">😊</span>}
                />
              </div>

              {/* Limpiar filtros */}
              {hasActiveFilters && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                  >
                    <FaTimes size={12} /> Limpiar filtros
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indicador de filtros activos */}
      {hasActiveFilters && !showFilters && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Filtros activos:</span>
            {activeFilters.type !== 'all' && (
              <span className="bg-[#BCC990]/20 text-[#7a8c54] px-2 py-0.5 rounded-full text-xs font-medium">
                {activeFilters.type === 'pending' && 'Pendientes'}
                {activeFilters.type === 'reviewed' && 'Revisados'}
                {activeFilters.type === 'withProblems' && 'Con problemas'}
                {activeFilters.type === 'excellentHealth' && 'Salud excelente'}
                {activeFilters.type === 'adapted' && 'Bien adaptados'}
              </span>
            )}
            {searchTerm && (
              <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-xs font-medium">
                "{searchTerm}"
              </span>
            )}
          </div>
          <button
            onClick={clearFilters}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Limpiar
          </button>
        </div>
      )}
    </div>
  );
}

// Componente de chip para filtros
function FilterChip({ label, count, active, onClick, icon, highlight = false, alert = false }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
        active
          ? 'bg-[#BCC990] text-white shadow-sm'
          : alert
          ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
          : highlight
          ? 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200'
          : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
      }`}
    >
      {icon}
      <span>{label}</span>
      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
        active 
          ? 'bg-white/20 text-white' 
          : alert
          ? 'bg-red-200 text-red-800'
          : highlight
          ? 'bg-orange-200 text-orange-800'
          : 'bg-gray-200 text-gray-600'
      }`}>
        {count}
      </span>
    </button>
  );
}
