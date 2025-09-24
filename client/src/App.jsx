import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Perritos from "./pages/Dogs"; 
import Footer from "./components/Footer";
import HeroCats from "./pages/Cats";
import Login from "./pages/Login"; // tu página de login

export default function App() {
  const location = useLocation();

  // rutas donde no quieres mostrar navbar/footer
  const hideLayout = location.pathname === "/login";  

  return (
    <>
      {!hideLayout && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Dogs" element={<Perritos />} />
        <Route path="/Cats" element={<HeroCats />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      {!hideLayout && <Footer />}
    </>
  );
}
