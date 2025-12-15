import { motion } from "framer-motion";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function ChangePasswordModal({ isOpen, onClose, user }) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        // Validaciones
        if (!currentPassword || !newPassword || !confirmPassword) {
            setMessage("❌ Por favor completa todos los campos");
            setMessageType("error");
            setLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage("❌ Las nuevas contraseñas no coinciden");
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

        if (currentPassword === newPassword) {
            setMessage("❌ La nueva contraseña debe ser diferente a la actual");
            setMessageType("error");
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('authToken');

            const response = await fetch(
                `${API_URL}/api/users/${user.id}/change-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token && { "Authorization": `Bearer ${token}` })
                    },
                    body: JSON.stringify({
                        currentPassword,
                        newPassword,
                        confirmPassword
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {
                setMessage("✅ Contraseña cambiada exitosamente");
                setMessageType("success");
                
                // Limpiar campos después de 2 segundos
                setTimeout(() => {
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    onClose();
                }, 2000);
            } else {
                setMessage("❌ " + (data.message || "Error al cambiar la contraseña"));
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <motion.div
                className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
            >
                {/* Encabezado */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">🔐 Cambiar Contraseña</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        <FaTimes size={24} />
                    </button>
                </div>

                {/* Formulario */}
                <form onSubmit={handleChangePassword} className="space-y-4">
                    {/* Contraseña Actual */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Contraseña Actual
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.current ? "text" : "password"}
                                placeholder="••••••••••"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#BCC990]"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                            >
                                {showPasswords.current ? "👁️" : "👁️‍🗨️"}
                            </button>
                        </div>
                    </div>

                    {/* Nueva Contraseña */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nueva Contraseña
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.new ? "text" : "password"}
                                placeholder="••••••••••"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#BCC990]"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                            >
                                {showPasswords.new ? "👁️" : "👁️‍🗨️"}
                            </button>
                        </div>
                    </div>

                    {/* Confirmar Contraseña */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirmar Nueva Contraseña
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.confirm ? "text" : "password"}
                                placeholder="••••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#BCC990]"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                            >
                                {showPasswords.confirm ? "👁️" : "👁️‍🗨️"}
                            </button>
                        </div>
                    </div>

                    {/* Mensaje */}
                    {message && (
                        <motion.div
                            className={`p-3 rounded-lg text-sm text-center ${
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

                    {/* Botones */}
                    <div className="flex gap-3 pt-4">
                        <motion.button
                            type="submit"
                            disabled={loading}
                            className={`flex-1 font-semibold py-2 rounded-lg ${
                                loading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-[#BCC990] hover:bg-[#9FB36F] text-white"
                            }`}
                            whileHover={!loading ? { scale: 1.05 } : {}}
                            whileTap={!loading ? { scale: 0.95 } : {}}
                        >
                            {loading ? "Cambiando..." : "Cambiar Contraseña"}
                        </motion.button>
                        <motion.button
                            type="button"
                            onClick={onClose}
                            className="flex-1 font-semibold py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Cancelar
                        </motion.button>
                    </div>
                </form>

                {/* Nota de seguridad */}
                <p className="mt-4 text-xs text-gray-500 text-center">
                    🔒 Tu contraseña es importante. No la compartas con nadie y cámbiala regularmente por seguridad.
                </p>
            </motion.div>
        </div>
    );
}
