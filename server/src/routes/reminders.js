import express from 'express';
import jwt from 'jsonwebtoken';
import {
  getReminders,
  markAsRead,
  markAllAsRead,
  getSettings,
  updateSettings,
  triggerReminderCheck
} from '../controllers/remindersController.js';

const router = express.Router();

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token requerido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'huellitas-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Token inválido' });
  }
};

// Obtener recordatorios no leídos
router.get('/', authenticateToken, getReminders);

// Marcar un recordatorio como leído
router.patch('/:reminderId/read', authenticateToken, markAsRead);

// Marcar todos como leídos
router.patch('/read-all', authenticateToken, markAllAsRead);

// Obtener configuración de recordatorios
router.get('/settings', authenticateToken, getSettings);

// Actualizar configuración
router.put('/settings', authenticateToken, updateSettings);

// Ejecutar verificación manual (solo para testing/admin)
router.post('/check', authenticateToken, triggerReminderCheck);

export default router;
