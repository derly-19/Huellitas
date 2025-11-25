import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AdoptionProvider } from "./contexts/AdoptionContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Perritos from "./pages/Dogs"; 
import Footer from "./components/Footer";
import HeroCats from "./pages/Cats";
import Login from "./pages/Login";
import Register from "./pages/Register"; 
import RegisterFoundation from "./pages/RegisterFoundation";
import Fundaciones from "./pages/Fundaciones";
import Formulario from "./pages/Formulario";
import Carnet from "./pages/Carnet";
import FoundationDashboard from "./pages/FoundationDashboard";

function AppContent() {
  const location = useLocation();

  // rutas donde no quieres mostrar navbar/footer
  // Normalizamos pathname: quitamos una barra final (si existe) y pasamos a minúsculas
  const normalizedPath = location.pathname.replace(/\/$/, "").toLowerCase();
  const hideLayout = ["/login", "/register", "/register-foundation", "/foundation/dashboard"].includes(normalizedPath);


  return (
    <div className="flex flex-col min-h-screen">
      {!hideLayout && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Dogs" element={<Perritos />} />
          <Route path="/Cats" element={<HeroCats />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/register-foundation" element={<RegisterFoundation />} />
          <Route path="/Fundaciones" element={<Fundaciones />} />
          <Route path="/formulario" element={<Formulario />} />
          <Route path="/formulario/:petId" element={<Formulario />} />
          <Route path="/carnet" element={<Carnet />} />
          <Route path="/carnet/:petId" element={<Carnet />} />
          <Route path="/foundation/dashboard" element={<FoundationDashboard />} />
        </Routes>
      </main>
      {!hideLayout && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AdoptionProvider>
        <AppContent />
      </AdoptionProvider>
    </AuthProvider>
  );
}
