// Componente de la página de Login
export default function Login() {
    return (
        // Contenedor principal que ocupa toda la altura de la pantalla
        // Usa utilidades de Tailwind para centrar contenido y definir el fondo verde claro
        <div className="min-h-screen flex items-center justify-center bg-[#BCC990] relative overflow-hidden">
            {/*
                Fondos decorativos con huellas: son elementos puramente visuales
                posicionados absolutamente dentro del contenedor. Se usan emojis
                con baja opacidad para simular el patrón de huellas en el fondo.
            */}
            <span className="absolute left-8 top-16 text-7xl text-[#BCC990] opacity-25">🐾</span>
            <span className="absolute right-8 top-24 text-8xl text-[#BCC990] opacity-20">🐾</span>
            <span className="absolute left-6 bottom-20 text-8xl text-[#BCC990] opacity-20">🐾</span>
            <span className="absolute right-6 bottom-16 text-7xl text-[#BCC990] opacity-25">🐾</span>

            {/*
                Tarjeta central blanca donde está el formulario de login.
                - `max-w-md` limita el ancho para mantener la tarjeta proporcional.
                - `rounded-2xl` y `shadow-2xl` le dan bordes y sombra para elevarla del fondo.
            */}
            <div className="bg-white p-8 rounded-2xl shadow-2xl z-10 w-full max-w-md mx-4">
                {/* Icono de pata dentro de un círculo verde oscuro reemplazado por una imagen
                    que debe estar en la carpeta public (p. ej. C:\Users\Aprendiz\Downloads\Huella.png copiada a public/Huella.png).
                    Se referencia como /Huella.png desde la app React. */}
                <div className="w-20 h-20 bg-[#BCC990] rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                    <img src="/Huella.png" alt="Huella" className="w-12 h-12 object-contain" loading="lazy" />
                </div>

                {/* Título y subtítulo */}
                <h2 className="text-3xl font-extrabold mb-2 text-center">Bienvenido</h2>
                        <p className="text-center text-sm text-gray-500 mb-6">
                    Inicia sesión para continuar y ver mascotas disponibles para adopción
                </p>

                {/*
                    Formulario de login:
                    - Cada input tiene una etiqueta visible (mejora accesibilidad).
                    - Se usan estilos de Tailwind para bordes, padding y estados de foco.
                    - Actualmente el formulario no tiene lógica JS (onSubmit), sólo estructura.
                */}
                <form className="flex flex-col gap-4">
                    {/* Etiqueta del email */}
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    {/* Campo de email con placeholder de ejemplo */}
                                <input
                        type="email"
                        placeholder="tuemail@ejemplo.com"
                                    className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#BCC990]"
                    />

                    {/* Etiqueta y campo para la contraseña */}
                    <label className="text-sm font-medium text-gray-700">Contraseña</label>
                                <input
                        type="password"
                        placeholder="••••••••••"
                                    className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#BCC990]"
                    />

                    {/* Botón principal para enviar el formulario */}
                                <button
                                    type="submit"
                                    className="mt-3 w-full bg-[#BCC990] hover:bg-[#9FB36F] text-white font-semibold py-3 rounded-lg shadow"
                                >
                        Iniciar sesión
                    </button>

                    {/* Enlace para recuperar contraseña */}
                                <a href="#" className="text-sm text-[#BCC990] text-center mt-2">
                        ¿Olvidaste tu contraseña?
                    </a>

                    {/*
                        Enlace de registro: invita al usuario a crear cuenta si no la tiene.
                        Actualmente apunta a `/register` — asegúrate de tener esa ruta si la usas.
                    */}
                    <div className="mt-4 text-center">
                        <span className="text-sm text-gray-600 mr-2">¿No tienes cuenta?</span>
                                    <a href="/register" className="inline-block text-sm font-semibold text-[#BCC990] hover:underline">
                            Regístrate
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}