import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ Para Vite/React
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, HeartHandshake, Dog, Cat, FileText, User, Building2, LayoutDashboard } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, isFoundation, user, logout } = useAuth();
  const navigate = useNavigate();
  const [hasAdoptedPet, setHasAdoptedPet] = useState(false);

  // Verificar si el usuario ha adoptado una mascota
  useEffect(() => {
    if (isAuthenticated() && !isFoundation()) {
      const hasAdopted = localStorage.getItem('hasAdoptedPet') === 'true';
      setHasAdoptedPet(hasAdopted);
    } else {
      setHasAdoptedPet(false);
    }
  }, [isAuthenticated, isFoundation, user]);

  // ✅ Links para usuarios no autenticados (público)
  const publicLinks = [
    { name: "Inicio", path: "/", icon: <Home size={18} /> },
    { name: "Perritos", path: "/Dogs", icon: <Dog size={18} /> },
    { name: "Gatitos", path: "/cats", icon: <Cat size={18} /> },
    { name: "Fundaciones", path: "/fundaciones", icon: <HeartHandshake size={18} /> },
  ];

  // ✅ Links para usuarios autenticados normales (sin carnet por defecto)
  const baseAuthenticatedLinks = [
    { name: "Inicio", path: "/", icon: <Home size={18} /> },
    { name: "Adopción", path: "/Dogs", icon: <HeartHandshake size={18} /> },
    { name: "Perfil", path: "/perfil", icon: <User size={18} /> },
  ];

  // Si el usuario ha adoptado una mascota, agregar el link de Carnet
  const authenticatedLinks = hasAdoptedPet
    ? [
        { name: "Inicio", path: "/", icon: <Home size={18} /> },
        { name: "Carnet", path: "/carnet", icon: <FileText size={18} /> },
        { name: "Adopción", path: "/Dogs", icon: <HeartHandshake size={18} /> },
        { name: "Perfil", path: "/perfil", icon: <User size={18} /> },
      ]
    : baseAuthenticatedLinks;

  // ✅ Links para fundaciones
  const foundationLinks = [
    { name: "Dashboard", path: "/foundation/dashboard", icon: <LayoutDashboard size={18} /> },
  ];

  // Usar los links apropiados según el estado de autenticación
  const links = isAuthenticated() 
    ? (isFoundation() ? foundationLinks : authenticatedLinks) 
    : publicLinks;

  // Manejar logout
  const handleLogout = () => {
    logout();
    navigate('/');
    setOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-4 bg-[var(--primary)] text-[var(--secondary)] shadow z-50">
      {/* Logo */}
      <motion.div
        className="flex items-center gap-2"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <img src="/logo.png" alt="logo" className="w-10 h-10" />
        <h1 className="font-bold text-lg">Huellitas</h1>
      </motion.div>

      {/* Links en desktop */}
      <ul className="hidden md:flex gap-6 font-medium">
        {links.map((link) => (
          <motion.li
            key={link.path}
            whileHover={{ scale: 1.1, color: "#fff" }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2"
          >
            {link.icon}
            <Link to={link.path}>{link.name}</Link>
          </motion.li>
        ))}
      </ul>

      {/* Botones en desktop */}
      <div className="hidden md:flex gap-3 items-center">
        {isAuthenticated() ? (
          // Usuario autenticado - mostrar saludo y logout
          <>
            {/* Campana de notificaciones (solo para usuarios normales) */}
            {!isFoundation() && <NotificationBell />}
            
            <div className="flex items-center gap-3">
              <span className="text-[var(--secondary)]">
                {isFoundation() 
                  ? `🏠 ${user?.foundation_name || user?.username}` 
                  : `¡Hola, ${user?.username || 'Usuario'}! 👋`
                }
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                onClick={handleLogout}
              >
                Cerrar Sesión
              </motion.button>
            </div>
          </>
        ) : (
          // Usuario no autenticado - mostrar login y register
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-white text-[var(--secondary)] px-4 py-1 rounded hover:bg-gray-100"
            >
              <Link to="/login">Sign in</Link>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-[var(--secondary)] text-white px-4 py-1 rounded hover:bg-opacity-90"
            >
              <Link to="/register">Register</Link>
            </motion.button>
          </>
        )}
      </div>

      {/* Botón menú móvil */}
      <button
        className="md:hidden text-[var(--secondary)]"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Menú desplegable móvil */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute top-full left-0 w-full bg-[var(--primary)] flex flex-col items-center py-6 gap-4 z-50 shadow-lg md:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {(isAuthenticated() ? authenticatedLinks : publicLinks).map((link) => (
              <motion.div
                key={link.path}
                whileHover={{ scale: 1.1, color: "#fff" }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 text-lg font-medium"
              >
                {link.icon}
                <Link to={link.path} onClick={() => setOpen(false)}>
                  {link.name}
                </Link>
              </motion.div>
            ))}

            <div className="flex flex-col gap-3 mt-4">
              {isAuthenticated() ? (
                <>
                  <div className="text-center text-white font-medium">
                    {isFoundation() 
                      ? `🏠 ${user?.foundation_name || user?.username}` 
                      : `Hola, ${user?.username || 'Usuario'}!`
                    }
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 text-center"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="bg-white text-[var(--secondary)] px-4 py-1 rounded hover:bg-gray-100 text-center"
                    onClick={() => setOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="bg-[var(--secondary)] text-white px-4 py-1 rounded hover:bg-opacity-90 text-center"
                    onClick={() => setOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
