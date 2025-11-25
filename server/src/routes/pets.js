import express from "express";
import upload from "../config/multerConfig.js";
import { 
  getPets, 
  getPet, 
  addPet,
  addPetWithImage,
  editPet,
  editPetWithImage,
  adoptPet,
  togglePetAvailability,
  getFoundationPets,
  removePet
} from "../controllers/petsController.js";

const router = express.Router();

// GET /api/pets - Obtener todas las mascotas o filtradas por tipo
// Ejemplos: /api/pets, /api/pets?type=dog, /api/pets?type=cat
router.get("/", getPets);

// GET /api/pets/foundation/:foundationId - Obtener mascotas de una fundación
router.get("/foundation/:foundationId", getFoundationPets);

// GET /api/pets/:id - Obtener una mascota específica por ID
router.get("/:id", getPet);

// POST /api/pets - Agregar una nueva mascota (sin imagen)
router.post("/", addPet);

// POST /api/pets/with-image - Agregar una nueva mascota con imagen
router.post("/with-image", upload.single('image'), addPetWithImage);

// PUT /api/pets/:id - Actualizar una mascota (sin imagen)
router.put("/:id", editPet);

// PUT /api/pets/:id/with-image - Actualizar una mascota con imagen
router.put("/:id/with-image", upload.single('image'), editPetWithImage);

// PUT /api/pets/:id/adopt - Marcar una mascota como adoptada
router.put("/:id/adopt", adoptPet);

// PATCH /api/pets/:id/availability - Cambiar disponibilidad de una mascota
router.patch("/:id/availability", togglePetAvailability);

// DELETE /api/pets/:id - Eliminar una mascota
router.delete("/:id", removePet);

export default router;