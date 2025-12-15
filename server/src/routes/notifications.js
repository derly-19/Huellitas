import express from "express";
import {
  getUserNotifications,
  getUnreadNotifications,
  countUnread,
  markAsRead,
  markAllAsRead,
  deleteNotification
} from "../controllers/notificationsController.js";
import { sendEmail } from "../services/emailService.js";

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

// POST /api/notifications/test-email - Endpoint de prueba para enviar email
router.post("/test-email", async (req, res) => {
  try {
    const { email, subject, message } = req.body;

    if (!email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Email, subject y message son requeridos"
      });
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f0f0f0; padding: 20px; text-align: center;">
          <h1 style="color: #2c3e50; margin: 0;">🐾 Huellitas</h1>
          <p style="color: #7f8c8d; margin: 5px 0;">Prueba de Email</p>
        </div>
        
        <div style="padding: 30px; background-color: #ffffff;">
          <h2 style="color: #2c3e50;">✅ Email de Prueba</h2>
          
          <p>${message}</p>
          
          <div style="background-color: #e8f5e9; padding: 15px; border-left: 4px solid #4caf50; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>✓ Este es un email de prueba</strong></p>
            <p style="margin: 5px 0;">Si ves este mensaje, ¡los emails funcionan correctamente!</p>
          </div>
          
          <p style="color: #7f8c8d; font-size: 12px; margin-top: 30px; border-top: 1px solid #ecf0f1; padding-top: 20px;">
            Este es un email automático de prueba de la plataforma Huellitas.
          </p>
        </div>
      </div>
    `;

    const result = await sendEmail(email, subject, htmlContent);

    if (result.success) {
      res.json({
        success: true,
        message: "Email enviado correctamente",
        details: result
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Error al enviar el email",
        error: result.error
      });
    }
  } catch (error) {
    console.error("Error en test-email:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    });
  }
});

export default router;
