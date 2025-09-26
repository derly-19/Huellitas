// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function Login() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#BCC990] relative overflow-hidden px-4 sm:px-6">
            {/* Huellas decorativas */}
            <motion.span
                className="absolute left-6 top-12 text-5xl sm:text-6xl text-[#BCC990] opacity-25"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 0.25, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
            >
                🐾
            </motion.span>
            <motion.span
                className="absolute right-6 bottom-14 text-6xl sm:text-7xl text-[#BCC990] opacity-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 0.2, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
            >
                🐾
            </motion.span>

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

                {/* Títulos */}
                <motion.h2
                    className="text-2xl sm:text-3xl font-extrabold mb-2 text-center"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    Bienvenido
                </motion.h2>
                <motion.p
                    className="text-center text-xs sm:text-sm text-gray-500 mb-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    Inicia sesión para ver mascotas disponibles 🐶🐱
                </motion.p>

                {/* Formulario */}
                <motion.form
                    className="flex flex-col gap-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                >
                    <input
                        type="email"
                        placeholder="tuemail@ejemplo.com"
                        className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#BCC990]"
                    />

                    <input
                        type="password"
                        placeholder="••••••••••"
                        className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#BCC990]"
                    />

                    <motion.button
                        type="submit"
                        className="mt-2 w-full bg-[#BCC990] hover:bg-[#9FB36F] text-white font-semibold py-2 rounded-lg shadow"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Iniciar sesión
                    </motion.button>

                    <a
                        href="#"
                        className="text-xs sm:text-sm text-[#BCC990] text-center mt-2 hover:underline"
                    >
                        ¿Olvidaste tu contraseña?
                    </a>

                    <div className="mt-3 text-center">
                        <span className="text-xs sm:text-sm text-gray-600 mr-1">¿No tienes cuenta?</span>
                        <a
                            href="/register"
                            className="inline-block text-xs sm:text-sm font-semibold text-[#BCC990] hover:underline"
                        >
                            Regístrate
                        </a>
                    </div>
                </motion.form>

                {/* Botón para volver al inicio */}
                <motion.div
                    className="mt-6 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                >
                    <a
                        href="/"
                        className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-5 rounded-lg shadow transition"
                    >
                        ← Volver al inicio
                    </a>
                </motion.div>
            </motion.div>
        </div>
    );
}
