import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FaBuilding, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdPets } from "react-icons/md";

export default function RegisterFoundation() {
  const navigate = useNavigate();
  const { registerFoundation } = useAuth();
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    foundation_name: "",
    foundation_description: "",
    foundation_phone: "",
    foundation_address: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validaciones
    if (!formData.username.trim()) {
      setError("El nombre de usuario es obligatorio");
      return;
    }
    if (!formData.email.trim()) {
      setError("El email es obligatorio");
      return;
    }
    if (!formData.password) {
      setError("La contraseña es obligatoria");
      return;
    }
    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (!formData.foundation_name.trim()) {
      setError("El nombre de la fundación es obligatorio");
      return;
    }
    
    setLoading(true);
    
    const result = await registerFoundation(formData);
    
    setLoading(false);
    
    if (result.success) {
      navigate('/foundation/dashboard');
    } else {
      setError(result.message || "Error al registrar la fundación");
    }
  };

  return (
    <div className="min-h-screen bg-[#BCC990] flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
        {/* Header con icono circular */}
        <div className="pt-6 pb-2">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 bg-[#BCC990] rounded-full flex items-center justify-center shadow-md">
              <MdPets className="text-white text-3xl" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-800 text-center mb-1">Registra tu Fundación</h1>
          <p className="text-center text-sm text-gray-500 mb-5">Únete a Huellitas y ayuda a más mascotas a encontrar un hogar</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
              {error}
            </div>
          )}

          {/* Sección: Datos de la Fundación */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Información de la Fundación
            </h2>
            
            {/* Nombre de la fundación */}
            <div>
              <label htmlFor="foundation_name" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Fundación *
              </label>
              <div className="relative">
                <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="foundation_name"
                  name="foundation_name"
                  value={formData.foundation_name}
                  onChange={handleChange}
                  placeholder="Ej: Huellitas de Amor"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#BCC990] focus:outline-none"
                />
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="foundation_description" className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                id="foundation_description"
                name="foundation_description"
                value={formData.foundation_description}
                onChange={handleChange}
                placeholder="Cuéntanos sobre tu fundación, misión y valores..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#BCC990] focus:outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Teléfono */}
              <div>
                <label htmlFor="foundation_phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono de contacto
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    id="foundation_phone"
                    name="foundation_phone"
                    value={formData.foundation_phone}
                    onChange={handleChange}
                    placeholder="Ej: +57 300 123 4567"
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#BCC990] focus:outline-none"
                  />
                </div>
              </div>

              {/* Dirección */}
              <div>
                <label htmlFor="foundation_address" className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    id="foundation_address"
                    name="foundation_address"
                    value={formData.foundation_address}
                    onChange={handleChange}
                    placeholder="Ciudad, País"
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#BCC990] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sección: Datos de Cuenta */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Datos de la Cuenta
            </h2>

            {/* Nombre de usuario */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de usuario *
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Nombre para identificarte en el sistema"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#BCC990] focus:outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico *
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="fundacion@ejemplo.com"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#BCC990] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contraseña */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña *
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#BCC990] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Confirmar contraseña */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar contraseña *
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repite la contraseña"
                    className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#BCC990] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Botón de registro */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#BCC990] text-white rounded-lg font-semibold hover:bg-[#9FB36F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow"
          >
            {loading ? "Registrando..." : "Fundación Registrada"}
          </button>

          {/* Links */}
          <div className="text-center space-y-1 text-sm">
            <p className="text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="text-[#BCC990] hover:underline font-semibold">
                Inicia sesión
              </Link>
            </p>
            <p className="text-gray-600">
              ¿Eres un usuario adoptante?{" "}
              <Link to="/register" className="text-[#BCC990] hover:underline font-semibold">
                Regístrate aquí
              </Link>
            </p>
          </div>
          
          {/* Botón volver al Home */}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg shadow-sm transition-colors"
          >
            ⬅ Volver al Home
          </button>
        </form>
      </div>
    </div>
  );
}
