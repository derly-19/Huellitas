import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Perritos from "./pages/Dogs"; 
import Footer from "./components/Footer";
import HeroCats from "./pages/Cats";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Dogs" element={<Perritos />} />
        <Route path="/Cats" element={<HeroCats />} />
      </Routes>
      <Footer />
    </>
  );
}
