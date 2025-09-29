//client\src\pages\Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { useAdoption } from "../contexts/AdoptionContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { getAdoptionIntent, clearAdoptionIntent } = useAdoption();
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Manejar el submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await register(formData.username, formData.email, formData.password);

      if (result.success) {
        setMessage({ type: "success", text: "✅ Registro exitoso, bienvenido!" });
        
        // Verificar si hay una intención de adopción guardada
        const adoptionIntent = getAdoptionIntent();
        
        if (adoptionIntent) {
          // Limpiar la intención
          clearAdoptionIntent();
          
          // Redirigir al formulario con la mascota seleccionada
          navigate(`/formulario/${adoptionIntent.petId}`);
        } else {
          // Redirigir al inicio si no hay intención de adopción
          navigate("/");
        }
      } else {
        setMessage({ type: "error", text: "❌ " + result.message });
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "❌ Error de conexión con el servidor" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#BCC990] relative overflow-hidden px-4 sm:px-6">
      {/* Tarjeta central */}
      <motion.div
        className="bg-white p-5 sm:p-6 rounded-2xl shadow-xl z-10 w-full max-w-sm"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Icono */}
        <motion.div
          className="w-14 h-14 sm:w-16 sm:h-16 bg-[#BCC990] rounded-full flex items-center justify-center mx-auto mb-3 shadow-md"
          initial={{ rotate: -15, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
        >
          <img
            src="/Huella.png"
            alt="Huella"
            className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
            loading="lazy"
          />
        </motion.div>

        {/* Títulos */}
        <motion.h2 className="text-xl sm:text-2xl font-extrabold mb-1 text-center">
          Crea tu cuenta
        </motion.h2>

        <motion.p className="text-center text-xs sm:text-sm text-gray-500 mb-5">
          Regístrate para adoptar y contactar a refugios 🐶🐱
        </motion.p>

        {/* Formulario */}
        <motion.form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Nombre de usuario"
            className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#BCC990]"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#BCC990]"
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Contraseña"
            className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#BCC990]"
          />

          <motion.button
            type="submit"
            disabled={loading}
            className={`mt-2 w-full font-semibold py-2 rounded-lg shadow ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-[#BCC990] hover:bg-[#9FB36F] text-white'
            }`}
            whileHover={!loading ? { scale: 1.05 } : {}}
            whileTap={!loading ? { scale: 0.95 } : {}}
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </motion.button>
        </motion.form>

        {/* Mensajes */}
        {message && (
          <p
            className={`mt-4 text-center text-sm ${
              message.type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message.text}
          </p>
        )}
        
        <div className="mt-3 text-center">
            <span className="text-xs sm:text-sm text-gray-600 mr-1">¿Ya tienes una cuenta?</span>
            <a
                href="/login"
                className="inline-block text-xs sm:text-sm font-semibold text-[#BCC990] hover:underline"
            > 
              Iniciar sesión 
            </a>
        </div>
        {/* Botón volver al Home */}
        <motion.a
          href="/"
          className="mt-4 w-full inline-block text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-lg shadow-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ⬅ Volver al Home
        </motion.a>
      </motion.div>
    </div>
  );
}
