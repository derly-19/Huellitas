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
export const createNotification = (notificationData) => {
  return new Promise((resolve, reject) => {
    const { user_id, type, title, message, request_id, pet_name } = notificationData;
    
    const sql = `
      INSERT INTO notifications (user_id, type, title, message, request_id, pet_name)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    db.run(sql, [user_id, type, title, message, request_id, pet_name], function(err) {
      if (err) {
        console.error("Error creating notification:", err);
        reject(err);
      } else {
        console.log(`✅ Notificación creada para usuario ${user_id}`);
        resolve({ id: this.lastID });
      }
    });
  });
};

// Obtener notificaciones de un usuario
export const getUserNotifications = (userId, limit = 50) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM notifications
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `;
    
    db.all(sql, [userId, limit], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows || []);
      }
    });
  });
};

// Obtener notificaciones no leídas de un usuario
export const getUnreadNotifications = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM notifications
      WHERE user_id = ? AND is_read = 0
      ORDER BY created_at DESC
    `;
    
    db.all(sql, [userId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows || []);
      }
    });
  });
};

// Contar notificaciones no leídas
export const countUnreadNotifications = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT COUNT(*) as count FROM notifications
      WHERE user_id = ? AND is_read = 0
    `;
    
    db.get(sql, [userId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row.count || 0);
      }
    });
  });
};

// Marcar notificación como leída
export const markAsRead = (notificationId) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE notifications SET is_read = 1 WHERE id = ?`;
    
    db.run(sql, [notificationId], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Marcar todas las notificaciones de un usuario como leídas
export const markAllAsRead = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE notifications SET is_read = 1 WHERE user_id = ?`;
    
    db.run(sql, [userId], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Eliminar una notificación
export const deleteNotification = (notificationId) => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM notifications WHERE id = ?`;
    
    db.run(sql, [notificationId], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Eliminar notificaciones antiguas (más de 30 días)
export const deleteOldNotifications = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      DELETE FROM notifications 
      WHERE created_at < datetime('now', '-30 days')
    `;
    
    db.run(sql, [], function(err) {
      if (err) {
        reject(err);
      } else {
        console.log(`🗑️ ${this.changes} notificaciones antiguas eliminadas`);
        resolve(this.changes);
      }
    });
  });
};
