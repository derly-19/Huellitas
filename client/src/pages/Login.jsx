// client/src/pages/Login.jsx
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useAdoption } from "../contexts/AdoptionContext";

export default function Login() {
    const navigate = useNavigate();
    const { login, user } = useAuth();
    const { getAdoptionIntent, clearAdoptionIntent } = useAdoption();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Cargar el último email guardado al montar el componente
    useEffect(() => {
        const savedEmail = localStorage.getItem('lastLoginEmail');
        if (savedEmail) {
            setEmail(savedEmail);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            if (!email || !password) {
                setMessage("❌ Por favor completa todos los campos");
                setLoading(false);
                return;
            }

            const result = await login(email, password);

            if (result?.success) {
                // Guardar el email para recordarlo en futuros logins
                localStorage.setItem('lastLoginEmail', email);
                
                setMessage("✅ Login exitoso, bienvenido!");
                
                // Obtener datos del usuario del localStorage para verificar el tipo
                const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                
                // Si es una fundación, redirigir al dashboard
                if (userData?.user_type === 'foundation') {
                    setTimeout(() => navigate('/foundation/dashboard'), 500);
                    return;
                }
                
                // Verificar si hay una intención de adopción guardada
                const adoptionIntent = getAdoptionIntent();
                
                if (adoptionIntent) {
                    // Limpiar la intención
                    clearAdoptionIntent();
                    
                    // Redirigir al formulario con la mascota seleccionada
                    setTimeout(() => navigate(`/formulario/${adoptionIntent.petId}`), 500);
                } else {
                    // Redirigir al inicio si no hay intención de adopción
                    setTimeout(() => navigate("/"), 500);
                }
            } else {
                setMessage("❌ " + (result?.message || "Error desconocido en el login"));
                setLoading(false);
            }
        } catch (error) {
            console.error("Error en login:", error);
            setMessage("❌ Error de conexión con el servidor");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#BCC990] relative overflow-hidden px-4 sm:px-6">
            {/* Tarjeta central */}
            <motion.div
                className="bg-white p-6 sm:p-7 rounded-2xl shadow-xl z-10 w-full max-w-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                {/* Icono */}
                <motion.div
                    className="w-16 h-16 sm:w-20 sm:h-20 bg-[#BCC990] rounded-full flex items-center justify-center mx-auto mb-4 shadow-md"
                    initial={{ rotate: -15, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
                >
                    <img src="/Huella.png" alt="Huella" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" loading="lazy" />
                </motion.div>

                <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 text-center">
                    Bienvenido
                </h2>
                <p className="text-center text-xs sm:text-sm text-gray-500 mb-5">
                    Inicia sesión para ver mascotas disponibles 🐶🐱
                </p>

                {/* Formulario conectado */}
                <motion.form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-3"
                    autoComplete="on"
                >
                    <input
                        type="email"
                        placeholder="tuemail@ejemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#BCC990]"
                        required
                        autoComplete="email"
                        name="email"
                    />

                    <input
                        type="password"
                        placeholder="••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#BCC990]"
                        required
                        autoComplete="current-password"
                        name="password"
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
                        {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                    </motion.button>
                </motion.form>

                {/* Mostrar mensaje */}
                {message && (
                    <p className="mt-3 text-center text-sm font-medium text-gray-700">
                        {message}
                    </p>
                )}

                <div className="mt-3 text-center">
                    <span className="text-xs sm:text-sm text-gray-600 mr-1">¿No tienes cuenta?</span>
                    <a
                        href="/register"
                        className="inline-block text-xs sm:text-sm font-semibold text-[#BCC990] hover:underline"
                    >
                        Regístrate
                    </a>
                </div>
                
                {/* Link para fundaciones */}
                <div className="mt-2 text-center">
                    <Link
                        to="/register-foundation"
                        className="text-xs sm:text-sm text-gray-500 hover:text-[#005017] hover:underline"
                    >
                        ¿Eres una fundación? Regístrate aquí
                    </Link>
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
