// eslint-disable-next-line no-unused-vars
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { useAdoption } from "../contexts/AdoptionContext";
import Hero from "../components/Hero";
import AdoptionSection from "../components/AdoptionSection";
import InfoSection from "../components/InfoSection";
import CallToAction from "../components/CallToAction";
import AdoptionNotification from "../components/AdoptionNotification";
import g1 from "../assets/g1.jpg";
import g2 from "../assets/g2.jpg";
import g3 from "../assets/g3.jpg";
import p1 from "../assets/p1.jpg";
import p2 from "../assets/p2.jpg";
import p3 from "../assets/p3.jpg";

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { saveAdoptionIntent } = useAdoption();
  const [selectedPet, setSelectedPet] = useState(null);
  const [showAdoptionNotification, setShowAdoptionNotification] = useState(false);
  const [pendingAdoption, setPendingAdoption] = useState(null);

  // Función para manejar la adopción
  const handleAdopt = (pet) => {
    if (isAuthenticated()) {
      // Si está autenticado, ir directamente al formulario
      navigate(`/formulario/${pet.id}`);
    } else {
      // Si NO está autenticado, mostrar notificación personalizada
      setPendingAdoption(pet);
      setShowAdoptionNotification(true);
    }
  };

  // Función para manejar el login desde la notificación
  const handleLoginFromNotification = () => {
    if (pendingAdoption) {
      saveAdoptionIntent({
        id: pendingAdoption.id,
        name: pendingAdoption.name,
        img: pendingAdoption.img,
        description: pendingAdoption.description,
        type: pendingAdoption.type
      });
    }
    setShowAdoptionNotification(false);
    navigate("/login");
  };

  // Función para manejar el registro desde la notificación
  const handleRegisterFromNotification = () => {
    if (pendingAdoption) {
      saveAdoptionIntent({
        id: pendingAdoption.id,
        name: pendingAdoption.name,
        img: pendingAdoption.img,
        description: pendingAdoption.description,
        type: pendingAdoption.type
      });
    }
    setShowAdoptionNotification(false);
    navigate("/register");
  };

  const cats = [
    { 
      id: 'cat_1', 
      name: "Bella", 
      img: g1, 
      description: "Una gatita muy cariñosa y tranquila, perfecta para familias.",
      type: 'cat',
      edad: "2 años",
      sexo: "Hembra",
      fundacion: "Fundación Huellitas",
      historial: "Bella fue rescatada de las calles cuando era muy pequeña. Estaba muy asustada pero con mucho amor y paciencia logró confiar nuevamente en los humanos."
    },
    { 
      id: 'cat_2', 
      name: "Luna", 
      img: g2, 
      description: "Gatita juguetona que ama explorar y recibir mimos.",
      type: 'cat',
      edad: "1 año",
      sexo: "Hembra", 
      fundacion: "Fundación Huellitas",
      historial: "Luna llegó a nosotros junto con su hermano cuando su mamá los abandonó. Es muy curiosa y le encanta jugar con todo lo que encuentra."
    },
    { 
      id: 'cat_3', 
      name: "Milo", 
      img: g3, 
      description: "Un gatito muy activo y sociable, ideal para hogares con niños.",
      type: 'cat',
      edad: "6 meses",
      sexo: "Macho",
      fundacion: "Fundación Huellitas", 
      historial: "Milo es un pequeño luchador. Fue encontrado herido en un parque, pero después de recibir atención médica se recuperó completamente y ahora es el más travieso del refugio."
    },
  ];

  const dogs = [
    { 
      id: 'dog_1', 
      name: "Rocky", 
      img: p1, 
      description: "Perrito muy leal y protector, perfecto compañero para toda la familia.",
      type: 'dog',
      edad: "3 años",
      sexo: "Macho",
      fundacion: "Fundación Huellitas",
      historial: "Rocky fue abandonado en la puerta del refugio cuando era cachorro. A pesar de esto, nunca perdió su fe en los humanos y siempre está dispuesto a dar amor."
    },
    { 
      id: 'dog_2', 
      name: "Máximo", 
      img: p2, 
      description: "Un perro muy inteligente y obediente, fácil de entrenar.",
      type: 'dog',
      edad: "2 años",
      sexo: "Macho",
      fundacion: "Fundación Huellitas",
      historial: "Máximo llegó al refugio después de que su familia anterior se mudara y no pudiera llevárselo. Es muy inteligente y ya conoce varios comandos básicos."
    },
    { 
      id: 'dog_3', 
      name: "Nina", 
      img: p3, 
      description: "Perrita muy dulce y cariñosa, ama los paseos y jugar en el parque.",
      type: 'dog',
      edad: "4 años",
      sexo: "Hembra",
      fundacion: "Fundación Huellitas",
      historial: "Nina fue rescatada de una situación de maltrato. Con mucho amor y rehabilitación, ahora es una perrita feliz que confía plenamente en las personas buenas."
    },
  ];

  return (
    <div className="bg-[#FFFCF4]">
      <Hero />

      {/* Sección de gatos */}
      <div className="mb-20">
        <AdoptionSection 
          title="Gatos en adopción" 
          pets={cats} 
          onAdopt={handleAdopt}
          onCardClick={setSelectedPet}
        />
      </div>

      {/* Sección de perros */}
      <div className="mb-20">
        <AdoptionSection 
          title="Perros en adopción" 
          pets={dogs} 
          onAdopt={handleAdopt}
          onCardClick={setSelectedPet}
        />
      </div>

      {/* Sección informativa */}
      <div className="mb-20">
        <InfoSection />
      </div>

      {/* Call to action */}
      <div className="mb-16">
        <CallToAction />
      </div>

      {/* Modal de información del pet */}
      {selectedPet && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedPet(null)} // Cerrar modal al hacer clic fuera
        >
          <div 
            className="bg-[#FDF8E7] rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 p-6 relative"
            onClick={(e) => e.stopPropagation()} // Evitar que se cierre al hacer clic dentro del modal
          >
            <h2 className="text-2xl font-bold mb-4 text-center">{selectedPet.name}</h2>

            <div className="flex flex-col md:flex-row gap-6 items-center">
              <img
                src={selectedPet.img}
                alt={selectedPet.name}
                className="w-48 h-40 object-cover rounded-lg"
              />
              <div className="flex-1">
                <p className="text-gray-700 mb-4">{selectedPet.description}</p>
                
                {/* Historial de rescate */}
                {selectedPet.historial && (
                  <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
                    <h4 className="font-semibold text-amber-800 mb-2">📖 Historia de rescate</h4>
                    <p className="text-amber-700 text-sm leading-relaxed">{selectedPet.historial}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
              <span><strong>Edad:</strong> {selectedPet.edad}</span>
              <span><strong>Sexo:</strong> {selectedPet.sexo}</span>
              <span><strong>Fundación:</strong> {selectedPet.fundacion}</span>
            </div>

            {/* Botón adoptar */}
            <div className="text-center mt-6">
              <button 
                onClick={() => {
                  setSelectedPet(null);
                  handleAdopt(selectedPet);
                }}
                className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition"
              >
                🐾 Adoptar a {selectedPet.name}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notificación de adopción */}
      <AdoptionNotification
        isVisible={showAdoptionNotification}
        onClose={() => setShowAdoptionNotification(false)}
        petName={pendingAdoption?.name || ""}
        onLogin={handleLoginFromNotification}
        onRegister={handleRegisterFromNotification}
      />
    </div>
  );
}
