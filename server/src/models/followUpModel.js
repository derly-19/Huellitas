import { db } from "../db/database.js";

// Crear tabla de seguimientos post-adopción
export async function createFollowUpTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS follow_ups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      adoption_request_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      pet_id INTEGER NOT NULL,
      foundation_id INTEGER NOT NULL,
      follow_up_date TEXT NOT NULL,
      health_status TEXT NOT NULL DEFAULT 'excelente', -- excelente, bueno, regular, malo
      behavior_status TEXT NOT NULL DEFAULT 'adaptado', -- adaptado, en proceso, problemas
      environment_description TEXT,
      feeding_notes TEXT,
      medical_visits INTEGER DEFAULT 0,
      problems_encountered TEXT,
      additional_notes TEXT,
      photos TEXT, -- JSON array de URLs
      reviewed INTEGER DEFAULT 0, -- 0 = no revisado, 1 = revisado
      foundation_feedback TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (adoption_request_id) REFERENCES adoption_requests(id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (pet_id) REFERENCES pets(id),
      FOREIGN KEY (foundation_id) REFERENCES users(id)
    )
  `;
  
  try {
    await db.run(sql);
    console.log("✅ Follow-ups table ready");
  } catch (err) {
    console.error("❌ Error creating follow-ups table:", err);
  }
}

// Crear seguimiento
export async function createFollowUp(followUpData) {
  const {
    adoption_request_id,
    user_id,
    pet_id,
    foundation_id,
    follow_up_date,
    health_status,
    behavior_status,
    environment_description,
    feeding_notes,
    medical_visits,
    problems_encountered,
    additional_notes,
    photos
  } = followUpData;

  try {
    const result = await db.run(
      `INSERT INTO follow_ups 
       (adoption_request_id, user_id, pet_id, foundation_id, follow_up_date, 
        health_status, behavior_status, environment_description, feeding_notes, 
        medical_visits, problems_encountered, additional_notes, photos)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        adoption_request_id,
        user_id,
        pet_id,
        foundation_id,
        follow_up_date,
        health_status,
        behavior_status,
        environment_description,
        feeding_notes,
        medical_visits,
        problems_encountered,
        additional_notes,
        photos ? JSON.stringify(photos) : null
      ]
    );
    
    console.log(`✅ Follow-up creado para usuario ${user_id}`);
    return { id: result.lastID, ...followUpData };
  } catch (err) {
    console.error("Error creating follow-up:", err);
    throw err;
  }
}

// Obtener seguimientos de un usuario
export async function getUserFollowUps(userId) {
  try {
    const rows = await db.all(
      `SELECT * FROM follow_ups
       WHERE user_id = ?
       ORDER BY follow_up_date DESC`,
      [userId]
    );
    return rows || [];
  } catch (err) {
    console.error("Error getting user follow-ups:", err);
    throw err;
  }
}

// Obtener seguimientos de una fundación
export async function getFoundationFollowUps(foundationId) {
  try {
    const rows = await db.all(
      `SELECT fu.*, 
              u.username as user_name, u.email as user_email,
              p.name as pet_name, p.type as pet_type, p.img as pet_img
       FROM follow_ups fu
       JOIN users u ON fu.user_id = u.id
       JOIN pets p ON fu.pet_id = p.id
       WHERE fu.foundation_id = ?
       ORDER BY fu.follow_up_date DESC`,
      [foundationId]
    );
    return rows || [];
  } catch (err) {
    console.error("Error getting foundation follow-ups:", err);
    throw err;
  }
}

// Obtener seguimiento por ID
export async function getFollowUpById(id) {
  try {
    const row = await db.get(
      `SELECT fu.*, 
              u.username as user_name, u.email as user_email,
              p.name as pet_name, p.type as pet_type
       FROM follow_ups fu
       JOIN users u ON fu.user_id = u.id
       JOIN pets p ON fu.pet_id = p.id
       WHERE fu.id = ?`,
      [id]
    );
    return row;
  } catch (err) {
    console.error("Error getting follow-up by id:", err);
    throw err;
  }
}

// Actualizar seguimiento
export async function updateFollowUp(id, followUpData) {
  const {
    health_status,
    behavior_status,
    environment_description,
    feeding_notes,
    medical_visits,
    problems_encountered,
    additional_notes,
    photos
  } = followUpData;

  try {
    await db.run(
      `UPDATE follow_ups 
       SET health_status = ?, behavior_status = ?, environment_description = ?,
           feeding_notes = ?, medical_visits = ?, problems_encountered = ?,
           additional_notes = ?, photos = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        health_status,
        behavior_status,
        environment_description,
        feeding_notes,
        medical_visits,
        problems_encountered,
        additional_notes,
        photos ? JSON.stringify(photos) : null,
        id
      ]
    );
    
    console.log(`✅ Follow-up ${id} actualizado`);
    return { id, ...followUpData };
  } catch (err) {
    console.error("Error updating follow-up:", err);
    throw err;
  }
}

// Agregar feedback de fundación
export async function addFoundationFeedback(id, feedback) {
  try {
    await db.run(
      `UPDATE follow_ups 
       SET foundation_feedback = ?, reviewed = 1, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [feedback, id]
    );
    
    console.log(`✅ Feedback agregado al follow-up ${id}`);
  } catch (err) {
    console.error("Error adding foundation feedback:", err);
    throw err;
  }
}

// Marcar seguimiento como revisado
export async function markAsReviewed(id) {
  try {
    await db.run(
      `UPDATE follow_ups 
       SET reviewed = 1, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [id]
    );
    
    console.log(`✅ Follow-up ${id} marcado como revisado`);
  } catch (err) {
    console.error("Error marking follow-up as reviewed:", err);
    throw err;
  }
}

// Obtener seguimientos pendientes (no revisados)
export async function getPendingFollowUps(foundationId) {
  try {
    const rows = await db.all(
      `SELECT fu.*, 
              u.username as user_name, u.email as user_email,
              p.name as pet_name
       FROM follow_ups fu
       JOIN users u ON fu.user_id = u.id
       JOIN pets p ON fu.pet_id = p.id
       WHERE fu.foundation_id = ? AND fu.reviewed = 0
       ORDER BY fu.follow_up_date ASC`,
      [foundationId]
    );
    return rows || [];
  } catch (err) {
    console.error("Error getting pending follow-ups:", err);
    throw err;
  }
}

// Obtener estadísticas de satisfacción
export async function getFoundationFollowUpStats(foundationId) {
  try {
    const stats = await db.get(
      `SELECT 
        COUNT(*) as total_follow_ups,
        SUM(CASE WHEN health_status = 'excelente' THEN 1 ELSE 0 END) as excellent_health,
        SUM(CASE WHEN behavior_status = 'adaptado' THEN 1 ELSE 0 END) as well_adapted,
        SUM(CASE WHEN problems_encountered IS NOT NULL AND TRIM(problems_encountered) != '' THEN 1 ELSE 0 END) as with_problems
       FROM follow_ups
       WHERE foundation_id = ?`,
      [foundationId]
    );
    return stats || {};
  } catch (err) {
    console.error("Error getting follow-up stats:", err);
    throw err;
  }
}

// Eliminar seguimiento
export async function deleteFollowUp(id) {
  try {
    await db.run(
      `DELETE FROM follow_ups WHERE id = ?`,
      [id]
    );
    console.log(`✅ Follow-up ${id} eliminado`);
  } catch (err) {
    console.error("Error deleting follow-up:", err);
    throw err;
  }
}
