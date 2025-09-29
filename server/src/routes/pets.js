import express from "express";
import { 
  getPets, 
  getPet, 
  addPet, 
  adoptPet 
} from "../controllers/petsController.js";

const router = express.Router();

// GET /api/pets - Obtener todas las mascotas o filtradas por tipo
// Ejemplos: /api/pets, /api/pets?type=dog, /api/pets?type=cat
router.get("/", getPets);

// GET /api/pets/:id - Obtener una mascota específica por ID
router.get("/:id", getPet);

// POST /api/pets - Agregar una nueva mascota (para administradores)
router.post("/", addPet);

// PUT /api/pets/:id/adopt - Marcar una mascota como adoptada
router.put("/:id/adopt", adoptPet);

export default router;