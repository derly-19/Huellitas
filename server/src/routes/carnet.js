import { Router } from "express";
import { 
  getCarnetByPetId, 
  addVacuna, 
  addDesparasitacion, 
  addBano, 
  addProcedimiento, 
  addMedicamento 
} from "../controllers/carnetController.js";

const router = Router();

// Obtener carnet completo de una mascota
router.get('/:petId', getCarnetByPetId);

// Agregar registros al carnet
router.post('/:petId/vacunas', addVacuna);
router.post('/:petId/desparasitaciones', addDesparasitacion);
router.post('/:petId/banos', addBano);
router.post('/:petId/procedimientos', addProcedimiento);
router.post('/:petId/medicamentos', addMedicamento);

export default router;