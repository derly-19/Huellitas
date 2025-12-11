import { Router } from "express";
import * as VisitsController from "../controllers/visitsController.js";

const router = Router();

// Crear visita (fundación)
router.post("/", VisitsController.createVisit);

// Obtener visitas del usuario (adoptante)
router.get("/user/:userId", VisitsController.getUserVisits);

// Obtener visitas de la fundación
router.get("/foundation/:foundationId", VisitsController.getFoundationVisits);

// Obtener próximas visitas de la fundación
router.get("/foundation/:foundationId/upcoming", VisitsController.getUpcomingVisits);

// Actualizar estado de visita
router.patch("/:id/status", VisitsController.updateVisitStatus);

// Aceptar visita (adoptante)
router.patch("/:id/accept", VisitsController.acceptVisit);

// Sugerir cambio de fecha (adoptante)
router.patch("/:id/suggest-reschedule", VisitsController.suggestReschedule);

// Reprogramar visita (fundación)
router.patch("/:id/reschedule", VisitsController.rescheduleVisit);

// Eliminar visita
router.delete("/:id", VisitsController.deleteVisit);

export default router;
