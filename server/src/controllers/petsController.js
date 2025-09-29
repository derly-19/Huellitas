import { 
  getAllPets, 
  getPetsByType, 
  getPetById, 
  createPet,
  markPetAsAdopted 
} from "../models/petsModel.js";

// Obtener todas las mascotas
export async function getPets(req, res) {
  try {
    const { type } = req.query; // ?type=dog o ?type=cat
    
    let pets;
    if (type) {
      pets = await getPetsByType(type);
    } else {
      pets = await getAllPets();
    }
    
    res.json({
      success: true,
      data: pets,
      message: `Se encontraron ${pets.length} mascotas`
    });
  } catch (error) {
    console.error("Error al obtener mascotas:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    });
  }
}

// Obtener una mascota por ID
export async function getPet(req, res) {
  try {
    const { id } = req.params;
    
    const pet = await getPetById(id);
    
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: "Mascota no encontrada o ya no está disponible"
      });
    }
    
    res.json({
      success: true,
      data: pet,
      message: "Mascota encontrada"
    });
  } catch (error) {
    console.error("Error al obtener mascota:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    });
  }
}

// Crear una nueva mascota (para administradores en el futuro)
export async function addPet(req, res) {
  try {
    const { name, type, img, description, age, size, sex, foundation } = req.body;
    
    // Validaciones básicas
    if (!name || !type || !img) {
      return res.status(400).json({
        success: false,
        message: "Nombre, tipo e imagen son campos obligatorios"
      });
    }
    
    if (!['dog', 'cat'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "El tipo debe ser 'dog' o 'cat'"
      });
    }
    
    const newPet = await createPet(name, type, img, description, age, size, sex, foundation);
    
    res.status(201).json({
      success: true,
      data: newPet,
      message: "Mascota agregada exitosamente"
    });
  } catch (error) {
    console.error("Error al crear mascota:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    });
  }
}

// Marcar mascota como adoptada
export async function adoptPet(req, res) {
  try {
    const { id } = req.params;
    
    // Verificar que la mascota existe y está disponible
    const pet = await getPetById(id);
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: "Mascota no encontrada o ya no está disponible"
      });
    }
    
    await markPetAsAdopted(id);
    
    res.json({
      success: true,
      message: `${pet.name} ha sido marcada como adoptada. ¡Felicidades!`
    });
  } catch (error) {
    console.error("Error al adoptar mascota:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    });
  }
}