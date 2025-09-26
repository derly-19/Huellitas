import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Perritos from "./pages/Dogs"; 
import Footer from "./components/Footer";
import HeroCats from "./pages/Cats";
import Login from "./pages/Login";
import Register from "./pages/Register"; 
import Fundaciones from "./pages/Fundaciones";
import Formulario from "./pages/Formulario";
import Carnet from "./pages/Carnet";

export default function App() {
  const location = useLocation();

  // rutas donde no quieres mostrar navbar/footer
  // Normalizamos pathname: quitamos una barra final (si existe) y pasamos a minúsculas
  const normalizedPath = location.pathname.replace(/\/$/, "").toLowerCase();
  const hideLayout = ["/login", "/register"].includes(normalizedPath);


  return (
    <>
      {!hideLayout && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Dogs" element={<Perritos />} />
        <Route path="/Cats" element={<HeroCats />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Fundaciones" element={<Fundaciones />} />
        <Route path="/formulario" element={<Formulario />} />
        <Route path="/carnet" element={<Carnet />} />
      </Routes>
      {!hideLayout && <Footer />}
    </>
  );
}
