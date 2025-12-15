import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Email, 2: Código y nueva contraseña
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // success, error
    const [loading, setLoading] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

    // PASO 1: Solicitar código
    const handleRequestReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        if (!email) {
            setMessage("❌ Por favor ingresa tu correo");
            setMessageType("error");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/api/users/forgot-password/request`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                setMessage("✅ Te hemos enviado un código de 6 dígitos a tu correo");
                setMessageType("success");
                setTimeout(() => {
                    setStep(2);
                    setMessage("");
                }, 1500);
            } else {
                setMessage("❌ " + (data.message || "Error al procesar la solicitud"));
                setMessageType("error");
            }
        } catch (error) {
            console.error("Error:", error);
            setMessage("❌ Error de conexión con el servidor");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    // PASO 2: Validar código y cambiar contraseña
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        if (!code || !newPassword || !confirmPassword) {
            setMessage("❌ Por favor completa todos los campos");
            setMessageType("error");
            setLoading(false);
            return;
        }

        if (code.length !== 6) {
            setMessage("❌ El código debe ser de 6 dígitos");
            setMessageType("error");
            setLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage("❌ Las contraseñas no coinciden");
            setMessageType("error");
            setLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setMessage("❌ La contraseña debe tener al menos 6 caracteres");
            setMessageType("error");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/api/users/forgot-password/reset`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        token: code,
                        email,
                        newPassword,
                        confirmPassword,
                    }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                setMessage("✅ ¡Contraseña restablecida! Redirigiendo al login...");
                setMessageType("success");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setMessage("❌ " + (data.message || "Error al restablecer la contraseña"));
                setMessageType("error");
            }
        } catch (error) {
            console.error("Error:", error);
            setMessage("❌ Error de conexión con el servidor");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    // Reenviar código
    const handleResendCode = async () => {
        setLoading(true);
        setMessage("");

        try {
            const response = await fetch(
                `${API_URL}/api/users/forgot-password/request`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                }
            );

            if (response.ok) {
                setMessage("✅ Nuevo código enviado a tu correo");
                setMessageType("success");
            } else {
                setMessage("❌ Error al reenviar el código");
                setMessageType("error");
            }
        } catch (error) {
            setMessage("❌ Error de conexión");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#BCC990] relative overflow-hidden px-4 sm:px-6">
            <motion.div
                className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl z-10 w-full max-w-md"
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
                    {step === 1 ? "Recuperar Contraseña" : "Ingresa el Código"}
                </h2>
                <p className="text-center text-xs sm:text-sm text-gray-500 mb-6">
                    {step === 1
                        ? "Te enviaremos un código de 6 dígitos a tu correo 📧"
                        : `Código enviado a ${email} 🔐`}
                </p>

                {/* PASO 1: Solicitar Email */}
                {step === 1 && (
                    <motion.form
                        onSubmit={handleRequestReset}
                        className="flex flex-col gap-4"
                    >
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                placeholder="tuemail@ejemplo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#BCC990]"
                                required
                            />
                        </div>

                        <motion.button
                            type="submit"
                            disabled={loading}
                            className={`w-full font-semibold py-3 rounded-lg shadow ${
                                loading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-[#BCC990] hover:bg-[#9FB36F] text-white"
                            }`}
                            whileHover={!loading ? { scale: 1.02 } : {}}
                            whileTap={!loading ? { scale: 0.98 } : {}}
                        >
                            {loading ? "Enviando..." : "Enviar Código"}
                        </motion.button>
                    </motion.form>
                )}

                {/* PASO 2: Ingreso de Código y Nueva Contraseña */}
                {step === 2 && (
                    <motion.form
                        onSubmit={handleResetPassword}
                        className="flex flex-col gap-4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        {/* Campo del código */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Código de Verificación
                            </label>
                            <input
                                type="text"
                                placeholder="123456"
                                value={code}
                                onChange={(e) => {
                                    // Solo permitir números y máximo 6 dígitos
                                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                    setCode(value);
                                }}
                                className="w-full border border-gray-200 rounded-lg p-3 text-center text-2xl font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-[#BCC990]"
                                maxLength={6}
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1 text-center">
                                Ingresa el código de 6 dígitos que recibiste por email
                            </p>
                        </div>

                        {/* Nueva Contraseña */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nueva Contraseña
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••••"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#BCC990]"
                                required
                            />
                        </div>

                        {/* Confirmar Contraseña */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirmar Contraseña
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#BCC990]"
                                required
                            />
                        </div>

                        <motion.button
                            type="submit"
                            disabled={loading}
                            className={`w-full font-semibold py-3 rounded-lg shadow ${
                                loading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-[#BCC990] hover:bg-[#9FB36F] text-white"
                            }`}
                            whileHover={!loading ? { scale: 1.02 } : {}}
                            whileTap={!loading ? { scale: 0.98 } : {}}
                        >
                            {loading ? "Cambiando..." : "Cambiar Contraseña"}
                        </motion.button>

                        {/* Opciones adicionales */}
                        <div className="flex justify-between text-sm">
                            <button
                                type="button"
                                onClick={handleResendCode}
                                disabled={loading}
                                className="text-[#BCC990] hover:text-[#9FB36F] hover:underline"
                            >
                                Reenviar código
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setStep(1);
                                    setMessage("");
                                    setCode("");
                                    setNewPassword("");
                                    setConfirmPassword("");
                                }}
                                className="text-gray-500 hover:text-gray-700 hover:underline"
                            >
                                Cambiar email
                            </button>
                        </div>
                    </motion.form>
                )}

                {/* Mensaje */}
                {message && (
                    <motion.div
                        className={`mt-4 p-3 rounded-lg text-sm text-center ${
                            messageType === "success"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                        }`}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {message}
                    </motion.div>
                )}

                {/* Links */}
                <div className="mt-6 text-center space-y-2">
                    <Link
                        to="/login"
                        className="block text-sm text-gray-500 hover:text-[#005017] hover:underline"
                    >
                        ← Volver al Login
                    </Link>
                    <Link
                        to="/"
                        className="block text-sm text-gray-500 hover:text-[#005017] hover:underline"
                    >
                        ⬅ Volver al Home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
