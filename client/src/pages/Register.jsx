// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function Register() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#BCC990] relative overflow-hidden px-4 sm:px-6">
            {/* Fondos decorativos */}
            <motion.span
                className="absolute left-4 top-10 text-4xl sm:text-5xl md:text-6xl text-[#BCC990] opacity-25"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 0.25, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
            >
                🐾
            </motion.span>
            <motion.span
                className="absolute right-6 bottom-12 text-5xl sm:text-6xl md:text-7xl text-[#BCC990] opacity-25"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 0.25, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
            >
                🐾
            </motion.span>

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
                <motion.h2
                    className="text-xl sm:text-2xl font-extrabold mb-1 text-center"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    Crea tu cuenta
                </motion.h2>
                <motion.p
                    className="text-center text-xs sm:text-sm text-gray-500 mb-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    Regístrate para adoptar y contactar a refugios 🐶🐱
                </motion.p>

                {/* Formulario */}
                <motion.form
                    className="flex flex-col gap-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                >
                    <input
                        type="text"
                        placeholder="Nombre"
                        className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#BCC990]"
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#BCC990]"
                    />

                    <input
                        type="password"
                        placeholder="Contraseña"
                        className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#BCC990]"
                    />

                    <motion.button
                        type="submit"
                        className="mt-2 w-full bg-[#BCC990] hover:bg-[#9FB36F] text-white font-semibold py-2 rounded-lg shadow"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Crear cuenta
                    </motion.button>

                    <div className="mt-3 text-center">
                        <span className="text-xs sm:text-sm text-gray-600 mr-1">¿Ya tienes cuenta?</span>
                        <a
                            href="/login"
                            className="inline-block text-xs sm:text-sm font-semibold text-[#BCC990] hover:underline"
                        >
                            Inicia sesión
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
                </motion.form>
            </motion.div>
        </div>
    );
}
