import express from "express";
import {
  getUserNotifications,
  getUnreadNotifications,
  countUnread,
  markAsRead,
  markAllAsRead,
  deleteNotification
} from "../controllers/notificationsController.js";

const router = express.Router();

// GET /api/notifications/user/:userId - Obtener todas las notificaciones de un usuario
router.get("/user/:userId", getUserNotifications);

// GET /api/notifications/user/:userId/unread - Obtener notificaciones no leídas
router.get("/user/:userId/unread", getUnreadNotifications);

// GET /api/notifications/user/:userId/count - Contar notificaciones no leídas
router.get("/user/:userId/count", countUnread);

// PATCH /api/notifications/:id/read - Marcar notificación como leída
router.patch("/:id/read", markAsRead);

// PATCH /api/notifications/user/:userId/read-all - Marcar todas como leídas
router.patch("/user/:userId/read-all", markAllAsRead);

// DELETE /api/notifications/:id - Eliminar notificación
router.delete("/:id", deleteNotification);

export default router;
