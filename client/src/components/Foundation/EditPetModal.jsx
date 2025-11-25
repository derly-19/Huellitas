import { useState, useEffect, useRef } from "react";
import { FaTimes, FaDog, FaCat } from "react-icons/fa";
import { MdCloudUpload, MdImage } from "react-icons/md";

export default function EditPetModal({ pet, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "dog",
    description: "",
    age: "",
    size: "",
    sex: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // Cargar datos de la mascota
  useEffect(() => {
    if (pet) {
      setFormData({
        name: pet.name || "",
        type: pet.type || "dog",
        description: pet.description || "",
        age: pet.age || "",
        size: pet.size || "",
        sex: pet.sex || ""
      });
      setCurrentImage(pet.img);
    }
  }, [pet]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError("Solo se permiten imágenes (jpeg, jpg, png, gif, webp)");
        return;
      }
      
      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        setError("La imagen no debe superar los 5MB");
        return;
      }
      
      setImageFile(file);
      setError("");
      
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveNewImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validaciones
    if (!formData.name.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    
    setLoading(true);
    
    const result = await onSubmit(formData, imageFile);
    
    setLoading(false);
    
    if (!result.success) {
      setError(result.message || "Error al actualizar la mascota");
    }
  };

  // Construir URL completa de la imagen actual
  const getImageUrl = (imgPath) => {
    if (!imgPath) return null;
    if (imgPath.startsWith('http')) return imgPath;
    if (imgPath.startsWith('/uploads')) return `http://localhost:4000${imgPath}`;
    return imgPath;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Editar Mascota</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Tipo de mascota */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de mascota *
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: "dog" }))}
                className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                  formData.type === "dog"
                    ? "border-amber-500 bg-amber-50 text-amber-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <FaDog className="text-2xl" />
                <span className="font-medium">Perro</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: "cat" }))}
                className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                  formData.type === "cat"
                    ? "border-purple-500 bg-purple-50 text-purple-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <FaCat className="text-2xl" />
                <span className="font-medium">Gato</span>
              </button>
            </div>
          </div>

          {/* Nombre */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Luna"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Imagen */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagen de la mascota
            </label>
            
            {/* Mostrar imagen actual o nueva */}
            {imagePreview ? (
              // Nueva imagen seleccionada
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Nueva imagen" 
                  className="w-full h-48 object-cover rounded-xl"
                />
                <span className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                  Nueva imagen
                </span>
                <button
                  type="button"
                  onClick={handleRemoveNewImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
            ) : currentImage ? (
              // Imagen actual
              <div className="relative">
                <img 
                  src={getImageUrl(currentImage)} 
                  alt="Imagen actual" 
                  className="w-full h-48 object-cover rounded-xl"
                  onError={(e) => {
                    e.target.src = '/public/icon.png';
                  }}
                />
                <span className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                  Imagen actual
                </span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 bg-white text-gray-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors flex items-center gap-1"
                >
                  <MdImage />
                  Cambiar imagen
                </button>
              </div>
            ) : (
              // Sin imagen
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors"
              >
                <MdCloudUpload className="text-5xl text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">Haz clic para subir una imagen</p>
                <p className="text-gray-400 text-sm mt-1">JPG, PNG, GIF o WEBP (máx. 5MB)</p>
              </div>
            )}
            
            {/* Botón para cambiar si hay imagen actual y no hay nueva */}
            {currentImage && !imagePreview && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                Haz clic en "Cambiar imagen" para seleccionar una nueva foto
              </p>
            )}
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              className="hidden"
            />
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe la personalidad y características de la mascota..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Fila: Edad, Tamaño, Sexo */}
          <div className="grid grid-cols-3 gap-4">
            {/* Edad */}
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                Edad
              </label>
              <select
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Seleccionar</option>
                <option value="Cachorro">Cachorro</option>
                <option value="Joven">Joven</option>
                <option value="Adulto">Adulto</option>
              </select>
            </div>

            {/* Tamaño */}
            <div>
              <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-2">
                Tamaño
              </label>
              <select
                id="size"
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Seleccionar</option>
                <option value="Pequeño">Pequeño</option>
                <option value="Mediano">Mediano</option>
                <option value="Grande">Grande</option>
              </select>
            </div>

            {/* Sexo */}
            <div>
              <label htmlFor="sex" className="block text-sm font-medium text-gray-700 mb-2">
                Sexo
              </label>
              <select
                id="sex"
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Seleccionar</option>
                <option value="Macho">Macho</option>
                <option value="Hembra">Hembra</option>
              </select>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-[#005017] text-white rounded-xl font-medium hover:bg-[#0e8c37] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
