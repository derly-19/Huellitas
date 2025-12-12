import { Router } from "express";
import * as FollowUpController from "../controllers/followUpController.js";

const router = Router();

// Crear seguimiento
router.post("/", FollowUpController.createFollowUp);

// Obtener seguimientos del usuario
router.get("/user/:userId", FollowUpController.getUserFollowUps);

// Obtener seguimientos de la fundación
router.get("/foundation/:foundationId", FollowUpController.getFoundationFollowUps);

// Obtener seguimientos pendientes de la fundación
router.get("/foundation/:foundationId/pending", FollowUpController.getPendingFollowUps);

// Obtener estadísticas de la fundación
router.get("/foundation/:foundationId/stats", FollowUpController.getFollowUpStats);

// Obtener detalle de un seguimiento
router.get("/:id", FollowUpController.getFollowUpDetail);

// Actualizar seguimiento
router.patch("/:id", FollowUpController.updateFollowUp);

// Agregar feedback de fundación
router.patch("/:id/feedback", FollowUpController.addFoundationFeedback);

// Marcar como revisado (sin feedback)
router.patch("/:id/review", FollowUpController.markAsReviewed);

// Eliminar seguimiento
router.delete("/:id", FollowUpController.deleteFollowUp);

export default router;
