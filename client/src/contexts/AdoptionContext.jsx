import { createContext, useContext, useState } from 'react';

// Crear el contexto
const AdoptionContext = createContext();

// Hook personalizado para usar el contexto
export const useAdoption = () => {
  const context = useContext(AdoptionContext);
  if (!context) {
    throw new Error('useAdoption debe ser usado dentro de AdoptionProvider');
  }
  return context;
};

// Proveedor del contexto
export const AdoptionProvider = ({ children }) => {
  const [adoptionIntent, setAdoptionIntent] = useState(null);

  // Función para guardar la intención de adopción
  const saveAdoptionIntent = (pet) => {
    const intentData = {
      petId: pet.id,
      petName: pet.name,
      petImg: pet.img,
      petDescription: pet.description,
      timestamp: new Date().toISOString()
    };
    
    // Guardar en sessionStorage para persistencia entre páginas
    sessionStorage.setItem('adoptionIntent', JSON.stringify(intentData));
    setAdoptionIntent(intentData);
    
    console.log('Intención de adopción guardada:', intentData);
  };

  // Función para obtener la intención de adopción guardada
  const getAdoptionIntent = () => {
    if (adoptionIntent) {
      return adoptionIntent;
    }
    
    // Intentar recuperar desde sessionStorage
    const savedIntent = sessionStorage.getItem('adoptionIntent');
    if (savedIntent) {
      try {
        const intentData = JSON.parse(savedIntent);
        setAdoptionIntent(intentData);
        return intentData;
      } catch (error) {
        console.error('Error parsing adoption intent:', error);
        sessionStorage.removeItem('adoptionIntent');
      }
    }
    
    return null;
  };

  // Función para limpiar la intención de adopción
  const clearAdoptionIntent = () => {
    sessionStorage.removeItem('adoptionIntent');
    setAdoptionIntent(null);
    console.log('Intención de adopción limpiada');
  };

  // Función para verificar si hay una intención pendiente
  const hasAdoptionIntent = () => {
    return !!getAdoptionIntent();
  };

  const value = {
    adoptionIntent,
    saveAdoptionIntent,
    getAdoptionIntent,
    clearAdoptionIntent,
    hasAdoptionIntent
  };

  return (
    <AdoptionContext.Provider value={value}>
      {children}
    </AdoptionContext.Provider>
  );
};