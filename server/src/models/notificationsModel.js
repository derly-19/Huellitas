import { db } from "../db/database.js";

// Crear tabla de notificaciones si no existe
export const createNotificationsTable = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      request_id INTEGER,
      pet_name TEXT,
      is_read INTEGER DEFAULT 0,
      email_sent INTEGER DEFAULT 0,
      email_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `;
  
  try {
    await db.run(sql);
    console.log("✅ Notifications table ready");
  } catch (err) {
    console.error("❌ Error creating notifications table:", err);
  }
};

// Crear una notificación
export const createNotification = async (notificationData) => {
  const { user_id, type, title, message, request_id, pet_name, email_address, email_sent } = notificationData;
  
  try {
    const result = await db.run(
      `INSERT INTO notifications (user_id, type, title, message, request_id, pet_name, email_address, email_sent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, type, title, message, request_id, pet_name, email_address || null, email_sent ? 1 : 0]
    );
    console.log(`✅ Notificación creada para usuario ${user_id}`);
    return { id: result.lastID };
  } catch (err) {
    console.error("Error creating notification:", err);
    throw err;
  }
};

// Obtener notificaciones de un usuario
export const getUserNotifications = async (userId, limit = 50) => {
  try {
    const rows = await db.all(
      `SELECT * FROM notifications
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT ?`,
      [userId, limit]
    );
    return rows || [];
  } catch (err) {
    console.error("Error getting user notifications:", err);
    throw err;
  }
};

// Obtener notificaciones no leídas de un usuario
export const getUnreadNotifications = async (userId) => {
  try {
    const rows = await db.all(
      `SELECT * FROM notifications
       WHERE user_id = ? AND is_read = 0
       ORDER BY created_at DESC`,
      [userId]
    );
    return rows || [];
  } catch (err) {
    console.error("Error getting unread notifications:", err);
    throw err;
  }
};

// Contar notificaciones no leídas
export const countUnreadNotifications = async (userId) => {
  try {
    const row = await db.get(
      `SELECT COUNT(*) as count FROM notifications
       WHERE user_id = ? AND is_read = 0`,
      [userId]
    );
    return row?.count || 0;
  } catch (err) {
    console.error("Error counting unread notifications:", err);
    throw err;
  }
};

// Marcar notificación como leída
export const markAsRead = async (notificationId) => {
  try {
    await db.run(
      `UPDATE notifications SET is_read = 1 WHERE id = ?`,
      [notificationId]
    );
  } catch (err) {
    console.error("Error marking notification as read:", err);
    throw err;
  }
};

// Marcar todas las notificaciones de un usuario como leídas
export const markAllAsRead = async (userId) => {
  try {
    await db.run(
      `UPDATE notifications SET is_read = 1 WHERE user_id = ?`,
      [userId]
    );
  } catch (err) {
    console.error("Error marking all notifications as read:", err);
    throw err;
  }
};

// Eliminar una notificación
export const deleteNotification = async (notificationId) => {
  try {
    await db.run(
      `DELETE FROM notifications WHERE id = ?`,
      [notificationId]
    );
  } catch (err) {
    console.error("Error deleting notification:", err);
    throw err;
  }
};

// Eliminar notificaciones antiguas (más de 30 días)
export const deleteOldNotifications = async () => {
  try {
    const result = await db.run(
      `DELETE FROM notifications 
       WHERE created_at < datetime('now', '-30 days')`
    );
    console.log(`🗑️ ${result.changes} notificaciones antiguas eliminadas`);
    return result.changes;
  } catch (err) {
    console.error("Error deleting old notifications:", err);
    throw err;
  }
};
