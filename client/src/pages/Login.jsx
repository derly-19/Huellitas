export default function Login() {
  return (
    <div className="h-screen flex items-center justify-center bg-green-200 relative">
      {/* Fondo con huellas de ejemplo */}
      <div className="absolute inset-0 flex justify-around items-center opacity-20">
        <span className="text-8xl">🐾</span>
        <span className="text-8xl">🐾</span>
        <span className="text-8xl">🐾</span>
      </div>

      {/* Caja del formulario */}
      <div className="bg-white p-8 rounded shadow-md z-10 w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <form className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded"
          />
          <button className="bg-black text-white p-2 rounded hover:bg-gray-800">
            Sign In
          </button>
          <a href="#" className="text-sm text-blue-500 text-center">
            Forgot password?
          </a>
        </form>
      </div>
    </div>
  );
}