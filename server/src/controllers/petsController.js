import { 
  getAllPets, 
  getPetsByType, 
  getPetById,
  getPetByIdAdmin,
  createPet,
  updatePet,
  markPetAsAdopted,
  markPetAsAvailable,
  getPetsByFoundationId,
  deletePet
} from "../models/petsModel.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Crear una nueva mascota (para fundaciones)
export async function addPet(req, res) {
  try {
    const { name, type, img, description, age, size, sex, foundation, foundation_id } = req.body;
    
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
    
    const newPet = await createPet(name, type, img, description, age, size, sex, foundation, foundation_id);
    
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

// Crear una nueva mascota CON IMAGEN (para fundaciones)
export async function addPetWithImage(req, res) {
  try {
    const { name, type, description, age, size, sex, foundation, foundation_id } = req.body;
    
    // Validaciones básicas
    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: "Nombre y tipo son campos obligatorios"
      });
    }
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "La imagen es obligatoria"
      });
    }
    
    if (!['dog', 'cat'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "El tipo debe ser 'dog' o 'cat'"
      });
    }
    
    // Construir la URL de la imagen
    const imageUrl = `/uploads/pets/${req.file.filename}`;
    
    const newPet = await createPet(name, type, imageUrl, description, age, size, sex, foundation, foundation_id);
    
    res.status(201).json({
      success: true,
      data: newPet,
      message: "Mascota agregada exitosamente"
    });
  } catch (error) {
    console.error("Error al crear mascota:", error);
    // Si hay error, eliminar la imagen subida
    if (req.file) {
      const imagePath = path.join(__dirname, '../../uploads/pets', req.file.filename);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    });
  }
}

// Actualizar una mascota
export async function editPet(req, res) {
  try {
    const { id } = req.params;
    const { name, type, img, description, age, size, sex } = req.body;
    
    // Verificar que la mascota existe
    const pet = await getPetByIdAdmin(id);
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: "Mascota no encontrada"
      });
    }
    
    await updatePet(id, { name, type, img, description, age, size, sex });
    
    res.json({
      success: true,
      message: "Mascota actualizada exitosamente"
    });
  } catch (error) {
    console.error("Error al actualizar mascota:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    });
  }
}

// Actualizar una mascota CON IMAGEN
export async function editPetWithImage(req, res) {
  try {
    const { id } = req.params;
    const { name, type, description, age, size, sex } = req.body;
    
    // Verificar que la mascota existe
    const pet = await getPetByIdAdmin(id);
    if (!pet) {
      // Si hay imagen subida, eliminarla
      if (req.file) {
        const imagePath = path.join(__dirname, '../../uploads/pets', req.file.filename);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      return res.status(404).json({
        success: false,
        message: "Mascota no encontrada"
      });
    }
    
    let imageUrl = pet.img; // Mantener imagen anterior por defecto
    
    // Si se subió nueva imagen
    if (req.file) {
      imageUrl = `/uploads/pets/${req.file.filename}`;
      
      // Eliminar imagen anterior si existe y es de uploads
      if (pet.img && pet.img.startsWith('/uploads/pets/')) {
        const oldImagePath = path.join(__dirname, '../..', pet.img);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }
    
    await updatePet(id, { name, type, img: imageUrl, description, age, size, sex });
    
    res.json({
      success: true,
      message: "Mascota actualizada exitosamente"
    });
  } catch (error) {
    console.error("Error al actualizar mascota:", error);
    // Si hay error y se subió imagen, eliminarla
    if (req.file) {
      const imagePath = path.join(__dirname, '../../uploads/pets', req.file.filename);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
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

// Cambiar estado de disponibilidad de una mascota
export async function togglePetAvailability(req, res) {
  try {
    const { id } = req.params;
    const { available } = req.body;
    
    // Verificar que la mascota existe
    const pet = await getPetByIdAdmin(id);
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: "Mascota no encontrada"
      });
    }
    
    if (available) {
      await markPetAsAvailable(id);
    } else {
      await markPetAsAdopted(id);
    }
    
    res.json({
      success: true,
      message: available 
        ? `${pet.name} está nuevamente disponible para adopción`
        : `${pet.name} ha sido marcada como adoptada`
    });
  } catch (error) {
    console.error("Error al cambiar disponibilidad:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    });
  }
}

// Obtener mascotas de una fundación específica
export async function getFoundationPets(req, res) {
  try {
    const { foundationId } = req.params;
    
    const pets = await getPetsByFoundationId(foundationId);
    
    res.json({
      success: true,
      data: pets,
      message: `Se encontraron ${pets.length} mascotas de esta fundación`
    });
  } catch (error) {
    console.error("Error al obtener mascotas de la fundación:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    });
  }
}

// Eliminar una mascota
export async function removePet(req, res) {
  try {
    const { id } = req.params;
    
    // Verificar que la mascota existe
    const pet = await getPetByIdAdmin(id);
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: "Mascota no encontrada"
      });
    }
    
    await deletePet(id);
    
    res.json({
      success: true,
      message: `${pet.name} ha sido eliminada del sistema`
    });
  } catch (error) {
    console.error("Error al eliminar mascota:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    });
  }
}