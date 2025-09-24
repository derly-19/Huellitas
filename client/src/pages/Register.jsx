// Componente de la página de Registro
export default function Register() {
    return (
        // Contenedor principal que ocupa toda la altura de la pantalla
        // Usa utilidades de Tailwind para centrar contenido y definir el fondo verde claro
        <div className="min-h-screen flex items-center justify-center bg-[#BCC990] relative overflow-hidden">
            {/* Fondos decorativos con huellas: elementos visuales en el fondo */}
            <span className="absolute left-8 top-16 text-7xl text-[#BCC990] opacity-25">🐾</span>
            <span className="absolute right-8 top-24 text-8xl text-[#BCC990] opacity-20">🐾</span>
            <span className="absolute left-6 bottom-20 text-8xl text-[#BCC990] opacity-20">🐾</span>
            <span className="absolute right-6 bottom-16 text-7xl text-[#BCC990] opacity-25">🐾</span>

            {/* Tarjeta central blanca */}
            <div className="bg-white p-8 rounded-2xl shadow-2xl z-10 w-full max-w-md mx-4">
                {/* Icono de pata dentro de un círculo (imagen en public/Huella.png) */}
                <div className="w-20 h-20 bg-[#BCC990] rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                    <img src="/Huella.png" alt="Huella" className="w-12 h-12 object-contain" loading="lazy" />
                </div>

                {/* Título y subtítulo para registro */}
                <h2 className="text-3xl font-extrabold mb-2 text-center">Crea tu cuenta</h2>
                <p className="text-center text-sm text-gray-500 mb-6">
                    Regístrate para poder adoptar, guardar favoritos y contactar a refugios
                </p>

                {/* Formulario de registro: Nombre, Email y Contraseña */}
                <form className="flex flex-col gap-4">
                    {/* Nombre */}
                    <label className="text-sm font-medium text-gray-700">Nombre</label>
                    <input type="text" placeholder="Tu nombre completo" className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#BCC990]" />

                    {/* Email */}
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <input type="email" placeholder="tuemail@ejemplo.com" className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#BCC990]" />

                    {/* Contraseña */}
                    <label className="text-sm font-medium text-gray-700">Contraseña</label>
                    <input type="password" placeholder="••••••••••" className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#BCC990]" />

                    {/* Botón principal para enviar el formulario (registrarse) */}
                    <button type="submit" className="mt-3 w-full bg-[#BCC990] hover:bg-[#9FB36F] text-white font-semibold py-3 rounded-lg shadow">
                        Crear cuenta
                    </button>

                    {/* Enlace a la página de login para usuarios que ya tienen cuenta */}
                    <div className="mt-4 text-center">
                        <span className="text-sm text-gray-600 mr-2">¿Ya tienes cuenta?</span>
                        <a href="/login" className="inline-block text-sm font-semibold text-[#BCC990] hover:underline">
                            Inicia sesión
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
