import { Router } from "express";
import * as AdoptionRequestsController from "../controllers/adoptionRequestsController.js";

const router = Router();

// Crear nueva solicitud de adopción
router.post("/", AdoptionRequestsController.createRequest);

// IMPORTANTE: Las rutas más específicas deben ir primero
// Obtener estadísticas de solicitudes de una fundación (debe ir antes de /foundation/:foundationId)
router.get("/foundation/:foundationId/stats", AdoptionRequestsController.getFoundationRequestStats);

// Obtener solicitudes de una fundación
router.get("/foundation/:foundationId", AdoptionRequestsController.getFoundationRequests);

// Obtener solicitudes de un usuario
router.get("/user/:userId", AdoptionRequestsController.getUserRequests);

// Obtener solicitudes de una mascota específica
router.get("/pet/:petId", AdoptionRequestsController.getPetRequests);

// Obtener detalle de una solicitud
router.get("/:id", AdoptionRequestsController.getRequestDetail);

// Actualizar estado de una solicitud
router.patch("/:id/status", AdoptionRequestsController.updateRequestStatus);

// Eliminar una solicitud
router.delete("/:id", AdoptionRequestsController.deleteRequest);

export default router;
